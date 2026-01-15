/**
 * GOLD STANDARD - Offer Comparison Emphasis
 * "Bis zu 5 Offerten vergleichen" block
 * ChatGPT recommendation: Emphasize comparison benefits like competitors
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, ArrowRight, CheckCircle, 
  TrendingUp, Clock, Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RegionOfferComparisonProps {
  regionName: string;
  variant?: 'canton' | 'city';
}

export const RegionOfferComparison = memo(({ 
  regionName, 
  variant = 'canton' 
}: RegionOfferComparisonProps) => {
  const locationPrefix = variant === 'canton' ? 'im Kanton' : 'in';
  
  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-2xl border border-primary/20 p-6 md:p-10"
        >
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              Bis zu 40% günstiger durch Vergleich
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Bis zu 5 Offerten gratis vergleichen
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Erhalten Sie unverbindliche Angebote von geprüften Umzugsfirmen 
              {locationPrefix} {regionName} – das beste Preis-Leistungs-Verhältnis garantiert.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border/50">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">100% kostenlos</p>
                <p className="text-xs text-muted-foreground">Keine Gebühren</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border/50">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">24-48h Antwort</p>
                <p className="text-xs text-muted-foreground">Schnell & direkt</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border/50">
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Geprüfte Partner</p>
                <p className="text-xs text-muted-foreground">Alle versichert</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="h-14 px-8 text-base font-bold gradient-cta text-white shadow-strong"
              asChild
            >
              <Link to="/umzugsofferten">
                <FileText className="w-5 h-5 mr-2" />
                Jetzt Gratis-Offerten erhalten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              ✓ Unverbindlich · ✓ In 2 Minuten · ✓ Keine Registrierung nötig
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

RegionOfferComparison.displayName = 'RegionOfferComparison';
