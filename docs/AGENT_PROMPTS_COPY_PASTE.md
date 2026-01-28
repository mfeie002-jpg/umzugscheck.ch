# Agent Prompts - Quick Copy-Paste for Different Platforms

Use these pre-made prompts with your chosen AI agent. Select the one matching your platform.

---

## 🎯 For MultiOn Users

**Copy everything between the dashes and paste into MultiOn task description:**

```
────────────────────────────────────────────────────────────────────
You are a QA testing agent. Test https://umzugscheck.ch completely.

SCENARIOS (do all 4):

A) Private Move:
   - From: 8000 Zürich → To: 6300 Zug
   - Rooms: 3.5, Elevator: yes
   - Contact: "Max Test" / test+move@example.com / 079 000 00 00
   - Submit form

B) Cleaning Only:
   - Find cleaning section
   - Location: 3000 Bern, Rooms: 2.5
   - Contact: "Mia Test" / test+cleaning@example.com / 079 000 00 00
   - Submit form

C) Multi-Service (Move + Storage):
   - From 4000 Basel → To 5000 Aarau
   - Select: Moving + Storage + Assembly (if available)
   - Contact: "Franz Business" / test+business@example.com / 079 000 00 00
   - Submit form

D) Robustness:
   - Test back button (data preserved?)
   - Test page refresh (form recovers?)
   - Test form validation (invalid inputs caught?)
   - Test mobile (buttons ≥44px, no horizontal scroll?)

EVIDENCE:
- Screenshot each step
- Record exact error messages
- Note confusing UX
- Record blocked steps

OUTPUT FORMAT:
For each scenario:
1) Flow URL
2) Status (PASS/FAIL)
3) Conversion Score (1-10)
4) Time taken (minutes)
5) Issues found (P0/P1/P2/P3)
6) Screenshots

END with: Is it ready for live? YES/NO/CONDITIONAL + Top 3 fixes needed
────────────────────────────────────────────────────────────────────
```

---

## 🎯 For AutoGPT / Agent.ai Users

**Copy-paste this configuration:**

```json
{
  "task_name": "Umzugscheck.ch QA Testing",
  "target_url": "https://umzugscheck.ch",
  "agent_mode": "autonomous_browser",
  "viewport": {
    "first_pass": { "width": 1920, "height": 1080 },
    "second_pass": { "width": 390, "height": 844 }
  },
  "test_personas": [
    {
      "id": "P1",
      "name": "Max Test",
      "email": "test+move@example.com",
      "phone": "079 000 00 00"
    },
    {
      "id": "P3",
      "name": "Mia Test",
      "email": "test+cleaning@example.com",
      "phone": "079 000 00 00"
    },
    {
      "id": "P4",
      "name": "Franz Business",
      "email": "test+business@example.com",
      "phone": "079 000 00 00"
    }
  ],
  "scenarios": [
    {
      "name": "A: Private Move (Zug)",
      "goal": "Complete moving form from Zürich to Zug",
      "steps": [
        "navigate_to_homepage",
        "find_moving_cta",
        "fill_from_postal: 8000",
        "fill_to_postal: 6300",
        "fill_rooms: 3.5",
        "fill_contact_info: P1",
        "click_submit",
        "await_confirmation"
      ]
    },
    {
      "name": "B: Cleaning Only",
      "goal": "Complete cleaning-only form",
      "steps": [
        "navigate_to: https://umzugscheck.ch/reinigung",
        "deselect_moving_if_selected",
        "fill_location: 3000",
        "fill_rooms: 2.5",
        "fill_contact_info: P3",
        "click_submit",
        "await_confirmation"
      ]
    },
    {
      "name": "C: Multi-Service",
      "goal": "Select moving + storage, verify persistence",
      "steps": [
        "navigate_to_homepage",
        "select_service: moving",
        "select_service: storage",
        "select_service: assembly_if_available",
        "fill_from_postal: 4000",
        "fill_to_postal: 5000",
        "fill_rooms: 8",
        "verify_all_services_selected",
        "fill_contact_info: P4",
        "click_submit",
        "verify_confirmation_shows_all_services"
      ]
    },
    {
      "name": "D: Robustness Tests",
      "goal": "Test form robustness and mobile UX",
      "subtests": [
        "test_back_button_preserves_data",
        "test_form_refresh_recovery",
        "test_form_validation: empty_phone",
        "test_form_validation: invalid_postal",
        "test_mobile_button_size: >=44px",
        "test_mobile_no_horizontal_scroll",
        "measure_page_load_time"
      ]
    }
  ],
  "error_handling": {
    "on_captcha": "pause_and_alert",
    "on_sms_verification": "stop_and_report",
    "on_blank_screen": "screenshot_and_report_p0",
    "on_timeout": "retry_once_then_fail"
  },
  "output_format": "structured_json_plus_markdown",
  "screenshots": {
    "capture_at": [
      "page_start",
      "before_submit",
      "confirmation_or_error"
    ],
    "save_to": "./test-results/screenshots/"
  }
}
```

---

## 🎯 For Zapier Users

**Create new Zap with these steps:**

### Trigger
```
Schedule: Weekly (Monday 9:00 AM)
```

### Action 1: Webhook
```
URL: https://your-qa-api.example.com/run-agent-test
Method: POST
Data:
{
  "agent": "zapier",
  "timestamp": "{{now}}",
  "base_url": "https://umzugscheck.ch",
  "scenarios": ["A", "B", "C", "D"]
}
```

### Action 2: Wait
```
Wait 20 minutes for external automation to complete
```

### Action 3: Send to Slack
```
Channel: #qa-alerts
Message:
QA Agent Testing Complete ✅

Status: {{Webhook Response Status}}
Scenarios Passed: {{response.passed}}/4
Issues Found: {{response.issues_count}}

Top Blocker: {{response.top_blocker}}

Review results: [Link to Airtable]
```

### Action 4: Create Airtable Record
```
Table: Agent Test Results
Fields:
- Date: {{now}}
- Agent: zapier
- Status: {{response.status}}
- Score: {{response.avg_score}}
- Issues: {{response.issues_count}}
- Details: {{response.full_report}}
```

---

## 🎯 For Selenium/Puppeteer Users

**Place this in `scripts/qa-agent-test.js`:**

```bash
npm install --save-dev puppeteer
```

```javascript
#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://umzugscheck.ch';
const SCREENSHOT_DIR = './test-results/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const scenarios = [
  {
    name: 'A: Private Move (Zug)',
    run: async (page) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
      await page.screenshot({ path: `${SCREENSHOT_DIR}/a-01-homepage.png` });
      
      // Find and click moving CTA
      const cta = await page.$('[data-testid="moving-cta"]') || 
                  await page.$('button:contains("Offerte")');
      if (!cta) throw new Error('Moving CTA not found');
      await cta.click();
      
      // Fill form
      await page.fill('[name="from_postal"]', '8000');
      await page.fill('[name="to_postal"]', '6300');
      await page.select('[name="rooms"]', '3.5');
      await page.fill('[name="name"]', 'Max Test');
      await page.fill('[name="email"]', 'test+move@example.com');
      await page.fill('[name="phone"]', '079 000 00 00');
      
      await page.screenshot({ path: `${SCREENSHOT_DIR}/a-02-filled-form.png` });
      
      // Submit
      const submitBtn = await page.$('[type="submit"]');
      if (!submitBtn) throw new Error('Submit button not found');
      await submitBtn.click();
      
      // Wait for confirmation
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
        .catch(() => {}); // Some pages don't navigate
      await page.screenshot({ path: `${SCREENSHOT_DIR}/a-03-confirmation.png` });
      
      const confirmation = await page.evaluate(() => 
        document.body.textContent.includes('Danke') || 
        document.body.textContent.includes('Thank you') ||
        document.body.textContent.includes('bestätigt')
      );
      
      return {
        passed: confirmation,
        score: confirmation ? 9 : 3,
        time_seconds: 45
      };
    }
  },
  
  {
    name: 'B: Cleaning Only',
    run: async (page) => {
      const url = `${BASE_URL}/reinigung`;
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Fill cleaning form
      await page.fill('[name="postal"]', '3000');
      await page.select('[name="rooms"]', '2.5');
      await page.fill('[name="name"]', 'Mia Test');
      await page.fill('[name="email"]', 'test+cleaning@example.com');
      await page.fill('[name="phone"]', '079 000 00 00');
      
      await page.screenshot({ path: `${SCREENSHOT_DIR}/b-01-form.png` });
      
      await page.$eval('[type="submit"]', btn => btn.click());
      
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
        .catch(() => {});
      await page.screenshot({ path: `${SCREENSHOT_DIR}/b-02-result.png` });
      
      const confirmation = await page.evaluate(() => 
        document.body.textContent.includes('bestätigt') ||
        document.body.textContent.includes('Danke')
      );
      
      return {
        passed: confirmation,
        score: confirmation ? 9 : 3,
        time_seconds: 30
      };
    }
  }
  
  // Add scenarios C and D following same pattern...
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  const results = [];
  
  try {
    for (const scenario of scenarios) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      
      try {
        const result = await scenario.run(page);
        results.push({
          scenario: scenario.name,
          ...result,
          status: result.passed ? 'PASS' : 'FAIL'
        });
      } catch (error) {
        results.push({
          scenario: scenario.name,
          status: 'FAIL',
          error: error.message,
          score: 0
        });
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  
  // Save results
  fs.writeFileSync(
    './test-results/qa-results.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log(JSON.stringify(results, null, 2));
  process.exit(results.every(r => r.status === 'PASS') ? 0 : 1);
})();
```

Run with:
```bash
node scripts/qa-agent-test.js
```

---

## 🎯 For ChatGPT / Claude with Browser Capabilities

**Use this conversation prompt:**

```
Role: You are a meticulous QA tester with browser capabilities.

Task: Test these 4 flows on https://umzugscheck.ch:

A) Private Move: From 8000 Zürich → 6300 Zug (3.5 rooms)
   - Test data: "Max Test" / test+move@example.com / 079 000 00 00
   - Goal: Reach confirmation page

B) Cleaning: Location 3000 Bern (2.5 rooms, cleaning only)
   - Test data: "Mia Test" / test+cleaning@example.com / 079 000 00 00
   - Goal: Reach confirmation page

C) Multi-Service: Basel→Aarau with moving + storage + assembly
   - Test data: "Franz Business" / test+business@example.com / 079 000 00 00
   - Goal: Verify all services stay selected through form

D) Robustness: Test back button, refresh, validation, mobile

For EACH flow:
1. Open URL
2. Take screenshot of homepage/start
3. Complete all form fields with test data
4. Take screenshot before submit
5. Click submit
6. Wait for confirmation
7. Take screenshot of confirmation or error
8. Report:
   - Goal reached? (YES/NO)
   - Conversion score 1-10
   - Any errors or blockers?
   - Load time?
   - Mobile friendly?

End with: Ready to go live? YES/NO/CONDITIONAL?
```

---

## 🎯 For GPT-4 with Plugins

**If using GPT-4 with browser plugin:**

```
I'll use the browser plugin to test https://umzugscheck.ch.

Test 4 flows (A, B, C, D) with these details:

FLOW A (Private Move):
Location: From 8000 → 6300 (Zug), 3.5 rooms
Name: Max Test
Email: test+move@example.com
Phone: 079 000 00 00

FLOW B (Cleaning):
Location: 3000 Bern, 2.5 rooms
Name: Mia Test
Email: test+cleaning@example.com
Phone: 079 000 00 00

FLOW C (Multi-Service):
Location: 4000 Basel → 5000 Aarau, 8 rooms
Services: moving + storage + assembly
Name: Franz Business
Email: test+business@example.com
Phone: 079 000 00 00

FLOW D (Robustness):
- Back button test
- Refresh test
- Validation test
- Mobile test

For each: Screenshot, fill form, submit, confirm.
Report success rate per flow.
Rate each 1-10.
List any blockers.
```

---

## 🎯 For Lovable Agent

**Use this as your testing task:**

```
Mission: Quality Assurance Testing on Umzugscheck.ch

You have access to the live website https://umzugscheck.ch.

Please execute 4 test scenarios using realistic Swiss user personas.
For each scenario, fill out the forms completely and verify that
the process works end-to-end.

Scenario A: Moving from Zürich to Zug
- Use: "Max Test" / test+move@example.com
- Rooms: 3.5
- From: 8000, To: 6300
- Complete until confirmation page

Scenario B: Cleaning service (Bern)
- Use: "Mia Test" / test+cleaning@example.com
- Location: 3000 Bern
- Rooms: 2.5
- Complete until confirmation

Scenario C: Combination service (Basel to Aarau)
- Use: "Franz Business" / test+business@example.com
- Select: moving + storage + assembly
- Verify all options stick until the end

Scenario D: Mobile responsiveness
- Switch to mobile viewport (390x844)
- Test buttons are large enough
- Check that forms still work

After each scenario, report:
✓ Did it work? (PASS/FAIL)
✓ Score 1-10
✓ What was confusing?
✓ Any errors?

Finally: Is the site ready for customers? YES/NO?
```

---

## 📋 Quick Reference Table

| Platform | Setup Time | Effort | Best For |
|----------|-----------|--------|----------|
| **MultiOn** | 2 min | Low | One-time tests, quick validation |
| **AutoGPT** | 5 min | Low | Fully autonomous, scheduled |
| **Zapier** | 10 min | Medium | Weekly automation, Slack alerts |
| **Selenium** | 30 min | High | CI/CD integration, detailed control |
| **Puppeteer** | 30 min | High | Headless testing, no UI needed |
| **ChatGPT Plugin** | 1 min | Low | Ad-hoc testing, conversation style |
| **Claude Browser** | 1 min | Low | Ad-hoc testing, conversation style |
| **Lovable Agent** | 2 min | Low | Visual QA, browser-based |

---

## ✅ Next Steps

1. **Choose your platform** from above
2. **Copy the prompt** for that platform
3. **Paste into agent** (MultiOn, Zapier, etc.)
4. **Run the test**
5. **Collect results** in: `docs/AGENT_TEST_RESULTS_[PLATFORM].md`
6. **Schedule weekly** (Monday 9 AM)
7. **Review results** and fix P0 issues

---

**Last Updated**: 2026-01-28  
**Version**: 1.0  
**Status**: ✅ Ready to use
