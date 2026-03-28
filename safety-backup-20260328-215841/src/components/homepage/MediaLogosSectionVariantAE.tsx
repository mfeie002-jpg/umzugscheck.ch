/**
 * Variant AE (V28) - Glasmorphism Authority Bar
 * 
 * CRO Research Pattern: "Frosted Glass Overlay" premium bar
 * - backdrop-filter: blur(10px) per research
 * - Semi-transparent white (rgba(255,255,255,0.9))
 * - Combines media logos + key stats in one bar
 * - High-end tech aesthetic matching "Smart Video Rechner"
 * - Links to press articles for transparency
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Users, Shield, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDIA_LOGOS = [
  { name: "SRF", link: "/presse#srf" },
  { name: "NZZ", link: "/presse#nzz" },
  { name: "20min", link: "/presse#20min" },
  { name: "Blick", link: "/presse#blick" },
  { name: "TCS", link: "/presse#tcs" },
];

export const MediaLogosSectionVariantAE = memo(function MediaLogosSectionVariantAE() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-4"
      aria-label="Glasmorphism Trust Bar"
    >
      <div className="container mx-auto px-4">
        {/* Glasmorphism Bar - Premium feel */}
        <div className={cn(
          "max-w-4xl mx-auto",
          // Glasmorphism per research specs
          "bg-white/90 backdrop-blur-xl",
          "border border-white/60 shadow-lg",
          "rounded-2xl overflow-hidden"
        )}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-5">
            {/* Left: Media Logos with links */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">
                Bekannt aus:
              </span>
              <div className="flex items-center gap-3">
                {MEDIA_LOGOS.map((logo, idx) => (
                  <motion.a
                    key={logo.name}
                    href={logo.link}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className={cn(
                      "text-xs font-bold",
                      // Monochrome with hover color per research
                      "text-muted-foreground/40 grayscale opacity-70",
                      "hover:text-foreground hover:grayscale-0 hover:opacity-100",
                      "transition-all duration-300"
                    )}
                    title={`Artikel auf ${logo.name} lesen`}
                  >
                    {logo.name}
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Divider (desktop only) */}
            <div className="hidden md:block h-8 w-px bg-border/40" />
            
            {/* Right: Key Stats */}
            <div className="flex items-center gap-4">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold">4.8/5</span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline">(2'847)</span>
              </div>
              
              {/* Separator */}
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              
              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary/70" />
                <span className="text-sm font-medium text-muted-foreground">15'000+</span>
                <span className="text-xs text-muted-foreground/60 hidden sm:inline">Umzüge</span>
              </div>
              
              {/* Separator */}
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
              
              {/* Insurance */}
              <div className="hidden sm:flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-alpine/70" />
                <span className="text-sm font-medium text-muted-foreground">Vollversichert</span>
              </div>
            </div>
            
            {/* Link to press page */}
            <a 
              href="/presse" 
              className="hidden lg:flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors"
            >
              <span>Alle Erwähnungen</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default MediaLogosSectionVariantAE;
