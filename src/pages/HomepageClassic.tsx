/**
 * HomepageClassic - Original 20+ Sections Version
 * 
 * This page preserves the original homepage layout with all sections
 * for comparison with the optimized 11-section version.
 * 
 * Route: /homepage-classic
 */

import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import { SkipToContent } from "@/components/SkipToContent";
import { ErrorBoundary } from "@/components/homepage/ErrorBoundary";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { SocialProofABProvider } from "@/contexts/SocialProofABContext";
import { TabHintABProvider } from "@/contexts/TabHintABContext";
import { HomepageABProvider } from "@/contexts/HomepageABContext";
import { SectionSkeleton, TestimonialsSkeleton } from "@/components/ui/skeleton-section";
import { 
  HeroSkeleton, 
  CompanyCardsSkeleton, 
  TrustSkeleton 
} from "@/components/performance/CLSOptimizedSections";

// Hero
import { HomepageHeroAB } from "@/components/homepage/HomepageHeroAB";

// All original sections - lazy loaded
const TrustRibbonAB = lazy(() => import("@/components/trust/TrustRibbonAB").then(m => ({ default: m.TrustRibbonAB })));
const TrustBadges = lazy(() => import("@/components/homepage/TrustBadges").then(m => ({ default: m.TrustBadges })));
const TrustSeals = lazy(() => import("@/components/homepage/TrustSeals").then(m => ({ default: m.TrustSeals })));
const MediaLogosSection = lazy(() => import("@/components/homepage/MediaLogosSection").then(m => ({ default: m.MediaLogosSection })));
const TrustLogosAnimated = lazy(() => import("@/components/homepage/TrustLogosAnimated").then(m => ({ default: m.TrustLogosAnimated })));
const QualityStandardsBar = lazy(() => import("@/components/homepage/QualityStandardsBar").then(m => ({ default: m.QualityStandardsBar })));
const SpotlightTestimonial = lazy(() => import("@/components/homepage/SpotlightTestimonial").then(m => ({ default: m.SpotlightTestimonial })));
const VideoTestimonial = lazy(() => import("@/components/homepage/VideoTestimonial").then(m => ({ default: m.VideoTestimonial })));
const PainGainSection = lazy(() => import("@/components/homepage/PainGainSection").then(m => ({ default: m.PainGainSection })));
const EnhancedHowItWorks = lazy(() => import("@/components/homepage/EnhancedHowItWorks").then(m => ({ default: m.EnhancedHowItWorks })));
const CompanyComparisonSection = lazy(() => import("@/components/homepage/CompanyComparisonSection").then(m => ({ default: m.CompanyComparisonSection })));
const ServiceComparisonTable = lazy(() => import("@/components/homepage/ServiceComparisonTable").then(m => ({ default: m.ServiceComparisonTable })));
const CityPricesSection = lazy(() => import("@/components/homepage/CityPricesSection").then(m => ({ default: m.CityPricesSection })));
const EnhancedTestimonialsAB = lazy(() => import("@/components/homepage/EnhancedTestimonialsAB").then(m => ({ default: m.EnhancedTestimonialsAB })));
const TrustScoreWidget = lazy(() => import("@/components/homepage/TrustScoreWidget").then(m => ({ default: m.TrustScoreWidget })));
const SavingsCalculatorSimple = lazy(() => import("@/components/homepage/SavingsCalculatorSimple").then(m => ({ default: m.SavingsCalculatorSimple })));
const GuaranteesSection = lazy(() => import("@/components/homepage/GuaranteesSection").then(m => ({ default: m.GuaranteesSection })));
const EnhancedServicesGrid = lazy(() => import("@/components/homepage/EnhancedServicesGrid").then(m => ({ default: m.EnhancedServicesGrid })));
const EnhancedRegionsGrid = lazy(() => import("@/components/homepage/EnhancedRegionsGrid").then(m => ({ default: m.EnhancedRegionsGrid })));
const MovingProcessGuide = lazy(() => import("@/components/homepage/MovingProcessGuide").then(m => ({ default: m.MovingProcessGuide })));
const AIVideoCalculatorSection = lazy(() => import("@/components/homepage/AIVideoCalculatorSection").then(m => ({ default: m.AIVideoCalculatorSection })));
const ChecklistTeaser = lazy(() => import("@/components/ChecklistTeaser"));
const EnhancedFAQ = lazy(() => import("@/components/homepage/EnhancedFAQ").then(m => ({ default: m.EnhancedFAQ })));
const SEOContentAccordion = lazy(() => import("@/components/homepage/SEOContentAccordion").then(m => ({ default: m.SEOContentAccordion })));
const EnhancedFinalCTA = lazy(() => import("@/components/homepage/EnhancedFinalCTA").then(m => ({ default: m.EnhancedFinalCTA })));
const CookieConsentBanner = lazy(() => import("@/components/CookieConsentBanner").then(m => ({ default: m.CookieConsentBanner })));
const MobileStickyBar = lazy(() => import("@/components/homepage/MobileStickyBar").then(m => ({ default: m.MobileStickyBar })));

const HomepageClassic = () => {
  return (
    <HomepageABProvider>
    <TabHintABProvider>
    <SocialProofABProvider>
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Homepage Classic - Alle Sektionen | Umzugscheck.ch</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <ScrollProgress />
        <SkipToContent />

        {/* Version Label */}
        <div className="fixed top-20 left-4 z-50 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          CLASSIC VERSION (20+ Sections)
        </div>

        <main id="main-content" role="main">
          {/* 1. Hero */}
          <HomepageHeroAB />
          
          {/* 2. Trust Ribbon */}
          <Suspense fallback={<TrustSkeleton />}>
            <TrustRibbonAB variant="full" />
          </Suspense>
          
          {/* 3. Trust Badges */}
          <Suspense fallback={<SectionSkeleton height="120px" />}>
            <TrustBadges />
          </Suspense>
          
          {/* 4. Media Logos */}
          <Suspense fallback={<SectionSkeleton height="100px" />}>
            <MediaLogosSection />
          </Suspense>
          
          {/* 5. Trust Logos Animated */}
          <Suspense fallback={<SectionSkeleton height="80px" />}>
            <TrustLogosAnimated />
          </Suspense>
          
          {/* 6. Quality Standards Bar */}
          <Suspense fallback={<SectionSkeleton height="60px" />}>
            <QualityStandardsBar />
          </Suspense>
          
          {/* 7. Trust Seals */}
          <Suspense fallback={<SectionSkeleton height="100px" />}>
            <div className="py-8 bg-muted/20">
              <div className="container">
                <TrustSeals />
              </div>
            </div>
          </Suspense>
          
          {/* 8. Spotlight Testimonial */}
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <SpotlightTestimonial />
          </Suspense>
          
          {/* 9. Video Testimonial */}
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <VideoTestimonial />
          </Suspense>
          
          {/* 10. Pain vs Gain */}
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <PainGainSection />
          </Suspense>
          
          {/* 11. How It Works */}
          <Suspense fallback={<SectionSkeleton height="350px" />}>
            <EnhancedHowItWorks />
          </Suspense>
          
          {/* 12. Company Comparison */}
          <Suspense fallback={<CompanyCardsSkeleton count={3} />}>
            <CompanyComparisonSection />
          </Suspense>
          
          {/* 13. Service Comparison Table */}
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <ServiceComparisonTable />
          </Suspense>
          
          {/* 14. Savings Calculator */}
          <Suspense fallback={<SectionSkeleton height="250px" />}>
            <SavingsCalculatorSimple />
          </Suspense>
          
          {/* 15. City Prices */}
          <Suspense fallback={<SectionSkeleton height="350px" />}>
            <CityPricesSection />
          </Suspense>
          
          {/* 16. Testimonials */}
          <Suspense fallback={<TestimonialsSkeleton />}>
            <EnhancedTestimonialsAB />
          </Suspense>
          
          {/* 17. Trust Score Widget */}
          <Suspense fallback={<SectionSkeleton height="250px" />}>
            <TrustScoreWidget />
          </Suspense>
          
          {/* 18. Guarantees */}
          <Suspense fallback={<SectionSkeleton height="350px" />}>
            <GuaranteesSection />
          </Suspense>
          
          {/* 19. AI Video Calculator */}
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <AIVideoCalculatorSection />
          </Suspense>
          
          {/* 20. Services Grid */}
          <Suspense fallback={<SectionSkeleton height="400px" variant="cards" />}>
            <EnhancedServicesGrid />
          </Suspense>
          
          {/* 21. Moving Process Guide */}
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <MovingProcessGuide />
          </Suspense>
          
          {/* 22. Regions Grid */}
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <EnhancedRegionsGrid />
          </Suspense>
          
          {/* 23. Checklist Teaser */}
          <Suspense fallback={<SectionSkeleton height="120px" />}>
            <ChecklistTeaser />
          </Suspense>
          
          {/* 24. FAQ */}
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <EnhancedFAQ />
          </Suspense>
          
          {/* 25. SEO Content */}
          <Suspense fallback={<SectionSkeleton height="200px" />}>
            <SEOContentAccordion />
          </Suspense>
          
          {/* 26. Final CTA */}
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <EnhancedFinalCTA />
          </Suspense>
        </main>

        {/* Mobile Sticky Bar */}
        <Suspense fallback={null}>
          <MobileStickyBar />
        </Suspense>
        
        {/* WhatsApp */}
        <FloatingWhatsApp 
          phoneNumber="41780980000" 
          message="Hallo! Ich interessiere mich für einen Umzug."
          delayMs={30000}
        />
        
        <Suspense fallback={null}>
          <CookieConsentBanner />
        </Suspense>
      </div>
    </ErrorBoundary>
    </SocialProofABProvider>
    </TabHintABProvider>
    </HomepageABProvider>
  );
};

export default HomepageClassic;
