/**
 * Homepage V2 - Zweite Feedback-Runde
 * 
 * Neue Trust-Entitäten:
 * - Digital Trust Label (Swiss Digital Initiative)
 * - HEV Schweiz (Hauseigentümerverband)
 * - Swiss Fintech Association (SFTA)
 * - EnergieSchweiz / MyClimate
 * 
 * Top 15 Verbesserungen implementiert:
 * - #1 Sticky Trust & Action Bar
 * - #2 Radikal reduzierter Hero
 * - #5 WhatsApp Business Button
 * - #6 Echtzeit-Social-Proof Popups
 * - #7 Authentisches Team-Branding
 * - #9 Escrow-Visualisierung
 * - #15 Dynamische Preis-Indikation
 */
import { SEOHead } from '@/components/SEOHead';

// V2 Components
import { HeroV2 } from '@/components/homepage-v2/HeroV2';
import { DynamicPriceIndicator } from '@/components/homepage-v2/DynamicPriceIndicator';
import { EscrowVisualization } from '@/components/homepage-v2/EscrowVisualization';
import { TeamBrandingV2 } from '@/components/homepage-v2/TeamBrandingV2';
import { StickyTrustActionBar } from '@/components/homepage-v2/StickyTrustActionBar';
import { RealTimeSocialProof } from '@/components/homepage-v2/RealTimeSocialProof';
import { WhatsAppButtonV2 } from '@/components/homepage-v2/WhatsAppButtonV2';

// Reuse from V1
import { HowItWorksV1 } from '@/components/homepage-v1/HowItWorksV1';
import { CompanyCardsV1 } from '@/components/homepage-v1/CompanyCardsV1';
import { TestimonialsV1 } from '@/components/homepage-v1/TestimonialsV1';
import { FAQV1 } from '@/components/homepage-v1/FAQV1';
import { FinalCTAV1 } from '@/components/homepage-v1/FinalCTAV1';

export default function HomepageV2() {
  const currentUrl = 'https://umzugscheck.ch/homepage-2';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url={currentUrl}
      />

      {/* 1. Hero - Radikal reduziert mit 2 grossen CTAs */}
      <HeroV2 />

      {/* 2. Dynamische Preisindikation */}
      <DynamicPriceIndicator />

      {/* 3. Wie es funktioniert */}
      <HowItWorksV1 />

      {/* 4. Escrow/Treuhand Visualisierung */}
      <EscrowVisualization />

      {/* 5. Top Firmen */}
      <CompanyCardsV1 />

      {/* 6. Testimonials */}
      <TestimonialsV1 />

      {/* 7. Team Branding */}
      <TeamBrandingV2 />

      {/* 8. FAQ */}
      <FAQV1 />

      {/* 9. Finaler CTA */}
      <FinalCTAV1 />

      {/* === Floating/Fixed Elements === */}
      
      {/* Sticky Mobile CTA Bar */}
      <StickyTrustActionBar />

      {/* Real-Time Social Proof Popups */}
      <RealTimeSocialProof />

      {/* WhatsApp Floating Button */}
      <WhatsAppButtonV2 variant="floating" />
    </div>
  );
}
