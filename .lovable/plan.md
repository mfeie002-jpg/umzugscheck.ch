

# Funding Roadmap Section auf /investoren einbauen

## Kontext

Morgen ist ein Investor-Meeting. Die `/investoren`-Seite braucht eine visuelle, professionelle **Funding Roadmap**, die den CHF-Ask, Tranchen und Milestones auf einen Blick zeigt. Basierend auf der Konversation mit allen AI-Agents konsolidiere ich die Zahlen.

## Konsolidierte Zahlen

Die Empfehlungen der verschiedenen Agents reichen von CHF 55k bis 200k. Ich baue die Komponente **flexibel mit den Zahlen aus der letzten Gemini-Empfehlung (CHF 60k: 15k/20k/25k)** als Default, da diese am konservativsten und für ein erstes Angel-Gespräch am glaubwürdigsten sind. Die Komponente wird so gebaut, dass die Zahlen leicht anpassbar sind (als Konstanten oben in der Datei).

## Was wird gebaut

**Neue Datei:** `src/components/vision/FundingRoadmapSection.tsx`

### Sektionen:

1. **Header** — Badge "Pre-Seed Funding" + Titel "CHF 60'000 bis zur Selbsttragfähigkeit" + Subline
2. **3 KPI-Karten** — Gesamtbedarf (60k) | Max. Erst-Risiko (15k) | Zeithorizont (6-8 Monate)
3. **3 Tranchen-Timeline** mit vertikaler Linie:
   - **Tranche 1 "Launchpad" (15k)** — GmbH, ERP v2, initiales Setup. Status: Blau/Aktiv
   - **Tranche 2 "Scale-up" (20k)** — 15 Quotes/8 Jobs pro Monat bewiesen → Ads skalieren. Status: Amber/Locked
   - **Tranche 3 "Sustainability" (25k)** — 15k Umsatz/Monat → Automatisierung, Selbsttragfähigkeit. Status: Gruen/Locked
   - Jede Karte mit Milestone-Checkliste als Unlock-Bedingung
4. **Risk-Cards** (2er Grid) — Risikobegrenzung (max 15k) + Skin in the Game (kein Lohn)
5. **Finanzierungslogik-Box** — Zeigt die CHF 1'590 Marge → ~990 Reinvest Mechanik
6. **CTA** — "Interesse an einem Gespräch?" mit Kontakt-Link

### Styling:
- Tailwind + Framer Motion `whileInView` (wie alle anderen Vision-Sektionen)
- Lucide Icons (Shield, Lock, Unlock, TrendingUp, Target, Rocket)
- Responsive: Mobile stacked, Desktop 3-column grid
- Farbkodierung: Blau (aktiv), Amber (locked), Gruen (Ziel)
- Timeline-Linie via CSS pseudo-elements

## Integration

In `src/pages/InvestorenLanding.tsx` nach ExitTimeline (Zeile 345) und vor Jokes (Zeile 347):

```tsx
import { FundingRoadmapSection } from "@/components/vision/FundingRoadmapSection";
// ...
<ScrollReveal><FundingRoadmapSection language={language} /></ScrollReveal>
```

## Dateien

| Datei | Aktion |
|---|---|
| `src/components/vision/FundingRoadmapSection.tsx` | Neu erstellen |
| `src/pages/InvestorenLanding.tsx` | Import + einfuegen Zeile 345 |

