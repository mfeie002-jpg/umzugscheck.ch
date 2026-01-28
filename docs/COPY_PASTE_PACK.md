# E) QUICK "COPY PASTE PACK" — 6 Essential Snippets

**Schnell kopierbar für Zapier, Terminal, VS Code - NO THINKING REQUIRED** 🚀

---

## 📌 Snippet 1: Next CODEX Task

### Use Case
- Zapier Webhook Step (Body)
- Terminal for quick test
- When you want CODEX agent to pick next task

### Copy & Paste:
```json
{
  "action": "next",
  "agent": "codex"
}
```

### In Zapier Step 2 (Get Next Task):
1. Go to Webhooks by Zapier → POST
2. URL: `https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook`
3. Headers: Add Authorization Bearer
4. Body (raw): **Paste above JSON**

### Via cURL (Testing):
```bash
curl -X POST https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4" \
  -d '{"action":"next","agent":"codex"}'
```

---

## 📌 Snippet 2: Next COPILOT Task

### Use Case
- Zapier Webhook Step (Body)
- Terminal for quick test
- When you want COPILOT agent to pick next task

### Copy & Paste:
```json
{
  "action": "next",
  "agent": "copilot"
}
```

### In Zapier Step 2 (Get Next Task):
1. Go to Webhooks by Zapier → POST
2. URL: `https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook`
3. Headers: Add Authorization Bearer
4. Body (raw): **Paste above JSON**

### Via cURL (Testing):
```bash
curl -X POST https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4" \
  -d '{"action":"next","agent":"copilot"}'
```

---

## 📌 Snippet 3: Mark Task Complete

### Use Case
- Zapier Webhook Step 5 (Mark Complete)
- Terminal after manual task execution
- When task is done and you have output summary

### Copy & Paste:
```json
{
  "action": "complete",
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "output_summary": "Fixed invalid hook call in Breadcrumbs.tsx by adding proper dependency array. Tested on mobile (iPhone 12) and desktop. All console errors resolved.",
  "agent": "copilot"
}
```

### ⚠️ IMPORTANT: Replace These Values
- `task_id`: UUID from Step 2 response → `{{Step2.task.id}}`
- `output_summary`: Summary of what was done → `{{Step4.response}}`
- `agent`: What agent executed (codex or copilot)

### In Zapier Step 5 (Mark Complete):
1. Go to Webhooks by Zapier → POST
2. URL: `https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook`
3. Headers: Add Authorization Bearer
4. Body (raw): **Paste above JSON with actual values**

### Via cURL (Testing):
```bash
curl -X POST https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4" \
  -d '{"action":"complete","task_id":"550e8400-e29b-41d4-a716-446655440000","output_summary":"Task completed successfully","agent":"copilot"}'
```

---

## 📌 Snippet 4: Sweep (Clean Up Stuck Tasks)

### Use Case
- Mark all tasks stuck >120 minutes as failed
- Keep queue healthy
- Run weekly or when backlog grows

### Copy & Paste:
```json
{
  "action": "sweep",
  "agent": "all",
  "stuck_minutes": 120
}
```

### What It Does
- Finds all tasks in "in_progress" status for >120 minutes
- Marks them as "failed"
- Logs which tasks were stuck
- Allows them to be picked up again

### Via cURL (Testing):
```bash
curl -X POST https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4" \
  -d '{"action":"sweep","agent":"all","stuck_minutes":120}'
```

---

## 📌 Snippet 5: CODEX Prompt (Zapier Step 4 - ChatGPT)

### Use Case
- Zapier → ChatGPT Step
- Send to Claude/GPT-4 for execution
- For CODEX tasks (content, analysis, copy)

### Copy & Paste:
```
You are CODEX, an AI content specialist for umzugscheck.ch (Swiss moving company comparison).

CONTEXT:
- Platform: umzugscheck.ch
- Mission: Help residents save 40% on moves
- Values: Trust, Transparency, Quality

TASK:
{{Step2.task.prompt}}

CONSTRAINTS:
- Language: German (Swiss acceptable)
- Output: Valid JSON or clean Markdown
- Be specific and actionable
- Don't ask for clarification (fill gaps reasonably)
- Max tokens: 2000

EXPECTED OUTPUT:
{
  "status": "completed|pending|error",
  "summary": "brief summary",
  "findings": ["finding1", "finding2"],
  "recommendations": ["rec1", "rec2"],
  "next_steps": ["step1", "step2"]
}

Execute the task now.
```

### In Zapier Step 4:
1. Go to ChatGPT (by OpenAI) → Send Prompt
2. **Prompt**: **Paste above** (will replace {{Step2.task.prompt}} automatically)
3. **Model**: gpt-4 (or gpt-3.5-turbo for cost)
4. **Temperature**: 0.7

---

## 📌 Snippet 6: COPILOT Prompt (Zapier Step 4 - ChatGPT)

### Use Case
- Zapier → ChatGPT Step
- Send to Claude/GPT-4 for execution
- For COPILOT tasks (code, features, bugs)

### Copy & Paste:
```
You are COPILOT, an expert software engineer for umzugscheck.ch.

TECH STACK:
- Frontend: React 18 + Vite + TypeScript
- Backend: Supabase (PostgreSQL + Edge Functions)
- Styling: Tailwind CSS + shadcn-ui
- State: TanStack Query + Context API

TASK:
{{Step2.task.prompt}}

WORKFLOW:
1. Identify root cause (specific, not vague)
2. Propose MINIMAL fix (no overengineering)
3. Provide exact code changes (diff-style, copy-paste ready)
4. List 2-3 quick test steps

CONSTRAINTS:
- Code style: Match existing patterns
- Performance: Prefer Query/Context over useState
- Security: Validate inputs, use Supabase RLS
- Accessibility: ARIA labels, semantic HTML
- TypeScript: Strict mode, proper types
- Language: German comments acceptable

EXPECTED OUTPUT:
# Root Cause
[specific 1-2 sentences]

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

Execute the task now.
```

### In Zapier Step 4:
1. Go to ChatGPT (by OpenAI) → Send Prompt
2. **Prompt**: **Paste above** (will replace {{Step2.task.prompt}} automatically)
3. **Model**: gpt-4 (best for code) or gpt-4-turbo (faster)
4. **Temperature**: 0.3 (less creative, more consistent)

---

## 🧩 Complete Zapier Webhook Setup (All Headers)

### Headers for ALL Webhook Requests (Snippets 1-4)

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4"
}
```

### URL (Same for All):
```
https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook
```

---

## 🚀 Quick Start: Zapier in 5 Minutes

### 1. Create Zap: Schedule Trigger
```
App: Schedule by Zapier
Trigger: Every 30 minutes
```

### 2. Webhook: Get Next Task
```
App: Webhooks by Zapier
Method: POST
URL: https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook
Headers: [Copy above]
Body: [Paste Snippet 1 or 2]
```

### 3. Filter: Task Exists
```
App: Filter by Zapier
Condition: Task (from Step 2) → not empty
```

### 4. ChatGPT: Execute Task
```
App: ChatGPT
Action: Send prompt
Prompt: [Paste Snippet 5 or 6]
Model: gpt-4
Temperature: 0.7 or 0.3
```

### 5. Webhook: Mark Complete
```
App: Webhooks by Zapier
Method: POST
URL: https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook
Headers: [Copy above]
Body: [Paste Snippet 3 with Zapier vars]
```

---

## 📋 Testing: One-Click Test Calls

### Test Snippet 1 (Next CODEX)
```bash
curl -X POST https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4" \
  -d '{"action":"next","agent":"codex"}' | jq .
```

### Test Snippet 2 (Next COPILOT)
```bash
curl -X POST https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4" \
  -d '{"action":"next","agent":"copilot"}' | jq .
```

### Test Snippet 4 (Sweep)
```bash
curl -X POST https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4" \
  -d '{"action":"sweep","agent":"all","stuck_minutes":120}' | jq .
```

---

## 📌 One-Pager: Where to Use Each Snippet

| Snippet | Use In | Format | Example |
|---------|--------|--------|---------|
| 1 | Zapier Step 2 | JSON Body | `{"action":"next","agent":"codex"}` |
| 2 | Zapier Step 2 | JSON Body | `{"action":"next","agent":"copilot"}` |
| 3 | Zapier Step 5 | JSON Body | `{"action":"complete","task_id":"...",` |
| 4 | Zapier (Admin) | JSON Body | `{"action":"sweep","agent":"all",...}` |
| 5 | Zapier Step 4 | Text Prompt | "You are CODEX..." |
| 6 | Zapier Step 4 | Text Prompt | "You are COPILOT..." |

---

## ✅ Checklist Before Going Live

- [ ] Anon Key copied correctly (from .env)
- [ ] Webhook URL tested with cURL
- [ ] Zapier headers set (Content-Type + Authorization)
- [ ] Snippet 5 or 6 in ChatGPT Step (correct model + temperature)
- [ ] Filter Step (Task not empty) configured
- [ ] Test Zap manually runs without errors
- [ ] Mark Complete Step returns success
- [ ] Check Supabase logs (no 401/403 errors)
- [ ] Turn on Zap scheduling

---

**Print this page or save as bookmark.** 🔖

**Last Updated**: 2026-01-28
**Status**: Copy-Paste Ready
