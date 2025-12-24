/**
 * /umzugsofferten - AI-Powered Moving Quote Comparison Page
 * 
 * This is the core landing page for Umzugscheck.ch, featuring:
 * - AI-powered moving quote calculator with real-time price estimation
 * - Best-practice UX & conversion optimization
 * - Strong comparison focus demonstrating platform value
 * - SEO-optimized with proper headings and schema markup
 * - Fully accessible and performance-aware
 * - Ready for A/B testing and personalization
 * 
 * Brand: Swiss quality, trustworthy, neutral, "digital Swiss watch" vibe
 * Colors: Primary red for CTAs, grey neutrals, green ONLY for checkmarks/verification
 */

import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { ConsentBanner } from "@/components/ConsentBanner";
import { DebugOverlay } from "@/components/DebugOverlay";

import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  HeroAIQuoteCalculator,
  AIInsightsBar,
  HowItWorksSection,
  ComparisonShowcase,
  PriceScenariosSection,
  WhyUsSection,
  TrustAndSecuritySection,
  TestimonialsSection,
  FAQSection,
  BottomFinalCTA,
  BottomStickyCTA,
  PageEnhancements,
} from "@/components/offerten-v2";
import { Link } from "react-router-dom";

const Umzugsofferten = () => {
  // Service Schema for SEO
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Umzugsofferten vergleichen mit KI",
    "description": "Erhalten Sie kostenlose, KI-gestützte Umzugsofferten von geprüften Schweizer Umzugsfirmen. Vergleichen Sie Preise, Bewertungen und Leistungen – schnell, transparent und unverbindlich.",
    "provider": {
      "@type": "Organization",
      "name": "umzugscheck.ch",
      "url": "https://umzugscheck.ch",
    },
    "areaServed": {
      "@type": "Country",
      "name": "Switzerland",
    },
    "serviceType": "Moving Quote Comparison",
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Umzugsofferten vergleichen mit KI | Gratis & unverbindlich | umzugscheck.ch",
    "description": "Erhalten Sie kostenlose, KI-gestützte Umzugsofferten von geprüften Schweizer Umzugsfirmen.",
    "url": "https://umzugscheck.ch/umzugsofferten",
    "isPartOf": {
      "@type": "WebSite",
      "name": "umzugscheck.ch",
      "url": "https://umzugscheck.ch",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <ExitIntentPopup />
      <ConsentBanner />
      <DebugOverlay />
      <PageEnhancements />
      <Helmet>
        <title>Umzugsofferten vergleichen & bis 40% sparen | umzugscheck.ch</title>
        <meta
          name="description"
          content="Erhalten Sie jetzt kostenlos bis zu 5 Offerten für Ihren Umzug. Vergleichen Sie 200+ geprüfte Umzugsfirmen in der Schweiz und sparen Sie bis zu 40% bei Ihrem Umzug!"
        />
        <meta
          name="keywords"
          content="Umzugsofferten, Umzugsofferten vergleichen, Umzug Schweiz, Umzugsfirma vergleichen, KI Umzugsrechner, Umzugskosten berechnen, Zügelofferte, kostenlose Offerten"
        />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsofferten" />

        {/* Open Graph */}
        <meta property="og:title" content="Umzugsofferten vergleichen & bis 40% sparen | umzugscheck.ch" />
        <meta
          property="og:description"
          content="Erhalten Sie jetzt kostenlos bis zu 5 Offerten für Ihren Umzug. Vergleichen Sie 200+ geprüfte Umzugsfirmen in der Schweiz."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/umzugsofferten" />
        <meta property="og:locale" content="de_CH" />
        <meta property="og:site_name" content="umzugscheck.ch" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Umzugsofferten vergleichen & bis 40% sparen | umzugscheck.ch" />
        <meta
          name="twitter:description"
          content="Kostenlos bis zu 5 Offerten für Ihren Umzug erhalten. 200+ geprüfte Schweizer Umzugsfirmen."
        />

        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      <main id="main-content">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <Breadcrumbs items={[{ label: "Umzugsofferten vergleichen" }]} />
        </div>

        {/* Hero with AI Calculator */}
        <HeroAIQuoteCalculator />

        {/* AI Insights Strip */}
        <AIInsightsBar />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Comparison Showcase */}
        <ComparisonShowcase />

        {/* Price Scenarios */}
        <PriceScenariosSection />

        {/* Why Us */}
        <WhyUsSection />

        {/* Trust & Security */}
        <TrustAndSecuritySection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <BottomFinalCTA />

        {/* Internal Links Section - Enhanced for SEO */}
        <section className="py-8 sm:py-12 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
              Weitere hilfreiche Seiten
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-sm">
              <div className="space-y-2 sm:space-y-2.5">
                <h3 className="font-medium text-foreground text-xs sm:text-sm">Umzug planen</h3>
                <Link to="/" className="block text-primary hover:underline py-1 active:opacity-70">Startseite</Link>
                <Link to="/rechner" className="block text-primary hover:underline py-1 active:opacity-70">Umzugsrechner</Link>
                <Link to="/rechner/video" className="block text-primary hover:underline py-1 active:opacity-70">KI Video-Analyse</Link>
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <h3 className="font-medium text-foreground text-xs sm:text-sm">Firmen finden</h3>
                <Link to="/umzugsfirmen" className="block text-primary hover:underline py-1 active:opacity-70">Alle Umzugsfirmen</Link>
                <Link to="/beste-umzugsfirma" className="block text-primary hover:underline py-1 active:opacity-70">Beste Umzugsfirmen</Link>
                <Link to="/guenstige-umzugsfirma" className="block text-primary hover:underline py-1 active:opacity-70">Günstige Umzugsfirmen</Link>
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <h3 className="font-medium text-foreground text-xs sm:text-sm">Services</h3>
                <Link to="/privatumzug" className="block text-primary hover:underline py-1 active:opacity-70">Privatumzug</Link>
                <Link to="/firmenumzug" className="block text-primary hover:underline py-1 active:opacity-70">Firmenumzug</Link>
                <Link to="/reinigung" className="block text-primary hover:underline py-1 active:opacity-70">Umzugsreinigung</Link>
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <h3 className="font-medium text-foreground text-xs sm:text-sm">Regionen</h3>
                <Link to="/zuerich" className="block text-primary hover:underline py-1 active:opacity-70">Umzug Zürich</Link>
                <Link to="/bern" className="block text-primary hover:underline py-1 active:opacity-70">Umzug Bern</Link>
                <Link to="/basel" className="block text-primary hover:underline py-1 active:opacity-70">Umzug Basel</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Sticky CTA */}
      <BottomStickyCTA />
    </div>
  );
};

export default Umzugsofferten;
