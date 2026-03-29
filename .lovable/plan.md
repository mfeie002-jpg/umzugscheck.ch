

# Status & Plan: Investoren-Seite erweitern

## Aktueller Stand

**Funding Roadmap IST drin** — Zeile 348-351 in `InvestorenLanding.tsx`. Die `FundingRoadmapSection` mit den CHF 60k / 3 Tranchen (15k/20k/25k) wird korrekt nach der ExitTimeline gerendert.

**Municipality SEO Moat FEHLT komplett** — Es gibt keine Sektion auf `/investoren`, die das 2'110-Gemeinden-Programm, die AI-Agent-Pipeline oder die 10 Content-Marketing-Projekte zeigt. Du hast recht: das ist einer der staerksten USPs fuer einen Investor (technischer Moat, 95% Automation, organischer Traffic-Flywheel).

---

## Was wird gebaut

**Neue Datei:** `src/components/vision/SEOContentMoatSection.tsx`

**Platzierung:** Nach FundingRoadmap (Zeile 351), vor Jokes — als Sektion 15.

### Sektionen der Komponente:

1. **Header** — Badge "Technical Moat" + Titel "2'110 Gemeinden. 1 System." + Subline ueber programmatische SEO-Dominanz

2. **KPI-Leiste (4 Karten)**
   - 2'110 Ziel-Gemeinden
   - 26 Kantone als Hubs
   - 10 Content-Projekte
   - 95% Automation

3. **Pipeline-Visualisierung** — Horizontaler Flow:
   `Scrape → Enrich → Draft → QA → Publish → Monitor`
   Zeigt wie die AI-Agents die Seiten automatisch erstellen

4. **Die 10 Projekte als kompakte Liste/Grid** (Top 5 hervorgehoben):
   - Swiss Relocation Command Center
   - Swiss Move Cost Index
   - Personalized Move Plan Generator
   - Interactive Calculators
   - Data-driven Infographics
   - (5 weitere collapsed/kleiner)

5. **Competitive Moat Box** — Warum das schwer kopierbar ist:
   - "2'110 lokale Landing Pages mit echten Gemeindedaten"
   - "AI-Pipeline: 15h Setup → automatische Skalierung"
   - "Backlinks von Gemeinden, Expat-Guides, Medien"
   - "Organischer Traffic-Flywheel ohne laufende Ad-Kosten"

6. **Rollout-Timeline** (3 Phasen):
   - Phase 1 (M1-3): 26 Kantone + Top 50 Gemeinden
   - Phase 2 (M4-6): 250+ Gemeinden + Cost Index + PR
   - Phase 3 (M7-9): 500+ Gemeinden + Full Automation

### Styling:
- Gleicher Stack wie FundingRoadmap: Tailwind + Framer Motion `whileInView`
- Lucide Icons (Globe, MapPin, Bot, Search, Database, Zap)
- Responsive: Mobile stacked, Desktop grid
- Navy/Blau Farbschema passend zum Rest

## Integration

In `InvestorenLanding.tsx` nach FundingRoadmap (Zeile 351):

```tsx
import { SEOContentMoatSection } from "@/components/vision/SEOContentMoatSection";
// ...
{/* 15. SEO & CONTENT MOAT */}
<ScrollReveal>
  <SEOContentMoatSection language={language} />
</ScrollReveal>
```

## Dateien

| Datei | Aktion |
|---|---|
| `src/components/vision/SEOContentMoatSection.tsx` | Neu erstellen |
| `src/pages/InvestorenLanding.tsx` | Import + einfuegen nach Zeile 351 |

