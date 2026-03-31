

# /feedback Seite: 10 neue Execution-Plan-Blöcke (Block 9–18)

## Was sich ändert

Die bestehende `/feedback`-Seite hat 8 Blöcke (619 Zeilen). Jetzt kommen 10 neue Blöcke dazu — der gesamte Inhalt aus der Nachricht des Users wird 1:1 als hardcoded Content eingefügt.

## Neue Blöcke

| Block | Titel | Inhalt |
|-------|-------|--------|
| 9 | Investor Readiness Overview | Gesamtbewertung 3/10 mit detaillierter Begründung, Stark/Schwach/Substanz/Story-Trennung |
| 10 | Gap Map | 9 Kategorien (A–I) mit je 2 Lücken, Status-Badges, Quellen, konkrete Fixes |
| 11 | Proof Requirements | 5 Kategorien (A–E) mit je 3 Beweispunkten, Dringlichkeit, Beschaffungsweg |
| 12 | Pitch Claim Audit (erweitert) | 4 Gruppen: sicher/vorsichtig/zu gross/nicht sagen — detaillierter als Block 5 |
| 13 | Investor Confusion Points | 6 Punkte wo Investoren aussteigen, mit Problemtyp strukturell/kommunikativ |
| 14 | What Must Be Fixed | 4 Listen (A–D): 10+5+5+5 konkrete Fixes vor Investorengesprächen |
| 15 | Investor Ready Roadmap | 3 Horizonte: 14 Tage / 30 Tage / Vor Investoren (detaillierter als Block 7) |
| 16 | Final Decision Frame | 7 harte Schlussantworten + Investitionsschwelle |

Dazu werden Block 9–10 als Tabs organisiert (Gap Map hat 9 Kategorien), und Block 14 nutzt Collapsibles.

## Design

- Gleiche UI-Patterns: `StatusBadge`, `SourceBadge`, `SeverityBar`, `Collapsible`, `Reveal`, `Card`, `Tabs`
- Neuer `SourceBadge` Wert: `ANALYSE 4` (orange) für die neuen Inhalte
- Gap Map als Tabs (A–I Kategorien)
- Priority-Punkte mit farbigen Dots (rot/orange/gelb nach Dringlichkeit)
- Final Verdict als gradient Card (wie Block 8)

## Dateien

| Aktion | Datei |
|--------|-------|
| Edit | `src/pages/FeedbackAnalysis.tsx` — Blöcke 9–16 nach Block 8 einfügen (vor closing divs) |

## Umfang

~500–600 zusätzliche Zeilen hardcoded Content, gleiche Komponenten-Patterns, keine neuen Dependencies.

