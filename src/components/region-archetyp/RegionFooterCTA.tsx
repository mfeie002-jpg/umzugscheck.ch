/**
 * GOLD STANDARD - Footer CTA Section
 * "Bereit für deinen Umzug?" with strong call-to-action
 * ChatGPT recommendation: Bold final CTA that restates the offer
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Star, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface RegionFooterCTAProps {
  regionName: string;
  providerCount?: number;
  variant?: 'canton' | 'city';
}

export const RegionFooterCTA = memo(({ 
  regionName, 
  providerCount = 200,
  variant = 'canton' 
}: RegionFooterCTAProps) => {
  const flowPath = useFlowPath();
  const locationPrefix = variant === 'canton' ? 'im Kanton' : 'in';
  
  return (
    <section id="offerten" className="py-16 md:py-20 bg-primary text-primary-foreground scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Bereit für Ihren Umzug {locationPrefix} {regionName}?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Vergleichen Sie jetzt {providerCount}+ geprüfte Umzugsfirmen 
            und sparen Sie bis zu 40% bei Ihrem nächsten Umzug.
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
            <Link to={flowPath}>
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

RegionFooterCTA.displayName = 'RegionFooterCTA';
