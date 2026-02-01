/**
 * Homepage V5 - Institutionelle Vertrauensarchitektur
 * 
 * Neue Features:
 * - P1: Sticky Trust Footer (Daumen-Zone)
 * - P1: Labor Illusion Loader (Verifikationsanimation)
 * - P0: Institutionelle Trust Bar (SRO, ASTAG, Ombudsstelle)
 * - P1: Partner Tiering (Gold/Silber)
 * - P1: Privacy Video Section (Swiss Hosting)
 * - P2: WhatsApp FAB mit Hesitation Detection
 * - P0: Escrow Flow Visualization
 * 
 * Ziel: Transformation zum regulierten Schweizer Intermediär
 */
import { SEOHead } from '@/components/SEOHead';

// V5 Components
import { StickyTrustFooter } from '@/components/homepage-v5/StickyTrustFooter';
import { InstitutionalTrustBar } from '@/components/homepage-v5/InstitutionalTrustBar';
import { PartnerTieringSection } from '@/components/homepage-v5/PartnerTieringSection';
import { PrivacyVideoSection } from '@/components/homepage-v5/PrivacyVideoSection';
import { WhatsAppFAB } from '@/components/homepage-v5/WhatsAppFAB';
import { EscrowFlowVisualization } from '@/components/homepage-v5/EscrowFlowVisualization';

// Reuse from previous versions
import { PersonalizedHero } from '@/components/homepage-v4/PersonalizedHero';
import { SeasonalBannerV4 } from '@/components/homepage-v4/SeasonalBannerV4';
import { DynamicReviewsSection } from '@/components/homepage-v4/DynamicReviewsSection';
import { CollapsibleFAQ } from '@/components/homepage-v4/CollapsibleFAQ';
import { HowItWorksV1 } from '@/components/homepage-v1/HowItWorksV1';
import { TransparencyV1 } from '@/components/homepage-v1/TransparencyV1';
import { FinalCTAV1 } from '@/components/homepage-v1/FinalCTAV1';
import { ContentHubTeaser } from '@/components/homepage-v3/ContentHubTeaser';

export default function HomepageV5() {
  const currentUrl = 'https://umzugscheck.ch/homepage-5';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url={currentUrl}
      />

      {/* 1. Seasonal Banner */}
      <SeasonalBannerV4 />

      {/* 2. Personalized Hero (from V4) */}
      <PersonalizedHero />

      {/* 3. Institutional Trust Bar - SRO, ASTAG, etc. */}
      <InstitutionalTrustBar />

      {/* 4. Wie es funktioniert */}
      <HowItWorksV1 />

      {/* 5. Privacy Video Section */}
      <PrivacyVideoSection />

      {/* 6. Escrow Flow Visualization */}
      <EscrowFlowVisualization />

      {/* 7. Partner Tiering (Gold/Silver) */}
      <PartnerTieringSection />

      {/* 8. Dynamic Reviews */}
      <DynamicReviewsSection />

      {/* 9. Transparenz */}
      <TransparencyV1 />

      {/* 10. Content Hub */}
      <ContentHubTeaser />

      {/* 11. Collapsible FAQ */}
      <CollapsibleFAQ />

      {/* 12. Finaler CTA */}
      <FinalCTAV1 />

      {/* === Fixed Elements === */}
      
      {/* Sticky Trust Footer (Mobile) */}
      <StickyTrustFooter />

      {/* WhatsApp FAB - Shows on hesitation */}
      <WhatsAppFAB />
    </div>
  );
}
