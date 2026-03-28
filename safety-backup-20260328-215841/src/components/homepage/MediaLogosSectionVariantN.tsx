/**
 * MediaLogosSection VARIANT N - "Hero Form Footer"
 * 
 * VERSION 14: Trust logos integrated INSIDE the form card in Hero
 * 
 * This variant moves trust signals INTO the Hero form card
 * The separate MediaLogosSection is therefore minimal/hidden
 * 
 * Features:
 * - Minimal below-fold section (trust already shown in Hero form)
 * - Reinforcement with different trust signals
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Award } from "lucide-react";

export const MediaLogosSectionVariantN = memo(function MediaLogosSectionVariantN() {
  return (
    <section className="py-3 bg-muted/30 border-b border-border/30">
      <div className="container max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 md:gap-6 text-xs text-muted-foreground flex-wrap"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Geprüfte Firmen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Antwort in 24h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>200+ Partner</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantN;
