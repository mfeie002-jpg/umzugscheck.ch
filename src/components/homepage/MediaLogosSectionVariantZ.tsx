/**
 * Variant Z (V23) - Trust Floor / Der Anker
 * 
 * CRO Research Pattern: "Hero Footer" model
 * - Full-width bar that "anchors" the hero section
 * - Max 80px height, 90% white opacity (per research specs)
 * - Monochrome logos (grayscale 100%, opacity 70%) with color on hover
 * - Clear "BEKANNT AUS:" uppercase label with letter-spacing
 * - Visual "Brücke" (bridge) between hero and content
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MEDIA_LOGOS = [
  { name: "SRF", label: "Schweizer Radio und Fernsehen", link: "/presse#srf" },
  { name: "NZZ", label: "Neue Zürcher Zeitung", link: "/presse#nzz" },
  { name: "20min", label: "20 Minuten", link: "/presse#20min" },
  { name: "Blick", label: "Blick.ch", link: "/presse#blick" },
  { name: "TCS", label: "Touring Club Schweiz", link: "/presse#tcs" },
];

export const MediaLogosSectionVariantZ = memo(function MediaLogosSectionVariantZ() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full"
      aria-label="Bekannt aus Medien"
    >
      {/* Trust Floor - The Anchor (max 80px height per research) */}
      <div className={cn(
        "w-full h-[80px] flex items-center",
        "bg-white/90 backdrop-blur-md", // 90% opacity per research
        "border-t border-border/30",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {/* Label - Swiss Style: uppercase, letter-spacing */}
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 font-medium hidden sm:block">
              Bekannt aus:
            </span>
            
            {/* Logo Row - Monochrome with hover color */}
            <div className="flex items-center gap-5 md:gap-8">
              {MEDIA_LOGOS.map((logo, idx) => (
                <motion.a
                  key={logo.name}
                  href={logo.link}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className={cn(
                    "text-sm md:text-base font-bold",
                    // Grayscale 100%, opacity 70% per research
                    "text-muted-foreground/50 grayscale opacity-70",
                    // Color on hover
                    "hover:text-foreground hover:grayscale-0 hover:opacity-100",
                    "transition-all duration-300"
                  )}
                  title={logo.label}
                >
                  {logo.name}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default MediaLogosSectionVariantZ;
