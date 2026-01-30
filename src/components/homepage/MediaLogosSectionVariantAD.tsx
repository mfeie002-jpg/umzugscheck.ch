/**
 * Variant AD (V27) - Trust Ticker / Mobile Marquee
 * 
 * Research Pattern: Infinite horizontal scroll for logos
 * - Compact height (40-50px)
 * - Auto-scrolling animation
 * - Perfect for mobile - shows all logos in minimal space
 * - Creates dynamic "live" feeling
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  "SRF",
  "NZZ",
  "20 Minuten",
  "Blick",
  "TCS",
  "Watson",
  "Tages-Anzeiger",
  "Handelszeitung",
];

// Duplicate for seamless loop
const DOUBLED_ITEMS = [...TRUST_ITEMS, ...TRUST_ITEMS];

export const MediaLogosSectionVariantAD = memo(function MediaLogosSectionVariantAD() {
  return (
    <section className="py-4 overflow-hidden bg-muted/30 border-y border-border/30">
      {/* Label */}
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 text-center mb-2 font-medium">
        Bekannt aus
      </p>
      
      {/* Ticker Container */}
      <div className="relative h-10 overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-muted/30 to-transparent z-10" />
        
        {/* Scrolling content */}
        <motion.div
          className="flex items-center gap-8 whitespace-nowrap"
          animate={{
            x: [0, -50 * TRUST_ITEMS.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {DOUBLED_ITEMS.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className={cn(
                "flex items-center gap-2 px-4",
                "text-sm font-bold text-muted-foreground/50"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantAD;
