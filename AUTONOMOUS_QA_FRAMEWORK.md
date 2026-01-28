# 🚀 Umzugscheck.ch - Autonomous Agent QA Testing Framework

**Status**: ✅ **PRODUCTION READY**  
**Last Updated**: 2026-01-28  
**Version**: 1.0  

---

## 📌 What You Have

A **complete autonomous testing system** for validating all user journeys on https://umzugscheck.ch.

**Key Components**:
1. ✅ **4 Test Scenarios** (A-D) covering all customer journeys
2. ✅ **5 Test Personas** with realistic Swiss data
3. ✅ **Copy-paste prompts** for 8 different agent platforms
4. ✅ **Detailed results template** for documentation
5. ✅ **Integration guide** for Zapier, MultiOn, Selenium, etc.
6. ✅ **Executable Playwright suite** for automated testing
7. ✅ **Weekly tracking dashboard** for results

---

## 🎯 Your 3-Minute Quick Start

### Option 1: Run Playwright (Immediate)
```bash
# Install (if not already done)
npm install

# Run all tests
npm run test:e2e

# View results
open test-reports/report-*.html
```

**Time**: ~20 minutes for full test run  
**Output**: HTML report + JSON data + Markdown summary

---

### Option 2: Use MultiOn Agent (Browser-Based)
1. Go to: https://www.multihon.com
2. Create new task
3. Copy-paste from: [docs/AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md)
4. Select "MultiOn Users" section
5. Click "Execute"
6. Wait 20 minutes
7. Download results
8. Paste into: [docs/AGENT_TEST_RESULTS_TEMPLATE.md](docs/AGENT_TEST_RESULTS_TEMPLATE.md)

**Time**: ~5 minutes setup + 20 minutes execution  
**Output**: Screenshots + detailed report

---

### Option 3: Use Zapier (Weekly Automation)
1. Create Zapier account
2. Create "Zap" following: [docs/AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 2
3. Set schedule: Monday 9:00 AM
4. Configure webhook to your backend
5. Results auto-populate in Airtable / Slack

**Time**: ~10 minutes setup (one-time)  
**Output**: Weekly automated reports + Slack alerts

---

## 📂 File Directory

```
umzugscheck.ch/
├── AGENT_EXECUTION_PROMPT.sh          ← Main prompt (copy for agents)
├── docs/
│   ├── AGENT_INTEGRATION_GUIDE.md     ← Setup for MultiOn, Zapier, etc.
│   ├── AGENT_TEST_RESULTS_TEMPLATE.md ← Results documentation format
│   ├── AGENT_PROMPTS_COPY_PASTE.md    ← Platform-specific prompts
│   ├── FUNNEL_TESTING_PLAN.md         ← Main testing protocol
│   └── FUNNEL_TEST_RESULTS.md         ← Weekly tracking
├── e2e/
│   └── core-20-funnels.spec.ts        ← Playwright test suite
├── src/lib/
│   └── funnel-test-helpers.ts         ← Test data, personas, selectors
└── scripts/
    └── verify-testing-setup.js         ← Verify framework is ready
```

---

## 🎬 Test Scenarios (What Gets Tested)

### Scenario A: Private Move (Canton Zug)
**Purpose**: Test the main moving service flow  
**Persona**: P1 (Max Test) - Private user, 3.5 rooms  
**Steps**:
1. Open homepage
2. Fill from postal: 8000 (Zurich)
3. Fill to postal: 6300 (Zug)
4. Select rooms: 3.5
5. (Optional) Add cleaning
6. Fill contact info
7. Submit form
8. Verify confirmation page

**Success Criteria**: Reach confirmation page without errors

---

### Scenario B: Cleaning Only
**Purpose**: Test alternative service (cleaning without moving)  
**Persona**: P3 (Mia Test) - Only needs cleaning  
**Steps**:
1. Navigate to cleaning section
2. Select location: 3000 (Bern)
3. Select rooms: 2.5
4. Fill contact info
5. Submit
6. Verify confirmation

**Success Criteria**: Can select cleaning-only without being forced to add moving

---

### Scenario C: Complex Multi-Service
**Purpose**: Test multiple services together (moving + storage + assembly)  
**Persona**: P4 (Franz Business) - Business moving  
**Steps**:
1. Select moving service
2. Add storage option
3. Add assembly option
4. Fill details: Basel → Aarau, 8 workstations
5. Fill contact info
6. Submit
7. Verify ALL services shown in confirmation

**Success Criteria**: Multiple services stay selected and confirmed

---

### Scenario D: Robustness & Mobile
**Purpose**: Test edge cases and mobile UX  
**Checks**:
- Back button: Data preserved? ✓/✗
- Refresh: Form recovers? ✓/✗
- Validation: Invalid input rejected? ✓/✗
- Mobile buttons: ≥44px (tappable)? ✓/✗
- Mobile: No horizontal scroll? ✓/✗
- Load time: <5 seconds? ✓/✗

**Success Criteria**: All checks pass

---

## 📊 Test Results Template

When agent completes tests, it should produce a report like:

```
SCENARIO A: PRIVATE MOVE
- Status: PASS ✓
- Conversion Score: 9/10
- Time to Complete: 2.5 minutes
- Issues Found: None (P0), 1 minor (P2)
- Blockers: None

SCENARIO B: CLEANING ONLY
- Status: PASS ✓
- Conversion Score: 8/10
- Time to Complete: 1.5 minutes
- Issues Found: 1 (P2: Button styling)
- Blockers: None

SCENARIO C: MULTI-SERVICE
- Status: FAIL ✗
- Conversion Score: 4/10
- Time to Complete: 5 minutes
- Issues Found: 2 (P0, P1)
- Blockers: "Storage option deselected after page 2"

SCENARIO D: ROBUSTNESS
- Back button: ✓ Preserves data
- Refresh: ✓ Form recovers
- Validation: ✓ Catches invalid input
- Mobile: ⚠️ CTA button too small (P2)
- Load time: ✓ 2.3 seconds

OVERALL: 75% complete (3/4 scenarios pass)
READINESS: NO - Must fix P0 storage selection issue first
```

---

## 🔧 Agent Platform Comparison

| Feature | Playwright | MultiOn | Zapier | Selenium | Claude |
|---------|-----------|---------|--------|----------|--------|
| **Setup Time** | 5 min | 2 min | 10 min | 30 min | 1 min |
| **Cost** | Free | Free tier | $20-100/mo | Free | $20/mo |
| **Automation** | Yes | Yes | Yes | Yes | No |
| **Screenshots** | Yes | Yes | No | Yes | No |
| **Scheduling** | GitHub Actions | Native | Native | Custom | No |
| **Best For** | CI/CD | Quick tests | Weekly reports | Detailed control | Ad-hoc testing |

**Recommendation**: Start with **Playwright** (immediate results) + **MultiOn** (visual validation) + **Zapier** (weekly automation)

---

## 📋 Weekly Testing Schedule

### Monday 9:00 AM
**Agent Testing Starts**
- Zapier trigger fires
- MultiOn agent begins Scenario A
- Playwright suite runs in parallel
- Results collected

### Wednesday 2:00 PM
**Team Review**
- Open: [docs/AGENT_TEST_RESULTS_*.md](docs/AGENT_TEST_RESULTS_TEMPLATE.md)
- Triage P0/P1 issues
- Assign fixes

### Friday 4:00 PM
**Final Check + Documentation**
- Manual spot-check critical paths
- Update: [docs/FUNNEL_TEST_RESULTS.md](docs/FUNNEL_TEST_RESULTS.md)
- Document week's findings
- Schedule next week's tests

---

## 🎬 How to Run Your First Test

### Method 1: Playwright (Recommended for CI/CD)

```bash
# 1. Install dependencies
npm install

# 2. Run tests
npm run test:e2e

# 3. View report
open test-reports/report-YYYY-MM-DD.html

# 4. Save results
cp test-reports/report-*.md docs/AGENT_TEST_RESULTS_PLAYWRIGHT.md
```

**Output Files**:
- `test-reports/report-YYYY-MM-DD.html` (interactive)
- `test-reports/report-YYYY-MM-DD.json` (machine-readable)
- `test-reports/report-YYYY-MM-DD.md` (markdown summary)
- `test-reports/screenshots/` (all captures)

---

### Method 2: MultiOn (Recommended for Visual Testing)

```
1. Open: https://www.multihon.com
2. Login or create account
3. Create new task
4. Paste prompt from: docs/AGENT_PROMPTS_COPY_PASTE.md (MultiOn section)
5. Click "Execute"
6. Wait 15-20 minutes
7. Review results in MultiOn dashboard
8. Download report
9. Paste into: docs/AGENT_TEST_RESULTS_MULTIHON.md
```

**Output**: 
- Screenshots of each step
- Form field details
- Error messages (if any)
- Conversion path visualization

---

### Method 3: Zapier (Recommended for Weekly Automation)

```
1. Create Zapier account (free tier OK)
2. Follow setup in: docs/AGENT_INTEGRATION_GUIDE.md Section 2
3. Configure webhook to your backend
4. Set schedule: Monday 9 AM
5. Add Slack action for notifications
6. Add Airtable action to store results
7. Turn on Zap
8. Next Monday, results auto-populate
```

**Benefits**:
- ✅ Fully automated
- ✅ Weekly results
- ✅ Slack alerts for P0 issues
- ✅ Airtable dashboard
- ✅ Historical tracking

---

## 🚨 Issue Severity Guide

When agent finds issues, they're marked:

### 🔴 P0 - CRITICAL (Blocks Completion)
- Form never submits
- Blank screen appears
- Submit button disabled
- **Action**: Fix TODAY before users hit it

### 🟠 P1 - MAJOR (Slows Conversion)
- Confusing form labels
- Slow page load (>5s)
- Button hard to find
- Required field validation confusing
- **Action**: Fix this week

### 🟡 P2 - MINOR (Quality Issue)
- Button styling looks wrong
- Text alignment off
- Error message could be clearer
- **Action**: Fix next sprint

### ⚪ P3 - COSMETIC (Nice-to-Have)
- Typo
- Color shade not perfect
- Spacing could be better
- **Action**: Defer unless redesigning

---

## 📈 Success Metrics

You're on track if:

| Metric | Target | Status |
|--------|--------|--------|
| Scenarios Passed | 4/4 (100%) | ✓ |
| Avg Conversion Score | ≥8/10 | ✓ |
| P0 Issues | 0 | ✓ |
| P1 Issues | ≤2 | ✓ |
| Page Load Time | <5 seconds | ✓ |
| Mobile UX Score | ≥8/10 | ✓ |
| Form Completion Time | <3 minutes | ✓ |

**Go-Live Readiness**: "YES" when all metrics ✓

---

## 🛠️ Common Issues & Fixes

### Issue: Form validation rejects valid postal codes
**Root Cause**: Swiss postal code format validation wrong  
**Fix**: Update validation regex to accept 4-digit codes  
**Who**: Backend developer  
**Time**: 15 minutes

### Issue: Mobile buttons too small (<44px)
**Root Cause**: Tailwind size class incorrect  
**Fix**: Change from `px-4 py-2` to `px-6 py-3`  
**Who**: Frontend developer  
**Time**: 5 minutes

### Issue: Submit button disabled after page refresh
**Root Cause**: Form state lost on reload  
**Fix**: Add localStorage persistence  
**Who**: Frontend developer  
**Time**: 30 minutes

### Issue: Confirmation page never loads
**Root Cause**: Missing redirect after submission  
**Fix**: Add `redirect()` to backend function  
**Who**: Backend developer  
**Time**: 10 minutes

---

## 📞 Support & Questions

### "How do I run the tests?"
Start with: **Method 1 (Playwright)** above

### "Which agent platform should I use?"
- **Quick one-time test**: MultiOn
- **Weekly automation**: Zapier
- **CI/CD integration**: Playwright
- **Ad-hoc testing**: Claude/ChatGPT

### "How long do tests take?"
- **Playwright**: ~20 minutes
- **MultiOn**: ~20 minutes
- **Zapier**: Automated (you set schedule)

### "What if tests find an issue?"
1. Check severity (P0/P1/P2/P3)
2. Assign to team member
3. Retest after fix
4. Document in FUNNEL_TEST_RESULTS.md

### "Can I schedule tests automatically?"
**Yes!** Use Zapier (Section 2 of integration guide)
- Set to run every Monday 9 AM
- Auto-alert team on Slack
- Store results in Airtable
- Zero manual effort

---

## ✅ Checklist: Ready to Start?

- [ ] You have Node.js installed (`node --version`)
- [ ] You have npm installed (`npm --version`)
- [ ] You can access https://umzugscheck.ch (not geo-blocked)
- [ ] You know your test data (postal codes, names)
- [ ] You have a way to collect results (Airtable, spreadsheet, etc.)
- [ ] You have Slack for alerts (optional but recommended)
- [ ] You've chosen your agent platform (Playwright, MultiOn, Zapier, etc.)

**All checked?** → You're ready! Pick a method above and start.

---

## 📚 Full Documentation

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [AGENT_EXECUTION_PROMPT.sh](AGENT_EXECUTION_PROMPT.sh) | Main agent prompt | Copy-paste into agents |
| [AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md) | Platform-specific prompts | Pick your platform |
| [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) | Setup for each platform | Setting up automation |
| [AGENT_TEST_RESULTS_TEMPLATE.md](docs/AGENT_TEST_RESULTS_TEMPLATE.md) | Results documentation | After tests run |
| [FUNNEL_TESTING_PLAN.md](docs/FUNNEL_TESTING_PLAN.md) | Full testing protocol | Deep dive (100+ pages) |
| [FUNNEL_TEST_RESULTS.md](docs/FUNNEL_TEST_RESULTS.md) | Weekly tracking | Week-to-week results |

---

## 🎯 Next Actions

### **TODAY**
1. Choose your testing method (Playwright / MultiOn / Zapier)
2. Run your first test
3. Collect results

### **THIS WEEK**
4. Review test findings with team
5. Triage P0/P1 issues
6. Start fixing critical issues

### **NEXT WEEK**
7. Retest to verify fixes
8. Schedule weekly testing (if using Zapier)
9. Document results in tracking sheet

### **ONGOING**
10. Run tests every Monday
11. Review results Wednesday
12. Fix issues continuously
13. Track improvements over time

---

## 📞 Questions or Issues?

1. **Technical help**: See docs/AGENT_INTEGRATION_GUIDE.md
2. **Test help**: See docs/FUNNEL_TESTING_PLAN.md  
3. **Results help**: See docs/AGENT_TEST_RESULTS_TEMPLATE.md
4. **Quick answers**: See section "Support & Questions" above

---

**🚀 You're all set! Pick a method and start testing.**

**Recommended starting point**: [docs/AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md)

---

**Created**: 2026-01-28  
**Version**: 1.0  
**Status**: ✅ Production Ready  
**Maintained by**: QA Team
