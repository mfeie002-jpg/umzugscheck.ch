/**
 * /umzugsofferten-v2a - Test Version V2.a
 * 
 * V2 variant series based on UmzugsoffertenVariant (variant-a = Premium).
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
import { PremiumCalculator } from "@/components/premium-v2/PremiumCalculator";
import { Link } from "react-router-dom";

const UmzugsoffertenV2a = () => {
  return (
    <div className="min-h-screen theme-premium-v2 bg-background">
      <PageEnhancements />
      <Helmet>
        <title>V2.a Test | Premium Calculator | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">V2.a Test - Premium Umzugsrechner</h1>
          <Breadcrumbs items={[{ label: "V2.a Test (Premium)" }]} />
        </div>

        {/* Hero with Premium Calculator */}
        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-8">
          <PremiumCalculator />
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
              Test-Versionen
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">V1 Serie</h3>
                <Link to="/umzugsofferten-baseline" className="block text-primary hover:underline py-1">Baseline</Link>
                <Link to="/umzugsofferten-v1a" className="block text-primary hover:underline py-1">V1.a (ChatGPT UX)</Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">V2 Serie</h3>
                <Link to="/umzugsofferten-v2" className="block text-primary hover:underline py-1">V2 Baseline</Link>
                <Link to="/umzugsofferten-v2a" className="block text-primary hover:underline py-1 font-bold">V2.a (Premium)</Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">Live</h3>
                <Link to="/umzugsofferten" className="block text-primary hover:underline py-1">Production</Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">Tools</h3>
                <Link to="/flow-tester" className="block text-primary hover:underline py-1">Flow Tester</Link>
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

export default UmzugsoffertenV2a;
