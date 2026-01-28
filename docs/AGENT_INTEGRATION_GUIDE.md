# Agent QA Testing Integration Guide

## Overview

This guide shows how to integrate autonomous web testing agents with the Umzugscheck.ch QA framework.

**Supported Agent Platforms:**
- MultiOn (AI browser agent)
- AutoGPT / Agent.ai
- Zapier with custom webhooks
- Selenium / Puppeteer scripts
- Claude with browser capabilities
- GPT-4 with browsing plugins
- Custom Playwright integration

---

## 1. MultiOn Agent Setup

### Step 1: Create MultiOn Account
- Go to https://www.multihon.com
- Sign up and get API credentials
- Install MultiOn browser extension

### Step 2: Copy the Prompt
1. Open: `AGENT_EXECUTION_PROMPT.sh` in this repo
2. Copy the full prompt (between `AGENT_EOF` markers)
3. Go to MultiOn dashboard
4. Create new task
5. Paste prompt into "Task Description"

### Step 3: Configure Target URL
- Set target: `https://umzugscheck.ch`
- Viewport: Desktop 1920x1080 (for first pass)
- Then: Mobile 390x844 (for robustness testing)

### Step 4: Run the Agent
- Click "Execute"
- Agent will begin Scenario A
- Progress will be logged in dashboard
- Screenshots saved automatically

### Step 5: Collect Results
- When complete, download report
- Paste into: `docs/AGENT_TEST_RESULTS_MULTIHON.md`
- Run: `node scripts/parse-agent-results.js` to auto-format

---

## 2. Zapier Integration (Custom Webhook)

### Step 1: Create Zapier Zap
```
Trigger: Schedule (Daily, Weekly)
↓
Action 1: Call Webhook (your custom automation API)
↓
Action 2: Send results to Slack / Discord
↓
Action 3: Store in Airtable / Google Sheets
```

### Step 2: Webhook Format
Send POST to your backend:
```json
{
  "agent": "zapier-automation",
  "timestamp": "2026-01-28T10:00:00Z",
  "scenarios": [
    {
      "name": "A: Private Move",
      "url": "https://umzugscheck.ch/vergleich",
      "status": "PASS",
      "score": 9,
      "severity": "P0",
      "blocker": null
    },
    {
      "name": "B: Cleaning Only",
      "url": "https://umzugscheck.ch/reinigung",
      "status": "FAIL",
      "score": 3,
      "severity": "P1",
      "blocker": "Submit button disabled"
    }
  ],
  "readiness": {
    "ready_for_live": false,
    "must_fix": [
      "Scenario B submit button broken",
      "Mobile CTA too small",
      "Form validation error message unclear"
    ]
  }
}
```

---

## 3. Playwright Integration (In-Repo)

### Already Configured!
You already have: `e2e/core-20-funnels.spec.ts`

To run WITH agent-mode output:

```bash
# Run with detailed report generation
npm run test:e2e -- --reporter=html --reporter=json

# Reports appear in:
# - test-reports/report-YYYY-MM-DD.html
# - test-reports/report-YYYY-MM-DD.json
```

Then merge agent results:
```bash
node scripts/merge-agent-results.js
```

---

## 4. Custom Selenium/Puppeteer Script

### Template
```javascript
// scripts/qa-agent-test.js
const puppeteer = require('puppeteer');
const fs = require('fs');

const scenarios = [
  {
    name: 'A: Private Move',
    steps: [
      { action: 'goto', url: 'https://umzugscheck.ch' },
      { action: 'screenshot', name: 'homepage' },
      { action: 'fill', selector: '[name="from"]', value: '8000' },
      { action: 'fill', selector: '[name="to"]', value: '6300' },
      // ... continue
      { action: 'screenshot', name: 'confirmation' }
    ]
  }
  // ... more scenarios
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  for (const scenario of scenarios) {
    await testScenario(page, scenario);
  }
  
  await browser.close();
})();
```

---

## 5. Store Results in Airtable (Optional)

### Schema
```
Table: "Agent Test Results"

Columns:
- Date (Date)
- Agent (Single select: MultiOn, Zapier, Playwright, Custom)
- Scenario (A, B, C, D)
- Status (Pass/Fail)
- Score (Number 1-10)
- Severity (Select: P0, P1, P2, P3)
- Blocker (Long text)
- Screenshot URL (URL)
- Time to Complete (Number minutes)
- Notes (Long text)
```

### Zapier-Airtable Action
```
Trigger: Webhook received
↓
Action: Create record in Airtable
- Map JSON fields to table columns
```

---

## 6. Slack Notification (Optional)

### Auto-Alert on P0 Issues
```json
{
  "channel": "#qa-alerts",
  "text": "🚨 P0 Issue Found in Scenario A",
  "attachments": [
    {
      "color": "danger",
      "fields": [
        { "title": "Blocker", "value": "Submit button disabled" },
        { "title": "Severity", "value": "P0" },
        { "title": "URL", "value": "https://umzugscheck.ch/vergleich" },
        { "title": "Screenshot", "value": "[Link]" }
      ]
    }
  ]
}
```

Configure in: `.env.local`
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## 7. Weekly Test Cycle

### Monday 9:00 AM
1. ✅ Agent starts: MultiOn runs Scenarios A-D
2. ✅ Results collected in Airtable
3. ✅ Slack notification sent

### Wednesday 2:00 PM
1. ✅ Team reviews results
2. ✅ P0 issues documented
3. ✅ Team estimates fixes

### Friday 4:00 PM
1. ✅ Manual spot-check on critical paths
2. ✅ Update: `docs/FUNNEL_TEST_RESULTS.md`
3. ✅ Document week's findings

---

## 8. Report Parsing & Merging

### Auto-Parse Agent Output
```bash
# Expects MultiOn / Agent output in JSON or Markdown
node scripts/parse-agent-results.js \
  --source AGENT_TEST_RESULTS_MULTIHON.md \
  --format markdown \
  --output docs/PARSED_AGENT_RESULTS.json
```

### Merge with Playwright Results
```bash
# Combines Playwright E2E + Agent results
node scripts/merge-agent-results.js \
  --playwright test-reports/report-*.json \
  --agent docs/PARSED_AGENT_RESULTS.json \
  --output docs/COMBINED_QA_REPORT.md
```

### Generate Executive Summary
```bash
node scripts/generate-qa-summary.js \
  --combined docs/COMBINED_QA_REPORT.md \
  --output QA_EXECUTIVE_SUMMARY.md
```

---

## 9. Example: Full Weekly Workflow

### Setup (One-time)
```bash
# 1. Copy agent prompt to your agent platform
cat AGENT_EXECUTION_PROMPT.sh | pbcopy

# 2. Schedule weekly runs (optional)
npm run setup:agent-schedule

# 3. Create Slack webhook
export SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### Every Monday (Automated)
```bash
# Agent runs (external platform handles this)
# Results come in via webhook → Airtable
```

### Every Friday
```bash
# Download results and merge
npm run qa:merge-results

# Generate summary
npm run qa:summary

# View summary
open QA_EXECUTIVE_SUMMARY.md
```

---

## 10. Monitoring & Alerts

### Status Codes
- ✅ **PASS**: All 4 scenarios complete successfully
- ⚠️  **PARTIAL**: Some scenarios complete, minor issues
- ❌ **FAIL**: Scenario blocked, P0 issue found
- 🔍 **INVESTIGATING**: Agent timed out, needs re-run

### Auto-Escalation
| Severity | Response Time | Assignee |
|----------|---------------|----------|
| P0 | Immediate (1 hour) | Tech Lead |
| P1 | Today (4 hours) | Dev Team |
| P2 | This week | Product |
| P3 | Next sprint | Design |

---

## 11. Troubleshooting

### Agent Stuck in Loop
- **Problem**: Agent keeps filling same field
- **Fix**: Add explicit "Exit if stuck" rule in prompt
- **Prevention**: Set max iterations in agent config

### Captcha Blocks Test
- **Problem**: reCAPTCHA prevents submission
- **Fix**: Configure test environment to bypass captcha
- **Alternative**: Whitelist test email for automatic verification

### Screenshot Not Captured
- **Problem**: Agent moves too fast, screenshot empty
- **Fix**: Add 2-second wait before each screenshot
- **Code**: `await page.waitForTimeout(2000)`

### False Positives (Flow looks broken but isn't)
- **Problem**: Form resets due to legitimate validation
- **Fix**: Update test data to match validation rules
- **Example**: Phone number format must be `079 XXX XX XX`

---

## 12. Integration with CI/CD

### GitHub Actions Example
```yaml
# .github/workflows/qa-agent-test.yml

name: QA Agent Testing
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday 9 AM

jobs:
  agent-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Playwright Tests
        run: npm run test:e2e
      
      - name: Parse Results
        run: node scripts/parse-agent-results.js
      
      - name: Upload to Airtable
        env:
          AIRTABLE_API_KEY: ${{ secrets.AIRTABLE_API_KEY }}
        run: node scripts/upload-to-airtable.js
      
      - name: Send Slack Alert
        if: failure()
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
        run: node scripts/slack-alert.js
```

---

## 13. Next Steps

1. **Choose your agent platform** (MultiOn, Zapier, or Playwright)
2. **Copy the execution prompt** from `AGENT_EXECUTION_PROMPT.sh`
3. **Run your first test**
4. **Collect results** in `docs/AGENT_TEST_RESULTS_*.md`
5. **Schedule weekly tests** (every Monday 9 AM)
6. **Review on Friday** and update main results file
7. **Iterate and fix** P0 issues before they reach production

---

## 14. Files Reference

| File | Purpose |
|------|---------|
| `AGENT_EXECUTION_PROMPT.sh` | Main agent prompt (copy-paste) |
| `docs/AGENT_TEST_RESULTS_MULTIHON.md` | MultiOn results (agent fills this) |
| `docs/AGENT_TEST_RESULTS_SELENIUM.md` | Selenium results (agent fills this) |
| `docs/COMBINED_QA_REPORT.md` | Merged results (script generates) |
| `scripts/parse-agent-results.js` | Parse agent output |
| `scripts/merge-agent-results.js` | Merge all results |
| `scripts/generate-qa-summary.js` | Executive summary |
| `e2e/core-20-funnels.spec.ts` | Playwright E2E suite |

---

## 15. Support

### Questions?
- **Playwright setup**: See `docs/TESTING_INFRASTRUCTURE.md`
- **Agent prompt**: See `AGENT_EXECUTION_PROMPT.sh`
- **Results template**: See section 8 below

### Report an issue:
```markdown
- **Agent Platform**: [MultiOn/Zapier/etc.]
- **Scenario**: [A/B/C/D]
- **Error**: [Copy exact error]
- **Steps**: [How to reproduce]
```

---

**Last Updated**: 2026-01-28  
**Version**: 1.0  
**Status**: 🚀 Ready for use
