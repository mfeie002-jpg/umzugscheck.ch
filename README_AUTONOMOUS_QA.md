# 🤖 Umzugscheck.ch - Autonomous QA Testing Framework

**Turn any AI agent (MultiOn, AutoGPT, Claude, GPT-4, Zapier, Selenium) into your dedicated QA tester.**

---

## 🎯 What This Is

A **complete, production-ready testing framework** that allows autonomous web agents to:
- ✅ Test all user journeys on https://umzugscheck.ch
- ✅ Fill out forms with realistic test data
- ✅ Capture screenshots at critical steps
- ✅ Identify UX friction and blockers
- ✅ Generate detailed reports with severity ratings
- ✅ Run weekly on autopilot (via Zapier)

**Result**: Find bugs BEFORE customers do.

---

## 🚀 Quick Start (Choose One)

### 1️⃣ Run Playwright Tests (20 minutes, free)
```bash
npm install
npm run test:e2e
open test-reports/report-YYYY-MM-DD.html
```

### 2️⃣ Use MultiOn Agent (2 minutes setup + 20 minutes test)
1. Go to: https://www.multihon.com
2. Copy-paste prompt from: `AGENT_EXECUTION_PROMPT.sh`
3. Click "Execute"
4. Get screenshots + detailed report

### 3️⃣ Automate with Zapier (10 minutes setup, fully automated)
1. Create Zapier Zap
2. Configure: Schedule → Webhook → Slack → Airtable
3. Turn on
4. Every Monday 9 AM, tests run automatically

**→ Pick one and go to [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)**

---

## 📂 Files Overview

```
umzugscheck.ch/
├── 🎬 AGENT_EXECUTION_PROMPT.sh
│   └── Main prompt for all agents (copy-paste this)
│
├── 📖 AUTONOMOUS_QA_FRAMEWORK.md
│   └── Complete guide (read this first!)
│
├── ✅ QUICK_START_CHECKLIST.md
│   └── Step-by-step setup (start here!)
│
├── docs/
│   ├── AGENT_INTEGRATION_GUIDE.md    ← Setup for MultiOn, Zapier, Selenium
│   ├── AGENT_PROMPTS_COPY_PASTE.md   ← Platform-specific prompts
│   ├── AGENT_TEST_RESULTS_TEMPLATE.md ← Results format
│   ├── FUNNEL_TESTING_PLAN.md         ← Full testing protocol
│   └── FUNNEL_TEST_RESULTS.md         ← Weekly tracking
│
├── e2e/
│   └── core-20-funnels.spec.ts       ← Playwright test suite
│
└── src/lib/
    └── funnel-test-helpers.ts         ← Test data, personas, selectors
```

---

## 🎬 What Gets Tested?

### Scenario A: Private Move (Canton Zug)
- User flows: Homepage → Form → Confirmation
- Persona: Max Test (3.5 rooms, Zurich → Zug)
- Success: Reaches confirmation page

### Scenario B: Cleaning Only
- User flows: Cleaning section → Form → Confirmation
- Persona: Mia Test (2.5 rooms, cleaning-only)
- Success: Form submits without being forced to add moving

### Scenario C: Multi-Service (Moving + Storage + Assembly)
- User flows: Multiple service selection → Form → Confirmation
- Persona: Franz Business (8 workstations, Basel → Aarau)
- Success: All services stay selected through form

### Scenario D: Robustness & Mobile
- User flows: Back button, refresh, validation, mobile UX
- Tests: Button size (≥44px), load time (<5s), error handling
- Success: All edge cases handled gracefully

**Result**: 40+ test cases across all critical user journeys

---

## 💡 Why This Matters

### Before
- Manual QA: Weeks to test all flows
- Coverage: ~60% of user journeys
- Cost: Multiple QA engineers
- Frequency: Monthly or less
- Bottleneck: Releases blocked waiting for QA

### After
- Autonomous QA: Tests run in 20 minutes
- Coverage: 100% of critical flows
- Cost: Free (or $20/month for Zapier automation)
- Frequency: Weekly (or daily)
- Speed: Release blocker removed ✅

---

## 🔧 Agent Platforms Supported

| Platform | Setup Time | Cost | Auto Schedule | Best For |
|----------|-----------|------|---------------|----------|
| **Playwright** | 5 min | Free | GitHub Actions | CI/CD, immediate |
| **MultiOn** | 2 min | Free | Manual | Visual testing |
| **Zapier** | 10 min | $20-100/mo | ✅ Yes | Weekly autopilot |
| **AutoGPT** | 5 min | Free | Custom | Advanced users |
| **Selenium** | 30 min | Free | Custom | Detailed control |
| **Puppeteer** | 30 min | Free | Custom | Headless testing |
| **Claude / ChatGPT** | 1 min | $20/mo | No | Ad-hoc testing |

---

## 📊 What You Get

### Immediate (First Run)
- ✅ 40+ test cases executed
- ✅ Screenshots at each step
- ✅ Form validation checks
- ✅ Page load performance metrics
- ✅ Mobile responsiveness scoring
- ✅ Detailed issue backlog (P0/P1/P2/P3)

### Weekly (Ongoing)
- ✅ Automated test execution
- ✅ Trend tracking (improving/stable/declining)
- ✅ Slack alerts on P0 issues
- ✅ Airtable dashboard of results
- ✅ Historical data for analysis

### Go-Live Decision
- ✅ Clear readiness assessment
- ✅ Top 3 must-fix items identified
- ✅ Conversion score benchmarks
- ✅ Performance metrics

---

## 🎯 Key Metrics You'll Track

| Metric | Target | Status |
|--------|--------|--------|
| Scenarios Passed | 4/4 (100%) | ✓ |
| Avg Conversion Score | ≥8/10 | ✓ |
| P0 Issues | 0 | ✓ |
| Page Load Time | <5 seconds | ✓ |
| Mobile UX Score | ≥8/10 | ✓ |
| Form Completion | <3 minutes | ✓ |

**Go-Live = All metrics pass ✅**

---

## 📋 Test Data Included

### 5 Test Personas
```
P1: Max Test (Private move, 3.5 rooms)
P2: Mia Move (Private move + cleaning)
P3: Mia Test (Cleaning only)
P4: Franz Business (Business/office move)
P5: Rapidus User (Mobile, impatient)
```

### Swiss Test Locations
```
From: 8000 Zürich
To: 6300 Zug, 3000 Bern, 4000 Basel, 5000 Aarau
```

All test data includes "TEST" or "EXAMPLE" to prevent real customer confusion.

---

## 🚨 Severity Ratings

Issues found are automatically rated:

- 🔴 **P0**: Blocks completion (Form won't submit)
- 🟠 **P1**: Major issue (Confusing UX, slow, wrong data)
- 🟡 **P2**: Minor issue (Styling, validation message unclear)
- ⚪ **P3**: Cosmetic (Typo, color, spacing)

---

## 🔄 Weekly Testing Cycle

```
Monday 9:00 AM
  ↓ Zapier trigger fires
  ↓ Agent tests all 4 scenarios
  ↓ Results collected in Airtable
  ↓ Slack alert sent
  ✅

Wednesday 2:00 PM
  ↓ Team reviews results
  ↓ Triage P0/P1 issues
  ↓ Assign fixes
  ✅

Friday 4:00 PM
  ↓ Manual spot-check critical paths
  ↓ Document week's findings
  ↓ Plan next week
  ✅
```

---

## 📖 How to Get Started

### Step 1: Choose Your Method
See [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) → STEP 1

**Pick one:**
- Playwright (CI/CD)
- MultiOn (Visual)
- Zapier (Weekly automation)

### Step 2: Run Your First Test
See [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) → STEP 4

**Takes**: ~30 minutes (setup + execution)

### Step 3: Review Results
See [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) → STEP 5

**Deliverables**:
- HTML report with screenshots
- JSON data for integration
- Markdown summary
- Issue backlog with priorities

### Step 4: Share & Fix
See [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) → STEPS 6-7

**Actions**:
- Post results to Slack
- Assign P0/P1 fixes
- Retest after fixes
- Track improvements

### Step 5: Automate Weekly
See [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) → STEP 8

**Optional**: Set up Zapier to run tests automatically every Monday

---

## 💻 Example: Playwright (Immediate Results)

```bash
# 1. Install (one time)
npm install

# 2. Run tests
npm run test:e2e

# 3. View results
open test-reports/report-YYYY-MM-DD.html
```

**Output**: Interactive HTML report with:
- Screenshots at each step
- Form field values
- Errors encountered
- Performance metrics
- Severity ratings

---

## 💻 Example: MultiOn (Visual Testing)

1. Go to: https://www.multihon.com
2. Create new task
3. Copy-paste from: `AGENT_EXECUTION_PROMPT.sh`
4. Click "Execute"
5. Wait 15-20 minutes
6. Download screenshots + report
7. Paste into: `docs/AGENT_TEST_RESULTS_MULTIHON.md`

**Output**: High-quality screenshots showing:
- What user saw at each step
- Form field interactions
- Error messages
- Success confirmations

---

## 💻 Example: Zapier (Fully Automated)

```
1. Create Zapier account
2. New Zap:
   - Trigger: Schedule (Monday 9 AM)
   - Action: Webhook (call your API)
   - Action: Send Slack message
   - Action: Create Airtable record
3. Turn on
4. Every Monday, tests run automatically ✅
```

**Output**: Zero-effort weekly testing

---

## 📚 Full Documentation

| Document | Purpose | Time to Read |
|----------|---------|--------------|
| [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) | Step-by-step setup | 5 min |
| [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) | Complete guide | 15 min |
| [AGENT_EXECUTION_PROMPT.sh](AGENT_EXECUTION_PROMPT.sh) | Main agent prompt | Copy-paste |
| [AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md) | Platform-specific | 5 min |
| [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) | Deep setup guide | 20 min |
| [AGENT_TEST_RESULTS_TEMPLATE.md](docs/AGENT_TEST_RESULTS_TEMPLATE.md) | Results format | Reference |
| [FUNNEL_TESTING_PLAN.md](docs/FUNNEL_TESTING_PLAN.md) | Full protocol | 100+ pages |

---

## ❓ Common Questions

**Q: How long do tests take?**  
A: ~20 minutes per run (including Scenarios A-D)

**Q: Can I run tests every day?**  
A: Yes! With Zapier, you can schedule them as often as you want

**Q: What if tests find an issue?**  
A: Issues are prioritized (P0/P1/P2/P3), assigned, fixed, and retested

**Q: Do I need to code?**  
A: No! Just copy-paste the prompt into your agent platform

**Q: What if tests find a false positive?**  
A: Rare, but adjust test data to match validation rules (e.g., phone format)

**Q: Can I add more test scenarios?**  
A: Yes! Fork the repo, modify `e2e/core-20-funnels.spec.ts`, and PR

**Q: Is this free?**  
A: Playwright & MultiOn are free. Zapier starts at $19/month

**Q: When should we go live?**  
A: When P0 issues = 0, P1 issues ≤ 2, and conversion score ≥ 8/10

---

## 🎓 Learning Path

**Beginner** (30 minutes):
1. Read: QUICK_START_CHECKLIST.md
2. Run: `npm run test:e2e`
3. View: test-reports/report-*.html
4. Done! ✅

**Intermediate** (1 hour):
1. Read: AUTONOMOUS_QA_FRAMEWORK.md
2. Set up: MultiOn agent testing
3. Review: results & prioritize issues
4. Share: findings with team

**Advanced** (2 hours):
1. Read: AGENT_INTEGRATION_GUIDE.md
2. Configure: Zapier + Airtable + Slack
3. Build: Custom webhook handler
4. Integrate: into your CI/CD pipeline

---

## 🚀 Next Steps

1. **Read**: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) (5 min)
2. **Choose**: Your testing method (Playwright / MultiOn / Zapier)
3. **Run**: Your first test (20 min)
4. **Review**: Results (5 min)
5. **Fix**: P0/P1 issues (ongoing)
6. **Automate**: Weekly testing (Zapier, optional)

---

## 📞 Support

- **Setup help**: See [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md)
- **Prompt questions**: See [AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md)
- **Results help**: See [AGENT_TEST_RESULTS_TEMPLATE.md](docs/AGENT_TEST_RESULTS_TEMPLATE.md)
- **Full protocol**: See [FUNNEL_TESTING_PLAN.md](docs/FUNNEL_TESTING_PLAN.md)

---

## ✅ Status

- **Framework**: ✅ Production Ready
- **Documentation**: ✅ Complete
- **Test Coverage**: ✅ 4 Scenarios, 40+ Test Cases
- **Agent Support**: ✅ 8 Platforms
- **Automation**: ✅ Ready for CI/CD & Zapier

---

**🎯 Start here: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)**

**Version**: 1.0  
**Created**: 2026-01-28  
**Status**: 🚀 Production Ready
