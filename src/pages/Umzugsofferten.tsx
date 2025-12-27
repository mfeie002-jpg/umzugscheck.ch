/**
 * /umzugsofferten - AI-Powered Moving Quote Comparison Page
 * 
 * DYNAMIC FLOW VERSIONING via URL parameters:
 * - (none) or ?v=1 → V1 Control (Baseline)
 * - ?v=2 → V2 (UX Optimization)
 * - ?v=2a → V2.a (Variant A)
 * - ?v=2a1 → V2.a.1 (Adjustment 1)
 * - ?v=3 → V3 (Mobile-First)
 * - ?v=4 → V4 (Conversion Boost)
 * - ?v=5 → V5 (Ultimate)
 * - ?v=ultimate → Final Combined Ultimate
 * 
 * Configurations loaded from database (flow_versions table)
 */

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
import { 
  V2aProgressEnhanced, 
  V2bSimplifiedLabels, 
  V2cTrustFocused, 
  V2dSpeedOptimized, 
  V2eExperimental,
  V3aMobileFirst,
  V3bSwipeNavigation,
  V3cBottomSheet,
  V3dThumbZone,
  V3eFullscreen,
  V4aUrgencyBased,
  V4bSocialProof,
  V4cValueFirst,
  V4dGamified,
  V4eMinimalFriction,
  V5aHighContrast,
  V5bScreenReader,
  V5cKeyboardNav,
  V5dLargeText,
  V5eReducedMotion,
  V1aFeedbackBased,
  V1bFeedbackBased,
  V1cFeedbackBased,
} from "@/components/calculator-variants";
import { Link, useSearchParams } from "react-router-dom";
import { useFlowVersion } from "@/hooks/useFlowVersion";

const Umzugsofferten = () => {
  const [searchParams] = useSearchParams();
  const variantParam = searchParams.get('variant');
  
  const { 
    parsed, 
    label, 
    isControl, 
    componentName, 
    meta,
  } = useFlowVersion();

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
    "url": `https://umzugscheck.ch/umzugsofferten${!isControl ? `?v=${parsed.flowCode}` : ''}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "umzugscheck.ch",
      "url": "https://umzugscheck.ch",
    },
  };

  // Render the appropriate calculator based on version
  const renderCalculator = () => {
    // Check ?variant= param first for feedback-based variants (v1a, v1b, v1c, etc.)
    if (variantParam) {
      const v = variantParam.toLowerCase();
      if (v === 'v1a') return <V1aFeedbackBased />;
      if (v === 'v1b') return <V1bFeedbackBased />;
      if (v === 'v1c') return <V1cFeedbackBased />;
      // v1d and v1e don't have separate components yet - fall through to default
    }
    
    // V2 Sub-variants (2a, 2b, 2c, 2d, 2e) via ?v= param
    if (parsed.flowCode === '2a') return <V2aProgressEnhanced />;
    if (parsed.flowCode === '2b') return <V2bSimplifiedLabels />;
    if (parsed.flowCode === '2c') return <V2cTrustFocused />;
    if (parsed.flowCode === '2d') return <V2dSpeedOptimized />;
    if (parsed.flowCode === '2e') return <V2eExperimental />;
    
    // V3 Sub-variants - Mobile-First (3a, 3b, 3c, 3d, 3e)
    if (parsed.flowCode === '3a') return <V3aMobileFirst />;
    if (parsed.flowCode === '3b') return <V3bSwipeNavigation />;
    if (parsed.flowCode === '3c') return <V3cBottomSheet />;
    if (parsed.flowCode === '3d') return <V3dThumbZone />;
    if (parsed.flowCode === '3e') return <V3eFullscreen />;
    
    // V4 Sub-variants - Conversion-Focused (4a, 4b, 4c, 4d, 4e)
    if (parsed.flowCode === '4a') return <V4aUrgencyBased />;
    if (parsed.flowCode === '4b') return <V4bSocialProof />;
    if (parsed.flowCode === '4c') return <V4cValueFirst />;
    if (parsed.flowCode === '4d') return <V4dGamified />;
    if (parsed.flowCode === '4e') return <V4eMinimalFriction />;
    
    // V5 Sub-variants - Accessibility-Focused (5a, 5b, 5c, 5d, 5e)
    if (parsed.flowCode === '5a') return <V5aHighContrast />;
    if (parsed.flowCode === '5b') return <V5bScreenReader />;
    if (parsed.flowCode === '5c') return <V5cKeyboardNav />;
    if (parsed.flowCode === '5d') return <V5dLargeText />;
    if (parsed.flowCode === '5e') return <V5eReducedMotion />;
    
    // Main versions
    switch (componentName) {
      case 'MultiStepCalculatorVariantA':
        return <MultiStepCalculatorVariantA />;
      case 'MultiStepCalculatorVariantB':
        return <MultiStepCalculatorVariantB />;
      case 'MultiStepCalculatorVariantC':
        return <MultiStepCalculatorVariantC />;
      case 'MultiStepCalculatorUltimate':
        return <MultiStepCalculatorUltimate />;
      default:
        return <MultiStepCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>{meta.title} | Umzugscheck.ch</title>
        <meta name="description" content={meta.description} />
        <meta
          name="keywords"
          content="Umzugsofferten, Umzugsofferten Schweiz, gratis Offerten, Umzugsfirma vergleichen, Umzug Schweiz, Zügelofferte"
        />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsofferten" />
        {/* noindex for test variants */}
        {!isControl && <meta name="robots" content="noindex, nofollow" />}

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
          <h1 className="sr-only">{meta.title}</h1>
          <div className="flex items-center justify-between">
            <Breadcrumbs items={[{ label: "Umzugsofferten vergleichen" }]} />
            {/* Version indicator for testing */}
            {!isControl && (
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                {label}
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
                <Link to="/umzugsofferten" className="block text-primary hover:underline py-1 active:opacity-70">V1 Control</Link>
                <Link to="/umzugsofferten?v=2" className="block text-primary hover:underline py-1 active:opacity-70">V2 UX</Link>
                <Link to="/umzugsofferten?v=2a" className="block text-primary hover:underline py-1 active:opacity-70 pl-2 text-xs">↳ 2a Progress</Link>
                <Link to="/umzugsofferten?v=2b" className="block text-primary hover:underline py-1 active:opacity-70 pl-2 text-xs">↳ 2b Simplified</Link>
                <Link to="/umzugsofferten?v=2c" className="block text-primary hover:underline py-1 active:opacity-70 pl-2 text-xs">↳ 2c Trust</Link>
                <Link to="/umzugsofferten?v=2d" className="block text-primary hover:underline py-1 active:opacity-70 pl-2 text-xs">↳ 2d Speed</Link>
                <Link to="/umzugsofferten?v=2e" className="block text-primary hover:underline py-1 active:opacity-70 pl-2 text-xs">↳ 2e Chat</Link>
                <Link to="/umzugsofferten?v=3" className="block text-primary hover:underline py-1 active:opacity-70">V3 Mobile</Link>
                <Link to="/umzugsofferten?v=4" className="block text-primary hover:underline py-1 active:opacity-70">V4 Conversion</Link>
                <Link to="/umzugsofferten?v=ultimate" className="block text-primary hover:underline py-1 active:opacity-70 font-bold">Ultimate ⭐</Link>
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
