/**
 * Golden Flow V10 - The optimized 4-step conversion funnel
 * 
 * Combines best practices from:
 * - V9 Zero Friction (minimal inputs, instant price preview)
 * - V1 Conversion patterns (trust pills, expandable service cards)
 * - Mobile-first design with sticky CTAs
 * - Labor illusion loading for perceived value
 * 
 * Features:
 * - GoldenNavigation (V15-based optimized nav)
 * - GoldenSocialProof (trust elements)
 * - KI-Video-Analyse USP prominently featured
 */

import { GoldenFlowWizard } from "@/components/golden-flow";
import { GoldenNavigation, GoldenSocialProof, GoldenTrustBadges } from "@/components/golden";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/Footer";

const GoldenFlowV10Page = () => {
  return (
    <>
      <Helmet>
        <title>Umzugsofferten vergleichen | Kostenlos & unverbindlich | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Vergleichen Sie in 2 Minuten Umzugsofferten von geprüften Schweizer Umzugsfirmen. Kostenlos, unverbindlich und ohne Werbeanrufe." 
        />
      </Helmet>

      {/* Golden Navigation */}
      <GoldenNavigation />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pt-20">
        {/* Hero Section with Social Proof */}
        <div className="container mx-auto px-4 py-6">
          <GoldenSocialProof variant="strip" className="mb-6" />
        </div>

        {/* Main Flow */}
        <div className="container mx-auto px-4 pb-12">
          <GoldenFlowWizard />
        </div>

        {/* Bottom Trust Section */}
        <div className="container mx-auto px-4 py-8 border-t">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Warum Umzugscheck.ch?</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Seit 2018 verbinden wir Schweizer Haushalte mit geprüften Umzugsfirmen – 
              kostenlos, transparent und mit KI-gestützter Präzision.
            </p>
          </div>
          <GoldenTrustBadges preset="premium" className="justify-center" />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GoldenFlowV10Page;
