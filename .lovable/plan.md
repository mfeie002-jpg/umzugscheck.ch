

# "Why Invest" Section auf /investoren

## Kontext

Die Seite hat bereits: Metrics, Relo-OS, Profitability, Traction, Pillars, Revenue Streams, Unit Economics, Market Potential, Uniqueness, Exit Timeline, Funding Roadmap, SEO Moat, SEO Market Size. Was fehlt: eine klare, kompakte **"Warum investieren?"**-Sektion die alle Argumente auf einen Blick zusammenfasst — der emotionale + rationale Closer.

## Was wird gebaut

**Neue Datei:** `src/components/vision/WhyInvestSection.tsx`

**Platzierung:** Nach SEOMarketSizeSection (Zeile 362), vor Jokes — als Sektion 17. Das ist die letzte inhaltliche Sektion vor dem Footer CTA, also der perfekte "Closer".

### Aufbau der Komponente:

1. **Header** — Badge "Investment Thesis" + Titel "Warum jetzt investieren?" + Subline

2. **6 Investment-Argumente als Cards** (2x3 Grid desktop, stacked mobile):
   - **Timing** — "450'000 Umzuege/Jahr, kein digitaler Marktfuehrer" + Schweizer Markt ist fragmentiert
   - **Unit Economics** — "CHF 553 Revenue pro Kunde bei 90%+ Marge" + kapitaleffizientes Modell
   - **Technical Moat** — "2'110 Gemeinde-SEO + AI-Pipeline = schwer kopierbar" + organischer Traffic-Flywheel
   - **Skin in the Game** — "Gruender arbeitet ohne Lohn, 100% reinvestiert" + maximale Alignment
   - **De-Risked Structure** — "Meilenstein-basierte Tranchen, max CHF 15k Erstrisiko" + Investor-Schutz
   - **Scalability** — "95% Automation, 6 Revenue Streams, Multi-Brand ready" + Plattform nicht Service

3. **Zusammenfassung-Box** — Kompaktes Statement:
   > "CHF 60k Pre-Seed. 3 Tranchen. Klare Milestones. Break-even in 6-9 Monaten. Kein Gruenderlohn. Der Schweizer Umzugsmarkt hat keinen digitalen Champion — wir bauen ihn."

### Styling:
- Framer Motion `whileInView` Animationen
- Lucide Icons (Clock, Calculator, Shield, Heart, Lock, Rocket)
- Cards mit leichtem Gradient und Icon-Akzent
- Navy/Primary Farbschema passend zum Rest
- Responsive: Mobile stacked, Desktop 2x3 grid

## Integration

In `InvestorenLanding.tsx` nach SEOMarketSizeSection (Zeile 363):

```tsx
import { WhyInvestSection } from "@/components/vision/WhyInvestSection";
// ...
{/* 17. WHY INVEST — Investment Thesis Summary */}
<ScrollReveal>
  <WhyInvestSection language={language} />
</ScrollReveal>
```

## Dateien

| Datei | Aktion |
|---|---|
| `src/components/vision/WhyInvestSection.tsx` | Neu erstellen |
| `src/pages/InvestorenLanding.tsx` | Import + einfuegen nach Zeile 363 |

