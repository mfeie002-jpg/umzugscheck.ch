/**
 * Homepage V4 - Personalisierung & Datengetriebene Optimierung
 * 
 * Neue Features:
 * - P0: IP-basierte Personalisierung (Zürich, Bern, etc.)
 * - P0: Echtzeit-Reviews mit Live-Status
 * - P1: A/B-Test-fähige CTA-Varianten
 * - P1: Saisonale dynamische Banner
 * - P0: Volle ARIA-Accessibility
 * - P1: Collapsible FAQ (Accordion)
 * 
 * Score-Ziel: 98 → 100/100
 */
import { SEOHead } from '@/components/SEOHead';

// V4 Components
import { PersonalizedHero } from '@/components/homepage-v4/PersonalizedHero';
import { SeasonalBannerV4 } from '@/components/homepage-v4/SeasonalBannerV4';
import { DynamicReviewsSection } from '@/components/homepage-v4/DynamicReviewsSection';
import { ABTestCTASection } from '@/components/homepage-v4/ABTestCTASection';
import { CollapsibleFAQ } from '@/components/homepage-v4/CollapsibleFAQ';

// Reuse from previous versions
import { TrustSiegelBar } from '@/components/homepage-v3/TrustSiegelBar';
import { HowItWorksV1 } from '@/components/homepage-v1/HowItWorksV1';
import { CompanyCardsV1 } from '@/components/homepage-v1/CompanyCardsV1';
import { TransparencyV1 } from '@/components/homepage-v1/TransparencyV1';
import { FinalCTAV1 } from '@/components/homepage-v1/FinalCTAV1';
import { EscrowVisualization } from '@/components/homepage-v2/EscrowVisualization';
import { ContentHubTeaser } from '@/components/homepage-v3/ContentHubTeaser';
import { SupportContact } from '@/components/homepage-v3/SupportContact';
import { AccessibleStickyBar } from '@/components/homepage-v3/AccessibleStickyBar';

export default function HomepageV4() {
  const currentUrl = 'https://umzugscheck.ch/homepage-4';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url={currentUrl}
      />

      {/* 1. Seasonal Banner - Dynamic based on month */}
      <SeasonalBannerV4 />

      {/* 2. Personalized Hero - IP-based location */}
      <PersonalizedHero />

      {/* 3. Trust Siegel Bar */}
      <TrustSiegelBar />

      {/* 4. Wie es funktioniert */}
      <HowItWorksV1 />

      {/* 5. Dynamic Reviews - Real-time */}
      <DynamicReviewsSection />

      {/* 6. Top Firmen */}
      <CompanyCardsV1 />

      {/* 7. A/B Test CTA Section */}
      <ABTestCTASection />

      {/* 8. Escrow/Treuhand */}
      <EscrowVisualization />

      {/* 9. Content Hub / Ratgeber */}
      <ContentHubTeaser />

      {/* 10. Transparenz */}
      <TransparencyV1 />

      {/* 11. Support Kontakt */}
      <SupportContact />

      {/* 12. Collapsible FAQ */}
      <CollapsibleFAQ />

      {/* 13. Finaler CTA */}
      <FinalCTAV1 />

      {/* === Fixed Elements === */}
      
      {/* Accessible Sticky Bar (Mobile) */}
      <AccessibleStickyBar />
    </div>
  );
}
