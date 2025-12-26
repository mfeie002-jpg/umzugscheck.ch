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
 * 
 * VARIANT SUPPORT via URL parameters:
 * - ?v=a → Variante A (ChatGPT Analyse - UX Optimization)
 * - ?v=b → Variante B (Mobile-First Redesign)
 * - ?v=c → Variante C (Conversion Boost)
 * - ?v=ultimate → Ultimate kombinierte Version
 */

import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { ConsentBanner } from "@/components/ConsentBanner";
import { DebugOverlay } from "@/components/DebugOverlay";

import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
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
import { MultiStepCalculator } from "@/components/homepage/MultiStepCalculator";
import { MultiStepCalculatorVariantA } from "@/components/homepage/MultiStepCalculatorVariantA";
import { MultiStepCalculatorVariantB } from "@/components/homepage/MultiStepCalculatorVariantB";
import { MultiStepCalculatorVariantC } from "@/components/homepage/MultiStepCalculatorVariantC";
import { MultiStepCalculatorUltimate } from "@/components/homepage/MultiStepCalculatorUltimate";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

// Variant configuration based on AI analysis results
type FlowVersion = 'control' | 'a' | 'b' | 'c' | 'ultimate';

interface VersionMeta {
  title: string;
  description: string;
  headline: string;
}

const VERSION_META: Record<FlowVersion, VersionMeta> = {
  control: {
    title: "Umzugsofferten Schweiz kostenlos vergleichen | Umzugscheck.ch",
    description: "Erhalten Sie gratis Umzugsofferten von geprüften Umzugsfirmen in der Schweiz. Schnell vergleichen, transparente Preise, echte Bewertungen – in ca. 2 Minuten.",
    headline: "Umzugsofferten Schweiz kostenlos vergleichen",
  },
  a: {
    title: "Umzugsofferten V1.a – UX-optimiert | Umzugscheck.ch",
    description: "Optimierte Nutzerführung mit klareren Fortschrittsanzeigen, verständlicherer Terminologie und erhöhtem Vertrauen.",
    headline: "Umzugsofferten – UX-optimierte Version",
  },
  b: {
    title: "Umzugsofferten V1.b – Mobile-First | Umzugscheck.ch",
    description: "Mobile-First Redesign mit Touch-optimierten CTAs, Sticky Footer und verbesserter Thumb-Zone-Navigation.",
    headline: "Umzugsofferten – Mobile-First Version",
  },
  c: {
    title: "Umzugsofferten V1.c – Conversion Boost | Umzugscheck.ch",
    description: "Maximale Conversion mit größeren CTAs, Trust-Signals in Hero, Social Proof und weniger Formularfeldern.",
    headline: "Umzugsofferten – Conversion-optimierte Version",
  },
  ultimate: {
    title: "Umzugsofferten Ultimate V2 | Umzugscheck.ch",
    description: "Die beste Kombination aus allen Optimierungen: UX, Mobile, Conversion – das Beste vereint.",
    headline: "Umzugsofferten – Ultimate Version",
  },
};

const Umzugsofferten = () => {
  const [searchParams] = useSearchParams();
  const versionParam = searchParams.get('v');
  
  // Determine which version to show
  const version: FlowVersion = 
    versionParam === 'a' ? 'a' :
    versionParam === 'b' ? 'b' :
    versionParam === 'c' ? 'c' :
    versionParam === 'ultimate' ? 'ultimate' :
    'control';
  
  const meta = VERSION_META[version];
  
  // Track variant view for analytics
  useEffect(() => {
    if (version !== 'control') {
      localStorage.setItem('uc_flow_variant', `v1.${version}`);
      console.log(`[Flow Variant] Viewing: V1.${version}`);
    }
  }, [version]);

  // Service Schema for SEO
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Umzugsofferten vergleichen mit KI",
    "description": meta.description,
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
    "name": meta.title,
    "description": meta.description,
    "url": `https://umzugscheck.ch/umzugsofferten${version !== 'control' ? `?v=${version}` : ''}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "umzugscheck.ch",
      "url": "https://umzugscheck.ch",
    },
  };

  // Render the appropriate calculator based on version
  const renderCalculator = () => {
    switch (version) {
      case 'a':
        return <MultiStepCalculatorVariantA />;
      case 'b':
        return <MultiStepCalculatorVariantB />;
      case 'c':
        return <MultiStepCalculatorVariantC />;
      case 'ultimate':
        return <MultiStepCalculatorUltimate />;
      default:
        return <MultiStepCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Popups disabled for cleaner UX */}
      {/* <ExitIntentPopup /> */}
      {/* <ConsentBanner /> */}
      {/* <DebugOverlay /> */}
      <PageEnhancements />
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta
          name="keywords"
          content="Umzugsofferten, Umzugsofferten Schweiz, gratis Offerten, Umzugsfirma vergleichen, Umzug Schweiz, Zügelofferte"
        />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsofferten" />
        {/* noindex for test variants */}
        {version !== 'control' && <meta name="robots" content="noindex, nofollow" />}

        {/* Open Graph */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/umzugsofferten" />
        <meta property="og:locale" content="de_CH" />
        <meta property="og:site_name" content="umzugscheck.ch" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />

        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      <main id="main-content">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">{meta.headline}</h1>
          <div className="flex items-center justify-between">
            <Breadcrumbs items={[{ label: "Umzugsofferten vergleichen" }]} />
            {/* Version indicator for testing */}
            {version !== 'control' && (
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                V1.{version.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Hero with Comparison Wizard - Version-specific */}
        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6">
          {renderCalculator()}
        </section>

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
                <h3 className="font-medium text-foreground text-xs sm:text-sm">Flow-Versionen</h3>
                <Link to="/umzugsofferten" className="block text-primary hover:underline py-1 active:opacity-70">Control</Link>
                <Link to="/umzugsofferten?v=a" className="block text-primary hover:underline py-1 active:opacity-70">V1.a – UX-optimiert</Link>
                <Link to="/umzugsofferten?v=b" className="block text-primary hover:underline py-1 active:opacity-70">V1.b – Mobile-First</Link>
                <Link to="/umzugsofferten?v=c" className="block text-primary hover:underline py-1 active:opacity-70">V1.c – Conversion</Link>
                <Link to="/umzugsofferten?v=ultimate" className="block text-primary hover:underline py-1 active:opacity-70 font-bold">Ultimate V2 ⭐</Link>
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
