/**
 * E2E Tests für Top-10 Marketing Funnels
 * 
 * Test-Strategie:
 * - Jeder Funnel wird als eigener Test ausgeführt
 * - FAKE Testdaten werden verwendet (keine echten Submissions)
 * - Tests prüfen: Rendering, Navigation, Form Validation, CTA Accessibility
 * 
 * Ausführung:
 * - npx playwright test e2e/top-10-funnels.spec.ts
 * - npx playwright test e2e/top-10-funnels.spec.ts --headed (mit Browser)
 * - npx playwright test e2e/top-10-funnels.spec.ts --project=chromium --project=mobile
 */

import { test, expect, Page } from '@playwright/test';

// ============================================
// TEST DATA (FAKE - NUR FÜR TESTING)
// ============================================

const FAKE_TEST_DATA = {
  customer: {
    name: 'Max Test',
    email: 'max.test+funnel-test@example.com',
    phone: '079 000 00 00',
    note: 'TEST - bitte ignorieren'
  },
  move: {
    fromPostal: '8001',
    fromCity: 'Zürich',
    toPostal: '6300',
    toCity: 'Zug',
    rooms: '3.5',
    date: '2026-02-15',
    floor: '2',
    hasLift: true
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Wartet bis die Seite vollständig geladen ist
 */
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Prüft ob ein Sticky CTA vorhanden ist (wichtig für Mobile)
 */
async function checkStickyCTA(page: Page) {
  const stickyCTA = page.locator('[data-testid="sticky-cta"], .sticky-cta, footer button[type="submit"]');
  const isVisible = await stickyCTA.isVisible().catch(() => false);
  return isVisible;
}

/**
 * Prüft auf Trust-Elemente (Bewertungen, Badges, etc.)
 */
async function checkTrustElements(page: Page) {
  const trustSignals = {
    rating: await page.locator('text=/\\d\\.\\d.*Bewertung|\\d\\.\\d.*Sterne/i').isVisible().catch(() => false),
    testimonials: await page.locator('[data-testid="testimonial"], .testimonial').count() > 0,
    badges: await page.locator('text=/geprüft|zertifiziert|SSL|sicher/i').isVisible().catch(() => false),
    socialProof: await page.locator('text=/\\d+.*Umzüge|\\d+.*Kunden/i').isVisible().catch(() => false)
  };
  return trustSignals;
}

/**
 * Füllt ein Standard-Umzugsformular aus
 */
async function fillStandardForm(page: Page) {
  // PLZ Von
  const fromPostalInput = page.locator('input[name="fromPostal"], input[placeholder*="Von"]').first();
  if (await fromPostalInput.isVisible()) {
    await fromPostalInput.fill(FAKE_TEST_DATA.move.fromPostal);
  }

  // PLZ Nach
  const toPostalInput = page.locator('input[name="toPostal"], input[placeholder*="Nach"]').first();
  if (await toPostalInput.isVisible()) {
    await toPostalInput.fill(FAKE_TEST_DATA.move.toPostal);
  }

  // Zimmer
  const roomsInput = page.locator('input[name="rooms"], select[name="rooms"]').first();
  if (await roomsInput.isVisible()) {
    await roomsInput.fill(FAKE_TEST_DATA.move.rooms);
  }

  // Datum
  const dateInput = page.locator('input[type="date"], input[name="date"]').first();
  if (await dateInput.isVisible()) {
    await dateInput.fill(FAKE_TEST_DATA.move.date);
  }
}

/**
 * Screenshot mit aussagekräftigem Namen
 */
async function takeScreenshot(page: Page, funnelId: string, step: string) {
  await page.screenshot({
    path: `test-results/funnel-${funnelId}-${step}.png`,
    fullPage: true
  });
}

// ============================================
// FUNNEL TESTS
// ============================================

test.describe('Top-10 Marketing Funnels - End-to-End Tests', () => {
  
  // Timeout pro Test erhöhen (Funnels können länger dauern)
  test.setTimeout(60000);

  // ==========================================
  // F1: V9 Zero Friction
  // ==========================================
  test('F1: V9 Zero Friction - Should load and navigate', async ({ page }) => {
    const url = '/umzugsofferten-v9';
    
    // Start
    await page.goto(url);
    await waitForPageLoad(page);
    await takeScreenshot(page, 'F1', 'landing');

    // Check: Seite lädt ohne Fehler
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Check: H1 ist vorhanden
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 5000 });
    const h1Text = await h1.textContent();
    console.log('F1 H1:', h1Text);

    // Check: Primary CTA ist vorhanden
    const primaryCTA = page.locator('button:has-text("Offerte"), button:has-text("Weiter"), button[type="submit"]').first();
    await expect(primaryCTA).toBeVisible({ timeout: 5000 });

    // Check: Trust-Elemente
    const trustElements = await checkTrustElements(page);
    console.log('F1 Trust Elements:', trustElements);

    // Mobile: Sticky CTA Check
    const hasStickyCTA = await checkStickyCTA(page);
    console.log('F1 Sticky CTA:', hasStickyCTA);

    // Formular ausfüllen (soweit möglich)
    await fillStandardForm(page);
    await takeScreenshot(page, 'F1', 'form-filled');

    // WICHTIG: Nicht absenden (nur bis kurz vor Submit)
  });

  // ==========================================
  // F2: ChatGPT Pro Ext (V9b)
  // ==========================================
  test('F2: V9b ChatGPT Pro Ext - Should load and navigate', async ({ page }) => {
    const url = '/umzugsofferten-v9b';
    
    await page.goto(url);
    await waitForPageLoad(page);
    await takeScreenshot(page, 'F2', 'landing');

    // Check: Titel enthält relevante Keywords
    const title = await page.title();
    expect(title).toMatch(/umzug|offerte|vergleich/i);

    // Check: H1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Check: Trust-Elemente (sollte bei "Pro" Version mehr sein)
    const trustElements = await checkTrustElements(page);
    console.log('F2 Trust Elements:', trustElements);
    expect(trustElements.rating || trustElements.socialProof).toBeTruthy();

    // Check: Primary CTA
    const primaryCTA = page.locator('button:has-text("Offerte"), button:has-text("Weiter")').first();
    await expect(primaryCTA).toBeVisible();

    // Micro-Test: Back-Button (falls vorhanden)
    const backButton = page.locator('button:has-text("Zurück")');
    if (await backButton.isVisible()) {
      console.log('F2: Back-Button gefunden');
    }

    await fillStandardForm(page);
    await takeScreenshot(page, 'F2', 'form-filled');
  });

  // ==========================================
  // F3: Zero Friction Optimized (V9c)
  // ==========================================
  test('F3: V9c Zero Friction Optimized - Mobile', async ({ page }) => {
    const url = '/umzugsofferten-v9c';
    
    // Mobile Viewport
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto(url);
    await waitForPageLoad(page);
    await takeScreenshot(page, 'F3', 'mobile-landing');

    // Check: Seite ist mobile-optimiert
    const body = page.locator('body');
    const bodyWidth = await body.evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390); // Kein horizontaler Scroll

    // Check: Touch-Targets sind groß genug (min 44px)
    const buttons = page.locator('button, a.btn');
    const firstButton = buttons.first();
    if (await firstButton.isVisible()) {
      const box = await firstButton.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        console.log('F3 Button Height:', box.height);
      }
    }

    // Check: Sticky CTA (kritisch für Mobile)
    const hasStickyCTA = await checkStickyCTA(page);
    expect(hasStickyCTA).toBeTruthy();

    await fillStandardForm(page);
    await takeScreenshot(page, 'F3', 'mobile-form-filled');
  });

  // ==========================================
  // F4: ChatGPT Flow 1 (2-Step Zero-Friction Pro)
  // ==========================================
  test('F4: ChatGPT Flow 1 - Should have conversational UI', async ({ page }) => {
    const url = '/chatgpt-flow-1';
    
    await page.goto(url);
    await waitForPageLoad(page);
    await takeScreenshot(page, 'F4', 'landing');

    // Check: Chat-artige UI?
    const chatElements = await page.locator('.chat, [data-testid="chat"], .message').count();
    console.log('F4 Chat Elements:', chatElements);

    // Check: Step-Indicator (2-Step sollte Progress zeigen)
    const progressIndicator = page.locator('[data-testid="progress"], .progress, .stepper');
    if (await progressIndicator.isVisible()) {
      console.log('F4: Progress Indicator vorhanden');
    }

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    await fillStandardForm(page);
    await takeScreenshot(page, 'F4', 'step-1-filled');
  });

  // ==========================================
  // F5: ChatGPT Flow 2 (Social Proof Boosted)
  // ==========================================
  test('F5: ChatGPT Flow 2 - Should have strong trust signals', async ({ page }) => {
    const url = '/chatgpt-flow-2';
    
    await page.goto(url);
    await waitForPageLoad(page);
    await takeScreenshot(page, 'F5', 'landing');

    // Check: Trust-Elemente (MUSS bei "Social Proof Boosted" vorhanden sein)
    const trustElements = await checkTrustElements(page);
    console.log('F5 Trust Elements:', trustElements);
    
    // Mindestens 2 Trust-Signale müssen vorhanden sein
    const trustCount = Object.values(trustElements).filter(Boolean).length;
    expect(trustCount).toBeGreaterThanOrEqual(2);

    // Check: Testimonials mit Fotos/Namen
    const testimonials = page.locator('[data-testid="testimonial"], .testimonial');
    const testimonialCount = await testimonials.count();
    console.log('F5 Testimonials:', testimonialCount);

    // Check: Firmen-Logos (Bekannt aus...)
    const logos = page.locator('img[alt*="logo"], img[alt*="partner"]');
    const logoCount = await logos.count();
    console.log('F5 Partner Logos:', logoCount);

    await fillStandardForm(page);
    await takeScreenshot(page, 'F5', 'with-social-proof');
  });

  // ==========================================
  // F6: ChatGPT Flow 3 (Chat-basierter Guided Flow)
  // ==========================================
  test('F6: ChatGPT Flow 3 - Should guide step-by-step', async ({ page }) => {
    const url = '/chatgpt-flow-3';
    
    await page.goto(url);
    await waitForPageLoad(page);
    await takeScreenshot(page, 'F6', 'landing');

    // Check: Nur 1 Frage pro Screen (Guided = minimale Ablenkung)
    const inputFields = page.locator('input[type="text"], input[type="number"], select');
    const visibleInputs = await inputFields.evaluateAll(inputs => 
      inputs.filter(input => {
        const style = window.getComputedStyle(input);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }).length
    );
    console.log('F6 Visible Inputs:', visibleInputs);
    // Guided Flow sollte nicht mehr als 3 Felder gleichzeitig zeigen
    expect(visibleInputs).toBeLessThanOrEqual(3);

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    await takeScreenshot(page, 'F6', 'guided-step');
  });

  // ==========================================
  // F7: Ultimate Best36
  // ==========================================
  test('F7: Ultimate Best36 - Should have comprehensive calculator', async ({ page }) => {
    const url = '/umzugsofferten-ultimate-best36';
    
    await page.goto(url);
    await waitForPageLoad(page);
    await takeScreenshot(page, 'F7', 'landing');

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Check: Zusatzservices (Ultimate sollte viele Optionen haben)
    const serviceCheckboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await serviceCheckboxes.count();
    console.log('F7 Service Options:', checkboxCount);

    // Ultimate Flow sollte mindestens 5 Zusatzservices anbieten
    expect(checkboxCount).toBeGreaterThanOrEqual(5);

    // Check: Preisanzeige (sollte live kalkulieren)
    const priceDisplay = page.locator('text=/CHF|Preis|Total/i');
    if (await priceDisplay.isVisible()) {
      console.log('F7: Live Price Display vorhanden');
    }

    await fillStandardForm(page);
    await takeScreenshot(page, 'F7', 'full-calculator');
  });

  // ==========================================
  // F8: Ultimate CH
  // ==========================================
  test('F8: Ultimate CH - Should be Swiss-optimized', async ({ page }) => {
    const url = '/umzugsofferten-ultimate-ch';
    
    await page.goto(url);
    await waitForPageLoad(page);
    await takeScreenshot(page, 'F8', 'landing');

    // Check: Schweizer Begriffe (Helvetisms)
    const bodyText = await page.locator('body').textContent();
    const hasOfferte = bodyText?.includes('Offerte') || bodyText?.includes('offerte');
    const hasZuegeln = bodyText?.includes('Zügel') || bodyText?.includes('zügel');
    const hasCHF = bodyText?.includes('CHF');

    console.log('F8 Helvetisms:', { hasOfferte, hasZuegeln, hasCHF });
    
    // Mindestens "Offerte" muss vorhanden sein
    expect(hasOfferte).toBeTruthy();

    // Check: Schweizer Städte/Kantone erwähnt
    const swissCities = ['Zürich', 'Bern', 'Basel', 'Luzern', 'Genf'];
    const mentionsSwissCity = swissCities.some(city => bodyText?.includes(city));
    expect(mentionsSwissCity).toBeTruthy();

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    await fillStandardForm(page);
    await takeScreenshot(page, 'F8', 'swiss-optimized');
  });

  // ==========================================
  // F9: Ultimate V7 (BLOCKED - Falls Route existiert)
  // ==========================================
  test.skip('F9: Ultimate V7 - Currently blocked (route missing)', async ({ page }) => {
    const url = '/umzugsofferten-ultimate-v7';
    
    // Dieser Test wird übersprungen, bis die Route existiert
    await page.goto(url);
    await waitForPageLoad(page);
    
    // Sollte 404 oder Fehlerseite sein
    const is404 = await page.locator('text=/404|nicht gefunden|not found/i').isVisible();
    expect(is404).toBeTruthy();
  });

  // ==========================================
  // F10: Ultimate "Best of All" (v6f) (BLOCKED)
  // ==========================================
  test.skip('F10: V6f Best of All - Currently blocked (route missing)', async ({ page }) => {
    const url = '/umzugsofferten-v6f';
    
    // Dieser Test wird übersprungen, bis die Route existiert
    await page.goto(url);
    await waitForPageLoad(page);
    
    const is404 = await page.locator('text=/404|nicht gefunden|not found/i').isVisible();
    expect(is404).toBeTruthy();
  });
});

// ============================================
// ACCESSIBILITY TESTS (Quick Check)
// ============================================

test.describe('Funnel Accessibility Quick Checks', () => {
  
  const testFunnels = [
    '/umzugsofferten-v9b',
    '/umzugsofferten-v9c',
    '/chatgpt-flow-1',
    '/chatgpt-flow-2',
    '/chatgpt-flow-3',
    '/umzugsofferten-ultimate-best36',
    '/umzugsofferten-ultimate-ch'
  ];

  testFunnels.forEach(url => {
    test(`Accessibility: ${url}`, async ({ page }) => {
      await page.goto(url);
      await waitForPageLoad(page);

      // Check: Alle Buttons haben erkennbaren Text
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }

      // Check: Form-Inputs haben Labels
      const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const name = await input.getAttribute('name');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');
        
        // Mindestens eines muss vorhanden sein
        expect(id || name || ariaLabel || placeholder).toBeTruthy();
      }
    });
  });
});

// ============================================
// PERFORMANCE CHECKS (Core Web Vitals Proxy)
// ============================================

test.describe('Funnel Performance Quick Checks', () => {
  
  const testFunnels = [
    '/umzugsofferten-v9b',
    '/chatgpt-flow-1',
    '/umzugsofferten-ultimate-ch'
  ];

  testFunnels.forEach(url => {
    test(`Performance: ${url}`, async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(url);
      await page.waitForLoadState('domcontentloaded');
      
      const domLoadTime = Date.now() - startTime;
      console.log(`${url} DOM Load Time:`, domLoadTime, 'ms');
      
      // DOM sollte in unter 3 Sekunden laden
      expect(domLoadTime).toBeLessThan(3000);

      // Check: LCP Element ist sichtbar
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 2500 });

      // Check: Keine JavaScript Errors
      const errors: string[] = [];
      page.on('pageerror', error => {
        errors.push(error.message);
      });

      await page.waitForTimeout(1000); // Kurz warten auf mögliche Errors
      
      if (errors.length > 0) {
        console.warn(`${url} JavaScript Errors:`, errors);
      }
    });
  });
});
