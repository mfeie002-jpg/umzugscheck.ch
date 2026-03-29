

# FundingRoadmapSection ersetzen mit neuem HTML-Design

## Was passiert

Die bestehende `FundingRoadmapSection.tsx` wird komplett neu gebaut, basierend auf dem hochgeladenen HTML-Design. Das neue Design ist deutlich professioneller mit:

- **CHF 70'000** Gesamtbedarf (statt 80k)
- **3 Tranchen**: 20k (Validation) → 25k (Traction) → 25k (Scale to Break-even)
- **Timeline-Layout** mit vertikaler Linie und farbigen Dots
- **Risk-Grid**: 2-spaltig (Risikobegrenzung + Kein Gründerlohn)
- **Break-even Projektion**: Monat 3/6/9/12-15 Revenue-Pfad
- **CTA**: "Interesse an einem Gespräch?"

## Aenderungen am FUNDING Config

| Feld | Alt | Neu |
|------|-----|-----|
| total | 80'000 | 70'000 |
| Tranche 1 | 20k / Proof of Concept | 20k / Validation / Monat 1–4 |
| Tranche 2 | 25k / Scale-up | 25k / Traction / Monat 5–9 |
| Tranche 3 | 35k / Break-Even Capital | 25k / Scale to Break-even / Monat 10–15 |
| Horizont | 6–9 Monate | 12–18 Monate |

## Neue Elemente (aus HTML)

1. **Timeline-Design**: Vertikale Linie links, farbige Dots (blau/amber/grün), Cards rechts
2. **Tranche-Cards**: Phase-Label, Titel, Betrag, Beschreibung, Use-Tags (Pills), Milestone-Checkliste
3. **Risk-Grid**: Zwei Cards mit Left-Border-Accent (grün/blau)
4. **Break-even Card**: Monatliche Revenue-Projektion (500 → 1'800 → 3'200 → 5'000+)
5. **CTA-Box**: Navy-Gradient mit "Kontakt aufnehmen" Button

## Neue Milestones pro Tranche

**T1**: 15–20 Firmen aktiv, 50–100 Leads, CPL <25 CHF, Erste Provisionen
**T2**: CHF 1'500–2'500 Umsatz/Monat, 200+ Leads, Retention bestätigt, Break-even Pfad
**T3**: CHF 4'000–5'000 deckt Kosten, Positiver ROI, Selbsttragend

## Dateien

| Datei | Aktion |
|---|---|
| `src/components/vision/FundingRoadmapSection.tsx` | Komplett neu — HTML-Design als React/Tailwind mit Framer Motion |

Keine Aenderung an InvestorenLanding.tsx noetig — Import bleibt gleich.

