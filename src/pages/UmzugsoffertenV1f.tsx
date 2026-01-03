/**
 * /umzugsofferten-v1f - V1f Sticky CTA + Trust Pills
 * 
 * UX Improvements:
 * - EnhancedStickyCTA with micro-feedback
 * - StepTrustPills per step context
 * - WhyThis component for transparency
 */

import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  AIInsightsBar,
  HowItWorksSection,
  WhyUsSection,
  TrustAndSecuritySection,
  TestimonialsSection,
  FAQSection,
  BottomFinalCTA,
  BottomStickyCTA,
  PageEnhancements,
} from "@/components/offerten-v2";
import { V1fStickyCTATrust } from "@/components/calculator-variants";
import { Link } from "react-router-dom";

const UmzugsoffertenV1f = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>V1f Test | Sticky CTA + Trust Pills | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">V1f Test - Sticky CTA + Trust Pills</h1>
          <Breadcrumbs items={[{ label: "V1f Test (Sticky CTA + Trust)" }]} />
        </div>

        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-8">
          <V1fStickyCTATrust />
        </section>

        <AIInsightsBar />
        <HowItWorksSection />
        <WhyUsSection />
        <TrustAndSecuritySection />
        <TestimonialsSection />
        <FAQSection />
        <BottomFinalCTA />

        <section className="py-8 sm:py-12 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
              V1 Serie - Test-Versionen
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">Baseline</h3>
                <Link to="/umzugsofferten-v1a" className="block text-primary hover:underline py-1">V1a Baseline</Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">UX Optimiert</h3>
                <Link to="/umzugsofferten-v1f" className="block text-primary hover:underline py-1 font-bold">V1f Sticky CTA ⭐</Link>
                <Link to="/umzugsofferten-v1g" className="block text-primary hover:underline py-1">V1g Input UX ⭐</Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">Tools</h3>
                <Link to="/flow-tester" className="block text-primary hover:underline py-1">Flow Tester</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomStickyCTA />
    </div>
  );
};

export default UmzugsoffertenV1f;
