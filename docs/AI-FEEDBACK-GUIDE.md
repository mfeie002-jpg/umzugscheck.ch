# AI Feedback Guide for Umzugscheck.ch

This guide explains how to get effective AI feedback (Gemini/ChatGPT) on the platform's implementation phases.

## Quick Start

### 1. Generate Phase Exports

```bash
# Generate all phases
node scripts/generate-phase-feedback-export.js all

# Generate specific phase
node scripts/generate-phase-feedback-export.js 1
```

### 2. Find Your Exports

Exports are saved to:
```
public/feedback-exports/
├── index.txt           # Overview of all phases
├── phase-1.txt         # Core Funnel & Calculator
├── phase-2.txt         # Funnel Variants (V1-V5)
├── phase-3.txt         # Calculator Variants (V3-V9)
├── phase-4.txt         # Company Ranking & Matching
├── phase-5.txt         # Regional & SEO Pages
├── phase-6.txt         # Homepage & Navigation
├── phase-7.txt         # Trust & Social Proof
├── phase-8.txt         # Services & Content Pages
├── phase-9.txt         # Mobile & Accessibility
└── phase-10.txt        # Design System & Styling
```

### 3. Use with AI

1. Open the phase file
2. Copy the entire content
3. Paste into Gemini/ChatGPT
4. Add screenshots if possible
5. Ask follow-up questions

---

## Phase Overview

| Phase | Name | Focus |
|-------|------|-------|
| 1 | Core Funnel & Calculator | Main quote request flow |
| 2 | Funnel Variants (V1-V5) | A/B test variants |
| 3 | Calculator Variants (V3-V9) | Experimental UIs |
| 4 | Company Ranking | Directory & matching |
| 5 | Regional & SEO Pages | Local landing pages |
| 6 | Homepage & Navigation | Entry point & nav |
| 7 | Trust & Social Proof | Credibility elements |
| 8 | Services & Content | Guides & info pages |
| 9 | Mobile & Accessibility | Touch & a11y |
| 10 | Design System | CSS & components |

---

## Best Practices

### Do's ✅

- **One phase at a time** - Keep context focused
- **Include screenshots** - Mobile + Desktop views
- **Ask specific questions** - "Is the CTA visible enough on mobile?"
- **Request code fixes** - "Show me how to fix this"
- **Compare variants** - "Which approach is better for conversion?"

### Don'ts ❌

- Don't paste entire codebase
- Don't skip the context section
- Don't ask vague questions
- Don't forget mobile screenshots
- Don't ignore the generated questions

---

## Sample Prompts

### For UX Analysis

```
Please analyze this moving quote funnel for:
1. Conversion optimization opportunities
2. Mobile usability issues
3. Trust signal placement
4. Drop-off risk points

Here's the code: [paste phase export]
```

### For Comparison

```
I have two funnel variants. Please compare them:

Variant A: [paste V1d code]
Variant B: [paste V1e code]

Which has better:
- Mobile UX?
- Trust signals?
- Conversion potential?
- Clarity?
```

### For Specific Issues

```
Users are dropping off at step 3 of this funnel.
Please analyze the code and suggest:
1. What might cause the drop-off
2. Specific code changes to fix it
3. A/B test ideas to validate

[paste phase export]
```

### For Mobile Optimization

```
Please review this mobile navigation for:
1. Thumb-zone accessibility
2. Touch target sizes (min 48px)
3. Gesture conflicts
4. Bottom nav usability

[paste mobile components]
```

---

## Screenshots to Include

For each phase, capture:

### Mobile (375px width)
- Initial view (above the fold)
- Form states (empty, filled, error)
- Navigation open state
- CTA visibility

### Desktop (1920px width)
- Full page layout
- Hover states
- Modal/dialog states
- Comparison views

### Tools
- Chrome DevTools (Device Mode)
- Firefox Responsive Design Mode
- Screenshot from actual device

---

## Follow-Up Questions

After initial analysis, ask:

1. **Prioritization**: "Which 3 issues should we fix first?"
2. **Code Examples**: "Show me the React code for that fix"
3. **Alternatives**: "What are other ways to solve this?"
4. **Validation**: "How can we A/B test this change?"
5. **Competitors**: "How does Movu handle this?"

---

## Updating Phase Definitions

To add or modify phases, edit:
```
scripts/generate-phase-feedback-export.js
```

Each phase needs:
- `id`: Unique number
- `name`: Short name
- `description`: What it covers
- `goal`: What it's trying to achieve
- `routes`: Related URL paths
- `files`: Key files to include
- `componentDirs`: Component folders to scan
- `questions`: Specific analysis questions

---

## Token Limits

Each export is optimized to stay under ~80,000 tokens:

| AI | Token Limit | Notes |
|----|-------------|-------|
| Gemini 1.5 Pro | 1M | Can handle multiple phases |
| Gemini 1.5 Flash | 1M | Same, faster |
| ChatGPT-4 | 128K | One phase at a time |
| ChatGPT-4 Turbo | 128K | Same |
| Claude 3.5 | 200K | Can handle 2-3 phases |

For larger analyses, use Gemini with its 1M context window.

---

## Troubleshooting

### "File not found" errors
Some files may have been renamed or moved. Update the phase definitions in the script.

### Export too large
Reduce `maxFiles` in `getFilesFromDir()` or remove less critical files from the phase.

### Missing components
Add the component directory to `componentDirs` in the phase definition.

---

## Integration with Flow Tester

The platform includes a Flow Tester at `/flow-tester` that:
- Captures screenshots of each funnel step
- Measures performance metrics
- Stores analysis in Supabase

Use Flow Tester results alongside AI feedback for comprehensive analysis.
