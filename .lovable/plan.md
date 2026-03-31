

# /feedback: Block 24 — AI Execution Masterplan

## Situation

`FeedbackAnalysis.tsx` is already 1895 lines. Adding ~800+ lines of the massive 10-section masterplan inline would make the file unmanageable. Solution: extract Block 24 into a separate component.

## Architecture

| Aktion | Datei |
|--------|-------|
| Create | `src/components/feedback/AIExecutionMasterplan.tsx` (~800 lines) |
| Edit | `src/pages/FeedbackAnalysis.tsx` — Import component, add Block 24 before footer, update footer badges |

## New Component: `AIExecutionMasterplan.tsx`

Contains all 10 sections from the user's message as hardcoded content:

| Sub | Title | UI Pattern |
|-----|-------|-----------|
| 24.1 | Final Strategic Summary | 4 collapsible lists (10 Erkenntnisse, 10 Risiken, 10 Lücken, 10 Massnahmen) + 5 Investierbarkeits-Entscheider as gradient card |
| 24.2 | Master Todo List (T1–T20) | Collapsible per todo with metadata grid (Kategorie, P1-P4, Wirkung, Dringlichkeit) |
| 24.3 | AI Delegation Map | Color-coded table: A=green, B=teal, C=yellow, D=orange, E=red — one row per T1–T20 |
| 24.4 | Human Minimum Model | 4-column grid: Automatisiert / Review / Eskalation / Menschlich |
| 24.5 | AI System Architecture | 10 cards (A–J: Intake through Monitoring) with role, system, automation scope |
| 24.6 | OpenClaw Maximum Use Plan | Tabs: Skills / Agents / Cron / Messaging / Kontrolle / Nicht geeignet |
| 24.7 | 80/20 Automation Plan | 5 lists as badge-tagged cards |
| 24.8 | Implementation Roadmap | 4-phase vertical timeline (7d/30d/60d/Pre-Investor) |
| 24.9 | Control, Risks & Guardrails | Cards per automation area with risk/escalation/approval fields |
| 24.10 | Final Executive Output | 5 collapsible lists (A–E) with the prioritized todo summaries |

## Design

- Reuses existing `StatusBadge`, `SourceBadge`, `SeverityBar`, `Collapsible`, `Reveal` — passed as props or re-imported
- New `SourceBadge`: `MASTERPLAN` (cyan: `bg-cyan-500/10 text-cyan-400`)
- AI Delegation categories color-coded in table rows
- All content hardcoded from the user's message — 1:1 faithful

## Integration in FeedbackAnalysis.tsx

- Add `MASTERPLAN` to SourceBadge styles
- Import `AIExecutionMasterplan` component
- Render as Block 24 between Block 23 (Final Strategic Verdict) and Footer
- Add `<SourceBadge source="MASTERPLAN" />` to footer badges

## Estimated size

- New component: ~750–850 lines
- Edit to main file: ~10 lines changed

