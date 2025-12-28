/**
 * /umzugsofferten-v1c - V1.c Test Version
 * 
 * Based on Gemini Pro (V1c) strategic feedback:
 * - Archetyp Wizard with conversational questions
 * - Heavy psychology/persuasion elements
 * - Multi-step guided experience
 */

import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { V1cFeedbackBased } from "@/components/calculator-variants";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const UmzugsoffertenV1c = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>V1.c Test | Umzugsofferten | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">V1.c Test - Umzugsofferten</h1>
          <div className="flex items-center gap-2">
            <Breadcrumbs items={[{ label: "V1.c Test" }]} />
            <Badge variant="secondary" className="text-[10px]">
              Gemini Pro (Strategic)
            </Badge>
          </div>
        </div>

        {/* Hero with V1c Calculator */}
        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-8">
          <V1cFeedbackBased />
        </section>

        {/* Condensed Trust Section */}
        <section className="py-6 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>15'000+ erfolgreiche Umzüge</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>200+ geprüfte Partnerfirmen</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Ø 4.8/5 Kundenzufriedenheit</span>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="py-8 bg-background border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Weitere hilfreiche Seiten
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
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

export default UmzugsoffertenV1c;
