/**
 * Variant Z (V23) - Trust Floor / Der Anker
 * 
 * Research Pattern: Horizontal bar at bottom of hero with media logos
 * - Full-width bar that "anchors" the hero section
 * - Glasmorphism effect on image backgrounds
 * - Monochrome logos with color on hover
 * - Clear "BEKANNT AUS:" label
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MEDIA_LOGOS = [
  { name: "SRF", label: "Schweizer Radio und Fernsehen" },
  { name: "NZZ", label: "Neue Zürcher Zeitung" },
  { name: "20min", label: "20 Minuten" },
  { name: "Blick", label: "Blick.ch" },
  { name: "TCS", label: "Touring Club Schweiz" },
];

export const MediaLogosSectionVariantZ = memo(function MediaLogosSectionVariantZ() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full"
    >
      {/* Trust Floor - The Anchor */}
      <div className={cn(
        "w-full py-4 px-4",
        "bg-white/90 backdrop-blur-md",
        "border-t border-border/30",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      )}>
        <div className="container mx-auto">
          {/* Label */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 text-center mb-3 font-medium">
            Bekannt aus
          </p>
          
          {/* Logo Row */}
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
            {MEDIA_LOGOS.map((logo, idx) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className={cn(
                  "text-sm md:text-base font-bold",
                  "text-muted-foreground/50 grayscale",
                  "hover:text-foreground hover:grayscale-0",
                  "transition-all duration-300 cursor-default"
                )}
                title={logo.label}
              >
                {logo.name}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default MediaLogosSectionVariantZ;
