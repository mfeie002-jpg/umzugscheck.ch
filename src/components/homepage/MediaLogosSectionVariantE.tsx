/**
 * MediaLogosSection VARIANT E - "Bekannt aus" with Real Logos
 * 
 * Based on reference design:
 * - 6 media partner cards in a row
 * - Real logos + website URLs
 * - "97% der Schweizer vertrauen Empfehlungen aus bekannten Medien" stat
 * - "Vertrauen Sie dem Marktführer" badge at top
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

// Import real logo images
import logo20min from "@/assets/media-logos/20minuten.png";
import logoBlick from "@/assets/media-logos/blick.png";
import logoWatson from "@/assets/media-logos/watson.png";
import logoNewhome from "@/assets/media-logos/newhome.png";

// Media partners with real logos
const mediaPartners = [
  {
    id: "20min",
    name: "20 Minuten",
    website: "20min.ch",
    logo: logo20min,
  },
  {
    id: "srf",
    name: "SRF",
    website: "srf.ch",
    // SRF uses styled text (no uploaded logo)
    logoComponent: (
      <div className="bg-[#C8102E] text-white font-bold text-sm px-3 py-1 rounded">
        SRF
      </div>
    ),
  },
  {
    id: "blick",
    name: "Blick",
    website: "blick.ch",
    logo: logoBlick,
  },
  {
    id: "nzz",
    name: "NZZ",
    website: "nzz.ch",
    // NZZ uses styled text (classic serif)
    logoComponent: (
      <span className="font-serif font-bold text-2xl text-[#1A1A1A] dark:text-foreground tracking-tight">
        NZZ
      </span>
    ),
  },
  {
    id: "watson",
    name: "watson",
    website: "watson.ch",
    logo: logoWatson,
  },
  {
    id: "newhome",
    name: "newhome",
    website: "newhome.ch",
    logo: logoNewhome,
  },
];

export const MediaLogosSectionVariantE = memo(function MediaLogosSectionVariantE() {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-muted/30 to-background border-b border-border/30">
      <div className="container max-w-5xl px-4">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                          bg-primary/10 border border-primary/30 text-primary">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Vertrauen Sie dem Marktführer
            </span>
          </div>
        </motion.div>

        {/* "Bekannt aus:" Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-muted-foreground text-sm mb-6"
        >
          Bekannt aus:
        </motion.p>

        {/* Logo Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-8"
        >
          {mediaPartners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex flex-col items-center justify-center p-3 md:p-4 
                         bg-card rounded-xl border border-border/50 
                         hover:border-border hover:shadow-md
                         transition-all duration-300 cursor-default group"
            >
              {/* Logo */}
              <div className="h-10 md:h-12 flex items-center justify-center mb-2">
                {partner.logo ? (
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-h-8 md:max-h-10 w-auto object-contain 
                               grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : partner.logoComponent ? (
                  <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    {partner.logoComponent}
                  </div>
                ) : null}
              </div>
              
              {/* Website URL */}
              <span className="text-[10px] md:text-xs text-muted-foreground">
                {partner.website}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Statistic */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground"
        >
          <span className="text-primary font-semibold">97% der Schweizer</span>
          {" "}vertrauen Empfehlungen aus bekannten Medien
        </motion.p>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantE;
