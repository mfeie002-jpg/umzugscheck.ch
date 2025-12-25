/**
 * Umzugsofferten Variant Page
 * 
 * A configurable landing page that renders different flow variants
 * based on the variantId prop or URL path.
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
import { MultiStepCalculatorVariant } from "@/components/homepage/MultiStepCalculatorVariant";
import { Link, useLocation } from "react-router-dom";
import { getVariantFromPath, type FlowVariantConfig } from "@/lib/flow-variants";
import { useEffect } from "react";

interface UmzugsoffertenVariantProps {
  variantId?: string;
}

const UmzugsoffertenVariant = ({ variantId }: UmzugsoffertenVariantProps) => {
  const location = useLocation();
  
  // Get variant config from prop or URL
  const variant: FlowVariantConfig = variantId 
    ? { ...getVariantFromPath('/umzugsofferten'), id: variantId }
    : getVariantFromPath(location.pathname);

  // Track variant view for analytics
  useEffect(() => {
    // Store variant in localStorage for conversion tracking
    localStorage.setItem('uc_flow_variant', variant.id);
    
    // Log for debugging
    console.log(`[Flow Variant] Viewing: ${variant.id} - ${variant.name}`);
  }, [variant.id, variant.name]);

  // Dynamic SEO based on variant
  const getTitle = () => {
    switch (variant.id) {
      case 'variant-a':
        return 'Schnell Umzugsofferten erhalten | In 60 Sekunden | Umzugscheck.ch';
      case 'variant-b':
        return 'Umzugskosten berechnen | Sofort Preise sehen | Umzugscheck.ch';
      case 'variant-c':
        return 'Persönliche Umzugsofferten | Geführte Anfrage | Umzugscheck.ch';
      default:
        return 'Umzugsofferten Schweiz kostenlos vergleichen | Umzugscheck.ch';
    }
  };

  const getDescription = () => {
    switch (variant.id) {
      case 'variant-a':
        return 'In nur 60 Sekunden kostenlose Umzugsofferten erhalten. Schnell, einfach, unverbindlich.';
      case 'variant-b':
        return 'Berechnen Sie sofort Ihre Umzugskosten und erhalten Sie verbindliche Offerten von Schweizer Umzugsfirmen.';
      case 'variant-c':
        return 'Beantworten Sie ein paar Fragen und wir finden die perfekte Umzugsfirma für Sie.';
      default:
        return 'Erhalten Sie gratis Umzugsofferten von geprüften Umzugsfirmen in der Schweiz. Schnell vergleichen, transparente Preise.';
    }
  };

  // Service Schema for SEO
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Umzugsofferten vergleichen - ${variant.name}`,
    "description": getDescription(),
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

  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>{getTitle()}</title>
        <meta name="description" content={getDescription()} />
        <meta name="robots" content="noindex, nofollow" /> {/* Variant pages not indexed */}
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      <main id="main-content">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">{variant.headline}</h1>
          <Breadcrumbs items={[{ label: "Umzugsofferten vergleichen" }]} />
          
          {/* Variant indicator for testing */}
          <div className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
            <span className="font-medium">Variante:</span>
            <span>{variant.name}</span>
            <span className="text-muted-foreground/60">({variant.id})</span>
          </div>
        </div>

        {/* Hero with Configurable Calculator */}
        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6">
          <MultiStepCalculatorVariant variant={variant} />
        </section>

        {/* AI Insights Strip - show based on variant */}
        {variant.showPriceEstimate && <AIInsightsBar />}

        {/* How It Works */}
        <HowItWorksSection />

        {/* Comparison Showcase - show based on variant */}
        {variant.showCompanyPreview && <ComparisonShowcase />}

        {/* Price Scenarios - show based on variant */}
        {variant.showSavingsCalculator && <PriceScenariosSection />}

        {/* Why Us */}
        <WhyUsSection />

        {/* Trust & Security - show based on variant */}
        {variant.trustBadges && <TrustAndSecuritySection />}

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <BottomFinalCTA />

        {/* Internal Links Section */}
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
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <h3 className="font-medium text-foreground text-xs sm:text-sm">Firmen finden</h3>
                <Link to="/umzugsfirmen" className="block text-primary hover:underline py-1 active:opacity-70">Alle Umzugsfirmen</Link>
                <Link to="/beste-umzugsfirma" className="block text-primary hover:underline py-1 active:opacity-70">Beste Umzugsfirmen</Link>
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <h3 className="font-medium text-foreground text-xs sm:text-sm">Services</h3>
                <Link to="/privatumzug" className="block text-primary hover:underline py-1 active:opacity-70">Privatumzug</Link>
                <Link to="/firmenumzug" className="block text-primary hover:underline py-1 active:opacity-70">Firmenumzug</Link>
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <h3 className="font-medium text-foreground text-xs sm:text-sm">Varianten testen</h3>
                <Link to="/umzugsofferten" className="block text-primary hover:underline py-1 active:opacity-70">Control</Link>
                <Link to="/umzugsofferten-v2" className="block text-primary hover:underline py-1 active:opacity-70">Variant A</Link>
                <Link to="/umzugsofferten-v3" className="block text-primary hover:underline py-1 active:opacity-70">Variant B</Link>
                <Link to="/umzugsofferten-v4" className="block text-primary hover:underline py-1 active:opacity-70">Variant C</Link>
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

export default UmzugsoffertenVariant;
