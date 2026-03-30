

# Batch 2 + 3: Remaining Infographics

## Status
- **Done**: Hero System Graphic, Warenkorb Stack-Chart, AI Workload Comparison, Proof Mockups ✅
- **TODO**: 4 remaining infographic components

## Batch 2: Flow Matrix + Swiss Territory Map

### 1. FlowTestingMatrix (`src/components/vision/FlowTestingMatrix.tsx`)
- SVG grid of ~60 mini-tiles grouped by funnel type (SEO, WhatsApp, Rechner, Vergleich, Regional, B2B)
- Top-10 "Winner" flows highlighted in teal, rest as subtle pattern tiles
- Title embedded: "60 Funnel-Varianten. Systematisch getestet."
- Stats bar: "12 Archetypen · 60 Varianten · Top-10 identifiziert"
- **Integration**: In `AlreadyLiveSection.tsx` after ProofMockups

### 2. SwissCoverageMap (`src/components/vision/SwissCoverageMap.tsx`)
- Simplified Switzerland silhouette (SVG path)
- Colored dots/regions: Live (green), Building (amber), Target (gray)
- Service layer legend: Umzug, Reinigung, Räumung, Entsorgung
- "2'110 Gemeinden" prominent, KPI bubbles below
- **Integration**: In `MarketPotentialSection.tsx`

## Batch 3: Nuclear Wow Visuals + Moonshot Badges

### 3. NuclearWowVisuals (`src/components/vision/NuclearWowVisuals.tsx`)
- 7 small SVG illustrations replacing icons in the Top-7 cards:
  1. Swiss map with moving arrows
  2. Box with services growing out
  3. SERP view with Umzugscheck dominant
  4. Municipality network on Swiss silhouette
  5. Human + AI modules
  6. Google→WhatsApp→Offerte flow
  7. Service stack layers
- **Integration**: In `WhyInvestSection.tsx`, nuclear-wow tier cards get SVG visual above text

### 4. Moonshot Status Badges (update `OverkillVisionSection.tsx`)
- Each tech-USP card gets a colored badge:
  - 🟢 "Live" (green) — items that exist
  - 🟡 "Buildable" (amber) — technically feasible now
  - 🔮 "Future" (purple) — vision layer
- Simple badge addition to existing card rendering

## Technical Approach
- Pure SVG + Framer Motion, viewBox-based, responsive
- Brand tokens: Teal `#008080`, Orange `#FF6B1A`, Slate tones
- All text/labels as SVG `<text>` elements (infographic standard)
- Same visual language as Batch 1 components

## Files to Create/Edit
| Action | File |
|--------|------|
| Create | `src/components/vision/FlowTestingMatrix.tsx` |
| Create | `src/components/vision/SwissCoverageMap.tsx` |
| Create | `src/components/vision/NuclearWowVisuals.tsx` |
| Edit | `src/components/vision/AlreadyLiveSection.tsx` (add FlowTestingMatrix) |
| Edit | `src/components/vision/MarketPotentialSection.tsx` (add SwissCoverageMap) |
| Edit | `src/components/vision/WhyInvestSection.tsx` (add NuclearWowVisuals) |
| Edit | `src/components/vision/OverkillVisionSection.tsx` (add status badges) |

