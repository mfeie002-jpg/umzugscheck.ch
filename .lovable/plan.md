

# Infographic-Upgrade: Von Text+Icons zu echten Systemgrafiken

## Bestandsaufnahme

### Was bereits als SVG-Infografik existiert (gut)
- Revenue Waterfall (InvestorInfographics3) ✅
- TAM/SAM/SOM Kreise (InvestorInfographics3) ✅
- Break-Even Pfad (InvestorInfographics3) ✅
- Platform Flywheel (InvestorInfographics) ✅
- Funnel Flow Diagram (InvestorInfographics) ✅
- Investment Gauge / Tranchen-Bar (InvestorInfographics2) ✅
- SEO Pipeline (InvestorInfographics2) ✅
- Tier Pyramid (InvestorInfographics2) ✅
- Risk-Reward Scale (InvestorInfographics2) ✅
- 5-Run Progress (InvestorInfographics) ✅
- Funding Milestone Timeline (FundingMilestoneTimeline) ✅
- Growth PR Story/Outreach/Flywheel/Awards (GrowthPRStrategySection) ✅
- Competitive Moat Shield (InvestorInfographics2) ✅

### Was noch reine Text+Icon-Karten ist (Upgrade nötig)

| # | Sektion | Aktuell | Fehlt |
|---|---------|---------|-------|
| 1 | **Hero** | Stock-Foto + Text | Master-Systemgrafik (Google→Hub→WhatsApp→KI→Offerte) |
| 2 | **Top-7 Nuclear Wow** (WhyInvestSection) | Lucide-Icons + Textkarten | 7 Mini-Illustrationen pro Karte |
| 3 | **Already Live Proof** | Icons + Text-Cards | Echte WhatsApp/UI-Mockup-Screenshots |
| 4 | **Modularer Warenkorb** | Icon-Liste mit Preisen | Visueller "Build Your Order" Stack-Chart |
| 5 | **KI/Automation Workload** | Text-Behauptung "95% KI" | Before/After Prozessleiste (Mensch vs KI) |
| 6 | **60 Flows Testing Engine** | Text "60 Funnel-Varianten" | Flow-Matrix Grid Visual |
| 7 | **Schweiz Territory Map** | Keine Karte | SVG-Karte mit Abdeckungs-Layern |
| 8 | **Overkill Vision / Moonshot** | Text-Cards + Icons | Status-Badges (Live/Buildable/Future) fehlen |

---

## Plan: 8 neue SVG-Infografiken

### 1. Master System Hero Graphic
**File:** Neues `src/components/vision/HeroSystemGraphic.tsx`
**Integration:** In `VisionEmotionalHero.tsx` unterhalb der Stats-Cards (nur variant="investor")
**Inhalt:** Horizontaler Flow als SVG:
- Links: Google/SEO/Map-Pins → Mitte: Umzugscheck Hub → Rechts: WhatsApp + KI-Engine → Unten: Offerten/Partner/Services
- Isometrisch-clean, dunkler Hintergrund, Interface-Cards
- Labels direkt im SVG

### 2. Top-7 Nuclear Wow Mini-Visuals
**File:** Neues `src/components/vision/NuclearWowVisuals.tsx`
**Integration:** In `WhyInvestSection.tsx` — jede nuclear-wow Karte bekommt ein SVG-Visual statt nur Icon
**7 SVGs:**
- Schweiz-Karte mit Umzugspfeilen ("Markt der nie weggeht")
- Umzugskarton mit herauswachsenden Services ("Umzug ist nur der Anfang")
- SERP/Search-View mit Umzugscheck dominant ("SEO kontrolliert Eingang")
- Gemeinde-Netz auf Schweiz-Silhouette ("Wir kartieren den Markt")
- Mensch+KI-Module ("95% KI skalierbar")
- Interface-Flow Google→WhatsApp→Offerte ("Von Google zur Offerte")
- Service-Stack ("Nicht nur was man muss, sondern was es gibt")

### 3. Already Live Proof Mockups
**File:** Neues `src/components/vision/ProofMockups.tsx`
**Integration:** In `AlreadyLiveSection.tsx` — 4 UI-Mockup SVGs statt Icon-Cards
**4 Mockups:**
- WhatsApp Business Profil/Katalog
- Service-Auswahl im Chat
- KI-Qualifizierung Chat-Ansicht
- Backend Approval Screen

### 4. Modularer Warenkorb Stack-Chart
**File:** Neues `src/components/vision/WarenkorbStackChart.tsx`
**Integration:** In `ModularerWarenkorbSection.tsx` — SVG neben den bestehenden Cards
**Inhalt:** Links aufeinander gestapelte Service-Blöcke, rechts steigender Gesamtwert-Balken mit "CHF 2'660+" prominent

### 5. KI Workload Before/After
**File:** Neues `src/components/vision/AIWorkloadComparison.tsx`
**Integration:** Neue Sub-Sektion innerhalb oder nach WhyInvestSection (AI-Block) oder als eigene Sektion
**Inhalt:** Zwei horizontale Prozessleisten:
- "Traditionell": 8-10 manuelle Schritte (rot)
- "Umzugscheck": 4 Touchpoints, KI übernimmt Rest (grün/teal)
- Rechts: Donut-Chart 80% KI / 20% Mensch

### 6. 60 Flows Testing Matrix
**File:** Neues `src/components/vision/FlowTestingMatrix.tsx`
**Integration:** In `AlreadyLiveSection.tsx` oder als eigene Sub-Sektion
**Inhalt:** Grid aus ~60 Mini-Kacheln (gruppiert), Top-10 hervorgehoben, Rest als Pattern. Titel: "60 Funnel-Varianten. Systematisch getestet."

### 7. Swiss Territory Map
**File:** Neues `src/components/vision/SwissCoverageMap.tsx`
**Integration:** In `MarketPotentialSection.tsx` oder `SEOContentMoatSection.tsx`
**Inhalt:** Vereinfachte Schweiz-Silhouette mit:
- Farbige Punkte/Regionen: live / building / target
- Service-Layer-Legende (Umzug, Reinigung, Räumung)
- "2'110 Gemeinden" prominent

### 8. Moonshot Status-Badges
**File:** Update `OverkillVisionSection.tsx`
**Inhalt:** Jede Tech-USP-Card bekommt ein farbiges Badge:
- 🟢 "Live" / 🟡 "Buildable Now" / 🔮 "Future Layer"
- Visuell klar abgrenzen was Realität vs Vision ist

---

## Technisch

| Aspekt | Detail |
|--------|--------|
| **SVG-Standard** | Reines SVG + Framer Motion, viewBox-basiert, responsive |
| **Farben** | Brand-Tokens: Teal `#008080`, Orange `#FF6B1A`, Slate-Töne |
| **Text im Bild** | Titel, Labels, Zahlen, Legenden als SVG `<text>` |
| **Konsistenz** | Gleicher Stil wie bestehende InvestorInfographics 1-3 |
| **Reihenfolge** | Phase 1 zuerst (Hero, Proof, Warenkorb, Workload, Flows), dann Phase 2 (Territory, Nuclear Wow, Moonshot) |

## Umsetzungs-Reihenfolge

**Batch 1** (grösster Impact):
1. Master System Hero
2. Warenkorb Stack-Chart
3. KI Workload Before/After
4. Already Live Proof Mockups

**Batch 2**:
5. 60 Flows Testing Matrix
6. Swiss Territory Map

**Batch 3**:
7. Top-7 Nuclear Wow Mini-Visuals
8. Moonshot Status-Badges

