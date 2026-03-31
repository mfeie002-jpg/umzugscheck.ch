

# `/feedback` — Ultimatives Verbesserungsdokument

## Was entsteht

Eine neue Seite unter `/feedback`, die alle kritischen Analysen aus den letzten Gesprächen konsolidiert — nicht als Wiederholung, sondern als strukturiertes, priorisiertes Verbesserungsdokument. Die Seite dient als internes Red-Team-Arbeitswerkzeug.

## Inhalt (destilliert aus allen Analyse-Runden)

Die Seite wird in 8 klare Blöcke gegliedert:

```text
1. READINESS SCORE        — Gesamtbewertung 3/10 mit Begründung
2. TOP 7 KILL POINTS      — Die gefährlichsten Bruchstellen, priorisiert
3. UNBELEGTE ANNAHMEN     — 10 Annahmen mit Status-Labels (BEWIESEN / NICHT BELEGT / REINE ANNAHME)
4. WIDERSPRÜCHE           — 6 Spannungsfelder mit konkreter Entschärfungs-Empfehlung
5. PITCH CLAIM AUDIT      — Was man sagen darf vs. was zu gross ist (4 Gruppen)
6. PROOF CHECKLIST        — Was vor Investorengesprächen bewiesen werden muss
7. 30-TAGE DE-RISKING     — 10 konkrete Schritte, 5 Tests, 5 Kennzahlen
8. STRATEGISCHE EMPFEHLUNG — Fokus-Cut, 2-Versionen-Strategie, Modellentscheidung
```

## Design

- Gleicher Stil wie `/investoren`: Badge-Header, Cards, Teal/Orange Palette
- Status-Labels als farbige Badges: BEWIESEN (grün), PLAUSIBEL (gelb), NICHT BELEGT (rot), RISIKO (orange)
- Severity-Ratings als visuelle Balken (1-5)
- Collapsible Sections für Tiefe ohne Überforderung
- Kein Scroll-Marathon: Tabs wo sinnvoll (z.B. Kill Points nach Kategorie)

## Quellen-Integration

Alle Punkte werden mit Quellen-Labels versehen:
- `[ANALYSE 1]` — Erste VC-Kritik (7 tödliche Schwachstellen)
- `[ANALYSE 2]` — Deep Dive (Core Failure Points, Assumption Stress Test)
- `[ANALYSE 3]` — Investor Readiness (Gap Map, Pitch Claim Audit)
- `[FEEDBACK]` — Das aktuelle Meta-Feedback (Tonalität-Korrekturen, Fokus-Cut)

## Dateien

| Aktion | Datei |
|--------|-------|
| Create | `src/pages/FeedbackAnalysis.tsx` — Hauptseite mit allen 8 Blöcken |
| Edit | `src/App.tsx` — Route `/feedback` + lazy import |

## Technisch
- Standalone-Seite, keine Abhängigkeit von Investoren-Komponenten
- Framer Motion für ScrollReveal
- Responsive Cards + Collapsible Accordions
- Alle Inhalte hardcoded (kein DB nötig — internes Dokument)
- Back-Button zu `/investoren`

