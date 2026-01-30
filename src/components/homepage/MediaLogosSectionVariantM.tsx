/**
 * MediaLogosSection VARIANT M - "Hero Reassurance"
 * 
 * VERSION 13: Trust logos integrated UNDER the left CTA in Hero
 * 
 * This variant moves trust signals INTO the Hero section (under left text block)
 * The separate MediaLogosSection is therefore minimal/hidden
 * 
 * Features:
 * - Minimal below-fold section (trust already shown in Hero)
 * - Just a subtle separator with key stats
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Users } from "lucide-react";

export const MediaLogosSectionVariantM = memo(function MediaLogosSectionVariantM() {
  return (
    <section className="py-3 bg-muted/30 border-b border-border/30">
      <div className="container max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Versicherte Partner</span>
          </div>
          <span className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>15'000+ Umzüge</span>
          </div>
          <span className="w-px h-4 bg-border hidden md:block" />
          <div className="hidden md:flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>4.8/5 Bewertung</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantM;
