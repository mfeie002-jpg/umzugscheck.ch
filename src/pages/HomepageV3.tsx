/**
 * Homepage V3 - Final 100/100 Optimierung
 * 
 * Änderungen für perfekten Score:
 * 
 * P0 Kritisch:
 * - Trust-Reassurance direkt unter Hero-CTA
 * - ARIA-Labels für Accessibility
 * - Emotionales Hintergrundbild
 * 
 * P1 Wichtig:
 * - Trust-Badges/Siegel Bar
 * - Testimonials mit echten Fotos
 * - Content Hub Teaser (Ratgeber)
 * - Persönlicher Support-Kontakt
 * - Intermediate CTAs zwischen Sektionen
 * 
 * Gap-Analyse adressiert:
 * - Subjektive Faktoren & Emotional Design ✓
 * - Edge Cases (Accessibility) ✓
 * - Page Focus (mehr CTAs) ✓
 */
import { SEOHead } from '@/components/SEOHead';

// V3 Components
import { HeroV3 } from '@/components/homepage-v3/HeroV3';
import { TrustSiegelBar } from '@/components/homepage-v3/TrustSiegelBar';
import { EmotionalTestimonials } from '@/components/homepage-v3/EmotionalTestimonials';
import { ContentHubTeaser } from '@/components/homepage-v3/ContentHubTeaser';
import { IntermediateCTA } from '@/components/homepage-v3/IntermediateCTA';
import { AccessibleStickyBar } from '@/components/homepage-v3/AccessibleStickyBar';
import { SupportContact } from '@/components/homepage-v3/SupportContact';

// Reuse from V1/V2
import { HowItWorksV1 } from '@/components/homepage-v1/HowItWorksV1';
import { CompanyCardsV1 } from '@/components/homepage-v1/CompanyCardsV1';
import { TransparencyV1 } from '@/components/homepage-v1/TransparencyV1';
import { FAQV1 } from '@/components/homepage-v1/FAQV1';
import { FinalCTAV1 } from '@/components/homepage-v1/FinalCTAV1';
import { EscrowVisualization } from '@/components/homepage-v2/EscrowVisualization';

export default function HomepageV3() {
  const currentUrl = 'https://umzugscheck.ch/homepage-3';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        pageType="home"
        url={currentUrl}
      />

      {/* 1. Hero - Emotional mit Trust-Reassurance */}
      <HeroV3 />

      {/* 2. Trust Siegel Bar */}
      <TrustSiegelBar />

      {/* 3. Wie es funktioniert */}
      <HowItWorksV1 />

      {/* 4. Intermediate CTA */}
      <IntermediateCTA variant="secondary" />

      {/* 5. Top Firmen */}
      <CompanyCardsV1 />

      {/* 6. Escrow/Treuhand */}
      <EscrowVisualization />

      {/* 7. Testimonials mit Fotos */}
      <EmotionalTestimonials />

      {/* 8. Intermediate CTA */}
      <IntermediateCTA />

      {/* 9. Content Hub / Ratgeber */}
      <ContentHubTeaser />

      {/* 10. Transparenz */}
      <TransparencyV1 />

      {/* 11. Support Kontakt */}
      <SupportContact />

      {/* 12. FAQ */}
      <FAQV1 />

      {/* 13. Finaler CTA */}
      <FinalCTAV1 />

      {/* === Fixed Elements === */}
      
      {/* Accessible Sticky Bar (Mobile) */}
      <AccessibleStickyBar />
    </div>
  );
}
