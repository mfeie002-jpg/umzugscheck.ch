/**
 * MediaLogosSection VARIANT C - Trust Hierarchy (Authority Logos oben)
 * 
 * VERSION 3: Authority → Logic → Emotion flow
 * - Row 1: Media logos (NZZ, SRF, Blick) - Authority
 * - Row 2: Quality seals (ASTAG, Versicherung) - Logic
 * - Row 3: Rating summary - Emotion
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Truck, Building2, CheckCircle2 } from "lucide-react";

// Media logos - Authority tier
const mediaLogos = [
  { name: "SRF", abbr: "SRF", color: "hover:text-red-600" },
  { name: "NZZ", abbr: "NZZ", color: "hover:text-blue-900" },
  { name: "20 Minuten", abbr: "20min", color: "hover:text-blue-600" },
  { name: "Blick", abbr: "Blick", color: "hover:text-red-500" },
  { name: "Watson", abbr: "watson", color: "hover:text-violet-600" },
];

// Quality seals - Logic tier
const qualitySeals = [
  {
    id: "astag",
    name: "ASTAG",
    label: "Verbandsmitglied",
    Icon: Truck,
    iconColor: "text-primary",
  },
  {
    id: "versicherung",
    name: "Versichert",
    label: "Bis CHF 2 Mio.",
    Icon: Shield,
    iconColor: "text-primary",
  },
  {
    id: "handelsregister",
    name: "Handelsregister",
    label: "Geprüfte Firmen",
    Icon: Building2,
    iconColor: "text-foreground",
  },
  {
    id: "verifiziert",
    name: "200+",
    label: "Geprüfte Firmen",
    Icon: CheckCircle2,
    iconColor: "text-primary",
  },
];

export const MediaLogosSectionVariantC = memo(function MediaLogosSectionVariantC() {
  return (
    <section className="py-6 md:py-10 bg-muted/20 dark:bg-muted/30 border-y border-border/30">
      <div className="container max-w-5xl px-4">
        
        {/* ROW 1: MEDIA LOGOS - Authority */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
            Bekannt aus Schweizer Medien
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            {mediaLogos.map((logo) => (
              <span
                key={logo.name}
                className={`text-sm md:text-base font-bold text-muted-foreground/60 
                           ${logo.color} transition-colors cursor-default`}
              >
                {logo.abbr}
              </span>
            ))}
          </div>
        </motion.div>
        
        {/* Divider */}
        <div className="w-20 h-px bg-border mx-auto mb-6" />
        
        {/* ROW 2: QUALITY SEALS - Logic */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6"
        >
          {qualitySeals.map((seal) => (
            <div
              key={seal.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50 
                         hover:border-border hover:shadow-sm transition-all"
            >
              <seal.Icon className={`w-4 h-4 ${seal.iconColor}`} />
              <div className="text-left">
                <span className="text-xs font-semibold text-foreground block leading-tight">{seal.name}</span>
                <span className="text-[10px] text-muted-foreground">{seal.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* ROW 3: RATING - Emotion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm">
            <strong className="text-foreground">4.8/5</strong>
            <span className="text-muted-foreground ml-1">aus 2'847 Bewertungen</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
});
