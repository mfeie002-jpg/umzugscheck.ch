/**
 * /umzugsofferten-v1a - Test Version V1.a with ChatGPT UX Improvements
 * 
 * This version includes the following ChatGPT-recommended UX improvements:
 * 1. PLZ/Ort Autocomplete with extended postal code list
 * 2. "Datum noch nicht fix" option for flexible move dates
 * 3. Improved category button layout (centered 2x2 grid)
 * 4. Enhanced selection indicators (larger checkmarks)
 * 5. Minimum font size 12px for better readability
 * 6. Progress bar (Schritt X von 4)
 * 7. Back navigation button
 * 8. "100% kostenlos & unverbindlich" reminder at submit
 * 9. "Empfohlen" badge for pre-selected companies
 * 10. Mobile-friendly input types (autocomplete attributes)
 * 
 * Changes here do NOT affect the live /umzugsofferten page.
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
import { MultiStepCalculatorV1 } from "@/components/funnel-v1";
import { Link } from "react-router-dom";

const UmzugsoffertenV1a = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>V1.a Test | ChatGPT UX | Umzugsofferten | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        {/* Test Banner */}
        <div className="bg-amber-500 text-amber-950 text-center py-2 px-4 text-sm font-medium">
          🧪 Test V1.a – ChatGPT Mobile UX Optimierungen
        </div>

        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">V1.a Test - Umzugsofferten mit UX-Verbesserungen</h1>
          <Breadcrumbs items={[{ label: "V1.a Test (ChatGPT UX)" }]} />
        </div>

        {/* Hero with V1 Calculator (ChatGPT improvements) */}
        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6">
          <MultiStepCalculatorV1 />
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

export default UmzugsoffertenV1a;
