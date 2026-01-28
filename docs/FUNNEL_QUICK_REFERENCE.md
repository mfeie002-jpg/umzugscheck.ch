# Umzugscheck Core 20 Funnels - Quick Reference Guide for Agents

> **Quick Start**: Copy-paste prompts for testing any of the 20 funnels

---

## 🚀 For Lovable Agent (Visual Testing)

### Run All 20 Tests

```
Task: "Test all 20 Core Umzugscheck Funnels using the Playwright test suite.

Follow this protocol for EACH of the 20 routes:

Test Personas (rotate):
- P1 (Zürich→Zug, 3 rooms): Max Test / max.test@example.com / +41 79 000 00 01
- P2 (Cleaning + move): Mia Muster / mia.muster@example.com / +41 79 000 00 02
- P4 (Business move): Franz Gesch / franz.gesch@example.com / +41 79 000 00 04
- P5 (Mobile/impatient): Rapidus User / rapid.user@example.com / +41 79 000 00 05

Steps for EACH funnel:
1. Open URL in fresh tab/viewport
2. Screenshot: page loads
3. Find and click primary CTA
4. If form: fill with test persona data, submit
5. Screenshot: result/thank you
6. Note: any errors, friction, missing trust elements
7. Rate conversion 1-10
8. Move to next funnel

Report format:
Funnel #[N]: [Name] → Status: ✅/⚠️/❌ → Score: X/10 → Notes: [issues]"
```

### Test One Funnel

```
Task: "Test Funnel #2: Vergleich Wizard at /vergleich

Persona: Max Test (Zürich→Zug, 3 rooms)

Steps:
1. Navigate to https://umzugscheckv2.lovable.app/vergleich
2. Screenshot: page loads
3. Fill form:
   - From postal: 8001
   - To postal: 6300
   - Rooms: 3
   - Date: 2026-03-15
4. Click 'Weiter' or 'Offerten erhalten'
5. Screenshot: next step
6. Repeat until thank you page
7. Screenshot: thank you page
8. Report: Success (✅) or Issues (⚠️/❌)"
```

### Test Critical 5 Funnels (Quick Check)

```
Task: "Run quick smoke test on 5 Critical funnels:

1. Homepage (/) → Click 'Offerten vergleichen'
2. Vergleich (/vergleich) → Fill + Submit
3. Video (/video) → Verify upload interface visible
4. Firmenverzeichnis (/umzugsfirmen) → Verify companies load
5. Beste Firmen (/beste-umzugsfirma) → Verify ranking visible

Viewport: Desktop 1920x1080
Time limit: 15 minutes
Report any blockers immediately"
```

---

## 🤖 For Claude/GPT/Gemini (API Testing)

### Test Using E2E Test Suite

```bash
# Run all tests
npm run test:e2e

# Run only critical funnels
npm run test:e2e -- --grep="Critical"

# Run with HTML report
npm run test:e2e -- --reporter=html

# Get JSON results
npm run test:e2e -- --reporter=json > test-results.json
```

### Specific Funnel Routes (Manual)

```json
{
  "task": "test_core_20_funnels",
  "base_url": "https://umzugscheckv2.lovable.app",
  "test_funnels": [
    {
      "id": 1,
      "name": "Homepage",
      "route": "/",
      "expected_element": "primary CTA or PLZ input",
      "persona": "P1"
    },
    {
      "id": 2,
      "name": "Vergleich Wizard",
      "route": "/vergleich",
      "expected_element": "form with postal, rooms, date",
      "persona": "P1",
      "test_data": {
        "from_postal": "8001",
        "to_postal": "6300",
        "rooms": "3"
      }
    },
    {
      "id": 3,
      "name": "Video-Offerte",
      "route": "/video",
      "expected_element": "video upload input",
      "persona": "P1"
    },
    {
      "id": 5,
      "name": "Firmenverzeichnis",
      "route": "/umzugsfirmen",
      "expected_element": "company list",
      "persona": "P1"
    },
    {
      "id": 6,
      "name": "Beste Firmen",
      "route": "/beste-umzugsfirma",
      "expected_element": "ranking list",
      "persona": "P1"
    }
  ],
  "assertions": [
    "page loads within 3s",
    "no console errors (max 2 warnings)",
    "primary CTA visible above fold",
    "form submits successfully",
    "thank you page visible after completion"
  ]
}
```

---

## 📊 The 20 Funnels (Quick Overview)

### Critical (Test Daily)

| # | Name | Route | Quick Test |
|---|------|-------|-----------|
| 1 | Homepage | `/` | Click main CTA |
| 2 | Vergleich | `/vergleich` | Fill form, submit |
| 3 | Video | `/video` | Upload interface visible |
| 5 | Firmenverzeichnis | `/umzugsfirmen` | Companies load |
| 6 | Beste Firmen | `/beste-umzugsfirma` | Ranking loads |
| 11 | Region Zürich | `/umzugsfirmen/zuerich` | Regional list loads |

### High Priority (Test Weekly)

| # | Name | Route | 
|---|------|-------|
| 4 | AI Photo | `/rechner/ai` |
| 7 | Günstige Firmen | `/guenstige-umzugsfirma` |
| 8 | Firmenprofil | `/firma/:slug` |
| 9 | Cleaning Calc | `/rechner/reinigung` |
| 10 | Disposal Calc | `/rechner/entsorgung` |
| 12 | Region Bern | `/umzugsfirmen/bern` |
| 13 | Privatumzug | `/privatumzug` |
| 14 | Firmenumzug | `/firmenumzug` |
| 18 | B2B Portal | `/fuer-firmen` |

### Medium Priority (Test Monthly)

| # | Name | Route |
|---|------|-------|
| 15 | Umzugskosten Guide | `/umzugskosten` |
| 16 | Checkliste | `/umzugscheckliste` |
| 17 | FAQ | `/faq` |
| 19 | Lagerrechner | `/rechner/lager` |
| 20 | Packservice | `/rechner/packservice` |

---

## 🧪 Test Selectors (for manual testing)

```javascript
// Global
Primary CTA: "[data-testid='main-cta'], button:has-text('Offerten'), button:has-text('Weiter')"
Form Submit: "button[type='submit'], [data-testid='submit-btn']"

// Form Fields
Postal: "input[placeholder*='PLZ'], input[name='postal']"
Email: "input[type='email']"
Phone: "input[type='tel']"
Rooms: "input[name='rooms'], select[name='rooms']"

// Results
Thank You: "[data-testid='thank-you'], h1:has-text('Danke'), h1:has-text('Vielen Dank')"
Price Result: "[data-testid='price-result'], .price-estimate"

// Lists
Company List: "[data-testid='company-list'], ul[role='list']"
Company Card: "[data-testid='company-card'], .company-item"
Ranking List: "[data-testid='ranking-list'], .ranking-list"
```

---

## 🐛 Quick Issue Report Template

Found a problem? Report it like this:

```
Issue: [Funnel Name] - [Brief problem]
Severity: P0/P1/P2/P3
Funnel: #N at /route
Steps:
1. Go to [URL]
2. [Action]
3. [Observe issue]
Expected: [What should happen]
Actual: [What happens]
Screenshot: [Attach if possible]
```

---

## 📱 Mobile vs Desktop

**For Mobile Testing** (390x844 viewport):
- Use smaller test personas (1 room, quick decisions)
- Verify touch targets ≥44px
- Check sticky CTA visibility
- Test with slower network

**For Desktop Testing** (1920x1080):
- Full multi-step funnels
- Test all optional features
- Check form validation

---

## ✅ Minimum Passing Criteria

For each funnel to **PASS**:

1. ✅ Page loads in <3 seconds
2. ✅ No console errors (max 2 warnings OK)
3. ✅ Primary CTA visible and clickable
4. ✅ Forms can be filled and submitted
5. ✅ User reaches a "goal" page (result, thank you, offer list)
6. ✅ No blank screens or infinite loaders
7. ✅ Mobile: buttons are tappable (44px minimum)

For funnel to **PARTIAL** (minor issues):
- Works but has friction (slow, confusing, missing text)
- User can reach goal despite friction

For funnel to **FAIL** (blocked):
- Cannot submit form
- Cannot click CTA
- Blank/error page
- Missing key elements

---

## 🔄 Weekly Testing Loop

**Monday 9am**: Run full E2E suite
```bash
npm run test:e2e
```

**Tuesday-Thursday**: Manual spot checks on critical funnels

**Friday 4pm**: Review report, triage issues

**Before each deploy**: Smoke test (critical 5 funnels)

---

## 📞 Quick Command Reference

```bash
# Start dev server
npm run dev

# Run E2E tests
npm run test:e2e

# Run with output
npm run test:e2e -- --reporter=verbose

# Generate HTML report
npm run test:e2e -- --reporter=html

# Run specific test
npm run test:e2e -- --grep "Homepage"

# View recent test reports
open test-reports/
```

---

## 🎯 What Success Looks Like

✅ **All 6 Critical funnels** pass with score ≥7/10
✅ **90% of High priority** (6/7) pass with score ≥6/10  
✅ **No P0 blockers** remaining
✅ **Mobile tests** pass for critical funnels
✅ **Average score** ≥7.0/10
✅ **Console errors** <3 per funnel
✅ **Thank you pages** reachable from all conversion flows

---

## 📚 Full Documentation

- [FUNNEL_TESTING_PLAN.md](./FUNNEL_TESTING_PLAN.md) - Detailed protocol
- [FUNNEL_TEST_RESULTS.md](./FUNNEL_TEST_RESULTS.md) - Results tracking
- [src/lib/funnel-test-helpers.ts](../src/lib/funnel-test-helpers.ts) - Test data & selectors
- [e2e/core-20-funnels.spec.ts](../e2e/core-20-funnels.spec.ts) - Playwright suite

---

**Last Updated**: 2026-01-28 | **Version**: 1.0
