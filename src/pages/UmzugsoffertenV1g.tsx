/**
 * /umzugsofferten-v1g - V1g Input UX + Inline Validation
 * 
 * UX Improvements:
 * - EnhancedFormField with inline validation
 * - Mobile-optimized inputMode + enterKeyHint
 * - Completion indicators
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
import { V1gInputUX } from "@/components/calculator-variants";
import { Link } from "react-router-dom";

const UmzugsoffertenV1g = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>V1g Test | Input UX + Validation | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">V1g Test - Input UX + Validation</h1>
          <Breadcrumbs items={[{ label: "V1g Test (Input UX + Validation)" }]} />
        </div>

        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-8">
          <V1gInputUX />
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
                <Link to="/umzugsofferten-v1f" className="block text-primary hover:underline py-1">V1f Sticky CTA ⭐</Link>
                <Link to="/umzugsofferten-v1g" className="block text-primary hover:underline py-1 font-bold">V1g Input UX ⭐</Link>
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

export default UmzugsoffertenV1g;
