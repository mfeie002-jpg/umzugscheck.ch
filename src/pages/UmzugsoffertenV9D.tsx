/**
 * /umzugsofferten-v9d - V9.D Archetyp Version
 * 
 * Implements strategic analysis recommendations:
 * - Prio 1: Google Places Autocomplete (enhanced)
 * - Prio 2: Mobile Input Modes
 * - Prio 3: Result Teasing (Glimp-Methode)
 * - Prio 5: Progressive Disclosure
 * - Prio 6: Conditional Logic
 * - Prio 7: Trust Badges Above the Fold
 * - Prio 8: Sticky CTA on Mobile
 * - Prio 9: Labor Illusion Loading
 * - Prio 10: Swissness Wording
 */

import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArchetypWizardV9D } from "@/components/zerofriction-v9/ArchetypWizardV9D";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const UmzugsoffertenV9D = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>V9.D Archetyp | Zügel-Offerten | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <h1 className="sr-only">V9.D Archetyp - Zügel-Offerten</h1>
          <div className="flex items-center gap-2">
            <Breadcrumbs items={[{ label: "V9.D Archetyp" }]} />
            <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 border-amber-200">
              Strategic Analysis
            </Badge>
          </div>
        </div>

        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-4 sm:pt-6 pb-8">
          <ArchetypWizardV9D />
        </section>

        <section className="py-6 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">✓ 15'000+ erfolgreiche Umzüge</span>
              <span className="flex items-center gap-2">✓ 200+ geprüfte Partner</span>
              <span className="flex items-center gap-2">✓ Ø 4.8/5 Kundenzufriedenheit</span>
            </div>
          </div>
        </section>

        <section className="py-8 bg-background border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-base font-semibold text-foreground mb-4">Test-Versionen</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <Link to="/umzugsofferten-v9" className="text-primary hover:underline">V9 Baseline</Link>
              <Link to="/umzugsofferten-v9d" className="text-primary hover:underline font-bold">V9.D Archetyp ⭐</Link>
              <Link to="/flow-tester" className="text-primary hover:underline">Flow Tester</Link>
              <Link to="/admin/tools" className="text-primary hover:underline">Admin Tools</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UmzugsoffertenV9D;
