/**
 * /umzugsofferten-v3a - Test Version V3.a (Mobile First)
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
import { V3aMobileFirst } from "@/components/calculator-variants";
import { Link } from "react-router-dom";

const UmzugsoffertenV3a = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>V3.a Test | Mobile First | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">V3.a Test - Mobile First Calculator</h1>
          <Breadcrumbs items={[{ label: "V3.a Test (Mobile First)" }]} />
        </div>

        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-8">
          <V3aMobileFirst />
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
              Test-Versionen
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">V3 Serie</h3>
                <Link to="/umzugsofferten-v3" className="block text-primary hover:underline py-1">V3 Baseline</Link>
                <Link to="/umzugsofferten-v3a" className="block text-primary hover:underline py-1 font-bold">V3.a (Mobile First)</Link>
                <Link to="/umzugsofferten-v3b" className="block text-primary hover:underline py-1">V3.b (Swipe Nav)</Link>
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

export default UmzugsoffertenV3a;
