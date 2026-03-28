/**
 * Homepage V6 - Ultimate Trust Architecture
 * 
 * Based on comprehensive feedback document covering:
 * - Trust Signals: Comparis, Swiss Label, Trusted Shops, TÜV, ISO, SMA
 * - 15 UX/Conversion Boosters
 * 
 * Key Features:
 * - Enhanced Trust Bar with premium badges
 * - Team Section for human touch
 * - No-Commitment badges at CTAs
 * - Partner Quality with SMA integration
 * - Speed Promise visualization
 * - Quality Promise icons
 */
import { SEOHead } from '@/components/SEOHead';

// V6 Components
import { EnhancedTrustBar } from '@/components/homepage-v6/EnhancedTrustBar';
import { TeamSection } from '@/components/homepage-v6/TeamSection';
import { QualityPromiseSection } from '@/components/homepage-v6/QualityPromiseSection';
import { PartnerQualityBadges } from '@/components/homepage-v6/PartnerQualityBadges';
import { SpeedPromiseSection } from '@/components/homepage-v6/SpeedPromiseSection';
import { NoCommitmentBadge } from '@/components/homepage-v6/NoCommitmentBadge';

// Reuse from previous versions
import { PersonalizedHero } from '@/components/homepage-v4/PersonalizedHero';
import { SeasonalBannerV4 } from '@/components/homepage-v4/SeasonalBannerV4';
import { DynamicReviewsSection } from '@/components/homepage-v4/DynamicReviewsSection';
import { CollapsibleFAQ } from '@/components/homepage-v4/CollapsibleFAQ';
import { HowItWorksV1 } from '@/components/homepage-v1/HowItWorksV1';
import { FinalCTAV1 } from '@/components/homepage-v1/FinalCTAV1';

// V5 Components
import { StickyTrustFooter } from '@/components/homepage-v5/StickyTrustFooter';
import { WhatsAppFAB } from '@/components/homepage-v5/WhatsAppFAB';
import { EscrowFlowVisualization } from '@/components/homepage-v5/EscrowFlowVisualization';

export default function HomepageV6() {
  const currentUrl = 'https://umzugscheck.ch/homepage-6';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url={currentUrl}
      />

      {/* 1. Seasonal Banner */}
      <SeasonalBannerV4 />

      {/* 2. Personalized Hero */}
      <PersonalizedHero />

      {/* 3. Enhanced Trust Bar - Premium badges */}
      <EnhancedTrustBar />

      {/* 4. Quality Promise Icons */}
      <QualityPromiseSection />

      {/* 5. How It Works */}
      <HowItWorksV1 />

      {/* 6. Speed Promise */}
      <SpeedPromiseSection />

      {/* 7. Escrow Flow (from V5) */}
      <EscrowFlowVisualization />

      {/* 8. Partner Quality with SMA */}
      <PartnerQualityBadges />

      {/* 9. No Commitment Promise */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <NoCommitmentBadge variant="full" />
        </div>
      </section>

      {/* 10. Dynamic Reviews */}
      <DynamicReviewsSection />

      {/* 11. Team Section */}
      <TeamSection />

      {/* 12. Collapsible FAQ */}
      <CollapsibleFAQ />

      {/* 13. Final CTA */}
      <FinalCTAV1 />

      {/* === Fixed Elements === */}
      
      {/* Sticky Trust Footer (Mobile) */}
      <StickyTrustFooter />

      {/* WhatsApp FAB */}
      <WhatsAppFAB />
    </div>
  );
}
