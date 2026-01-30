/**
 * Variant AA (V24) - Form Anchor / Integrierte Karte
 * 
 * Research Pattern: Trust integrated inside/attached to form card
 * - Trust elements as footer of the form card
 * - Rating + Guarantee combo near CTA
 * - "Mikro-Proximität" principle
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, CheckCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const MediaLogosSectionVariantAA = memo(function MediaLogosSectionVariantAA() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-4"
    >
      <div className="container mx-auto px-4">
        {/* Form Anchor Card */}
        <div className={cn(
          "max-w-2xl mx-auto",
          "bg-card rounded-xl border border-border/50",
          "shadow-lg overflow-hidden"
        )}>
          {/* Main Content Area (simulated form area) */}
          <div className="p-4 md:p-6 bg-gradient-to-b from-muted/30 to-transparent">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Ihr Formular erscheint hier...
            </p>
            
            {/* CTA Preview */}
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <span className="text-primary font-semibold">[ Preise vergleichen ]</span>
            </div>
            
            {/* Micro-Trust Under CTA */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Kostenlos, unverbindlich & vollversichert</span>
            </div>
          </div>
          
          {/* Trust Footer (The Integration) */}
          <div className={cn(
            "px-4 py-3",
            "bg-muted/40 border-t border-border/30"
          )}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Rating Cluster */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold">4.8/5</span>
                <span className="text-xs text-muted-foreground">(15'000+ Umzüge)</span>
              </div>
              
              {/* Guarantee Badges */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-alpine" />
                  <span>Vollversichert</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Abnahmegarantie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default MediaLogosSectionVariantAA;
