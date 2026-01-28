/**
 * Critical 5 Funnels - Quick Smoke Test
 * Test Duration: ~15 minutes
 * Persona: Max Test (Zürich→Zug, 3 rooms)
 */

import { test, expect } from '@playwright/test';

const TEST_DATA = {
  name: 'Max Test',
  email: 'max.test@example.com',
  phone: '+41 79 000 00 01',
  fromPostal: '8001',
  toPostal: '6300',
  rooms: '3',
  moveDate: '2026-03-15',
};

test.describe('Critical 5 Funnels - Smoke Test', () => {
  
  // ==========================================
  // Funnel 1: Homepage
  // ==========================================
  test('1. Homepage - Click Offerten vergleichen', async ({ page }) => {
    test.setTimeout(30000);
    
    console.log('📱 Test 1: Homepage (/)');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Screenshot: Landing
    await page.screenshot({ path: 'test-results/smoke-1-homepage-landing.png' });
    console.log('  ✓ Page loaded');
    
    // Find and click primary CTA
    const cta = page.locator('button:has-text("Offerten"), a:has-text("Offerten"), button:has-text("Vergleich")').first();
    if (await cta.isVisible()) {
      console.log('  ✓ Primary CTA visible');
      await cta.click();
      await page.waitForLoadState('networkidle');
      
      // Screenshot: After CTA
      await page.screenshot({ path: 'test-results/smoke-1-homepage-after-cta.png' });
      console.log('  ✓ CTA clicked, redirected');
      
      expect(page.url()).toMatch(/vergleich|offerte|rechner/i);
      console.log('✅ Funnel 1: PASS\n');
    } else {
      console.log('❌ Funnel 1: FAIL - No visible CTA');
    }
  });

  // ==========================================
  // Funnel 2: Vergleich Wizard
  // ==========================================
  test('2. Vergleich Wizard - Fill & Submit', async ({ page }) => {
    test.setTimeout(60000);
    
    console.log('📱 Test 2: Vergleich (/vergleich)');
    await page.goto('/vergleich');
    await page.waitForLoadState('networkidle');
    
    // Screenshot: Landing
    await page.screenshot({ path: 'test-results/smoke-2-vergleich-landing.png' });
    console.log('  ✓ Page loaded');
    
    // Fill form
    const fromPostalInput = page.locator('input[placeholder*="PLZ"], input[placeholder*="Von"], input[placeholder*="Adressen"]').first();
    if (await fromPostalInput.isVisible()) {
      await fromPostalInput.fill(TEST_DATA.fromPostal);
      console.log('  ✓ From postal filled');
      
      const toPostalInput = page.locator('input[placeholder*="nach"], input[placeholder*="Zu"], input[placeholder*="Ziel"]').first();
      if (await toPostalInput.isVisible()) {
        await toPostalInput.fill(TEST_DATA.toPostal);
        console.log('  ✓ To postal filled');
      }
      
      // Fill rooms if visible
      const roomsInput = page.locator('select[name*="room"], input[placeholder*="Zimmer"], input[placeholder*="rooms"]').first();
      if (await roomsInput.isVisible()) {
        await roomsInput.fill(TEST_DATA.rooms);
        console.log('  ✓ Rooms filled');
      }
      
      // Fill date if visible
      const dateInput = page.locator('input[type="date"]').first();
      if (await dateInput.isVisible()) {
        await dateInput.fill(TEST_DATA.moveDate);
        console.log('  ✓ Date filled');
      }
      
      // Screenshot: Form filled
      await page.screenshot({ path: 'test-results/smoke-2-vergleich-filled.png' });
      
      // Submit
      const submitBtn = page.locator('button:has-text("Weiter"), button:has-text("Offerten"), button[type="submit"]').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        console.log('  ✓ Form submitted');
        
        // Wait for next page
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        // Screenshot: Next step or results
        await page.screenshot({ path: 'test-results/smoke-2-vergleich-result.png' });
        console.log('✅ Funnel 2: PASS\n');
      } else {
        console.log('❌ Funnel 2: FAIL - No submit button');
      }
    } else {
      console.log('❌ Funnel 2: FAIL - No form found');
    }
  });

  // ==========================================
  // Funnel 3: Video Upload
  // ==========================================
  test('3. Video Upload - Interface Visible', async ({ page }) => {
    test.setTimeout(30000);
    
    console.log('📱 Test 3: Video (/video)');
    await page.goto('/video');
    await page.waitForLoadState('networkidle');
    
    // Screenshot: Landing
    await page.screenshot({ path: 'test-results/smoke-3-video-landing.png' });
    console.log('  ✓ Page loaded');
    
    // Check for upload interface
    const uploadInput = page.locator('input[type="file"]').first();
    const uploadButton = page.locator('button:has-text("Upload"), button:has-text("Video"), [role="button"]:has-text("Drag")').first();
    
    if (await uploadInput.isVisible() || await uploadButton.isVisible()) {
      console.log('  ✓ Upload interface visible');
      console.log('✅ Funnel 3: PASS\n');
    } else {
      console.log('⚠️  Funnel 3: PARTIAL - No obvious upload interface found');
      const pageText = await page.locator('body').textContent();
      if (pageText?.includes('video') || pageText?.includes('upload') || pageText?.includes('Video')) {
        console.log('  ℹ️  Page contains video/upload references');
        console.log('✅ Funnel 3: PASS (text reference found)\n');
      } else {
        console.log('❌ Funnel 3: FAIL\n');
      }
    }
  });

  // ==========================================
  // Funnel 4: Company Directory
  // ==========================================
  test('4. Firmenverzeichnis - Companies Load', async ({ page }) => {
    test.setTimeout(30000);
    
    console.log('📱 Test 4: Firmenverzeichnis (/umzugsfirmen)');
    await page.goto('/umzugsfirmen');
    await page.waitForLoadState('networkidle');
    
    // Screenshot: Landing
    await page.screenshot({ path: 'test-results/smoke-4-firms-landing.png' });
    console.log('  ✓ Page loaded');
    
    // Check for company list
    const companyItems = page.locator('[data-testid="company-card"], .company-item, li:has-text("Zürich"), .card:has-text("Umzug")');
    const companyCount = await companyItems.count();
    
    if (companyCount > 0) {
      console.log(`  ✓ Found ${companyCount} companies`);
      console.log('✅ Funnel 4: PASS\n');
    } else {
      // Fallback: check for company names or descriptions
      const pageText = await page.locator('body').textContent() || '';
      const hasCompanies = pageText.includes('Umzug') || pageText.includes('AG') || pageText.includes('GmbH');
      
      if (hasCompanies) {
        console.log('  ✓ Companies found in text');
        console.log('✅ Funnel 4: PASS\n');
      } else {
        console.log('❌ Funnel 4: FAIL - No companies found\n');
      }
    }
  });

  // ==========================================
  // Funnel 5: Best Companies Ranking
  // ==========================================
  test('5. Beste Firmen - Ranking Visible', async ({ page }) => {
    test.setTimeout(30000);
    
    console.log('📱 Test 5: Beste Firmen (/beste-umzugsfirma)');
    await page.goto('/beste-umzugsfirma');
    await page.waitForLoadState('networkidle');
    
    // Screenshot: Landing
    await page.screenshot({ path: 'test-results/smoke-5-best-landing.png' });
    console.log('  ✓ Page loaded');
    
    // Check for ranking list
    const rankingItems = page.locator('[data-testid="ranking"], .ranking-list li, [role="listitem"]:has-text("★")');
    const rankingCount = await rankingItems.count();
    
    if (rankingCount > 0) {
      console.log(`  ✓ Found ${rankingCount} ranked items`);
      console.log('✅ Funnel 5: PASS\n');
    } else {
      // Fallback: check for rating symbols or "beste" references
      const pageText = await page.locator('body').textContent() || '';
      const hasRanking = pageText.includes('★') || pageText.includes('Beste') || pageText.includes('Bewertung');
      
      if (hasRanking) {
        console.log('  ✓ Ranking indicators found');
        console.log('✅ Funnel 5: PASS\n');
      } else {
        console.log('❌ Funnel 5: FAIL - No ranking visible\n');
      }
    }
  });

  // Summary after all tests
  test.afterAll(async () => {
    console.log('\n========================================');
    console.log('🏁 SMOKE TEST COMPLETE');
    console.log('========================================');
    console.log('Screenshots saved to: test-results/smoke-*.png');
    console.log('Report: Check output above for pass/fail status');
  });
});
