# 🧪 Umzugscheck Testing Infrastructure

Professionelle **End-to-End Testing Suite** für die 20 Core Customer Journeys. Kann von jedem AI Agent (Lovable, Claude, GPT, Gemini) oder Mensch verwendet werden.

---

## 📋 Quick Start

### 1. Run Full Test Suite

```bash
# Install if needed
npm install

# Run all 20 funnel tests (Desktop + Mobile)
npm run test:e2e

# View HTML report
npm run test:e2e -- --reporter=html
open test-results/index.html
```

### 2. Use Quick Reference

- **For agents**: Open [`docs/FUNNEL_QUICK_REFERENCE.md`](./docs/FUNNEL_QUICK_REFERENCE.md)
- **For team**: Open [`docs/FUNNEL_TEST_RESULTS.md`](./docs/FUNNEL_TEST_RESULTS.md)
- **For detailed protocol**: Open [`docs/FUNNEL_TESTING_PLAN.md`](./docs/FUNNEL_TESTING_PLAN.md)

### 3. For Lovable Agent

Copy this prompt:

```
Task: "Test all 20 Core Umzugscheck Funnels.

Reference: docs/FUNNEL_QUICK_REFERENCE.md
Test helpers: src/lib/funnel-test-helpers.ts

For each funnel:
1. Navigate to the route
2. Use test persona data
3. Follow the user journey
4. Screenshot entry, steps, result
5. Rate conversion 1-10
6. Report blockers

Focus on Critical 6 first."
```

---

## 📂 Project Structure

```
├── docs/
│   ├── FUNNEL_TESTING_PLAN.md        # Detailed test protocol (👈 start here)
│   ├── FUNNEL_TEST_RESULTS.md        # Weekly tracking template
│   ├── FUNNEL_QUICK_REFERENCE.md     # Quick reference for agents
│
├── e2e/
│   ├── core-20-funnels.spec.ts       # Playwright E2E test suite
│   ├── conversion-funnels.spec.ts    # Older test file
│
├── src/
│   └── lib/
│       └── funnel-test-helpers.ts    # Test personas, data, selectors
│
├── test-reports/                      # Generated reports & screenshots
│   ├── report-XXXXXXXX.md            # Markdown reports
│   ├── results-XXXXXXXX.json         # JSON results
│   └── screenshots/                  # Test screenshots
│
└── playwright.config.ts              # Playwright configuration
```

---

## 🎯 The 20 Core Funnels

### Critical (6) - Test Daily
1. Homepage Smart Router (`/`)
2. Vergleich Wizard (`/vergleich`)
3. Video-Offerte (`/video`)
5. Firmenverzeichnis (`/umzugsfirmen`)
6. Beste Firmen Ranking (`/beste-umzugsfirma`)
11. Region Zürich (`/umzugsfirmen/zuerich`)

### High Priority (7) - Test Weekly
4. AI Photo Upload (`/rechner/ai`)
7. Günstige Firmen (`/guenstige-umzugsfirma`)
8. Firmenprofil (`/firma/:slug`)
9. Reinigungsrechner (`/rechner/reinigung`)
10. Entsorgungsrechner (`/rechner/entsorgung`)
12. Region Bern (`/umzugsfirmen/bern`)
13-14. Service Pages (`/privatumzug`, `/firmenumzug`)
18. B2B Portal (`/fuer-firmen`)

### Medium Priority (7) - Test Monthly
15. Umzugskosten Guide (`/umzugskosten`)
16. Checkliste (`/umzugscheckliste`)
17. FAQ (`/faq`)
19. Lagerrechner (`/rechner/lager`)
20. Packservice (`/rechner/packservice`)

---

## 🤖 Test Personas

```typescript
P1: Private Move (Zürich→Zug, 3 rooms)
P2: Private Move + Cleaning (Luzern→Zug, 2.5 rooms)
P3: Cleaning Only
P4: Business Move (3-10 workstations)
P5: Mobile/Impatient User (phone, drops easily)
```

**Test Data**:
```javascript
// Import from src/lib/funnel-test-helpers.ts
import { TEST_PERSONAS, getPersonaData } from '@/lib/funnel-test-helpers';

const p1 = getPersonaData('P1_PRIVATE_ZUG');
// {
//   name: 'Max Test',
//   email: 'max.test@example.com',
//   phone: '+41 79 000 00 01',
//   fromPostal: '8001',
//   toPostal: '6300',
//   rooms: '3'
// }
```

---

## 📊 Test Metrics

Each funnel is rated on:

| Metric | Scale | Target |
|--------|-------|--------|
| **Conversion Score** | 1-10 | 7+ for critical |
| **Status** | PASS/PARTIAL/FAIL | ≥90% passing |
| **Time to Complete** | seconds | <30s optimal |
| **UX Friction** | notes | <3 issues per flow |
| **Trust Elements** | notes | Social proof visible |

---

## ✅ Minimum Passing Criteria

For a funnel to **PASS**:
- ✅ Page loads in <3 seconds
- ✅ No blocking console errors
- ✅ Primary CTA visible and clickable
- ✅ Forms can be filled and submitted
- ✅ User reaches goal (result, thank you, offer list)
- ✅ Mobile: buttons ≥44px for touch

For a funnel to **PARTIAL** (minor issues):
- Flow works but has friction
- User can reach goal despite issues

For a funnel to **FAIL** (blocked):
- Cannot complete flow
- Blank/error page
- Missing critical elements

---

## 🧪 Running Tests

### Automated (Playwright)

```bash
# All tests
npm run test:e2e

# Only critical funnels
npm run test:e2e -- --grep "Critical"

# Only mobile
npm run test:e2e -- --grep "Mobile"

# Specific funnel
npm run test:e2e -- --grep "Homepage"

# With reporter
npm run test:e2e -- --reporter=html
npm run test:e2e -- --reporter=json > results.json

# Debug mode
npm run test:e2e -- --debug

# View UI
npm run test:e2e -- --ui
```

### Manual (Browser)

1. Open [`docs/FUNNEL_QUICK_REFERENCE.md`](./docs/FUNNEL_QUICK_REFERENCE.md)
2. Open each route in browser
3. Use test data from `TEST_PERSONAS`
4. Follow the user journey
5. Document any issues

### With Lovable Agent

Copy prompt from [`docs/FUNNEL_QUICK_REFERENCE.md`](./docs/FUNNEL_QUICK_REFERENCE.md)

---

## 📈 Reading Test Reports

### Markdown Report

Generated at: `test-reports/report-XXXXXXXX.md`

Contains:
- Executive summary (% passing)
- Issues backlog (P0, P1, P2, P3)
- Results table (all 20 funnels)
- Detailed findings per funnel
- Launch readiness verdict

### JSON Results

Generated at: `test-reports/results-XXXXXXXX.json`

Programmatic access to all test results. Use for dashboards or CI/CD integration.

### Screenshots

Saved to: `test-reports/screenshots/`

Captured at:
- Initial page load
- After CTA click
- After form submission
- Result/thank you page
- Any errors

---

## 🔄 Test Execution Schedule

| Frequency | What | Command | Duration |
|-----------|------|---------|----------|
| **Daily** | Smoke test (Critical 6) | Auto on push | 5min |
| **Weekly** | Full 20-funnel suite | Monday 9am | 20min |
| **Weekly** | Regression check | Friday 4pm | 30min |
| **Before Deploy** | Critical path | Auto before merge | 10min |
| **Monthly** | Medium priority funnels | First Friday | 30min |

---

## 🎯 Launch Readiness Checklist

**Ready to launch when:**

- [ ] ✅ All 6 Critical funnels pass (score ≥7/10)
- [ ] ✅ 90% of High priority (6/7) pass (score ≥6/10)
- [ ] ✅ No P0 blockers remaining
- [ ] ✅ Mobile tests pass for Critical funnels
- [ ] ✅ Average conversion score ≥7.0/10
- [ ] ✅ <5% flaky tests
- [ ] ✅ All regional pages work (Zürich, Bern, Luzern)
- [ ] ✅ Lead submission confirmations working
- [ ] ✅ Thank you pages reachable and clear
- [ ] ✅ Console errors <3 per funnel

---

## 🐛 Found an Issue?

1. **Quick Report**: Note the issue in [`FUNNEL_TEST_RESULTS.md`](./docs/FUNNEL_TEST_RESULTS.md)
2. **Detailed Report**: Create issue with format from Quick Reference
3. **Screenshot**: Save to `test-reports/screenshots/`
4. **Severity**: Mark as P0 (blocking) / P1 (major) / P2 (minor) / P3 (cosmetic)

---

## 📚 Key Files

| File | Purpose | Audience |
|------|---------|----------|
| **FUNNEL_TESTING_PLAN.md** | Complete test protocol | QA leads, agents |
| **FUNNEL_QUICK_REFERENCE.md** | Copy-paste prompts & quick tips | Agents, QA |
| **FUNNEL_TEST_RESULTS.md** | Weekly tracking template | Team leads |
| **funnel-test-helpers.ts** | Test data, personas, selectors | Developers |
| **core-20-funnels.spec.ts** | Playwright E2E suite | CI/CD, DevOps |

---

## 🔗 Integration with CI/CD

### GitHub Actions

```yaml
name: Test Core Funnels
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-reports
          path: test-reports/
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit
npm run test:e2e -- --grep "Critical"
```

---

## 💡 Tips for Agents

### For Lovable

1. Use browser tools to navigate & screenshot
2. Reference `TEST_PERSONAS` for realistic data
3. Fill forms like a real user (not instant)
4. Wait for network requests to complete
5. Check console for errors after each step

### For Claude/GPT/Gemini

1. Request browser/automation capability
2. Paste test suite location: `e2e/core-20-funnels.spec.ts`
3. Reference helpers: `src/lib/funnel-test-helpers.ts`
4. Run with `npm run test:e2e`
5. Parse JSON results for further analysis

### For Manual Testers

1. Read `FUNNEL_QUICK_REFERENCE.md` first
2. Use same test data across all funnels
3. Screenshot: start, each step, result
4. Note exact error messages
5. Rate friction 1-10
6. Track in `FUNNEL_TEST_RESULTS.md`

---

## 🚀 What's Next?

1. **Run the tests**: `npm run test:e2e`
2. **Review the report**: `test-reports/report-XXXXXXXX.md`
3. **Fix any P0 blockers**: Critical issues only
4. **Retest the critical 6**: Verify fixes
5. **Weekly schedule**: Set up recurring tests
6. **Go live**: When all criteria met

---

## 📞 Questions?

- **How to run tests?** → See "Running Tests" section
- **What's failing?** → Check latest test report in `test-reports/`
- **How to fix issues?** → Each report includes suggested fixes
- **Need custom test?** → Edit `e2e/core-20-funnels.spec.ts`
- **Add new funnel?** → Add to `CORE_20_FUNNELS` in `funnel-test-helpers.ts`

---

## 📊 Current Status

| Component | Status |
|-----------|--------|
| Test Suite | ✅ Ready |
| Test Helpers | ✅ Ready |
| Documentation | ✅ Complete |
| CI/CD Integration | ⏳ Pending |
| Lovable Integration | ⏳ Pending |

---

**Created**: 2026-01-28  
**Version**: 1.0  
**Maintained by**: QA & DevOps Team
