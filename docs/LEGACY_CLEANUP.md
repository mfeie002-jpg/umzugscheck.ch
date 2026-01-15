# Legacy Region Components - Cleanup Documentation

## Overview

This document identifies legacy region-specific components that have been superseded by the new unified Region-Archetyp system.

## Old Structure (To Be Deprecated)

### Bern-specific Components (`src/components/bern/`)
These 20 components were hardcoded for Bern and should be replaced by:
- `RegionHero` - replaces `BernStatsCounter`, `BernUrgencyBanner`, etc.
- `RegionCompanyList` - replaces `BernCompanyFilters`, `BernServiceComparison`
- `RegionFAQ` - replaces `BernChecklist`
- `RegionTrustSignals` - replaces `BernTrustSignals`, `BernSocialProof`, `BernTestimonials`
- `RegionInternalLinks` - replaces `BernRelatedServices`

Files to deprecate:
- BernBreadcrumb.tsx (use Breadcrumbs component with region data)
- BernChecklist.tsx (use RegionFAQ)
- BernCompanyFilters.tsx (use RegionCompanyList)
- BernContactSection.tsx (use RegionCTA)
- BernInteractiveMap.tsx (use SwitzerlandMap with region highlight)
- BernMovingTips.tsx (use RegionFAQ)
- BernNewsletter.tsx (generic newsletter component)
- BernPartnersSection.tsx (use RegionCompanyList)
- BernPriceCalculatorMini.tsx (use shared calculator)
- BernQuickActions.tsx (use RegionCTA)
- BernRelatedServices.tsx (use RegionInternalLinks)
- BernReviewsShowcase.tsx (use RegionCompanyList cards)
- BernServiceComparison.tsx (use RegionCompanyList)
- BernSocialProof.tsx (use RegionTrustSignals)
- BernStatsCounter.tsx (integrated into RegionHero)
- BernTestimonials.tsx (use RegionTrustSignals)
- BernTrustSignals.tsx (use RegionTrustSignals)
- BernUrgencyBanner.tsx (use RegionHero with urgency prop)
- BernVideoSection.tsx (optional enhancement)
- BernWeatherWidget.tsx (optional enhancement)

### Zürich-specific Components (`src/components/zuerich/`)
Same pattern - 21 components that duplicate Bern components.

### Old Page Files
- `src/pages/umzugsfirmen/zuerich/v1.tsx` - old version, kept for comparison
- `src/pages/CityMovers.tsx` - old approach, now use dynamic `/umzugsfirmen/:slug`

## New Unified Structure

### Data Layer
- `src/data/regions-database.ts` - Single source of truth for all 26 cantons

### Components (`src/components/region-archetyp/`)
- `RegionHero.tsx` - Dynamic hero with stats, trust signals
- `RegionCompanyList.tsx` - Filterable company cards
- `RegionFAQ.tsx` - SEO-optimized FAQs
- `RegionCTA.tsx` - Conversion-optimized CTAs
- `RegionTrustSignals.tsx` - Social proof & testimonials
- `RegionInternalLinks.tsx` - SEO internal linking
- `RegionSEO.tsx` - Meta tags & structured data
- `PillarPageSEO.tsx` - Hub page SEO
- `LazySection.tsx` - Performance optimization

### Pages
- `src/pages/UmzugsfirmenSchweizPillar.tsx` - Hub page
- `src/pages/RegionPageUnified.tsx` - Dynamic canton pages

### Hooks & Utils
- `src/hooks/useRegionTracking.ts` - Analytics tracking
- `src/lib/region-analytics.ts` - Region-specific analytics

## Migration Steps

1. ✅ Data layer created (regions-database.ts)
2. ✅ Archetyp components created
3. ✅ Dynamic routing implemented
4. ✅ Pillar page created
5. ✅ Analytics integration
6. ⏳ Remove old components (manual review recommended)
7. ⏳ Update any remaining references

## Cleanup Recommendations

### Safe to Delete (after verification)
- `src/components/bern/*` - All 20 files
- `src/components/zuerich/*` - All 21 files

### Keep for Reference
- `src/pages/umzugsfirmen/zuerich/v1.tsx` - Useful for A/B testing comparison

### Requires Review
- `src/pages/CityMovers.tsx` - Check if still in use
- `src/pages/Regionen.tsx` - May redirect to pillar page

## Benefits of New Structure

1. **DRY Principle**: One set of components for all 26 cantons
2. **Maintainability**: Update once, apply everywhere
3. **SEO Consistency**: Same structured data across all regions
4. **Performance**: Lazy loading, code splitting
5. **Analytics**: Unified tracking across all region pages
6. **Scalability**: Easy to add cities within cantons
