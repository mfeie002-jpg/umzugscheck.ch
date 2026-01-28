import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import {
  CORE_20_FUNNELS,
  TEST_PERSONAS,
  DEFAULT_TEST_CONFIG,
  MOBILE_TEST_CONFIG,
  TEST_SELECTORS,
  getPersonaData,
  generateFakeEmail,
  generateFakePhone,
  generateTestMetadata,
  FunnelDefinition,
} from '../lib/funnel-test-helpers';
import fs from 'fs';
import path from 'path';

// ============================================
// CONSTANTS
// ============================================

const BASE_URL = process.env.TEST_URL || DEFAULT_TEST_CONFIG.baseUrl;
const REPORT_DIR = path.join(__dirname, '../../test-reports');
const SCREENSHOTS_DIR = path.join(REPORT_DIR, 'screenshots');

// Ensure directories exist
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// ============================================
// TEST HELPERS
// ============================================

async function fillFormField(page: Page, selector: string, value: string) {
  const input = page.locator(selector).first();
  if (await input.isVisible()) {
    await input.fill(value);
    return true;
  }
  return false;
}

async function clickButton(page: Page, selector: string) {
  const button = page.locator(selector).first();
  if (await button.isVisible()) {
    await button.click();
    return true;
  }
  return false;
}

async function takeScreenshot(page: Page, name: string) {
  const filename = `${Date.now()}-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

async function handleConsent(page: Page) {
  // Accept cookies if consent banner present
  const acceptBtn = page.locator(TEST_SELECTORS.COOKIE_ACCEPT).first();
  if (await acceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await acceptBtn.click();
    await page.waitForLoadState('networkidle');
  }
}

// ============================================
// TEST RESULT TYPE
// ============================================

interface FlowTestResult {
  funnelId: number;
  funnelName: string;
  route: string;
  persona: string;
  viewport: string;
  status: 'PASS' | 'FAIL' | 'PARTIAL';
  blockerFound: string | null;
  blockerStep: string | null;
  errorMessage: string | null;
  uxFrictionNotes: string[];
  trustNotes: string[];
  conversionScore: number; // 1-10
  timeToComplete: number; // seconds
  screenshotPaths: string[];
  url: string;
  timestamp: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3';
}

// ============================================
// CORE 20 FUNNELS TEST SUITE
// ============================================

test.describe('Umzugscheck Core 20 Funnels - QA Testing', () => {
  let results: FlowTestResult[] = [];

  test.afterAll(async () => {
    // Generate comprehensive report
    generateReport(results);
  });

  // Test each Critical funnel first
  const criticalFunnels = CORE_20_FUNNELS.filter((f) => f.priority === 'Critical');

  for (const funnel of criticalFunnels) {
    test(`Funnel #${funnel.id}: ${funnel.name} (Desktop)`, async ({ page }) => {
      const result = await testFunnel(page, funnel, 'Desktop');
      results.push(result);
      expect(result.status).not.toBe('FAIL');
    });

    test(`Funnel #${funnel.id}: ${funnel.name} (Mobile)`, async ({ browser }) => {
      const context = await browser.newContext(MOBILE_TEST_CONFIG);
      const page = await context.newPage();
      const result = await testFunnel(page, funnel, 'Mobile');
      results.push(result);
      expect(result.status).not.toBe('FAIL');
      await context.close();
    });
  }

  // Test high priority funnels (desktop only)
  const highFunnels = CORE_20_FUNNELS.filter((f) => f.priority === 'High');

  for (const funnel of highFunnels) {
    test(`Funnel #${funnel.id}: ${funnel.name}`, async ({ page }) => {
      const result = await testFunnel(page, funnel, 'Desktop');
      results.push(result);
      expect(result.status).not.toBe('FAIL');
    });
  }

  // Test medium priority funnels (spot checks)
  const mediumFunnels = CORE_20_FUNNELS.filter((f) => f.priority === 'Medium').slice(0, 3); // Sample 3

  for (const funnel of mediumFunnels) {
    test(`Funnel #${funnel.id}: ${funnel.name} (Sample)`, async ({ page }) => {
      const result = await testFunnel(page, funnel, 'Desktop');
      results.push(result);
    });
  }
});

// ============================================
// FUNNEL TEST FUNCTION
// ============================================

async function testFunnel(
  page: Page,
  funnel: FunnelDefinition,
  viewport: 'Desktop' | 'Mobile',
): Promise<FlowTestResult> {
  const startTime = Date.now();
  const screenshots: string[] = [];

  const result: FlowTestResult = {
    funnelId: funnel.id,
    funnelName: funnel.name,
    route: funnel.route,
    persona: funnel.persona,
    viewport,
    status: 'PASS',
    blockerFound: null,
    blockerStep: null,
    errorMessage: null,
    uxFrictionNotes: [],
    trustNotes: [],
    conversionScore: 10,
    timeToComplete: 0,
    screenshotPaths: [],
    url: `${BASE_URL}${funnel.route}`,
    timestamp: new Date().toISOString(),
    severity: 'P3',
  };

  try {
    // STEP 1: Navigate to funnel
    console.log(`\n[${funnel.id}] Testing: ${funnel.name}`);
    page.setDefaultTimeout(30000);

    await page.goto(result.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await handleConsent(page);

    // Check for immediate errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // STEP 2: Initial page validation
    const sc1 = await takeScreenshot(page, `${funnel.id}-01-initial`);
    screenshots.push(sc1);

    // Check page loaded properly
    const pageContent = await page.content();
    if (!pageContent || pageContent.includes('404') || pageContent.includes('Page not found')) {
      result.status = 'FAIL';
      result.blockerFound = 'Page not found / 404';
      result.blockerStep = 'Initial page load';
      result.severity = 'P0';
      result.conversionScore = 0;
      return finishResult(result, screenshots, startTime);
    }

    // STEP 3: Find and verify main CTA
    const mainCTA = page.locator(TEST_SELECTORS.MAIN_CTA).first();
    const ctaVisible = await mainCTA.isVisible({ timeout: 3000 }).catch(() => false);

    if (!ctaVisible) {
      result.uxFrictionNotes.push('Primary CTA not visible above fold');
      result.conversionScore -= 2;
    }

    // STEP 4: Perform funnel-specific actions
    const personaData = getPersonaData(funnel.persona);

    switch (funnel.id) {
      case 1: // Homepage
        await testHomepageFlow(page, result, screenshots);
        break;
      case 2: // Vergleich
        await testVergleichFlow(page, result, screenshots, personaData);
        break;
      case 3: // Video
        await testVideoFlow(page, result, screenshots, personaData);
        break;
      case 4: // AI Photo
        await testAIPhotoFlow(page, result, screenshots, personaData);
        break;
      case 5: // Firmenverzeichnis
        await testCompanyListFlow(page, result, screenshots);
        break;
      case 6: // Beste Firmen
        await testBesteFirmenFlow(page, result, screenshots);
        break;
      case 7: // Günstige Firmen
        await testGuenstigeFirmenFlow(page, result, screenshots);
        break;
      case 9: // Cleaning Calculator
      case 10: // Disposal Calculator
      case 19: // Storage Calculator
      case 20: // Packing Calculator
        await testCalculatorFlow(page, result, screenshots, personaData, funnel);
        break;
      case 11:
      case 12: // Regional pages
        await testRegionalFlow(page, result, screenshots);
        break;
      case 15:
      case 16:
      case 17: // Info pages
        await testInfoPageFlow(page, result, screenshots);
        break;
      default:
        await testGenericFlow(page, result, screenshots, personaData);
    }

    // STEP 5: Robustness checks
    // Test back button
    await page.goBack().catch(() => {});
    await page.goForward().catch(() => {});

    // Test page refresh (safe)
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});

    // STEP 6: Calculate metrics
    if (consoleErrors.length > 0) {
      result.errorMessage = consoleErrors.slice(0, 3).join('\n');
      result.severity = 'P0';
      result.conversionScore -= 3;
    }

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    result.status = 'FAIL';
    result.blockerFound = errorMsg.substring(0, 100);
    result.blockerStep = 'Test execution error';
    result.severity = 'P1';
    result.conversionScore = Math.max(1, result.conversionScore - 5);
  }

  return finishResult(result, screenshots, startTime);
}

// ============================================
// FLOW-SPECIFIC TEST FUNCTIONS
// ============================================

async function testHomepageFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
) {
  // Verify hero section and CTAs visible
  const hero = page.locator('[data-testid="hero"], .hero, header').first();
  if (!(await hero.isVisible({ timeout: 3000 }).catch(() => false))) {
    result.uxFrictionNotes.push('Hero section not visible');
    result.conversionScore -= 1;
  }

  // Try to click primary CTA
  const clicked = await clickButton(page, TEST_SELECTORS.MAIN_CTA);
  if (clicked) {
    await page.waitForLoadState('networkidle').catch(() => {});
    const sc = await takeScreenshot(page, 'homepage-after-cta');
    screenshots.push(sc);
  } else {
    result.uxFrictionNotes.push('Could not click primary CTA');
    result.conversionScore -= 2;
  }
}

async function testVergleichFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
  personaData: any,
) {
  // Fill postal code
  const postalFilled = await fillFormField(page, TEST_SELECTORS.POSTAL_INPUT, personaData.fromPostal);
  if (!postalFilled) {
    result.uxFrictionNotes.push('Postal code input not accessible');
    result.conversionScore -= 2;
  }

  // Fill rooms
  const roomsFilled = await fillFormField(page, TEST_SELECTORS.ROOMS_INPUT, personaData.rooms);
  if (!roomsFilled) {
    result.uxFrictionNotes.push('Rooms input not accessible');
    result.conversionScore -= 2;
  }

  // Submit form
  const submitted = await clickButton(page, TEST_SELECTORS.FORM_SUBMIT);
  if (submitted) {
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
    const sc = await takeScreenshot(page, 'vergleich-after-submit');
    screenshots.push(sc);

    // Check for thank you page
    const thankYou = page.locator(TEST_SELECTORS.THANK_YOU);
    if (await thankYou.isVisible({ timeout: 5000 }).catch(() => false)) {
      result.status = 'PASS';
    } else {
      result.status = 'PARTIAL';
      result.uxFrictionNotes.push('Thank you page not clearly visible');
    }
  } else {
    result.status = 'FAIL';
    result.blockerFound = 'Could not submit form';
    result.blockerStep = 'Form submission';
    result.severity = 'P0';
    result.conversionScore = 2;
  }
}

async function testVideoFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
  personaData: any,
) {
  // Video upload is complex - just verify interface is present
  const videoUpload = page.locator(TEST_SELECTORS.VIDEO_UPLOAD).first();
  const uploadVisible = await videoUpload.isVisible({ timeout: 3000 }).catch(() => false);

  if (uploadVisible) {
    result.uxFrictionNotes.push('Video upload interface accessible');
  } else {
    result.uxFrictionNotes.push('Video upload input not visible');
    result.conversionScore -= 3;
    result.status = 'PARTIAL';
  }

  const sc = await takeScreenshot(page, 'video-upload-interface');
  screenshots.push(sc);
}

async function testAIPhotoFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
  personaData: any,
) {
  // Photo upload interface check
  const photoUpload = page.locator(TEST_SELECTORS.PHOTO_UPLOAD).first();
  const uploadVisible = await photoUpload.isVisible({ timeout: 3000 }).catch(() => false);

  if (uploadVisible) {
    result.trustNotes.push('AI photo upload interface clearly visible');
  } else {
    result.uxFrictionNotes.push('Photo upload not accessible');
    result.conversionScore -= 2;
  }

  const sc = await takeScreenshot(page, 'ai-photo-interface');
  screenshots.push(sc);
}

async function testCompanyListFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
) {
  // Check company list loads
  const companyList = page.locator(TEST_SELECTORS.COMPANY_LIST).first();
  const listVisible = await companyList.isVisible({ timeout: 5000 }).catch(() => false);

  if (listVisible) {
    result.status = 'PASS';
    result.trustNotes.push('Company list loads successfully');

    // Count visible companies
    const companies = page.locator(TEST_SELECTORS.COMPANY_CARD);
    const count = await companies.count();
    if (count === 0) {
      result.uxFrictionNotes.push('Company list empty or not loading');
      result.conversionScore -= 3;
    }
  } else {
    result.status = 'FAIL';
    result.blockerFound = 'Company list not visible';
    result.severity = 'P0';
    result.conversionScore = 2;
  }

  const sc = await takeScreenshot(page, 'company-list');
  screenshots.push(sc);
}

async function testBesteFirmenFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
) {
  const rankingList = page.locator(TEST_SELECTORS.RANKING_LIST).first();
  const visible = await rankingList.isVisible({ timeout: 5000 }).catch(() => false);

  if (visible) {
    result.status = 'PASS';
    result.trustNotes.push('Ranking list displays');
  } else {
    result.status = 'PARTIAL';
    result.uxFrictionNotes.push('Ranking list not immediately visible');
    result.conversionScore -= 2;
  }

  const sc = await takeScreenshot(page, 'ranking-beste');
  screenshots.push(sc);
}

async function testGuenstigeFirmenFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
) {
  await testBesteFirmenFlow(page, result, screenshots);
}

async function testCalculatorFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
  personaData: any,
  funnel: FunnelDefinition,
) {
  const form = page.locator(TEST_SELECTORS.CALCULATOR_FORM).first();
  const formVisible = await form.isVisible({ timeout: 5000 }).catch(() => false);

  if (!formVisible) {
    result.status = 'FAIL';
    result.blockerFound = 'Calculator form not visible';
    result.severity = 'P0';
    result.conversionScore = 2;
  } else {
    // Try to fill and submit
    await fillFormField(page, TEST_SELECTORS.ROOM_SELECTOR, personaData.rooms).catch(() => {});
    
    const submitted = await clickButton(page, TEST_SELECTORS.FORM_SUBMIT);
    if (submitted) {
      await page.waitForLoadState('networkidle').catch(() => {});
      const priceResult = page.locator(TEST_SELECTORS.PRICE_RESULT).first();
      if (await priceResult.isVisible({ timeout: 5000 }).catch(() => false)) {
        result.status = 'PASS';
        result.trustNotes.push('Price calculation works');
      } else {
        result.status = 'PARTIAL';
        result.uxFrictionNotes.push('Price result not clearly displayed');
      }
    }
  }

  const sc = await takeScreenshot(page, `calculator-${funnel.id}`);
  screenshots.push(sc);
}

async function testRegionalFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
) {
  await testCompanyListFlow(page, result, screenshots);
}

async function testInfoPageFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
) {
  // Check for content and CTA
  const content = await page.locator('main').first();
  const visible = await content.isVisible({ timeout: 3000 }).catch(() => false);

  if (visible) {
    result.status = 'PASS';
    result.trustNotes.push('Content page loads');
  }

  const sc = await takeScreenshot(page, 'info-page');
  screenshots.push(sc);
}

async function testGenericFlow(
  page: Page,
  result: FlowTestResult,
  screenshots: string[],
  personaData: any,
) {
  // Generic test for unmapped funnels
  const main = page.locator('main').first();
  const visible = await main.isVisible({ timeout: 3000 }).catch(() => false);

  if (visible) {
    result.status = 'PASS';
  } else {
    result.status = 'PARTIAL';
  }

  const sc = await takeScreenshot(page, 'generic-flow');
  screenshots.push(sc);
}

// ============================================
// RESULT FINALIZATION
// ============================================

function finishResult(
  result: FlowTestResult,
  screenshots: string[],
  startTime: number,
): FlowTestResult {
  result.screenshotPaths = screenshots;
  result.timeToComplete = (Date.now() - startTime) / 1000;

  // Ensure conversionScore is in valid range
  result.conversionScore = Math.max(1, Math.min(10, result.conversionScore));

  // Determine severity if not already set
  if (result.status === 'FAIL') {
    result.severity = result.severity || 'P0';
  } else if (result.status === 'PARTIAL') {
    result.severity = result.severity || 'P1';
  } else {
    result.severity = result.severity || 'P3';
  }

  return result;
}

// ============================================
// REPORT GENERATION
// ============================================

function generateReport(results: FlowTestResult[]) {
  const metadata = generateTestMetadata();

  // Group by status
  const passingTests = results.filter((r) => r.status === 'PASS');
  const partialTests = results.filter((r) => r.status === 'PARTIAL');
  const failingTests = results.filter((r) => r.status === 'FAIL');

  // Calculate metrics
  const avgConversionScore = (results.reduce((sum, r) => sum + r.conversionScore, 0) / results.length).toFixed(2);
  const avgTimeToComplete = (results.reduce((sum, r) => sum + r.timeToComplete, 0) / results.length).toFixed(2);

  // Group by severity
  const p0Issues = results.filter((r) => r.severity === 'P0');
  const p1Issues = results.filter((r) => r.severity === 'P1');
  const p2Issues = results.filter((r) => r.severity === 'P2');
  const p3Issues = results.filter((r) => r.severity === 'P3');

  // Generate markdown report
  let markdown = `# Umzugscheck Core 20 Funnels - QA Test Report

**Generated**: ${metadata.date} ${new Date().toLocaleTimeString('de-CH')}
**Test Environment**: ${process.env.TEST_URL || DEFAULT_TEST_CONFIG.baseUrl}

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Funnels Tested | ${results.length}/${metadata.totalFunnels} |
| ✅ Passing | ${passingTests.length} (${((passingTests.length / results.length) * 100).toFixed(1)}%) |
| ⚠️ Partial | ${partialTests.length} (${((partialTests.length / results.length) * 100).toFixed(1)}%) |
| ❌ Failing | ${failingTests.length} (${((failingTests.length / results.length) * 100).toFixed(1)}%) |
| 📊 Avg Conversion Score | ${avgConversionScore}/10 |
| ⏱️ Avg Time to Complete | ${avgTimeToComplete}s |

---

## Issues Backlog (Prioritized)

### P0 Issues (Blocking - Fix IMMEDIATELY) - ${p0Issues.length} found

${
  p0Issues.length > 0
    ? p0Issues
        .map(
          (issue) => `
- **${issue.funnelName}** (Route: \`${issue.route}\`)
  - **Blocker**: ${issue.blockerFound}
  - **Step**: ${issue.blockerStep}
  - **Severity**: P0
  - **Impact**: Funnel completely broken
  - **Screenshots**: [${issue.screenshotPaths.length} captured]
`,
        )
        .join('\n')
    : '✅ No P0 issues found'
}

### P1 Issues (Major Conversion Impact) - ${p1Issues.length} found

${
  p1Issues.length > 0
    ? p1Issues
        .slice(0, 10)
        .map(
          (issue) => `
- **${issue.funnelName}**
  - ${issue.uxFrictionNotes.join(', ') || 'No details'}
  - Score: ${issue.conversionScore}/10
`,
        )
        .join('\n')
    : '✅ No P1 issues found'
}

### P2 Issues (Minor Issues) - ${p2Issues.length} found

### P3 Issues (Cosmetic) - ${p3Issues.length} found

---

## Test Results by Funnel

| # | Funnel Name | Route | Status | Score | Time | Viewport |
|---|-------------|-------|--------|-------|------|----------|
${results
  .map(
    (r) =>
      `| ${r.funnelId} | ${r.funnelName} | \`${r.route}\` | ${
        r.status === 'PASS' ? '✅' : r.status === 'PARTIAL' ? '⚠️' : '❌'
      } | ${r.conversionScore}/10 | ${r.timeToComplete.toFixed(1)}s | ${r.viewport} |`,
  )
  .join('\n')}

---

## Top Recommendations

### Before Going Live:

1. **Fix all P0 blockers** (${p0Issues.length} issues)
   - These prevent users from completing funnels
   - Estimated fix time: ${p0Issues.length * 4} hours

2. **Address P1 conversion issues** (${p1Issues.length} issues)
   - Expected impact: ${((p1Issues.length / results.length) * 100).toFixed(1)}% conversion loss
   - Focus on: Mobile CTA visibility, form validation, thank-you page clarity

3. **Validate regional pages** 
   - Ensure all canton redirects work
   - Test local content relevance

### Launch Readiness

**Overall Status**: ${failingTests.length === 0 ? '✅ READY' : '❌ NOT READY'}

${
  failingTests.length === 0
    ? `🎉 **All critical funnels are passing!**
- Average conversion score: ${avgConversionScore}/10
- No blocking issues found
- Recommended: Launch with monitoring`
    : `⛔ **Not ready for launch**
- ${failingTests.length} critical funnels failing
- ${p0Issues.length} blocking issues must be fixed first
- Estimated time to fix: ${(p0Issues.length * 4 + p1Issues.length * 2)} hours`
}

---

## Detailed Results

${results
  .map(
    (r) => `
### Funnel #${r.funnelId}: ${r.funnelName}

- **Route**: \`${r.route}\`
- **Status**: ${r.status === 'PASS' ? '✅ PASS' : r.status === 'PARTIAL' ? '⚠️ PARTIAL' : '❌ FAIL'}
- **Persona**: ${r.persona}
- **Viewport**: ${r.viewport}
- **Conversion Score**: ${r.conversionScore}/10
- **Time to Complete**: ${r.timeToComplete.toFixed(2)}s
- **Severity**: ${r.severity}

${
  r.blockerFound
    ? `
**BLOCKER FOUND**:
- Error: ${r.blockerFound}
- Step: ${r.blockerStep}
- Console Errors: ${r.errorMessage ? `\`\`\`\n${r.errorMessage}\n\`\`\`` : 'None'}
`
    : ''
}

${
  r.uxFrictionNotes.length > 0
    ? `
**UX Friction Notes**:
${r.uxFrictionNotes.map((n) => `- ${n}`).join('\n')}
`
    : ''
}

${
  r.trustNotes.length > 0
    ? `
**Trust/Clarity Notes**:
${r.trustNotes.map((n) => `- ${n}`).join('\n')}
`
    : ''
}
`,
  )
  .join('\n')}

---

## Test Configuration

- Base URL: \`${BASE_URL}\`
- Desktop Viewport: 1920x1080
- Mobile Viewport: 390x844
- Timeout: 30s
- Screenshots Captured: ${results.reduce((sum, r) => sum + r.screenshotPaths.length, 0)}

**Report Generated**: ${new Date().toISOString()}
`;

  // Write report
  const reportPath = path.join(REPORT_DIR, `report-${Date.now()}.md`);
  fs.writeFileSync(reportPath, markdown);

  // Also write JSON for programmatic access
  const jsonPath = path.join(REPORT_DIR, `results-${Date.now()}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify({ metadata, results }, null, 2));

  console.log(`\n📊 Test report generated: ${reportPath}`);
  console.log(`📊 JSON results: ${jsonPath}`);
  console.log(`📸 Screenshots: ${SCREENSHOTS_DIR}`);

  return { reportPath, jsonPath };
}
