/**
 * /umzugsofferten-v4c - Test Version V4.c (Value First)
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
import { V4cValueFirst } from "@/components/calculator-variants";
import { Link } from "react-router-dom";

const UmzugsoffertenV4c = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>V4.c Test | Value First | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">V4.c Test - Value First Calculator</h1>
          <Breadcrumbs items={[{ label: "V4.c Test (Value First)" }]} />
        </div>

        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-8">
          <V4cValueFirst />
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
                <h3 className="font-medium text-foreground text-xs">V4 Serie</h3>
                <Link to="/umzugsofferten-v4" className="block text-primary hover:underline py-1">V4 Baseline</Link>
                <Link to="/umzugsofferten-v4c" className="block text-primary hover:underline py-1 font-bold">V4.c (Value First)</Link>
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

export default UmzugsoffertenV4c;
