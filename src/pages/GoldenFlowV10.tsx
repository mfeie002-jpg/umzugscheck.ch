/**
 * Golden Flow V10 - The optimized 4-step conversion funnel
 * 
 * Combines best practices from:
 * - V9 Zero Friction (minimal inputs, instant price preview)
 * - V1 Conversion patterns (trust pills, expandable service cards)
 * - Mobile-first design with sticky CTAs
 * - Labor illusion loading for perceived value
 */

import { GoldenFlowWizard } from "@/components/golden-flow";
import { Helmet } from "react-helmet";

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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <GoldenFlowWizard />
      </div>
    </>
  );
};

export default GoldenFlowV10Page;
