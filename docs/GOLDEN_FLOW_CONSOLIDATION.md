# Golden Flow Consolidation Plan

## Status: Phase 1 Implementation

## Executive Summary

Adding a new optimized **Golden Flow** (V10) based on V9 Zero Friction principles with V1's proven conversion patterns. All existing variants are **kept for A/B testing**.

---

## 1. Current State Analysis

### Variant Inventory (All Kept for A/B Testing)

#### Individual Page Files (40+) - KEPT
```
src/pages/
├── UmzugsoffertenV1.tsx          → KEEP (A/B testing)
├── UmzugsoffertenV1a.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV1b.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV1c.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV1d.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV1e.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV1f.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV1g.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV2a.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV2b.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV2e.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV2Archetyp.tsx  → KEEP (A/B testing)
├── UmzugsoffertenV3a.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV3b.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV3c.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV3d.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV3e.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV4a.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV4b.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV4c.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV4d.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV4e.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV5a.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV5b.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV5c.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV5d.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV5e.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV8a.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV9a.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV9b.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV9c.tsx         → KEEP (A/B testing)
├── UmzugsoffertenV9D.tsx         → KEEP (A/B testing)
├── V9ZeroFriction.tsx            → KEEP (A/B testing)
├── UmzugsoffertenBaseline.tsx    → KEEP (A/B testing)
├── UmzugsoffertenDynamic.tsx     → KEEP (A/B testing)
├── UmzugsoffertenVariant.tsx     → KEEP (A/B testing)
├── UmzugsoffertenUltimate.tsx    → KEEP (dynamic loading)
├── UmzugsoffertenUltimateCH.tsx  → KEEP (A/B testing)
├── UltimateBest36.tsx            → KEEP (A/B testing)
└── GoldenFlowV10.tsx             → NEW (Golden Flow entry point)
```

#### Component Folders to Consolidate
```
src/components/
├── funnel-v1/           → KEEP (Golden Flow base)
├── funnel-v1b/          → DELETE (merge into funnel-v1)
├── funnel-v1d/          → DELETE
├── funnel-v1e/          → DELETE
├── funnel-v2e/          → DELETE
├── god-mode-v3/         → DELETE
├── video-first-v4/      → DELETE
├── marketplace-v5/      → DELETE
├── ultimate-v6/         → DELETE
├── swissmove-v7/        → DELETE
├── decisionfree-v8/     → DELETE
├── zerofriction-v9/     → MERGE best into funnel-v1
├── calculator-variants/ → DELETE (all 25+ variants)
└── ultimate-flow/       → KEEP (for dynamic)
```

---

## 2. Golden Flow Architecture

### Target: 4-Step Flow (V9 Philosophy + V1 Conversion)

```
Step 1: Adressen (Zero Friction Start)
├── From PLZ (with city autocomplete)
├── To PLZ (with city autocomplete)
├── Instant price range preview
└── Trust badges (Schweizer Server, SSL, Keine Werbeanrufe)

Step 2: Details (Smart Defaults)
├── Room selector (visual, 1-6+)
├── Floor + Elevator toggle
├── Move date picker (with "flexible" option)
└── Price updates live

Step 3: Services (Expandable Cards)
├── Base move (always included)
├── Packing service (highlight: saves 1-2 days)
├── Cleaning (with guarantee badge)
├── Disposal
├── Storage
└── Price breakdown visible

Step 4: Contact (Trust-Optimized)
├── Name
├── Email
├── Phone (with "nur für Rückfragen" trust pill)
├── AGB + Datenschutz checkbox
├── Submit with loading animation
└── Labor illusion: "Firmen werden kontaktiert..."
```

### Key Features from Each Flow

| Feature | Source | Priority |
|---------|--------|----------|
| Instant price preview | V9 | ⭐⭐⭐ |
| Visual room selector | V1 | ⭐⭐⭐ |
| Expandable service cards | V1 | ⭐⭐⭐ |
| Trust pills per field | V1f/V1g | ⭐⭐ |
| Sticky mobile CTA | V1 | ⭐⭐⭐ |
| Labor illusion loading | V9 | ⭐⭐ |
| Smart defaults | V9 | ⭐⭐ |
| Progress bar (20% start) | Strategic | ⭐⭐ |

---

## 3. Implementation Plan

### Phase 1: Golden Flow Creation (Current)
- [x] Analyze current flows
- [x] Create new `GoldenFlowWizard.tsx` in `src/components/golden-flow/`
- [x] Implement 4-step flow with best patterns
- [x] Add mobile-first responsive design
- [x] Implement trust architecture
- [x] Register V10 in flowConfigs.ts
- [x] Create `/golden-flow-v10` route
- [ ] Google Places Autocomplete (pending API key)

### Phase 2: Route Consolidation
- [ ] Update `Umzugsofferten.tsx` to use GoldenFlow only
- [ ] Remove ?v= parameter handling
- [ ] Set up 301 redirects for old URLs
- [ ] Update internal links

### Phase 3: Cleanup
- [ ] Delete obsolete page files
- [ ] Delete obsolete component folders
- [ ] Update App.tsx routes
- [ ] Clean flowConfigs.ts

### Phase 4: Optimization
- [ ] Add Google Places Autocomplete (when API key added)
- [ ] Implement result teasing (Glimp method)
- [ ] Add labor illusion loading
- [ ] Performance optimization

---

## 4. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Conversion Rate | ~5% | 9%+ |
| Time to First Input | 3s | <1.5s |
| Bundle Size | ~2MB | <500KB |
| Flow Variants | 48 | 1 |
| Lighthouse Score | 75 | 95+ |

---

## 5. Rollback Plan

If Golden Flow underperforms:
1. Keep V1 MultiStepCalculator as fallback
2. A/B test: 90% Golden, 10% V1
3. Revert via feature flag if needed

---

## Notes

- Google Places API key pending user input
- Video AI inventory remains as optional enhancement
- Company selection step may be added in Phase 2 based on data
