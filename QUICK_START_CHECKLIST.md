# ✅ Autonomous QA Framework - Quick Integration Checklist

Use this checklist to get your agent testing up and running in minutes.

---

## 🟢 STEP 1: Choose Your Agent Platform (2 minutes)

Pick ONE:

### Option A: Playwright (Immediate Results)
- ✅ Best for: CI/CD, GitHub Actions, immediate validation
- ✅ Cost: Free
- ✅ Setup: 5 minutes
- ✅ Execution: ~20 minutes
- ✅ Requires: Node.js, npm

**Checklist**:
- [ ] I have Node.js v18+ installed
- [ ] I have npm installed
- [ ] I can clone/access the repository
- [ ] I'm ready to run: `npm run test:e2e`

---

### Option B: MultiOn (Visual Testing)
- ✅ Best for: Visual validation, screenshot capture
- ✅ Cost: Free tier available
- ✅ Setup: 2 minutes
- ✅ Execution: ~20 minutes
- ✅ Requires: Browser only

**Checklist**:
- [ ] I have internet access
- [ ] I can access https://www.multihon.com
- [ ] I'm comfortable with copy-paste
- [ ] I have a few minutes for agent to run

---

### Option C: Zapier (Weekly Automation)
- ✅ Best for: Scheduled weekly tests, Slack alerts
- ✅ Cost: $19-100/month (or free tier limited)
- ✅ Setup: 10 minutes
- ✅ Execution: Fully automated
- ✅ Requires: Zapier account

**Checklist**:
- [ ] I have Zapier account (or can create)
- [ ] I have Slack workspace (optional)
- [ ] I have Airtable (optional but recommended)
- [ ] I'm ready to automate weekly tests

---

## 🟢 STEP 2: Get Required Files (1 minute)

All files are in this repo:

```
✓ AGENT_EXECUTION_PROMPT.sh
✓ docs/AGENT_PROMPTS_COPY_PASTE.md
✓ docs/AGENT_INTEGRATION_GUIDE.md
✓ docs/AGENT_TEST_RESULTS_TEMPLATE.md
✓ e2e/core-20-funnels.spec.ts
✓ src/lib/funnel-test-helpers.ts
```

**Checklist**:
- [ ] I can see all files listed above in the repo
- [ ] I understand where each file is used
- [ ] I'm not missing any files

---

## 🟢 STEP 3: Prepare Test Data (2 minutes)

You'll use this fake data for testing (NOT real customers):

### Test Personas
```
P1 - Private Move:
  Name: Max Test
  Email: test+move@example.com
  Phone: 079 000 00 00
  
P3 - Cleaning Only:
  Name: Mia Test
  Email: test+cleaning@example.com
  Phone: 079 000 00 00
  
P4 - Business Move:
  Name: Franz Business
  Email: test+business@example.com
  Phone: 079 000 00 00
```

### Test Locations
```
From: 8000 Zürich
To: 6300 Zug
Other: 3000 Bern, 4000 Basel, 5000 Aarau
```

**Checklist**:
- [ ] I've copied the test persona names
- [ ] I've copied the test emails
- [ ] I've copied the test phone numbers
- [ ] I understand NOT to use real customer data

---

## 🟢 STEP 4: Run Your First Test

### If Using Playwright:

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Run tests
npm run test:e2e

# 3. Wait ~20 minutes for results

# 4. View results
open test-reports/report-YYYY-MM-DD.html
```

**Checklist**:
- [ ] I ran `npm install`
- [ ] I ran `npm run test:e2e`
- [ ] Tests are running (I can see output)
- [ ] I'm waiting for completion

**Expected Output**:
```
✓ Scenario A: Private Move
✓ Scenario B: Cleaning Only
✓ Scenario C: Multi-Service
✓ Scenario D: Robustness

Test run completed in 18 minutes.
Report saved: test-reports/report-2026-01-28.html
```

---

### If Using MultiOn:

1. Go to https://www.multihon.com
2. Login or create account
3. Click "New Task"
4. Paste from: `AGENT_EXECUTION_PROMPT.sh`
5. Set target: `https://umzugscheck.ch`
6. Click "Execute"
7. Wait 15-20 minutes
8. Download results
9. Paste into: `docs/AGENT_TEST_RESULTS_MULTIHON.md`

**Checklist**:
- [ ] I created MultiOn account
- [ ] I copied the prompt
- [ ] I pasted into MultiOn
- [ ] I clicked Execute
- [ ] Agent is running (I can see progress)

**Expected Output**:
- Screenshots of each step
- Form fields shown
- Confirmation page captured
- Any errors documented

---

### If Using Zapier:

1. Create Zapier account (free tier: https://zapier.com)
2. Follow Section 2 of: `docs/AGENT_INTEGRATION_GUIDE.md`
3. Configure:
   - Trigger: Schedule (Monday 9:00 AM)
   - Action 1: Webhook call
   - Action 2: Send to Slack (optional)
   - Action 3: Save to Airtable (optional)
4. Turn on Zap
5. Next Monday, tests run automatically

**Checklist**:
- [ ] I created Zapier account
- [ ] I created a new Zap
- [ ] I set up trigger (schedule)
- [ ] I set up webhook action
- [ ] I turned on the Zap
- [ ] I see "Last run: Never" (will change next Monday)

**Expected Output**:
- Automatic test runs every Monday 9 AM
- Slack alerts for any P0 issues
- Results in Airtable (if configured)
- JSON report in webhook response

---

## 🟢 STEP 5: Collect & Document Results (3 minutes)

### Step 5A: Save Results
```bash
# For Playwright:
cp test-reports/report-*.md docs/AGENT_TEST_RESULTS_PLAYWRIGHT_[DATE].md

# For MultiOn:
# Manually paste report into docs/AGENT_TEST_RESULTS_MULTIHON_[DATE].md

# For Zapier:
# Results auto-save (check Airtable or Slack)
```

**Checklist**:
- [ ] Test results file created
- [ ] File name includes date
- [ ] File saved in docs/ folder
- [ ] Results are readable

### Step 5B: Review Results
Open your results file and check:
- [ ] How many scenarios passed? (A, B, C, D)
- [ ] What's the average conversion score?
- [ ] Are there any P0 (blocking) issues?
- [ ] Are there any P1 (major) issues?
- [ ] What's the page load time?

### Step 5C: Create Summary
```
✅ WEEK OF 2026-01-28 QA TEST RESULTS

Scenarios Passed: 3/4 (75%)
- ✓ Scenario A: Private Move
- ✓ Scenario B: Cleaning Only
- ✗ Scenario C: Multi-Service (P1 issue: storage option deselects)
- ✓ Scenario D: Robustness

Avg Conversion Score: 7.5/10
P0 Issues: 0
P1 Issues: 1 (storage option)
P2 Issues: 1 (mobile button size)
P3 Issues: 2 (typos)

Recommendation: CONDITIONAL - Fix P1 storage issue, then good to go.
```

**Checklist**:
- [ ] I counted how many scenarios passed
- [ ] I identified the top issues
- [ ] I noted the severity level (P0/P1/P2/P3)
- [ ] I made a go/no-go recommendation

---

## 🟢 STEP 6: Share Results with Team (2 minutes)

### Option A: Slack Message
```
🤖 Umzugscheck.ch QA Test Results - Week of Jan 28

📊 Summary:
- Scenarios Passed: 3/4 (75%)
- Avg Score: 7.5/10
- P0 Issues: 0 ✅
- P1 Issues: 1 ⚠️

🔴 Must Fix:
1. Scenario C: Storage option deselects after page 2

📋 Full Report: [Link to docs/AGENT_TEST_RESULTS_*.md]

Questions? See AUTONOMOUS_QA_FRAMEWORK.md
```

**Checklist**:
- [ ] I posted results to Slack
- [ ] I linked to full report
- [ ] I highlighted top issues
- [ ] Team can see status

### Option B: Email Summary
```
Subject: QA Test Results - Jan 28, 2026

Umzugscheck.ch automated testing completed.

Results: 3/4 scenarios passed (75%)
Go-Live Status: CONDITIONAL
Top Blocker: Storage option deselection in Scenario C

See full report: docs/AGENT_TEST_RESULTS_[DATE].md

—QA Team
```

### Option C: Weekly Dashboard (Optional)
If using Zapier + Airtable, results auto-populate in:
```
Airtable > Agent Test Results table

Week  | Passed | Score | P0 | P1 | Status
------|--------|-------|----|----|--------
Jan 28| 3/4    | 7.5  | 0  | 1  | Conditional
```

**Checklist**:
- [ ] Results shared with team
- [ ] Team knows the go-live status
- [ ] Next steps assigned (fix issues, retest)
- [ ] Scheduled next test date

---

## 🟢 STEP 7: Fix Issues & Retest (Ongoing)

### P0 Issues (Critical - Fix TODAY)
```
❌ Form submission fails
→ Assign to: [Dev]
→ Estimated: 2 hours
→ Retest: Tomorrow
→ Status: BLOCKED UNTIL FIXED
```

### P1 Issues (Major - Fix This Week)
```
⚠️ Storage option deselects on page 2
→ Assign to: [Dev]
→ Estimated: 1 hour
→ Retest: Friday
→ Status: Can launch but not ideal
```

### P2 Issues (Minor - Fix Next Sprint)
```
📝 Mobile button size: 42px (should be 44px)
→ Assign to: [Designer/Dev]
→ Estimated: 15 min
→ Retest: Next sprint
→ Status: Nice-to-have
```

**Checklist**:
- [ ] I triaged all issues (P0/P1/P2/P3)
- [ ] Each issue assigned to person
- [ ] Timeline set for fixes
- [ ] Retest scheduled

---

## 🟢 STEP 8: Schedule Ongoing Testing (5 minutes)

### Option A: Weekly Manual Testing
```
Every Monday 9:00 AM:
1. Run tests: npm run test:e2e (or MultiOn)
2. Wait 20 minutes
3. Review results
4. Document in: docs/FUNNEL_TEST_RESULTS.md

Every Friday 4:00 PM:
1. Review week's issues
2. Verify fixes
3. Update go-live status
```

**Checklist**:
- [ ] I've blocked time on my calendar
- [ ] I've set reminders (Monday 9 AM, Friday 4 PM)
- [ ] I know where to save results
- [ ] Team knows the schedule

### Option B: Fully Automated (Zapier)
```
Setup once, then forget:

Every Monday 9:00 AM:
  Zapier runs tests automatically ✅
  Results post to Slack ✅
  Data saved to Airtable ✅
  No manual work needed ✅

Every Friday 4:00 PM:
  (Manual spot-check only)
  Review Airtable dashboard
  Assign fixes if needed
```

**Checklist**:
- [ ] Zapier Zap is created and ON
- [ ] Schedule is set correctly
- [ ] Slack alerts configured (optional)
- [ ] Airtable connected (optional)
- [ ] Zero manual work after setup

---

## 🟢 STEP 9: Track Improvements Over Time (Ongoing)

### Weekly Tracking Sheet
Keep in: `docs/FUNNEL_TEST_RESULTS.md`

```
| Week | Passed | Score | P0 | P1 | Trend | Next |
|------|--------|-------|----|----|-------|------|
| Jan 28| 3/4   | 7.5  | 0  | 1  | ↗    | Fix storage |
| Feb 4 | 4/4   | 9.2  | 0  | 0  | ✅   | Monitor |
| Feb 11| 4/4   | 9.0  | 0  | 1  | ✓    | Fix button |
```

**Checklist**:
- [ ] I update results weekly
- [ ] I track the trend (improving/stable/declining)
- [ ] I celebrate when all tests pass ✅
- [ ] I see the pattern of fixes

---

## 🟢 FINAL CHECKLIST: You're Done! ✅

- [ ] I chose my agent platform (Playwright / MultiOn / Zapier)
- [ ] I collected all required files
- [ ] I have test data ready
- [ ] I ran my first test
- [ ] I collected results
- [ ] I documented findings
- [ ] I shared results with team
- [ ] I triaged issues (P0/P1/P2/P3)
- [ ] I assigned fixes
- [ ] I scheduled ongoing testing
- [ ] I created tracking sheet

**Status**: 🚀 **YOU'RE LIVE WITH AUTONOMOUS QA TESTING!**

---

## 📞 Need Help?

| Question | Answer |
|----------|--------|
| "How do I run tests?" | See STEP 4 above |
| "Where are results saved?" | `test-reports/` or `docs/AGENT_TEST_RESULTS_*.md` |
| "How long do tests take?" | ~20 minutes per run |
| "How do I automate?" | Use Zapier (see STEP 8B) |
| "What if I find issues?" | Triage (P0/P1/P2/P3) and assign fixes |
| "Can I test manually?" | Yes, use docs/AGENT_PROMPTS_COPY_PASTE.md for prompts |
| "What's the go-live decision?" | Ready when P0=0, P1≤2, Score≥8/10 |

---

## 📚 Full Documentation

For detailed information, see:
- `AUTONOMOUS_QA_FRAMEWORK.md` ← Main overview
- `docs/AGENT_INTEGRATION_GUIDE.md` ← Platform setup
- `docs/AGENT_PROMPTS_COPY_PASTE.md` ← Copy-paste prompts
- `docs/AGENT_TEST_RESULTS_TEMPLATE.md` ← Results format
- `docs/FUNNEL_TESTING_PLAN.md` ← Full protocol (100+ pages)

---

**✅ Time to implement: ~30 minutes**  
**✅ Time to get first results: ~50 minutes**  
**✅ Time for ongoing (weekly): ~30 minutes**  

**🚀 Start now with STEP 1!**
