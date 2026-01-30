/**
 * MediaLogosSection VARIANT E - Trust Strip 2.0 (Unified)
 * 
 * VERSION 5: Single unified strip
 * - Minimal height, maximum trust density
 * - Consistent visual style
 * - All elements inline
 * - Clean separator dots
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Truck, CheckCircle2 } from "lucide-react";

export const MediaLogosSectionVariantE = memo(function MediaLogosSectionVariantE() {
  return (
    <section className="py-3 md:py-4 bg-card border-y border-border/50">
      <div className="container px-4">
        
        {/* UNIFIED STRIP */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:text-sm"
        >
          {/* Media */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-[10px] uppercase tracking-wide">Bekannt aus</span>
            <span className="font-semibold text-foreground/70">SRF · NZZ · Blick</span>
          </div>
          
          {/* Separator */}
          <span className="hidden md:inline text-border">|</span>
          
          {/* ASTAG */}
          <div className="flex items-center gap-1.5 text-primary">
            <Truck className="w-3.5 h-3.5" />
            <span className="font-medium">ASTAG Mitglied</span>
          </div>
          
          {/* Separator */}
          <span className="hidden md:inline text-border">|</span>
          
          {/* Versichert */}
          <div className="flex items-center gap-1.5 text-primary">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-medium">Bis 2 Mio. CHF versichert</span>
          </div>
          
          {/* Separator */}
          <span className="hidden md:inline text-border">|</span>
          
          {/* Firmen */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span><strong className="text-foreground">200+</strong> geprüfte Firmen</span>
          </div>
          
          {/* Separator */}
          <span className="hidden md:inline text-border">|</span>
          
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-muted-foreground">
              <strong className="text-foreground">4.8</strong>/5
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
