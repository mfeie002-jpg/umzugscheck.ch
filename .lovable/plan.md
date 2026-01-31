
# Social Proof A/B Testing Issues & Recommendations

## Problem Analysis

### Issue 1: Only 6 of 17 Variants Are Actually Different

The `TrustRibbonAB` component (which is used on the homepage) maps **17 variants (A-Q)** but only renders **6 distinct components**:

```
┌─────────┬────────────────────────────┬────────────────────────┐
│ Variant │ Label                      │ Actual Component       │
├─────────┼────────────────────────────┼────────────────────────┤
│ A       │ V1: Original               │ TrustRibbon           │
│ B       │ V2: Live Dashboard         │ TrustRibbonVariantB   │
│ C       │ V3: Trust Hierarchy        │ TrustRibbonVariantC   │
│ D       │ V4: Trust Stack            │ TrustRibbonVariantD   │
│ E       │ V5: Trust Strip 2.0        │ TrustRibbonVariantE   │
│ F       │ V6: Verifiable Trust       │ TrustRibbonVariantF   │
├─────────┼────────────────────────────┼────────────────────────┤
│ G-Q     │ V7-V17                     │ ALL → TrustRibbonVariantF │
└─────────┴────────────────────────────┴────────────────────────┘
```

**Result:** When you switch from V7 to V17, nothing changes because they all render the same `TrustRibbonVariantF`.

### Issue 2: MediaLogosSectionAB is Never Used

There's a comprehensive `MediaLogosSectionAB` component with 28 variants (including variants G-AB), but it's **not imported or used anywhere on the homepage**. The homepage uses `TrustRibbonAB` instead.

### Issue 3: Hero-Integrated Variants Need Hero Variant A

Variants I-M and Q are designed for "Hero-Integrated" trust signals, but they only work when:
- **Homepage Hero = A** (HeroVariantOriginal)
- NOT when Hero = C (SmartRouter) which is the default

The `HeroVariantOriginal.tsx` correctly checks the social proof variant and conditionally renders trust elements inside the hero:
```typescript
const showHeroTrust = ['I', 'J', 'K', 'L', 'M', 'Q'].includes(spVariant);
```

But if you're on Hero C (SmartRouter), these variants won't show their hero-integrated features.

---

## Fix Plan

### Step 1: Create Unique TrustRibbon Components for V7-V17

Currently missing components that need to be created:

| Variant | Component Needed | Description |
|---------|------------------|-------------|
| G | TrustRibbonVariantG | Swiss Infrastructure (eUmzugCH, Post, ASTAG) |
| H | TrustRibbonVariantH | Minimal Proof Strip (Grayscale only) |
| I-M | Minimal section | Hero-integrated (trust shown IN hero, minimal below) |
| N | TrustRibbonVariantN | Bandwagon Effect (Live Activity) |
| O | TrustRibbonVariantO | Local Trust (Regional Badges) |
| P | TrustRibbonVariantP | Data Security (SSL/GDPR focus) |
| Q | Minimal section | In-Form Container (trust inside form) |

### Step 2: Update TrustRibbonAB Switch Statement

Modify `src/components/trust/TrustRibbonAB.tsx` to route each variant to its unique component instead of falling back to VariantF.

### Step 3: Document Hero + Social Pairing

For variants I-M and Q, the user needs to set **Homepage Hero = A** for the hero-integrated trust to appear.

---

## My Recommendations

### Best Combination for Maximum Conversion

Based on the implemented patterns and CRO research:

| Category | Recommended Variant | Reason |
|----------|---------------------|--------|
| **1. Hero** | **B (Premium 4-Tab)** | Offers multiple entry points (Form/Video/Chat/WA), reduces friction |
| **2. Navigation** | **V10 (Golden Navigation)** | 5 aligned items with submenus, paired with Golden Flow |
| **3. Social Proof** | **I (Card CTA Trust)** 🎯 | Trust signals directly at the CTA decision point (Gatekeeper Moment) |
| **4. Tab Hints** | **C (Label oben)** | Clear visual hierarchy without being intrusive |

**Alternative Social Proof if using Hero C (SmartRouter):**
- **V2 (Live Dashboard)** - Best standalone section with live activity ticker
- **V4 (Trust Stack)** - Compact, high-density trust signals

### Why Variant I is Best (when paired with Hero A/B)

1. **Proximity to CTA**: Trust signals appear exactly where hesitation occurs
2. **100% Above-Fold**: User sees SRF, NZZ, TCS logos while entering data
3. **Mobile-Optimized**: Top 3 logos + '+X' counter for clean UI
4. **Research-Backed**: "Reassurance at the Gatekeeper Moment" pattern

### Visual Reference from Your Screenshot

The second uploaded image shows exactly what V9 (Card CTA Trust) looks like:
- "Vertrauen Sie dem Marktführer – bekannt aus:"
- SRF | TCS | NZZ | 20min | BLICK
- ★ 4.8/5 • 15'000+ Umzüge

This is the **V9 (I) Card CTA Trust** pattern implemented in `HeroVariantOriginal.tsx` via the `KnownFromRow` component.

---

## Summary

| Problem | Root Cause | Solution |
|---------|------------|----------|
| V7-V17 don't change | TrustRibbonAB maps all to VariantF | Create unique components for each |
| Hero-integrated variants invisible | Hero = C (SmartRouter), not A | Set Hero to A to see I-M, Q variants |
| MediaLogosSectionAB unused | Not imported in Index.tsx | Consider replacing TrustRibbonAB with MediaLogosSectionAB |

