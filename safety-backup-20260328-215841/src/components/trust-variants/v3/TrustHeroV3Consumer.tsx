/**
 * TrustHeroV3Consumer - Hero mit Käuferschutz
 * V3 Konsumenten-Fokus: Emotionale Sicherheit
 */

import { memo } from "react";
import { Shield, RefreshCw, HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const TrustHeroV3Consumer = memo(() => {
  return (
    <section className="relative bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 dark:to-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Consumer Protection Badge */}
          <div className="inline-flex items-center gap-3 bg-success text-white px-6 py-3 rounded-full shadow-lg mb-8">
            <Shield className="w-6 h-6" />
            <div className="text-left">
              <div className="font-bold">100% Käuferschutz</div>
              <div className="text-xs opacity-90">Geld-zurück-Garantie</div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Umziehen ohne Risiko
            <br />
            <span className="text-success">Sie sind geschützt</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bei uns sind Sie auf der sicheren Seite. Volle Transparenz, 
            versicherte Partner und Zufriedenheitsgarantie.
          </p>

          {/* Guarantee Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="bg-card rounded-xl p-4 border border-success/20 text-center">
              <Shield className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="font-semibold text-foreground">Vollversichert</div>
              <div className="text-sm text-muted-foreground">Bis CHF 2 Mio.</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-success/20 text-center">
              <RefreshCw className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="font-semibold text-foreground">30 Tage Garantie</div>
              <div className="text-sm text-muted-foreground">Geld zurück</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-success/20 text-center">
              <HeartHandshake className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="font-semibold text-foreground">Trusted Shops</div>
              <div className="text-sm text-muted-foreground">Zertifiziert</div>
            </div>
          </div>

          {/* CTA */}
          <Link to="/umzugsofferten">
            <Button size="lg" className="bg-success hover:bg-success/90 text-white px-8 py-6 text-lg shadow-lg">
              Sicher vergleichen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Kostenlos
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Unverbindlich
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Keine Risiken
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

TrustHeroV3Consumer.displayName = "TrustHeroV3Consumer";
