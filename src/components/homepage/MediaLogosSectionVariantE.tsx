/**
 * MediaLogosSection VARIANT E - Swiss Trust Strip (Minimalist)
 * 
 * VERSION 5: Single unified strip - Schweizer Fokus
 * - Minimal height, maximum trust density
 * - Nur verifizierbare Schweizer Siegel
 * - Clean separator dots
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Truck, CheckCircle2, Award } from "lucide-react";
import { TRUST } from "@/content/trust";

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
          {/* ASTAG */}
          <div className="flex items-center gap-1.5 text-primary">
            <Truck className="w-3.5 h-3.5" />
            <span className="font-medium">ASTAG Mitglied</span>
          </div>
          
          {/* Separator */}
          <span className="hidden md:inline text-border">|</span>
          
          {/* Swiss Label */}
          <div className="flex items-center gap-1.5 text-[#D52B1E]">
            <Award className="w-3.5 h-3.5" />
            <span className="font-medium">Swiss Label</span>
          </div>
          
          {/* Separator */}
          <span className="hidden md:inline text-border">|</span>
          
          {/* Versichert */}
          <div className="flex items-center gap-1.5 text-[#E2001A]">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-medium">Bis CHF 2 Mio. versichert</span>
          </div>
          
          {/* Separator */}
          <span className="hidden md:inline text-border">|</span>
          
          {/* Firmen */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span><strong className="text-foreground">{TRUST.companiesCount}</strong> geprüfte Firmen</span>
          </div>
          
          {/* Separator */}
          <span className="hidden md:inline text-border">|</span>
          
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-muted-foreground">
              <strong className="text-foreground">{TRUST.ratingValue}</strong>/5
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
