/**
 * Variant AD (V27) - Trust Ticker / Mobile Marquee
 * 
 * CRO Research Pattern: "Infinite Marquee" for mobile
 * - Compact height (40-50px max per research)
 * - Auto-scrolling horizontal animation
 * - Shows all logos in minimal vertical space
 * - Creates dynamic "live" feeling
 * - CSS animation for smooth performance (no layout shifts)
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  { name: "SRF", type: "media" },
  { name: "NZZ", type: "media" },
  { name: "20 Minuten", type: "media" },
  { name: "Blick", type: "media" },
  { name: "TCS", type: "partner" },
  { name: "Watson", type: "media" },
  { name: "Tages-Anzeiger", type: "media" },
  { name: "Handelszeitung", type: "media" },
];

// Duplicate for seamless loop
const DOUBLED_ITEMS = [...TRUST_ITEMS, ...TRUST_ITEMS];

export const MediaLogosSectionVariantAD = memo(function MediaLogosSectionVariantAD() {
  return (
    <section 
      className="py-0 overflow-hidden bg-muted/30 border-y border-border/30"
      aria-label="Bekannt aus - Scrolling Ticker"
    >
      {/* Label - Fixed position */}
      <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 text-center py-1.5 font-medium bg-muted/20">
        Bekannt aus
      </p>
      
      {/* Ticker Container - max 50px height per research */}
      <div className="relative h-[44px] overflow-hidden bg-white/50">
        {/* Fade edges for polish */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling content - CSS keyframes animation */}
        <motion.div
          className="flex items-center gap-6 whitespace-nowrap h-full"
          animate={{
            x: [0, -60 * TRUST_ITEMS.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25, // Slow for readability
              ease: "linear",
            },
          }}
        >
          {DOUBLED_ITEMS.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className={cn(
                "flex items-center gap-2 px-3",
                // Monochrome per research
                "text-sm font-bold",
                "text-muted-foreground/50 grayscale opacity-70"
              )}
            >
              {/* Dot indicator */}
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                item.type === "partner" ? "bg-alpine/50" : "bg-primary/30"
              )} />
              {item.name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantAD;
