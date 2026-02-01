/**
 * TrustHeroV1Zefix - Hero mit Zefix-Link
 * V1 Behörden-Fokus: Staatliche Autorität im Vordergrund
 */

import { memo } from "react";
import { Building2, ExternalLink, FileCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const TrustHeroV1Zefix = memo(() => {
  return (
    <section className="relative bg-gradient-to-b from-red-50 to-background dark:from-red-950/20 dark:to-background py-16 md:py-24">
      {/* Swiss Flag Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-card border border-red-200 dark:border-red-900 px-4 py-2 rounded-lg shadow-sm mb-6">
            <Building2 className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium">Offiziell im Handelsregister eingetragen</span>
            <a
              href="https://www.zefix.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Umzugsfirmen vergleichen
            <br />
            <span className="text-red-600">100% verifiziert</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Alle Partner sind im Schweizerischen Handelsregister (Zefix) eingetragen. 
            Keine anonymen Anbieter – nur geprüfte Unternehmen.
          </p>

          {/* CTA with UID */}
          <div className="space-y-4">
            <Link to="/umzugsofferten">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
                Jetzt Offerten anfragen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileCheck className="w-4 h-4 text-red-600" />
              <span>UID: CHE-XXX.XXX.XXX</span>
              <span className="text-red-600">•</span>
              <span>Schweizer Unternehmen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

TrustHeroV1Zefix.displayName = "TrustHeroV1Zefix";
