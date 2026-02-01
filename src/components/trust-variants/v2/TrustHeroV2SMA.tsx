/**
 * TrustHeroV2SMA - Hero mit SMA-Badge
 * V2 Branchen-Fokus: Verbandslegitimität im Vordergrund
 */

import { memo } from "react";
import { Award, Shield, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const TrustHeroV2SMA = memo(() => {
  return (
    <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* SMA Badge - Prominent */}
          <div className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg mb-8">
            <Award className="w-6 h-6" />
            <div className="text-left">
              <div className="font-bold">SMA-zertifizierte Partner</div>
              <div className="text-xs opacity-90">Swiss Movers Association</div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Nur die besten Umzugsfirmen
            <br />
            <span className="text-primary">Branchenverband-geprüft</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unsere Partner erfüllen die strengen Qualitätsstandards der Swiss Movers Association. 
            Professionell. Zuverlässig. Zertifiziert.
          </p>

          {/* Trust Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">ASTAG Mitglied</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
              <Truck className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">SPEDLOGSWISS</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">ISO 9001</span>
            </div>
          </div>

          {/* CTA */}
          <Link to="/umzugsofferten">
            <Button size="lg" className="px-8 py-6 text-lg shadow-lg">
              Zertifizierte Partner finden
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            Alle Partner durchlaufen eine strenge Qualitätsprüfung
          </p>
        </div>
      </div>
    </section>
  );
});

TrustHeroV2SMA.displayName = "TrustHeroV2SMA";
