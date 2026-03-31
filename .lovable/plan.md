

# /feedback Seite erweitern: Execution Plan (10 neue Blöcke)

## Was sich ändert

Die bestehende `/feedback`-Seite hat 8 Blöcke (Readiness Score bis Strategische Empfehlung). Jetzt kommen 10 neue Blöcke dazu — der finale, handlungsorientierte Teil, der aus Kritik konkrete Massnahmen macht.

## Kontextanpassung: Pre-Launch Startup

Wichtiger Rahmen: Das Projekt ist ein Pre-Launch Startup. Noch kein Live-Traffic, keine Umsätze — das ist der erwartete Zustand vor dem Go-Live am 1. April. Die Analyse wird dies berücksichtigen und zwischen "fehlt, weil Pre-Launch" und "fehlt, weil strukturelles Problem" unterscheiden.

## Neue Blöcke (9–18)

```text
 9. EXECUTIVE ACTION SUMMARY    — 5 Baustellen, 3 kritische Punkte, 3 Hebel
10. MASTER ACTION LIST          — Priorisierte Massnahmen mit Kategorie/Dringlichkeit/Hebel
11. PRIORITY MATRIX             — 4-Felder (Sofort/Bald/Nachgelagert/Nicht diskutieren)
12. INVESTOR PREP CHECKLIST     — Was vor Pitch/DD/Datenraum bereit sein muss
13. CLAIM CONTROL LIST          — Sicher/Vorsichtig/Zu gross/Nicht sagen (erweitert Block 5)
14. INTERNAL WORKSTREAMS        — 6 Arbeitsstränge mit Zielen & Deliverables
15. 30-60 DAY EXECUTION PLAN   — Phase 1 (7d) / Phase 2 (30d) / Phase 3 (60d)
16. WHAT TO PROVE FIRST         — Top-5-Listen: beweisen/messen/formulieren/testen/belegen
17. RED FLAGS IN INVESTOR MEETINGS — Gefährliche Punkte + Vorbereitung
18. FINAL INTERNAL VERDICT      — Hartes Schlussurteil + Erfolgseinschätzung + Investitionsschwelle
```

## Inhaltliche Kernpunkte (destilliert aus allen 3 Analysen + Meta-Feedback)

**Executive Action Summary:**
- 5 Baustellen: Revenue-Loop beweisen, Neutralitätskonflikt lösen, Team/Advisor, GSC-Daten, Fokus-Cut
- Kommunikation vs. Beweis vs. Modellproblem klar getrennt

**Master Action List (~15 Massnahmen):**
- z.B. "5 echte Jobs mit Vollkostenrechnung", "GSC-Daten exportieren", "Partner-LOIs einholen", "Pitch auf 250-300 CHF Kern reduzieren", "Governance-Modell für Routing definieren"
- Jede mit Kategorie, Dringlichkeit, Hebel, Problem-Typ

**Priority Matrix:**
- Sofort: Revenue-Proof, GSC, Fokus-Cut
- Bald: Partner-Validation, Teamplan, Paid-Channel-Test
- Nachgelagert: Internationalisierung, Premium-Packages, Exit-Szenarien
- Nicht diskutieren: 6 Revenue Streams, 92% Profitabilität, "100% safe"

**30-60 Day Plan:**
- Phase 1 (7d): GSC exportieren, erste 2-3 Jobs starten, Routing-Governance definieren
- Phase 2 (30d): 5-10 Jobs mit P&L, CPL via 500 CHF Test, 3 Partner-LOIs
- Phase 3 (60d): CM2-Nachweis, Proof Memo erstellen, Pitch überarbeiten

**Final Verdict mit Investitionsschwelle:**
- Erfolgswahrscheinlichkeit: ehrliche Einschätzung für Pre-Launch Startup
- Wann investierbar: konkreter Threshold (X Jobs, Y% Marge, Z Traffic)
- Grösster Denkfehler, grösstes Risiko, grösste unbelegte Hoffnung

## Design

- Gleiche UI-Patterns wie Block 1-8 (StatusBadge, SourceBadge, SeverityBar, Collapsible, Tabs)
- Neue visuelle Elemente: Priority Matrix als 2×2 Grid, Execution Timeline als vertikale Zeitleiste
- Badge `ANALYSE 4` für die neuen Inhalte (orange)

## Dateien

| Aktion | Datei |
|--------|-------|
| Rewrite | `src/pages/FeedbackAnalysis.tsx` — Block 9-18 hinzufügen (gleiche Komponenten-Patterns) |

## Technisch
- Gleiche Standalone-Architektur, keine neuen Dependencies
- Alle Inhalte hardcoded
- Geschätzter Umfang: ~400-500 zusätzliche Zeilen

