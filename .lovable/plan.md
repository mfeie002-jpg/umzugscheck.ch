

# Market Deep Dive Section auf /investoren

## Was gebaut wird

Eine neue, datenreiche **MarketDeepDiveSection** Komponente die das komplette Deep Research als visuelles Investment-Argument praesentiert. Platzierung: nach Market Potential (Sektion 11), vor Uniqueness (Sektion 12) — denn es liefert den Beweis fuer beides.

## Struktur der Komponente

Die Sektion besteht aus 5 visuellen Bloecken:

### Block 1: Marktgroesse mit harten Zahlen
- CHF 500M–1B TAM
- 697'000 Umzuege/Jahr (BFS 2024)
- 9.3% Mobilitaetsrate
- 130'000–200'000 professionelle Umzuege
- Durchschnittliche Kosten: CHF 1'200–1'750 (Umzug) + CHF 500–2'000 (Reinigung)
- Regionale Preisunterschiede (Zug >CHF 2'000, DE-CH +23% vs Romandie)

### Block 2: Wettbewerbs-Landschaft (nach MOVU-MoveAgain Merger)
Visuelle Vergleichstabelle: MOVU vs MoveAgain vs Comparis vs Ofri vs Umzugscheck
- Zeigt Schwaechen jedes Konkurrenten (keine Haftung, Inkasso-Probleme, kein Vetting)
- Umzugscheck-Spalte zeigt gruene Checkmarks ueberall
- Badge: "MOVU-MoveAgain Merger Sept 2025 = Near-Monopoly mit geerbten Problemen"

### Block 3: 7 Schmerzpunkte der Konsumenten
Kompakte Cards mit Icons:
1. Preisopazitaet (30-50% Varianz)
2. Null Qualitaetshaftung (CHF 17.50 fuer Schaeden)
3. Wohnungsuebergabe-Stress
4. Kurze Planungszeit (42% <30 Tage)
5. Sprachbarrieren
6. Keine digitalen Standards
7. Keine Lizenzpflicht

### Block 4: Digitale Luecken = Unsere Chance
- Keine Echtzeit-Verfuegbarkeit
- Kein Gemeinde-Daten-Hub (2'110 Gemeinden)
- FR/IT/EN massiv unterversorgt
- Cash-only Branche
- Keine App

### Block 5: 21 Wettbewerbsvorteile (Accordion/Grid)
Gruppiert in 5 Kategorien:
- Daten-Moats (Gemeinde-DB, Kosten-Benchmarks, Kantons-Navigator)
- Trust & Garantien (Geld-zurueck, Dispute Resolution, Preisdeckel, Mystery Shopping)
- Oekosystem (Adresswechsel, Reinigung+Abnahme, Moebel-Lifecycle, Versicherung)
- Unterversorgte Segmente (4-Sprachen, Expat-Modul, Senioren)
- Digital-First Features (AI Volume Scan, Echtzeit-Kalender, Uebergabe-App, Steuer-Rechner, Green Moving, B2B, Community)

Jeder Vorteil: Titel + 1-Satz-Beschreibung + "Kein Konkurrent hat das" Badge

### Header & Footer
- Badge: "DEEP RESEARCH — Verifizierte Marktdaten"
- Header: "CHF 500M+ Markt mit Vertrauenskrise — und 21 exploitable Luecken"
- Footer: "Quellen: BFS 2024, SRF Kassensturz, Comparis, Trustpilot, Handelszeitung"

## Design
- Dunkler/serioeser Ton (research-vibes) mit accent-farbe fuer Key Stats
- Animierte Counter fuer grosse Zahlen
- Competitor-Table mit rot/gruen Farbcodierung
- Collapsible Sections damit es nicht erschlaegt

## Dateien

| Datei | Aktion |
|---|---|
| `src/components/vision/MarketDeepDiveSection.tsx` | Neu — alle 5 Bloecke |
| `src/pages/InvestorenLanding.tsx` | Import + einfuegen nach MarketPotentialSection (Zeile 336) |

