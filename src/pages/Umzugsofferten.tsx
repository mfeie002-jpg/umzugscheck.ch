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
      <Helmet>
        <title>Umzugsofferten vergleichen mit KI | Gratis & unverbindlich | umzugscheck.ch</title>
        <meta
          name="description"
          content="Erhalten Sie kostenlose, KI-gestützte Umzugsofferten von geprüften Schweizer Umzugsfirmen. Vergleichen Sie Preise, Bewertungen und Leistungen – schnell, transparent und unverbindlich."
        />
        <meta
          name="keywords"
          content="Umzugsofferten, Umzugsrechner, Umzug Schweiz, Umzugsfirma vergleichen, KI Umzugsrechner, Umzugskosten berechnen, Zügelofferte"
        />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsofferten" />

        {/* Open Graph */}
        <meta property="og:title" content="Umzugsofferten vergleichen mit KI | umzugscheck.ch" />
        <meta
          property="og:description"
          content="Erhalten Sie kostenlose, KI-gestützte Umzugsofferten von geprüften Schweizer Umzugsfirmen."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/umzugsofferten" />
        <meta property="og:locale" content="de_CH" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Umzugsofferten vergleichen mit KI | umzugscheck.ch" />
        <meta
          name="twitter:description"
          content="Kostenlose, KI-gestützte Umzugsofferten von geprüften Schweizer Umzugsfirmen."
        />

        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      <main id="main-content">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4 max-w-6xl">
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

        {/* Internal Links Section */}
        <section className="py-12 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Weitere hilfreiche Seiten
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/" className="text-primary hover:underline">
                Startseite
              </Link>
              <Link to="/rechner" className="text-primary hover:underline">
                Umzugsrechner
              </Link>
              <Link to="/umzugsfirmen" className="text-primary hover:underline">
                Alle Umzugsfirmen
              </Link>
              <Link to="/ratgeber" className="text-primary hover:underline">
                Umzugsratgeber
              </Link>
              <Link to="/preise" className="text-primary hover:underline">
                Umzugskosten Schweiz
              </Link>
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
