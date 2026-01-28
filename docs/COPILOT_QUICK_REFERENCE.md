# VS Code Copilot Quick Reference Card

**Druck mich aus oder pinne mich an dein Monitor** 📌

---

## 🧠 B1: DEBUGGING (Cmd+I im VS Code)

### Copy-Paste Template:
```
You are my senior engineer on umzugscheck.ch.

STACK: React 18 + Vite + TypeScript + Supabase

WORKFLOW:
1. Root cause (specific)
2. Minimal fix (no overengineering)
3. Code changes (copy-paste ready)
4. Test steps (2-3)

Ask max 2 questions, otherwise best-effort.

---

[PASTE YOUR ERROR + CODE HERE]
```

### Beispiel Input:
```
Error: "Cannot read property 'id' of undefined"
File: src/components/ProviderMatchCard.tsx line 45

[paste the code]
```

**Output**: Root cause + diff + test steps ✅

---

## ✅ B2: COMMIT & PR (nach Fix)

### Copy-Paste Template:
```
Now write:

1. COMMIT MESSAGE (conventional)
   Format: type(scope): description

2. PR DESCRIPTION
   - What changed?
   - Why?
   - How to test?
   - Breaking changes?

3. QA CHECKLIST
   - [ ] Mobile responsive?
   - [ ] Console errors?
   - [ ] Keyboard accessible?
   - [ ] Design match?

Keep it Swiss-clear.
```

**Output**: Commit + PR description + checklist ✅

---

## 🎯 B3: FUNNEL QA (wöchentlich)

### Copy-Paste Template:
```
FUNNEL QA MODE

FLOW:
[PASTE YOUR FLOW STEPS HERE]

DELIVERABLES:
## 🔴 CRITICAL (P0)
## 🟡 IMPORTANT (P1)
## 🟢 NICE-TO-HAVE (P2)
## 💡 5 CONVERSION IDEAS
## 🔒 5 TRUST IDEAS
## 📊 GA4 EVENTS TO ADD

Keep it actionable.
```

**Output**: Issues + improvements + tracking plan ✅

---

## 🚀 BONUS QUICK PROMPTS

### Type Safety
```
Check for loose types (any, missing returns, untyped props):
[paste code]
```

### Performance
```
Check for re-renders, memoization, N+1 queries:
[paste code]
```

### A11y
```
Check ARIA, keyboard nav, contrast, focus:
[paste code]
```

### Design System
```
Match Tailwind colors, spacing, typography:
- Blue: #0050A8
- Red: #E32026
- Spacing: 4/8/12/16/24/32px
[paste code]
```

---

## 💡 PRO TIPS

1. **Context = Quality**
   - Paste error message
   - Paste relevant code section
   - Paste expected vs actual behavior

2. **Keep It Small**
   - 1 file per issue = focused answer
   - Don't paste entire src/

3. **Ask for Diffs**
   - "Give me before/after diff I can copy-paste"

4. **Chain Prompts**
   - Get fix → PR description → Tests in sequence

5. **When Stuck**
   - Add more context (full component)
   - Ask clarifying questions first
   - Break into smaller parts

---

## 📊 DAILY CHECKLIST

- [ ] Morning: Run B3 (Funnel QA) on 1-2 flows
- [ ] Dev: Use B1 for bugs
- [ ] Commit: Use B2 for messages
- [ ] Weekly: Deep QA on critical flows

---

## 🔗 WORKFLOW CHAIN

```
BUG FOUND
    ↓
B1: Paste error + code → Get fix
    ↓
TEST LOCALLY
    ↓
B2: Ask for commit message + PR description
    ↓
COMMIT & PUSH
    ↓
WEEKLY: B3 on 1-2 flows for improvements
```

---

**Use daily. Adjust prompts if needed. Ship fast.** 🚀
