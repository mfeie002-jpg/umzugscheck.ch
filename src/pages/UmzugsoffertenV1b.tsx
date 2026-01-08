/**
 * /umzugsofferten-v1b - V1.b Test Version
 * 
 * Based on /umzugsofferten-baseline with ChatGPT V1 Analysis improvements:
 * 1. Marketing blocks reduced/condensed
 * 2. Service selection simplified (show only important first)
 * 3. PLZ autocomplete enhanced
 * 4. Sticky CTA on mobile
 * 5. Company pre-selection explanation
 * 6. Tooltips for offer methods
 * 7. Visual CTA differentiation (primary vs secondary)
 * 8. Reduced company card info density
 * 9. Real-time contact validation
 * 10. Visual selection confirmation in Step 1
 */

import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MultiStepCalculatorV1b } from "@/components/funnel-v1b/MultiStepCalculatorV1b";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const UmzugsoffertenV1b = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>V1.b Test | Umzugsofferten | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>

      <main id="main-content" className="overflow-x-hidden">
        {/* Breadcrumbs - FIX: Responsive with overflow control */}
        <div className="container mx-auto px-3 sm:px-6 pt-3 sm:pt-4 max-w-6xl overflow-hidden">
          <h1 className="sr-only">V1.b Test - Umzugsofferten</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Breadcrumbs items={[{ label: "V1.b Test" }]} />
            <Badge variant="secondary" className="text-[10px] shrink-0">
              ChatGPT V1 Analysis
            </Badge>
          </div>
        </div>

        {/* Hero with Optimized Calculator - V1.b Version */}
        <section className="container mx-auto px-2 sm:px-6 max-w-6xl pt-3 sm:pt-6 pb-8">
          <MultiStepCalculatorV1b />
        </section>

        {/* Condensed Trust Section - ChatGPT Rec #1: Marketing reduced */}
        <section className="py-4 sm:py-6 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-green-500">✓</span>
                <span>15'000+ Umzüge</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-green-500">✓</span>
                <span>200+ Partnerfirmen</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-green-500">✓</span>
                <span>Ø 4.8/5 Zufriedenheit</span>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links Section - Reduced */}
        <section className="py-6 sm:py-8 bg-background border-t border-border">
          <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
            <h2 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">
              Weitere hilfreiche Seiten
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
              <Link to="/" className="text-primary hover:underline">Startseite</Link>
              <Link to="/umzugsfirmen" className="text-primary hover:underline">Alle Umzugsfirmen</Link>
              <Link to="/beste-umzugsfirma" className="text-primary hover:underline">Beste Umzugsfirmen</Link>
              <Link to="/guenstige-umzugsfirma" className="text-primary hover:underline">Günstige Umzugsfirmen</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UmzugsoffertenV1b;
