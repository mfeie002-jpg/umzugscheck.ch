/**
 * HomepageHeroAB - A/B Wrapper for Homepage Hero
 * 
 * Renders:
 * - A: "Original" Split Layout (Screenshot-style with form card)
 * - B: "Premium" 4-Tab Hero (IndexPremium style)
 * - C: "SmartRouter" PLZ-first Wizard (current default)
 */

import { memo, lazy, Suspense } from 'react';
import { useHomepageAB } from '@/contexts/HomepageABContext';
import { SectionSkeleton } from '@/components/ui/skeleton-section';

// Lazy load the different hero variants
const HeroVariantOriginal = lazy(() => 
  import('@/components/homepage/HeroVariantOriginal').then(m => ({ default: m.HeroVariantOriginal }))
);
const PremiumHeroSection = lazy(() => 
  import('@/components/premium/PremiumHeroSection').then(m => ({ default: m.PremiumHeroSection }))
);

// SmartRouter imports (inline since it's the default)
import { SmartRouterWizard } from '@/components/smart-router';

const SmartRouterHero = memo(function SmartRouterHero() {
  return (
    <section className="relative bg-gradient-to-b from-background to-muted/30 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Smart Router Wizard - Social Proof is handled by TrustRibbonAB in Index.tsx */}
        <SmartRouterWizard />
      </div>
    </section>
  );
});

export const HomepageHeroAB = memo(function HomepageHeroAB() {
  const { variant } = useHomepageAB();
  
  switch (variant) {
    case 'A':
      return (
        <Suspense fallback={<SectionSkeleton height="min-h-[500px]" />}>
          <HeroVariantOriginal />
        </Suspense>
      );
    case 'B':
      return (
        <Suspense fallback={<SectionSkeleton height="min-h-[500px]" />}>
          <PremiumHeroSection />
        </Suspense>
      );
    case 'C':
    default:
      return <SmartRouterHero />;
  }
});
