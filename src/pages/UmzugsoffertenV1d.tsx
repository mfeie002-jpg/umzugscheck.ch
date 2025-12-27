/**
 * /umzugsofferten-v1d - V1.d Optimized Funnel
 * 
 * Based on ChatGPT UX Audit with Top 10 improvements:
 * - Sticky CTA, simplified services, green "Both" option, etc.
 */

import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MultiStepCalculatorV1d } from "@/components/funnel-v1d";

const UmzugsoffertenV1d = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsofferten V1.d Test | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-4">
        <Breadcrumbs items={[{ label: "V1.d Optimized Test" }]} />
      </div>

      <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-32 md:pb-8">
        <MultiStepCalculatorV1d />
      </section>
    </div>
  );
};

export default UmzugsoffertenV1d;
