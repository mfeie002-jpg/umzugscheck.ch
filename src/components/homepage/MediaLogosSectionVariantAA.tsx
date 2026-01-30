/**
 * Variant AA (V24) - Form Anchor / Integrierte Karte
 * 
 * CRO Research Pattern: "Input Proximity" model
 * - Trust integrated inside/attached to form card footer
 * - Rating + Guarantee combo directly under CTA (Point of Anxiety)
 * - "Mikro-Proximität" principle: validation at decision point
 * - Psychological flow: Trigger -> Action -> Reassurance
 * - Max 50px trust footer on mobile
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, CheckCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDIA_NAMES = ["SRF", "TCS", "NZZ"];

export const MediaLogosSectionVariantAA = memo(function MediaLogosSectionVariantAA() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-4"
      aria-label="Formular mit Trust-Integration"
    >
      <div className="container mx-auto px-4">
        {/* Form Anchor Card - Simulates form with integrated trust */}
        <div className={cn(
          "max-w-2xl mx-auto",
          "bg-card rounded-xl border border-border/50",
          "shadow-lg overflow-hidden"
        )}>
          {/* Main Content Area (simulated form area) */}
          <div className="p-4 md:p-6 bg-gradient-to-b from-muted/30 to-transparent">
            <p className="text-sm text-muted-foreground text-center mb-4">
              [Formularfelder: Wohnungsgröße, PLZ, Datum]
            </p>
            
            {/* CTA Preview */}
            <div className="bg-primary rounded-lg p-3 text-center cursor-pointer hover:bg-primary/90 transition-colors">
              <span className="text-primary-foreground font-semibold">Preise jetzt vergleichen</span>
            </div>
            
            {/* Micro-Trust Under CTA - Point of Anxiety */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Kostenlos, unverbindlich & vollversichert</span>
            </div>
          </div>
          
          {/* Trust Footer (The Integration) - max 50px on mobile */}
          <div className={cn(
            "px-4 py-3 min-h-[50px]",
            "bg-muted/40 border-t border-border/30"
          )}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
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
              
              {/* Media Logos - Condensed */}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                <span>Bekannt aus</span>
                {MEDIA_NAMES.map((name, idx) => (
                  <span key={name} className="font-bold">
                    {name}{idx < MEDIA_NAMES.length - 1 && ","}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Guarantee Badges - Row 2 on mobile */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2 sm:hidden">
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
    </motion.section>
  );
});

export default MediaLogosSectionVariantAA;
