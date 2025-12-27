/**
 * /umzugsofferten-baseline - Baseline Test Version
 * 
 * This is an EXACT COPY of the live /umzugsofferten page for A/B testing.
 * Changes here do NOT affect the live page.
 * Use this as the starting point for new test versions (V1b, V1c, etc.)
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
import { Link } from "react-router-dom";

const UmzugsoffertenBaseline = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>Baseline Test | Umzugsofferten | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">

        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">Baseline Test - Umzugsofferten</h1>
          <Breadcrumbs items={[{ label: "Baseline Test" }]} />
        </div>

        {/* Hero with Comparison Wizard - ORIGINAL MultiStepCalculator with no auto-advance for stable screenshots */}
        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6">
          <MultiStepCalculator initialStep={1} disableAutoAdvance={true} />
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

export default UmzugsoffertenBaseline;
