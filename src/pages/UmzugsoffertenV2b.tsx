/**
 * /umzugsofferten-v2b - V2.b ChatGPT Agent Feedback
 * 
 * Based on ChatGPT V2.b Feedback:
 * - Address Auto-Completion
 * - Separate data and size steps  
 * - Personal package recommendation
 * - Package comparison tooltips
 * - Info tooltips for additional services
 * - Calendar date picker with flex options
 * - Extended progress display with step names
 * - Phone number optional
 * - Testimonials and trust seals
 * - Price range explanations
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
import { V2bFeedbackBased } from "@/components/calculator-variants";
import { Link } from "react-router-dom";

const UmzugsoffertenV2b = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>V2.b ChatGPT Agent | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">V2.b Calculator - ChatGPT Agent Feedback</h1>
          <Breadcrumbs items={[{ label: "V2.b ChatGPT Agent" }]} />
        </div>

        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-8">
          <V2bFeedbackBased />
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
              V2 Feedback-Versionen
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">V2 Serie</h3>
                <Link to="/umzugsofferten-v2" className="block text-primary hover:underline py-1">V2 Baseline</Link>
                <Link to="/umzugsofferten-v2a" className="block text-primary hover:underline py-1">V2.a (Gemini)</Link>
                <Link to="/umzugsofferten-v2b" className="block text-primary hover:underline py-1 font-bold">V2.b (ChatGPT)</Link>
                <Link to="/umzugsofferten-v2c" className="block text-primary hover:underline py-1">V2.c (Archetyp)</Link>
                <Link to="/umzugsofferten-v2d" className="block text-primary hover:underline py-1">V2.d (ChatGPT Pro)</Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">Tools</h3>
                <Link to="/flow-tester" className="block text-primary hover:underline py-1">Flow Tester</Link>
                <Link to="/admin/flow-deep-analysis" className="block text-primary hover:underline py-1">Deep Analysis</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomStickyCTA />
    </div>
  );
};

export default UmzugsoffertenV2b;
