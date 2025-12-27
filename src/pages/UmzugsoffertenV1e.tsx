/**
 * /umzugsofferten-v1e - V1.e Enhanced Trust & Transparency
 * 
 * Based on V1.d + UX Analysis improvements:
 * - Trust badges and social proof
 * - Process timeline
 * - Enhanced progress indicators
 */

import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MultiStepCalculatorV1e } from "@/components/funnel-v1e";

const UmzugsoffertenV1e = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsofferten V1.e Test | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-4">
        <Breadcrumbs items={[{ label: "V1.e Trust Enhanced Test" }]} />
      </div>

      <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-32 md:pb-8">
        <MultiStepCalculatorV1e />
      </section>
    </div>
  );
};

export default UmzugsoffertenV1e;
