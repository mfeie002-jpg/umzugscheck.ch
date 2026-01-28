# Umzugscheck Core 20 Funnels - Test Results Tracking

> **Zweck**: Wöchentliches Tracking aller 20 Core Funnels mit automatisierten E2E Tests

---

## 📊 Weekly Health Report Template

Kopiere diese Tabelle jede Woche und fülle sie mit Testergebnissen:

### Woche: [KW XX - YYYY-MM-DD]

| # | Funnel Name | Route | Status | Score | Notes | Last Test | Agent |
|---|-------------|-------|--------|-------|-------|-----------|-------|
| 1 | Homepage Smart Router | `/` | ❓ | -/10 | Pending | - | - |
| 2 | Vergleich Wizard | `/vergleich` | ❓ | -/10 | Pending | - | - |
| 3 | Video-Offerte | `/video` | ❓ | -/10 | Pending | - | - |
| 4 | AI Photo Upload | `/rechner/ai` | ❓ | -/10 | Pending | - | - |
| 5 | Firmenverzeichnis | `/umzugsfirmen` | ❓ | -/10 | Pending | - | - |
| 6 | Beste Firmen Ranking | `/beste-umzugsfirma` | ❓ | -/10 | Pending | - | - |
| 7 | Günstige Firmen | `/guenstige-umzugsfirma` | ❓ | -/10 | Pending | - | - |
| 8 | Firmenprofil | `/firma/:slug` | ❓ | -/10 | Pending | - | - |
| 9 | Reinigungsrechner | `/rechner/reinigung` | ❓ | -/10 | Pending | - | - |
| 10 | Entsorgungsrechner | `/rechner/entsorgung` | ❓ | -/10 | Pending | - | - |
| 11 | Region Zürich | `/umzugsfirmen/zuerich` | ❓ | -/10 | Pending | - | - |
| 12 | Region Bern | `/umzugsfirmen/bern` | ❓ | -/10 | Pending | - | - |
| 13 | Privatumzug Service | `/privatumzug` | ❓ | -/10 | Pending | - | - |
| 14 | Firmenumzug Service | `/firmenumzug` | ❓ | -/10 | Pending | - | - |
| 15 | Umzugskosten Guide | `/umzugskosten` | ❓ | -/10 | Pending | - | - |
| 16 | Checkliste | `/umzugscheckliste` | ❓ | -/10 | Pending | - | - |
| 17 | FAQ | `/faq` | ❓ | -/10 | Pending | - | - |
| 18 | Für Firmen (B2B) | `/fuer-firmen` | ❓ | -/10 | Pending | - | - |
| 19 | Lagerrechner | `/rechner/lager` | ❓ | -/10 | Pending | - | - |
| 20 | Packservice | `/rechner/packservice` | ❓ | -/10 | Pending | - | - |

**Summary**: 
- ✅ Passing: X/20
- ⚠️ Partial: X/20
- ❌ Failing: X/20
- 📊 Avg Score: X.X/10

---

## 📋 Legend

| Status | Meaning | Description |
|--------|---------|-------------|
| ✅ PASS | All steps completed | Funnel works end-to-end, user reaches goal |
| ⚠️ PARTIAL | Partial success | Flow mostly works but has minor friction |
| ❌ FAIL | Blocked | Funnel broken, user cannot complete |
| 🚀 IMPROVED | Regression fixed | Issue that was blocking is now resolved |
| 📍 REGRESSED | New issue | Previously passing funnel now has issues |
| ❓ PENDING | Not tested | Test not yet run or waiting for results |

| Score | Meaning |
|-------|---------|
| 9-10 | Excellent, ready for production |
| 7-8 | Good, minor issues only |
| 5-6 | Acceptable, noticeable friction |
| 3-4 | Poor, significant blockers |
| 1-2 | Critical, funnel unusable |
| 0 | Completely broken |

---

## 🔄 Test Execution Guide

### Automated Testing (Playwright)

```bash
# Run all 20 funnel tests (Desktop + Mobile)
npm run test:e2e

# Run only critical funnels
npm run test:e2e -- --grep "Critical"

# Run with detailed output
npm run test:e2e -- --reporter=html

# Run specific funnel
npm run test:e2e -- --grep "Homepage"

# Generate coverage report
npm run test:e2e -- --reporter=json --output-file=test-results.json
```

### Manual Testing (Lovable Agent)

```
Prompt for Lovable:
"Test all 20 Core Umzugscheck Funnels:

1. Use the Playwright test suite as guide: e2e/core-20-funnels.spec.ts
2. For each funnel, follow the test protocol
3. Use test personas from src/lib/funnel-test-helpers.ts
4. Capture screenshots at: start, after CTA, after form submission, result page
5. Document any errors in console
6. Rate conversion score 1-10
7. Record results in FUNNEL_TEST_RESULTS.md"
```

### Manual Testing (Direct Browser)

```
For each of the 20 routes:
1. Open the funnel in fresh incognito window
2. Follow the user journey (see FUNNEL_TESTING_PLAN.md)
3. Use test data from TEST_PERSONAS
4. Screenshot: entry, each step, result
5. Note any errors, broken buttons, confusing text
6. Rate user friction 1-10
7. Document in FUNNEL_TEST_RESULTS.md
```

---

## 🐛 Issue Tracking Template

When you find an issue, document it:

```markdown
### Issue #XXX: [Funnel Name] - [Brief Description]

**Severity**: P0/P1/P2/P3
**Funnel**: #N - [Name] at `/route`
**Persona**: P1/P2/P3/P4/P5
**Viewport**: Desktop/Mobile
**Date Found**: YYYY-MM-DD
**Status**: Open/In Progress/Fixed

**Steps to Reproduce**:
1. Go to `/route`
2. Fill form with [data]
3. Click [button]
4. Observe [problem]

**Expected**:
[What should happen]

**Actual**:
[What actually happens]

**Screenshots**:
[Links to screenshot files]

**Console Errors**:
```
[Paste any JS errors]
```

**Suggested Fix**:
[Direction for fix]

**Blocked Funnels**: #N, #M
```

---

## 📈 Metrics Tracking

### KPI Targets (per Funnel)

| Funnel | Min Conversion | Min Score | Target Mobile |
|--------|----------------|-----------|---|
| Homepage (#1) | >15% | 7+ | Must work |
| Vergleich (#2) | >25% | 8+ | Must work |
| Video (#3) | >40% | 7+ | Optimized |
| AI Photo (#4) | >30% | 7+ | Optimized |
| Firmenverzeichnis (#5) | >35% | 7+ | Must work |
| Beste Firmen (#6) | >20% | 7+ | Must work |
| Günstige Firmen (#7) | >20% | 7+ | Must work |
| Firmenprofil (#8) | >15% | 6+ | Must work |
| Cleaning Calc (#9) | >40% | 7+ | Optimized |
| Disposal Calc (#10) | >40% | 7+ | Optimized |
| Region Zürich (#11) | >25% | 7+ | Must work |
| Region Bern (#12) | >25% | 7+ | Must work |
| Privatumzug (#13) | >20% | 6+ | Must work |
| Firmenumzug (#14) | >20% | 6+ | Must work |
| Info Pages (#15-17) | >10% | 5+ | Must work |
| B2B Portal (#18) | >5% | 5+ | Must work |
| Storage/Pack (#19-20) | >40% | 7+ | Optimized |

### Weekly Metrics Template

```
Week: KW XX

Critical Funnels (6 total):
- Passing: X/6
- Score: X.X/10 (target: 8.0+)

High Priority (7 total):
- Passing: X/7
- Score: X.X/10 (target: 7.0+)

Medium Priority (7 total):
- Passing: X/7
- Score: X.X/10 (target: 6.0+)

Overall:
- Passing: X/20
- Avg Score: X.X/10
- Top Issue: [Category of issues]
- Trend: [Improving/Stable/Declining]
```

---

## 🚀 Release Checklist

Before going live, ALL of these must pass:

- [ ] All Critical funnels (1,2,3,5,6,11) score ≥7/10
- [ ] All High priority funnels score ≥6/10
- [ ] No P0 blockers remaining
- [ ] Mobile tests pass (viewport 390x844)
- [ ] Console errors < 3 per funnel
- [ ] Thank you pages reachable from all conversion flows
- [ ] Regional content is relevant (tested 3+ regions)
- [ ] Company profiles load without errors
- [ ] All calculators produce price estimates
- [ ] Video/photo uploads work (or gracefully fail)
- [ ] Form validation works for required fields
- [ ] Back button doesn't break flow
- [ ] Page refresh is safe on all steps
- [ ] Trust signals visible (reviews, badges, "kostenlos & unverbindlich")
- [ ] CTAs are sticky/visible on mobile
- [ ] No broken images or missing assets

---

## 📞 Test Execution Schedule

| When | What | Who | Duration |
|------|------|-----|----------|
| Daily | Smoke test (Critical 3 funnels) | Automated | 5min |
| Mondays 9am | Full 20-funnel test suite | Playwright | 20min |
| Fridays 4pm | Regression check + Manual spot test | QA Agent | 30min |
| After deploy | Critical path test | Automated | 10min |
| Weekly Friday | Report & triage issues | Team | 30min |

---

## 🎯 Success Criteria for Launch

**The platform is ready to go live when:**

1. ✅ 100% of Critical funnels (6) pass with score ≥7/10
2. ✅ 90% of High priority funnels (7) pass with score ≥6/10
3. ✅ 80% of Medium priority funnels (7) pass
4. ✅ No P0 (blocking) issues
5. ✅ Mobile tests pass for all Critical funnels
6. ✅ Average conversion score ≥7.0/10
7. ✅ <5% flaky tests
8. ✅ All regional pages work for Zürich, Bern, Luzern
9. ✅ Lead submission sends confirmations
10. ✅ Thank you pages are reachable and clear

---

## 📚 Test Assets

- **Playwright Test Suite**: [`e2e/core-20-funnels.spec.ts`](../e2e/core-20-funnels.spec.ts)
- **Test Helpers**: [`src/lib/funnel-test-helpers.ts`](../src/lib/funnel-test-helpers.ts)
- **Test Plan**: [`docs/FUNNEL_TESTING_PLAN.md`](./FUNNEL_TESTING_PLAN.md)
- **Screenshot Directory**: `test-reports/screenshots/`
- **Report Directory**: `test-reports/`

---

## 🔗 Related Documents

- [FUNNEL_TESTING_PLAN.md](./FUNNEL_TESTING_PLAN.md) - Detailed test protocol
- [PRODUCTION_CHECKLIST.md](../PRODUCTION_CHECKLIST.md) - Full release readiness
- [README.md](../README.md) - Project overview

---

*Last Updated: 2026-01-28*
*Test Infrastructure Version: 1.0*
