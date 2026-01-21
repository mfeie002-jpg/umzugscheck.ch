/**
 * V10 Smart Router - Based on Gemini UX Audit
 * 
 * Key improvements:
 * - Single PLZ entry (Hick's Law - minimal cognitive load)
 * - Smart routing based on room count (Video for >2.5 Zi)
 * - Swiss-focused trust signals (Treuhand, Swiss Server)
 * - Festpreis headline (outcome, not process)
 * - No "100% Kostenlos" (Swiss market context)
 */

import { Helmet } from "react-helmet";
import { SmartRouterWizard } from "@/components/smart-router";
import { GoldenSocialProof } from "@/components/golden";

const V10SmartRouter = () => {
  return (
    <>
      <Helmet>
        <title>Umzug zum Festpreis | KI-gestützte Offerten | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Erhalten Sie einen garantierten Festpreis für Ihren Umzug. Keine Nachforderungen, keine Hausbesuche nötig. KI-Analyse in 2 Minuten." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Social Proof Strip */}
        <div className="container mx-auto px-4 py-6">
          <GoldenSocialProof variant="strip" className="mb-4" />
        </div>

        {/* Main Flow */}
        <div className="container mx-auto px-4 pb-12">
          <SmartRouterWizard />
        </div>

        {/* Bottom Trust Section */}
        <div className="container mx-auto px-4 py-8 border-t">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-lg font-semibold mb-2">
              Warum Smart Router?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Basierend auf UX-Forschung: Weniger Entscheidungen = höhere Zufriedenheit. 
              Wir führen Sie zum optimalen Weg für Ihre Wohnungsgrösse.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span>🇨🇭 Entwickelt in Zürich</span>
              <span>•</span>
              <span>🔒 Schweizer Server</span>
              <span>•</span>
              <span>📵 Keine Werbeanrufe</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default V10SmartRouter;
