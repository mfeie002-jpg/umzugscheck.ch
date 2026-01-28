# D) MASTER TASK FACTORY — Zapier + VS Code zusammenbringen

Wie du deine **60 Flows systematisch in actionable Tasks verwandelst** und sie durch Zapier + VS Code automatisiert ausführst.

---

## 🏭 D1: AI_TASK_QUEUE Task-Prompt Standards

Jeder Task in der Supabase `ai_task_queue` Tabelle sollte dieses Schema folgen:

### Standard Task Schema

```json
{
  "id": "uuid-auto-generated",
  "title": "Fix Invalid Hook Call in Breadcrumbs",
  "agent": "copilot|codex",
  "priority": 1-5,
  "status": "pending|in_progress|completed|failed",
  "prompt": "Apply minimal fix in src/components/Breadcrumbs.tsx...",
  "context": {
    "repo": "umzugscheck.ch",
    "branch": "main|Copilot",
    "flow_id": "flow-3-homepage-to-results",
    "links": [
      "https://umzugscheck.ch/",
      "https://github.com/.../issues/42"
    ],
    "stacktrace": "...",
    "reproduction_steps": ["Step 1", "Step 2"]
  },
  "created_at": "2026-01-28T10:00:00Z",
  "started_at": "2026-01-28T10:05:00Z",
  "completed_at": null,
  "output_summary": null,
  "error_message": null
}
```

---

## 📋 Task Templates nach Agent-Typ

### COPILOT Tasks (Code Implementation & Bugs)

#### Template 1: Bug Fix
```json
{
  "title": "Fix: {{component}} - {{issue}}",
  "agent": "copilot",
  "priority": 4,
  "prompt": "**BUG**: {{issue_description}}

**LOCATION**: src/components/{{component}}.tsx:{{line}}

**ERROR MESSAGE**: 
{{error_message}}

**REPRODUCTION**:
1. {{step1}}
2. {{step2}}
3. {{step3}}

**EXPECTED**: {{expected_behavior}}
**ACTUAL**: {{actual_behavior}}

---

Apply minimal fix. Provide diff + test steps.

[paste relevant code section]",
  "context": {
    "flow_id": "flow-{{number}}-{{name}}",
    "issue_type": "bug",
    "severity": "high|medium|low",
    "links": ["https://github.com/.../issues/{{issue_number}}"]
  }
}
```

#### Template 2: Feature Implementation
```json
{
  "title": "Feat: Add {{feature_name}}",
  "agent": "copilot",
  "priority": 2,
  "prompt": "**FEATURE**: {{feature_description}}

**LOCATION**: src/components/{{component}}.tsx

**REQUIREMENTS**:
1. {{req1}}
2. {{req2}}
3. {{req3}}

**ACCEPTANCE CRITERIA**:
- [ ] {{criterion1}}
- [ ] {{criterion2}}
- [ ] {{criterion3}}

**DESIGN REFERENCE**: {{figma_link or description}}

---

Implement with full type safety (TypeScript), Tailwind styling, and test steps.

[paste component or file structure]",
  "context": {
    "flow_id": "flow-{{number}}-{{name}}",
    "issue_type": "feature",
    "effort_hours": 1-4,
    "design_system": "tailwind+shadcn-ui"
  }
}
```

---

### CODEX Tasks (Content & Analysis)

#### Template 1: Content Analysis
```json
{
  "title": "Analyze: {{page_name}} SEO & UX",
  "agent": "codex",
  "priority": 3,
  "prompt": "**PAGE**: {{page_name}}
**URL**: {{url}}

Analyze this page for:
1. SEO optimization (headings, meta, keywords)
2. User engagement (CTAs, flow, clarity)
3. Trust signals (badges, testimonials, security)
4. Mobile responsiveness (conceptually)

---

Provide structured output:
- Issues (P0/P1/P2)
- 5 quick wins
- Priority ranking

[paste HTML or describe page structure]",
  "context": {
    "flow_id": "flow-{{number}}-{{name}}",
    "content_type": "analysis",
    "pages_affected": 1-3
  }
}
```

#### Template 2: Copy Optimization
```json
{
  "title": "Optimize: {{component}} CTA Copy",
  "agent": "codex",
  "priority": 2,
  "prompt": "**COMPONENT**: {{component_name}}
**CURRENT CTA**: '{{current_text}}'

Improve this CTA for:
1. Clarity (what happens when clicked?)
2. Action-oriented language (urgency/benefit)
3. A/B test variant

---

Provide 3 variants ranked by conversion potential.
Keep German (Swiss).
Output as JSON.

[paste current copy or context]",
  "context": {
    "flow_id": "flow-{{number}}-{{name}}",
    "current_conversion_rate": "0.0X",
    "goal_increase": "target %"
  }
}
```

#### Template 3: Data Validation
```json
{
  "title": "Validate: {{data_source}} Quality",
  "agent": "codex",
  "priority": 3,
  "prompt": "Validate data from {{data_source}}:

SCHEMA:
- {{field1}}: {{type}} (expected format)
- {{field2}}: {{type}}

RECORDS TO CHECK**: {{number}} rows

VALIDATION RULES**:
1. No null required fields
2. Pricing: CHF 500-5000 range
3. Ratings: 1-5 scale
4. Locations: Valid Swiss cantons

---

Report:
- Quality score (0-100)
- Issue count
- Recommendations
- Approval: Yes/No

[paste sample data or query]",
  "context": {
    "flow_id": "flow-{{number}}-{{name}}",
    "data_type": "provider|content|pricing",
    "records_count": 100-1000
  }
}
```

---

## 🎯 D2: Task Generation Workflow (von 60 Flows zu Queue)

### Phase 1: Flow QA → Issues Identifizieren

**Input**: Deine 60 Flows Liste
**Nutze**: B3 Funnel QA Prompt (aus COPILOT_PAIR_BRAIN_SETUP.md)

```
FUNNEL QA MODE

FLOW:
[Paste flow steps hier]

OUTPUT:
- P0 Issues
- P1 Issues
- P2 Issues
- 5 Conversion Ideas
- 5 Trust Ideas
- GA4 Events
```

### Phase 2: Issues → Tasks in ai_task_queue

Für jedes P0/P1 Issue, erstelle einen Task:

**P0 (Critical)** → COPILOT Task, Priority 5
```
title: "Fix: {{component}} - {{issue}}"
agent: "copilot"
prompt: [Use COPILOT Task Template 1 (Bug Fix)]
```

**P1 (Important)** → COPILOT Task, Priority 3-4
```
title: "Feat: {{feature}}"
agent: "copilot"
prompt: [Use COPILOT Task Template 2]
```

**P2 (Nice-to-have)** → CODEX Task, Priority 2
```
title: "Analyze: {{component}} SEO"
agent: "codex"
prompt: [Use CODEX Task Template 1]
```

### Phase 3: Tasks durchs System laufen lassen

**Via Zapier (Automatic)**:
```
Every 30 minutes:
1. Webhook → GET next task (agent: codex OR copilot)
2. ChatGPT → Execute task
3. Webhook → Mark complete
```

**Via VS Code Extension (Manual Control)**:
```
Cmd+Shift+P → 🔵 Next CODEX Task
Cmd+I → Paste prompt
Copilot Chat → Solve
Cmd+Shift+P → ✅ Mark Current Task Done
```

### Phase 4: Output → Code Changes

Jeder Task-Output wird zu einem PR:

```
{
  "task_id": "uuid",
  "agent": "copilot",
  "output_summary": "Fixed invalid hook call by adding proper dependency array",
  "code_changes": [
    {
      "file": "src/components/Breadcrumbs.tsx",
      "diff": "..."
    }
  ],
  "test_steps": [
    "Step 1",
    "Step 2"
  ]
}
```

---

## 📊 MASTER WORKFLOW: 60 Flows → Production

```
┌─────────────────────────────────────────────────────┐
│ WEEKLY: Run B3 Funnel QA on 6 Flows (1 per day)   │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    P0 Issues    P1 Issues    P2 Issues
    (Critical)   (Important)   (Nice)
        │            │            │
        └────────────┼────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
    COPILOT Tasks          CODEX Tasks
    (Priority 4-5)         (Priority 2-3)
        │                         │
        ├─→ Auto via Zapier ←─────┤
        │   (Every 30 min)        │
        │                         │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
    ChatGPT Results      Content Suggestions
        │                         │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
    Code Changes             Copy Updates
        │                         │
        └────────────┬────────────┘
                     │
                Review + Test
                     │
                  Merge to main
                     │
                Deploy to Production
```

---

## 🔧 Example: Flow → Tasks in Action

### Input Flow (vom 60er List)
```
FLOW: Homepage → Search → Results

Steps:
1. Land on umzugscheck.ch
2. See hero with "Jetzt vergleichen"
3. Click CTA → go to /search form
4. Fill postcode (from, to), date, rooms
5. Submit
6. See results (5-10 companies)
7. Click company card
8. See details + "Angebot anfordern"
9. Click to request quote
10. Confirmation page
```

### B3 QA Output
```
🔴 CRITICAL (P0):
- Missing error handling on postcode validation
- No loading skeleton during fetch
- Button too small on mobile (mis-clicks)

🟡 IMPORTANT (P1):
- Rating not visible on results card mobile
- No back button to modify search

🟢 NICE-TO-HAVE (P2):
- Add price range filter
- Show savings badge

💡 5 CONVERSION IDEAS:
1. Add "Average savings: CHF 800" badge
2. Show top 3 results first, collapsible
3. Add "5 min to complete" above form
4. Highlight Vercosta seal
5. Change "Angebot anfordern" to "Sparen Sie 40%"

🔒 5 TRUST IDEAS:
1. Verified checkmark next to companies
2. Show "834 customers rated this"
3. Add "100% kostenlos" message
4. Datenschutz badge
5. Live counter "12 quotes sent today"

📊 GA4 EVENTS:
- homepage_hero_cta_clicked
- search_form_submitted
- results_page_viewed
- company_card_clicked
- quote_request_submitted
```

### Generated Tasks (in ai_task_queue)

**Task 1 (P0)**
```json
{
  "title": "Fix: Search Form - Postcode Validation Error",
  "agent": "copilot",
  "priority": 5,
  "prompt": "In src/pages/Search.tsx, add error handling for invalid postcode input. Currently no validation feedback. Expected: Show 'Invalid postcode' message. Provide diff + test steps.",
  "context": {
    "flow_id": "flow-1-homepage-search",
    "issue_type": "bug",
    "severity": "high"
  }
}
```

**Task 2 (P0)**
```json
{
  "title": "Feat: Add Loading Skeleton in Results",
  "agent": "copilot",
  "priority": 5,
  "prompt": "Add skeleton loader to src/pages/Results.tsx while fetching company data. Show 3-4 skeleton cards for 1-2 seconds. Matches design system (Tailwind). Provide diff + test steps.",
  "context": {
    "flow_id": "flow-1-homepage-search",
    "issue_type": "ux",
    "effort_hours": 1
  }
}
```

**Task 3 (P1)**
```json
{
  "title": "Feat: Improve Mobile Button Size",
  "agent": "copilot",
  "priority": 4,
  "prompt": "Increase CTA button size on mobile. Current: 36px height. Target: 48px+ for touch targets. File: src/components/ProviderCard.tsx. Responsive: 36px on mobile, 44px on desktop. Provide diff + test (48px on iPhone 12).",
  "context": {
    "flow_id": "flow-1-homepage-search",
    "issue_type": "ux",
    "severity": "medium"
  }
}
```

**Task 4 (P2)**
```json
{
  "title": "Optimize: Conversion CTA Copy",
  "agent": "codex",
  "priority": 2,
  "prompt": "Current CTA: 'Angebot anfordern'. Optimize for conversion. Provide 3 variants ranked by potential (CHF 800 savings angle). Output as JSON with variants + reasoning.",
  "context": {
    "flow_id": "flow-1-homepage-search",
    "current_conversion_rate": "0.035",
    "goal_increase": "10%"
  }
}
```

**Task 5 (P2)**
```json
{
  "title": "Analyze: Results Page SEO & Trust",
  "agent": "codex",
  "priority": 2,
  "prompt": "Analyze /results page for: (1) SEO (headings, meta, keywords), (2) Trust signals (badges, count, social proof), (3) Mobile UX. Provide issues list + 5 quick wins + priority ranking.",
  "context": {
    "flow_id": "flow-1-homepage-search",
    "content_type": "analysis",
    "pages_affected": 1
  }
}
```

---

## 🚀 D3: Weekly Process (Recurring)

### Monday
```
1. Pick 1-2 flows from your 60 list
2. Run B3 Funnel QA (from Copilot setup)
3. Generate tasks from P0/P1/P2
4. Insert into ai_task_queue table
```

### Tuesday-Friday
```
1. Zapier runs every 30 min:
   - Fetch next task
   - ChatGPT executes
   - Mark complete
2. OR manually:
   - Cmd+Shift+P → Next task
   - Cmd+I → Solve
   - Mark done
3. Review output, merge PRs
```

### Friday
```
1. Review week's task output
2. Merge completed PRs
3. Measure impact (GA4 events, conversion)
4. Plan next week's flows
```

---

## 📈 Scaling: 60 Flows → 250+ Tasks/Quarter

| Week | Flows QA'd | Tasks Generated | Agent Distribution | Est. Completion |
|------|-----------|-----------------|-------------------|-----------------|
| 1    | 6         | 15-20           | 70% Copilot, 30% Codex | ~5 days |
| 2    | 6         | 15-20           | 70% Copilot, 30% Codex | ~5 days |
| 3    | 6         | 15-20           | 70% Copilot, 30% Codex | ~5 days |
| 4    | 6         | 15-20           | 70% Copilot, 30% Codex | ~5 days |
| Q1   | 24        | 60-80           | - | ~20 days active |
| Year | 240-300   | 600-1000        | - | Continuous |

**Cost**: ~$50-150/month (Zapier + OpenAI APIs)
**ROI**: Equivalent to 1-2 FTE engineers

---

## ✅ Checklist: Task-Ready State

- [ ] Task has clear title
- [ ] Agent assigned (codex vs copilot)
- [ ] Priority set (1-5, where 5 is critical)
- [ ] Prompt is specific + actionable
- [ ] Context links provided (flow, issue, repo)
- [ ] Reproduction steps (if bug)
- [ ] Expected vs actual behavior defined
- [ ] Code examples/context pasted
- [ ] Status set to "pending"

---

**Last Updated**: 2026-01-28
**Status**: Production Ready
