
import { test, expect, Page, TestInfo, ConsoleMessage } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Social A/B Varianten V1 bis V17 (laut Screenshot)
const VARIANTS = [
  'V1','V2','V3','V4','V5','V6','V7','V8','V9','V10','V11','V12','V13','V14','V15','V16','V17'
];

const DEVICES = [
  { name: 'desktop', viewport: { width: 1280, height: 900 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
];

const ARTIFACTS_DIR = 'test-artifacts/social-proof';

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

for (const device of DEVICES) {
  test.describe(`Social Proof A/B Variants [${device.name}]`, () => {
    for (const variant of VARIANTS) {
      test(`renders SocialProof variant ${variant} without console errors`, async ({ page }, testInfo: TestInfo) => {
        // Set viewport
        await page.setViewportSize(device.viewport);

        // Collect console errors
        const errors: string[] = [];
        page.on('console', (msg: ConsoleMessage) => {
          if (msg.type() === 'error') errors.push(msg.text());
        });
        page.on('pageerror', (err: Error) => {
          errors.push(err.message);
        });

        // Set localStorage before page load
        await page.addInitScript((v: string) => {
          window.localStorage.setItem('socialproof-ab-variant', v);
        }, variant);

        // Go to homepage
        await page.goto('/');

        // Robust selector for Social Proof section
        // TODO: Add data-testid to SocialProofBlock in UI für Stabilität
        const locator = page.locator('section:has-text("Bekannt aus")');

        // Optional: Sichtbarkeitsprüfung (per ENV oder Testoption)
        if (process.env.CHECK_SOCIALPROOF_VISIBLE === '1') {
          await expect(locator).toBeVisible({ timeout: 8000 });
        }

        // Filter React UNSAFE_componentWillMount warnings (nicht als harter Fehler werten)
        const filteredErrors = errors.filter(
          (msg) => !msg.includes('UNSAFE_componentWillMount') && !msg.includes('SideEffect(NullComponent2)')
        );
        expect(filteredErrors, `Console errors for variant ${variant} [${device.name}]:\n${filteredErrors.join('\n')}`).toHaveLength(0);

        // Screenshot
        const screenshotDir = path.join(ARTIFACTS_DIR, device.name);
        ensureDirSync(screenshotDir);
        const screenshotPath = path.join(screenshotDir, `${variant}.png`);
        await locator.screenshot({ path: screenshotPath });
        testInfo.attach(`screenshot-${variant}-${device.name}`, { path: screenshotPath, contentType: 'image/png' });
      });
    }
  });
}

// To run: npm run dev (in one terminal), dann npm run test:e2e (in another)
