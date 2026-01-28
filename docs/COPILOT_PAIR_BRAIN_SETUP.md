# VS Code Copilot "Pair Brain" Setup

Dein persönlicher AI Senior Engineer direkt in VS Code. Nutze diese Prompts für schnelle, hochqualitäts Fixes und Code Reviews.

---

## 🧠 B1: COPILOT CHAT - STARTER PROMPT

**Wo nutzen**: VS Code Copilot Chat (Cmd+I)
**Zweck**: Root Cause Analysis + Minimal Fixes
**Zeit**: 30 Sekunden - 2 Minuten pro Issue

### Den Prompt einfügen:

```
You are my senior engineer on umzugscheck.ch.

TECH STACK:
- Frontend: React 18 + Vite + TypeScript
- Styling: Tailwind CSS + shadcn-ui
- Backend: Supabase (PostgreSQL + Edge Functions)
- State Management: TanStack Query + Context API
- Testing: Vitest + React Testing Library

WORKFLOW:
1. Identify root cause (be specific)
2. Propose MINIMAL fix (don't overengineer)
3. Provide exact code changes (copy-paste ready)
4. List 2-3 quick test steps

CONSTRAINTS:
- Code style: Follow existing patterns in file
- Performance: Prefer query/context over component state
- Security: Validate inputs, use Supabase RLS
- Accessibility: ARIA labels, semantic HTML
- TypeScript: Strict mode, proper types

If you need context, ask at most 2 questions, otherwise proceed with best-effort solution.

OUTPUT FORMAT:
# Root Cause
[1-2 sentences]

# Proposed Fix
[brief explanation]

# Code Changes
\`\`\`diff
[before → after]
\`\`\`

# Test Steps
1. [step]
2. [step]
3. [step]

# Notes
[any caveats or follow-ups]
```

---

### Wie du ihn nutzt:

**Szenario 1: Error Message + File**
```
Copilot Chat Input:
[paste error message]

---
File: src/components/Hero.tsx
[paste relevant code section]
```

**Szenario 2: Buggy Behavior**
```
Copilot Chat Input:
When clicking "Jetzt vergleichen" button on homepage, nothing happens.
DevTools says: "Cannot read property 'id' of undefined in ProviderMatchCard.tsx"

---
File: src/components/ProviderMatchCard.tsx
[paste relevant code]
```

**Szenario 3: Feature Request**
```
Copilot Chat Input:
Add a "copy price estimate" button that copies the summary to clipboard.

---
File: src/components/PriceCalculator.tsx
[paste component]
```

---

## ✅ B2: PR-READY CHANGE PROMPT

**Wo nutzen**: Nach Copilot den Fix bereitgestellt hat
**Zweck**: Commit message, PR description, QA Checklist
**Zeit**: 1 Minute

### Den Prompt einfügen (nachdem Fix fertig ist):

```
Now write:

1. COMMIT MESSAGE (conventional commits)
   Format: type(scope): description
   Examples: "fix(hero): resolve undefined props in ProviderMatchCard" or "feat(pricing): add copy-to-clipboard"

2. PR DESCRIPTION
   - What changed? (1-2 sentences)
   - Why? (motivation/issue link)
   - How to test? (3-4 steps)
   - Breaking changes? (none/list)
   - Impact: (🟢 low / 🟡 medium / 🔴 high)

3. QA CHECKLIST
   - [ ] Responsive on mobile/tablet/desktop?
   - [ ] Error states handled?
   - [ ] Console errors? (check F12)
   - [ ] Keyboard accessible? (Tab through)
   - [ ] Data persists after refresh?
   - [ ] Performance okay? (no lag)
   - [ ] Matches design system (Tailwind, brand colors)?

Keep it Swiss-clear: concise, professional, actionable.
```

---

### Beispiel Output (was Copilot dir gibt):

```
# Commit Message
fix(provider-match): fix undefined property error in card component

# PR Description
## What
Fixed "Cannot read property of undefined" error when rendering provider match cards with missing pricing data.

## Why
Fallback logic wasn't catching null/undefined pricing in certain regions.

## Test
1. Navigate to `/umzugsfirma-vergleichen`
2. Select a canton with incomplete provider data
3. Verify cards render without console errors
4. Check mobile view (iPhone 12) still works

## Breaking Changes
None

## Impact
🟢 Low - fixes UI crash, no API changes

# QA Checklist
- [x] Responsive tested (375px, 768px, 1440px)
- [x] Error states: shows "Price on request" instead of blank
- [x] Console: no errors after fix
- [x] Keyboard: Tab navigation works
- [x] Data: persists filters across refresh
- [x] Performance: <3s load time
- [x] Design: matches brand colors and spacing
```

---

## 🎯 B3: FUNNEL QA MODE (für deine 60 Flows)

**Wo nutzen**: VS Code Copilot Chat oder Desktop Terminal
**Zweck**: Systematische QA für jeden Flow
**Zeit**: 3-5 Minuten pro Flow

### Setup: Flow-Liste vorbereiten

Du brauchst deine 60 Flows als Liste. Beispiel-Format:

```
FLOW 1: Homepage → Search → Results
URL: https://umzugscheck.ch/

Steps:
1. Land on homepage
2. Click "Jetzt vergleichen"
3. Fill postcode
4. Select move date
5. See results
6. Click on provider
7. See provider details
8. Request quote

Expected: Smooth transition, no errors, all CTAs clickable
```

### Den QA Prompt einfügen:

```
FUNNEL QA MODE - Simulating user flow conceptually.

FLOW CONTEXT:
[paste your flow here - steps 1-10 or URL]

ANALYSIS FOCUS:
1. Conceptual funnel walkthrough (I'll simulate user perspective)
2. Identify where users might drop off
3. Check for missing trust signals
4. Verify CTA clarity

DELIVERABLES (structured list):

## 🔴 CRITICAL ISSUES (P0)
- [issue]: [how to fix] [impact: X% conversion loss]
- Example: "Missing email confirmation after quote request → users don't know status → add email notification"

## 🟡 IMPORTANT ISSUES (P1)
- [issue]: [fix] [effort: low/medium/high]

## 🟢 NICE-TO-HAVE (P2)
- [issue]: [context]

## 💡 5 CONVERSION IMPROVEMENTS
1. [improvement + reason]
2. [improvement + reason]
3. [improvement + reason]
4. [improvement + reason]
5. [improvement + reason]

## 🔒 5 TRUST IMPROVEMENTS
1. [improvement + where to add]
2. [improvement + where to add]
3. [improvement + where to add]
4. [improvement + where to add]
5. [improvement + where to add]

## 📊 GA4 TRACKING EVENTS TO ADD
- event_name: "flow_step_X_completed" | metrics: time_on_step, error_encountered
- event_name: "quote_request_submitted" | metrics: total_price_estimate
- [other key events]

Keep it actionable (what to code/where).
```

---

### Beispiel Flow QA Input:

```
FLOW: "Homepage to Comparison Results"

User journey:
1. Lands on umzugscheck.ch homepage
2. Sees hero section with "Jetzt vergleichen" button
3. Clicks button → modal or new page with form
4. Fills in:
   - Postcode (from)
   - Postcode (to)
   - Move date
   - Household size (rooms)
5. Submits form
6. Sees loading state
7. Results page: list of 5-10 moving companies
8. Each card shows:
   - Company logo
   - Rating (stars)
   - Price estimate
   - "Angebot anfordern" button
9. Can click on company to see details
10. Can request quote from details page
```

**Copilot wird dir geben:**
```
## 🔴 CRITICAL ISSUES (P0)
- Missing error handling on postcode validation → show "Invalid postcode" → users get stuck
- No loading skeleton → blank page for 2 seconds → users think page broke
- CTA button too small on mobile (36px) → mis-clicks increase

## 🟡 IMPORTANT ISSUES (P1)
- Company rating not visible on mobile → trust signal hidden
- No back button on results → users can't go back to modify search
- Price estimate missing for some companies → users confused about data

## 🟢 NICE-TO-HAVE (P2)
- Add filter (price range, rating min) to narrow results
- Show number of quotes already sent from IP → social proof

## 💡 5 CONVERSION IMPROVEMENTS
1. Add "Average savings: CHF 800" badge → show immediate value
2. Show top 3 results first, collapsible "Show all" → reduce cognitive load
3. Add "5 min to complete" next to form → lower friction perception
4. Highlight "Vercosta" seal on company cards → build trust
5. Change "Angebot anfordern" to "Jetzt sparen + 40%" → stronger CTA

## 🔒 5 TRUST IMPROVEMENTS
1. Add verified checkmark next to company names (on card + detail)
2. Show customer count under rating ("834 customers rated this")
3. Add "100% kostenlos, keine versteckten Gebühren" above form
4. Show "Datenschutz zertifiziert" footer badge
5. Add live counter "12 quotes sent today" → social proof

## 📊 GA4 TRACKING EVENTS TO ADD
- event: "homepage_hero_cta_clicked" | labels: button_location
- event: "search_form_submitted" | metrics: postcode, move_date, rooms_count
- event: "results_page_viewed" | metrics: result_count, avg_price
- event: "company_card_clicked" | metrics: company_id, position
- event: "quote_request_submitted" | metrics: company_id, estimated_price
```

---

## 🔄 WORKFLOW: So nutzt du alle 3 Prompts zusammen

### Tag 1: Bug Fixen
```
1. Copy-paste "B1: Starter Prompt" in Copilot Chat
2. Paste error + code
3. Copilot gibt dir fix
4. Apply fix locally
5. Test
```

### Tag 2: PR Vorbereiten
```
1. Copy-paste "B2: PR-Ready Change" in Copilot Chat
2. Copilot gibt dir commit message + PR description
3. Copy in GitHub PR Template
4. Merge
```

### Wöchentlich: QA durchführen
```
1. Nimm eine Flow aus deiner 60er Liste
2. Copy-paste "B3: Funnel QA Mode" in Copilot
3. Paste die Flow-Schritte
4. Copilot gibt dir QA Report
5. Priorisiere Issues (P0, P1, P2)
6. Erstelle Tickets
```

---

## 🎨 BONUS: Quick Prompts für spezifische Aufgaben

### "Design System Check"
```
I'm looking at [COMPONENT].
Does it match our design system (Tailwind colors, spacing, typography)?
Check against:
- Primary blue: #0050A8
- Accent red: #E32026
- Spacing scale: 4px, 8px, 12px, 16px, 24px, 32px
List differences.
```

### "Type Safety Audit"
```
Check this TypeScript for loose types:
- any types?
- Missing return type?
- Props not properly typed?
[paste code]
Give me fixed version.
```

### "Performance Review"
```
Review this component for performance issues:
- Unnecessary re-renders?
- Missing memoization?
- N+1 queries?
- Large bundle imports?
[paste code]
Suggest optimizations.
```

### "Accessibility Check"
```
Review for a11y issues:
- ARIA labels?
- Keyboard navigation?
- Color contrast?
- Focus states?
[paste code]
List fixes.
```

---

## 📝 COPILOT CHAT TIPS

### 1. Context is King
- **Good**: "Homepage hero button doesn't work. Here's the error + component code"
- **Bad**: "Button broken lol"

### 2. Keep It Small
- **Good**: 1 file + 1 error = focused fix
- **Bad**: Paste entire src/ folder

### 3. Ask for Diff-Style Output
```
"Give me changes as a before/after diff I can copy-paste"
```
Copilot wird cleaner Code geben.

### 4. Use Code Blocks
```markdown
# Root Cause

# Proposed Fix

# Code Changes
\`\`\`diff
\`\`\`

# Test Steps
```

### 5. Chain Prompts
```
1st: Paste code → get fix
2nd: "Now write PR description for this fix"
3rd: "Add tests for this"
```

---

## ✅ DAILY WORKFLOW CHECKLIST

```
☐ Morning: Run "B3: Funnel QA" on 1-2 flows
☐ During Development: Use "B1: Starter Prompt" for bugs
☐ Before Commit: Use "B2: PR-Ready Change"
☐ Weekly: Run full QA on critical flows
☐ Review: Check Copilot's output quality (adjust prompts if needed)
```

---

## 🚨 WHEN COPILOT GIVES BAD ANSWERS

**Problem**: Output is vague or wrong

**Fix**:
1. Add more context (paste more code)
2. Ask 2 clarifying questions first
3. Use "Type Safety Audit" or "Performance Review" for specific checks
4. Break problem into smaller parts

**Example of better prompt**:
```
In src/components/Hero.tsx, the "Jetzt vergleichen" button doesn't navigate.
React Router version: 6.x
Expected: Navigate to /search with URL params
Actual: Logs error "Cannot read searchParams"

[paste entire Hero.tsx + navigation setup]

What's the issue?
```

---

**Last Updated**: 2026-01-28
**Status**: Production Ready - Use Daily
