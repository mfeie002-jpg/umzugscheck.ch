import { chromium } from 'playwright';
import { RunConfig, RunResult, Step, CTA } from '../shared/schemas';
import { createSeededRandom } from '../shared/rng';
import { detectCtAs, selectCTA, detectTrustSignals, isSuccessPage, isLikelyFinalSubmit } from './heuristics';
import { generateFakeData } from './fakeData';
import { fillFormFields } from './formFiller';
import { createScorecard } from './scorecard';
import { AIScorer } from './aiScorer';
import { writeJSON, ensureDir } from '../shared/fs';
import { join, dirname } from 'path';

export async function runTest(
  config: RunConfig,
  outputDir: string,
  captureTrace = false,
  captureNetworkHar = false
): Promise<RunResult> {
  await ensureDir(outputDir);

  const isMobile = config.persona.device === 'mobile';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: isMobile ? { width: 375, height: 667 } : { width: 1280, height: 920 },
    locale: config.persona.language,
    userAgent: isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
      : undefined,
    recordVideo: captureTrace ? { dir: join(outputDir, 'videos') } : undefined,
  });

  if (captureTrace) {
    await context.tracing.start({ screenshots: true, snapshots: true });
  }

  const page = await context.newPage();

  const steps: Step[] = [];
  const ctAs: CTA[] = [];
  let trustSignals: string[] = [];
  let verdict: 'success' | 'dropout' | 'blocker' | 'unknown' = 'unknown';
  let dropoffReason: string | undefined;

  const rng = createSeededRandom(`${config.run_id}::${config.seed}::run`);
  const fakeData = generateFakeData(config.persona, config.seed);
  const aiScorer = new AIScorer();
  const startTime = Date.now();

  try {
    // Step 0: Load page
    console.log(`[${config.persona.name}] Loading: ${config.gateway.landing_url}`);
    await page.goto(config.gateway.landing_url, { waitUntil: 'load', timeout: 30000 });

    const screenshotDir = join(outputDir, 'screenshots');
    await ensureDir(screenshotDir);
    const landingScreenshot = join(screenshotDir, '00-landing.png');
    await page.screenshot({ path: landingScreenshot, fullPage: false });

    const pageTitle = await page.title();
    const pageText = await page.locator('body').textContent();

    // AI-powered scoring of landing page
    const aiScore = await aiScorer.scorePageFromScreenshot(
      landingScreenshot,
      config.gateway,
      config.persona,
      pageTitle,
      config.landing_url
    );

    console.log(`  AI Score: Conversion Confidence ${aiScore.conversion_confidence}%`);

    // Detect CTAs and trust signals with intent awareness
    const allCtAs = await detectCtAs(page, config.gateway);
    ctAs.push(...allCtAs);
    trustSignals = detectTrustSignals(pageText || '');

    console.log(`  Found ${allCtAs.length} CTAs, ${trustSignals.length} trust signals`);

    // Check if already on success page
    if (isSuccessPage(pageTitle, config.landing_url)) {
      verdict = 'success';
      return createScorecard(config, steps, ctAs, trustSignals, verdict, undefined, aiScore);
    }

    let stepNum = 1;

    // Main loop with persona-aware behavior
    while (stepNum < config.maxSteps && Date.now() - startTime < config.maxTimeMs) {
      const stepRng = createSeededRandom(`${config.run_id}::${config.seed}::run::step${stepNum}`);

      // Persona hesitation (anxious personas take longer)
      if (config.persona.traits.includes('anxious') || config.persona.trust_level === 'low') {
        await page.waitForTimeout(stepRng() * 2000 + 1000); // 1-3s delay
      }

      // Try to fill form fields
      try {
        await fillFormFields(page, fakeData);
        steps.push({
          stepNumber: stepNum,
          action: 'fill',
          text: 'Filled form fields with test data',
          timestamp: Date.now() - startTime,
          success: true,
        });
      } catch (e) {
        // No form fields or already filled
      }

      // Detect CTAs again (page may have changed)
      const currentCtAs = await detectCtAs(page, config.gateway);
      
      // Use persona click_bias and step-dependent weights
      const mainCTA = selectCTA(currentCtAs, config.policy, config.persona, stepRng, stepNum);

      if (!mainCTA) {
        dropoffReason = 'No clickable CTAs detected - Dead end';
        verdict = 'blocker';
        break;
      }

      console.log(`  Step ${stepNum}: Clicking "${mainCTA.text}" (${mainCTA.type}, score: ${mainCTA.score})`);

      // Check if this is a likely final submit
      if (config.dryRun && isLikelyFinalSubmit(mainCTA)) {
        console.log('  Dry run: Would submit here - STOPPING');
        verdict = 'success';
        dropoffReason = 'Dry-run stop at final submit';
        break;
      }

      // Click the CTA
      try {
        // Use text-based selector for more reliability
        const textSelector = mainCTA.text.length > 3
          ? `text="${mainCTA.text.substring(0, 30)}"`
          : 'button, a, [role="button"]';

        await page.click(textSelector, { timeout: 5000 });
        await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

        const stepScreenshot = join(screenshotDir, `${stepNum.toString().padStart(2, '0')}-after-click.png`);
        await page.screenshot({ path: stepScreenshot });

        steps.push({
          stepNumber: stepNum,
          action: 'click',
          text: mainCTA.text,
          selector: mainCTA.selector,
          screenshot: `${stepNum.toString().padStart(2, '0')}-after-click.png`,
          timestamp: Date.now() - startTime,
          success: true,
        });

        // Check for success
        const newPageTitle = await page.title();
        const newUrl = page.url();
        
        if (isSuccessPage(newPageTitle, newUrl)) {
          verdict = 'success';
          console.log(`  ✓ Success page detected: ${newPageTitle}`);
          break;
        }

        stepNum++;
      } catch (e) {
        dropoffReason = `Click failed on "${mainCTA.text}": ${String(e)}`;
        verdict = 'blocker';
        console.error(`  ✗ ${dropoffReason}`);
        break;
      }

      // Check if we left the domain
      const currentUrl = new URL(page.url());
      const originalUrl = new URL(config.gateway.landing_url);
      if (currentUrl.hostname !== originalUrl.hostname) {
        verdict = 'dropout';
        dropoffReason = `Left original domain (${originalUrl.hostname} → ${currentUrl.hostname})`;
        console.log(`  ⚠ ${dropoffReason}`);
        break;
      }
    }

    // Check time limit
    if (Date.now() - startTime >= config.maxTimeMs && verdict === 'unknown') {
      verdict = 'dropout';
      dropoffReason = `Max time exceeded (${config.maxTimeMs}ms)`;
    }

    // Check step limit
    if (stepNum >= config.maxSteps && verdict === 'unknown') {
      verdict = 'dropout';
      dropoffReason = `Max steps exceeded (${config.maxSteps})`;
    }

    if (captureTrace) {
      await context.tracing.stop({ path: join(outputDir, 'trace.zip') });
    }
  } catch (error) {
    verdict = 'blocker';
    dropoffReason = `Critical error: ${String(error)}`;
    console.error('  ✗ Test error:', error);
  } finally {
    await browser.close();
  }

  const result = createScorecard(config, steps, ctAs, trustSignals, verdict, dropoffReason);
  await writeJSON(join(outputDir, 'result.json'), result);

  return result;
}
