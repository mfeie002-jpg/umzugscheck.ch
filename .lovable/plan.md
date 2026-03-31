

# /feedback: Block 25 — Gemini Investor Readiness Blueprint

## Situation

Die `/feedback`-Seite hat 24 Blöcke (1913 Zeilen). Gemini hat eine eigenständige, schonungslose Analyse geliefert mit teils neuen Perspektiven (GAV-Compliance, SEO-Spam-Penalty, Ask-Diskrepanz, "Tech-Operator Pivot"). Diese wird als Block 25 in eine neue externe Komponente ausgelagert.

## Neue Inhalte (1:1 aus Geminis Analyse)

| Sub | Titel | UI |
|-----|-------|----|
| 25.1 | Executive Summary | Gradient card mit Score 3/10, Stärken/Risiken/Lücken/Hebel |
| 25.2 | Investability Scorecard | Farbcodierte Tabelle (9 Felder, Score 1-10) |
| 25.3 | Risk Map | 5 Risiken mit Eintritts-WK × Schweregrad (SeverityBar) |
| 25.4 | Gap Map | 4 Kategorien (Proof/Economics/Strategy/Docs) |
| 25.5 | Contradiction Map | 3 Widersprüche (A/B/C) als rot markierte Cards |
| 25.6 | Solution Blueprint | 3 Lösungen (Tech-Operator Pivot, Pro-Forma, HITL) |
| 25.7 | AI & Automation Design | 5 Bereiche (A-E) mit Automatisierungs-Level |
| 25.8 | Implementation Roadmap | 3 Phasen (7d/30d/Pre-Investor) |
| 25.9 | Claim & Pitch Control | 4 Kategorien (Sicher/Vorsichtig/Zu gross/Toxisch) als grün/gelb/orange/rot Grid |
| 25.10 | Investor Readiness Checklist | Hygiene + Proof Checkliste |
| 25.11 | Final Verdict | 5 Voraussetzungen + Schlussurteil |

## Design

- Neuer `SourceBadge`: `GEMINI` (violet: `bg-violet-500/10 text-violet-400`)
- Scorecard als farbcodierte Tabelle (Scores 1-3 rot, 4-6 gelb, 7-10 grün)
- Contradiction Map Cards mit rotem Seitenrand
- Solution Blueprint als nummerierte Step-Cards
- Claim Control als 4-Spalten rot/orange/gelb/grün Grid

## Dateien

| Aktion | Datei |
|--------|-------|
| Create | `src/components/feedback/GeminiBlueprint.tsx` (~600-700 Zeilen) |
| Edit | `src/pages/FeedbackAnalysis.tsx` — Import, Block 25 vor Footer, SourceBadge `GEMINI` hinzufügen, Footer-Update |

