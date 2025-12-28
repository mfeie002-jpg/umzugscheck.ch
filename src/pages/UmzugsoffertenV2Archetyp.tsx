/**
 * /umzugsofferten-v2-archetyp - V2 Archetyp Best-of-Best Calculator
 * 
 * Basiert auf der strategischen Marktanalyse für den Schweizer Umzugsmarkt:
 * - 4 Archetypen-orientiert (Security, Efficiency, Value, Overwhelmed)
 * - 6-Schritte Swiss Framework
 * - Swissness-Fokus mit Zügeltagen und Abnahmegarantie
 * - Movu-Differenzierung durch KI-Video-Inventar
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
import { V2ArchetypCalculator } from "@/components/calculator-variants";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Crown, Target, Shield, Zap } from "lucide-react";

const UmzugsoffertenV2Archetyp = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageEnhancements />
      <Helmet>
        <title>V2 Archetyp | Best-of-Best Calculator | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content">
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-4 max-w-6xl">
          <div className="flex items-center justify-between mb-2">
            <Breadcrumbs items={[{ label: "V2 Archetyp (Best-of-Best)" }]} />
            <Badge variant="default" className="gap-1">
              <Crown className="h-3 w-3" />
              Strategische Analyse
            </Badge>
          </div>
          <h1 className="sr-only">V2 Archetyp - Best-of-Best Swiss Calculator</h1>
        </div>

        {/* Feature Badges */}
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl mb-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="gap-1">
              <Target className="h-3 w-3" />
              4 Archetypen
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              6-Schritte Framework
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              Movu-Differenzierung
            </Badge>
          </div>
        </div>

        <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-2 sm:pt-4 pb-8">
          <V2ArchetypCalculator />
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
              Weitere Versionen
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">V1 Serie</h3>
                <Link to="/umzugsofferten-v1a" className="block text-primary hover:underline py-1">V1a Control</Link>
                <Link to="/umzugsofferten-v1c" className="block text-primary hover:underline py-1">V1c Archetyp</Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">V2 Serie</h3>
                <Link to="/umzugsofferten-v2-archetyp" className="block text-primary hover:underline py-1 font-bold">V2 Archetyp ⭐</Link>
                <Link to="/umzugsofferten-v2a" className="block text-primary hover:underline py-1">V2a Premium</Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">V9 Serie</h3>
                <Link to="/umzugsofferten-v9d" className="block text-primary hover:underline py-1">V9d Gemini Pro</Link>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground text-xs">Tools</h3>
                <Link to="/admin/flow-deep-analysis" className="block text-primary hover:underline py-1">Flow Analyse</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomStickyCTA />
    </div>
  );
};

export default UmzugsoffertenV2Archetyp;
