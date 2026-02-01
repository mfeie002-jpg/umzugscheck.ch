/**
 * Homepage V1 - Feedback-basierte Optimierung
 * 
 * Implementierte Verbesserungen aus der Analyse:
 * 
 * P0 (Sofort):
 * - #1 Trust-Strip unter Hero
 * - #2 Konkrete Zahlen im Hero ("30 Sekunden", "bis zu 40%")
 * - #3 Sticky Mobile CTA
 * - #4 Sections reduziert auf 8-10 Kern-Sections
 * 
 * P1 (Diese Woche):
 * - #5 "Wie es funktioniert" in genau 3 Schritten
 * - #6 Echte Testimonials mit Fotos
 * - #8 SMA/ASTAG PLUS Badges auf Firmen-Cards
 * - #9 Transparenz-Abschnitt
 * - #10 FAQ mit Schema.org Markup
 * 
 * Score-Ziel: 67.2 → 92.7
 */
import { Helmet } from 'react-helmet';
import { SEOHead } from '@/components/SEOHead';

// V1 Components
import { TrustStripV1 } from '@/components/homepage-v1/TrustStripV1';
import { HeroV1 } from '@/components/homepage-v1/HeroV1';
import { HowItWorksV1 } from '@/components/homepage-v1/HowItWorksV1';
import { CompanyCardsV1 } from '@/components/homepage-v1/CompanyCardsV1';
import { TestimonialsV1 } from '@/components/homepage-v1/TestimonialsV1';
import { TransparencyV1 } from '@/components/homepage-v1/TransparencyV1';
import { FAQV1 } from '@/components/homepage-v1/FAQV1';
import { FinalCTAV1 } from '@/components/homepage-v1/FinalCTAV1';
import { StickyMobileCTAV1 } from '@/components/homepage-v1/StickyMobileCTAV1';

// FAQ data for SEO
const faqs = [
  {
    question: 'Was kostet durchschnittlich ein Umzug in der Schweiz?',
    answer: 'Ein Umzug in der Schweiz kostet durchschnittlich CHF 1\'200 bis CHF 2\'500 für eine 3-Zimmer-Wohnung innerorts.',
  },
  {
    question: 'Wie schnell erhalte ich Offerten?',
    answer: 'In der Regel erhalten Sie innerhalb von 24 Stunden bis zu 5 Offerten von geprüften Umzugsfirmen.',
  },
  {
    question: 'Sind alle Umzugsfirmen geprüft und versichert?',
    answer: 'Ja, wir arbeiten ausschliesslich mit verifizierten Schweizer Umzugsfirmen.',
  },
  {
    question: 'Ist der Vergleich wirklich kostenlos?',
    answer: '100% kostenlos und unverbindlich. Es entstehen keine versteckten Kosten.',
  },
  {
    question: 'Wie verdient umzugscheck.ch Geld?',
    answer: 'Umzugsfirmen zahlen uns eine kleine Vermittlungsgebühr. Für Sie ist der Service gratis.',
  },
];

export default function HomepageV1() {
  const currentUrl = 'https://umzugscheck.ch/homepage-1';

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Head */}
      <SEOHead
        pageType="home"
        url={currentUrl}
        faqs={faqs}
      />

      {/* 1. Hero mit konkreten Zahlen */}
      <HeroV1 />

      {/* 2. Trust-Strip (fixiert bei Scroll) */}
      <TrustStripV1 />

      {/* 3. Wie es funktioniert - 3 Schritte */}
      <HowItWorksV1 />

      {/* 4. Top Umzugsfirmen mit SMA-Badges */}
      <CompanyCardsV1 />

      {/* 5. Testimonials mit echten Fotos */}
      <TestimonialsV1 />

      {/* 6. Transparenz-Abschnitt */}
      <TransparencyV1 />

      {/* 7. FAQ */}
      <FAQV1 />

      {/* 8. Finaler CTA */}
      <FinalCTAV1 />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTAV1 />
    </div>
  );
}
