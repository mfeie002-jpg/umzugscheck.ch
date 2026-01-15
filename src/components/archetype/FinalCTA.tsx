/**
 * FINAL CTA BLOCK
 * 
 * Bold call-to-action at the end of the page
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Star, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FinalCTAProps {
  placeName: string;
  placeKind: 'canton' | 'city';
  providerCount?: number;
  serviceName?: string;
}

export const FinalCTA = memo(({ 
  placeName, 
  placeKind,
  providerCount = 200,
  serviceName,
}: FinalCTAProps) => {
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';
  const contextText = serviceName || 'Ihren Umzug';
  
  return (
    <section className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Bereit für {contextText} {locationPrefix} {placeName}?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Vergleichen Sie jetzt {providerCount}+ geprüfte Firmen 
            und sparen Sie bis zu 40%.
          </p>

          {/* Trust Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>100% kostenlos</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Shield className="w-4 h-4" />
              <span>Unverbindlich</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Clock className="w-4 h-4" />
              <span>24h Offerten</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>4.8/5 Bewertung</span>
            </div>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="h-14 px-10 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg"
            asChild
          >
            <Link to="/umzugsofferten">
              Kostenlos Offerten erhalten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          {/* Micro-copy */}
          <p className="text-sm opacity-70 mt-4">
            Über 30'000 erfolgreiche Umzüge vermittelt
          </p>
        </motion.div>
      </div>
    </section>
  );
});

FinalCTA.displayName = 'FinalCTA';
