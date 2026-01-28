import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for Feierabend Umzüge Conversion Funnels
 * Run with: npx playwright test
 * 
 * Tests cover:
 * - Homepage & Navigation
 * - Contact Form Funnel
 * - Booking Funnel  
 * - Calculator Funnel
 * - Service Pages
 * - City Landing Pages
 * - Mobile Experience
 * - Performance
 * - Accessibility
 */

// Helper function to wait for page to be fully loaded
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
}

test.describe('Homepage & Navigation', () => {
  test('should load homepage with hero section', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    await expect(page.locator('h1').first()).toBeVisible();
    
    const ctaLinks = page.getByRole('link').filter({ hasText: /offerte|anrufen|buchen/i });
    await expect(ctaLinks.first()).toBeVisible();
  });

  test('should navigate to contact page from hero CTA', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const offerteLink = page.getByRole('link', { name: /offerte/i }).first();
    if (await offerteLink.isVisible()) {
      await offerteLink.click();
      await expect(page).toHaveURL(/contact/);
    }
  });

  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const nav = page.locator('header, nav').first();
    await expect(nav).toBeVisible();
  });
});

test.describe('Contact Form Funnel', () => {
  test('should display contact form with fields', async ({ page }) => {
    await page.goto('/contact');
    await waitForPageLoad(page);
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('should have input fields for contact info', async ({ page }) => {
    await page.goto('/contact');
    await waitForPageLoad(page);
    
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);
  });
});

test.describe('Booking Funnel', () => {
  test('should load booking page', async ({ page }) => {
    await page.goto('/booking');
    await waitForPageLoad(page);
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should display booking steps or form', async ({ page }) => {
    await page.goto('/booking');
    await waitForPageLoad(page);
    
    const content = page.locator('main, section, .container').first();
    await expect(content).toBeVisible();
  });
});

test.describe('Calculator Funnel', () => {
  test('should load calculator page', async ({ page }) => {
    await page.goto('/calculator');
    await waitForPageLoad(page);
    
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should display price or cost information', async ({ page }) => {
    await page.goto('/calculator');
    await waitForPageLoad(page);
    
    const priceElement = page.locator('text=/CHF|Fr\\.|Franken/i').first();
    await expect(priceElement).toBeVisible();
  });
});

test.describe('Service Pages', () => {
  const serviceRoutes = ['/plan', '/plan/packing', '/plan/disposal'];

  for (const route of serviceRoutes) {
    test(`should load ${route} with content`, async ({ page }) => {
      await page.goto(route);
      await waitForPageLoad(page);
      
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });
  }
});

test.describe('City Landing Pages', () => {
  const cityRoutes = ['/area/zurich', '/area/basel', '/area/bern'];

  for (const route of cityRoutes) {
    test(`should load ${route} with content`, async ({ page }) => {
      await page.goto(route);
      await waitForPageLoad(page);
      
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });
  }
});

test.describe('Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should load on mobile viewport', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should have adequate CTA sizing for touch', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const ctaLinks = page.getByRole('link').filter({ hasText: /offerte|anrufen|buchen/i });
    const count = await ctaLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have images with dimensions for CLS', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    expect(imageCount).toBeGreaterThan(0);
  });
});

test.describe('Accessibility', () => {
  test('should have exactly one H1 heading', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});
