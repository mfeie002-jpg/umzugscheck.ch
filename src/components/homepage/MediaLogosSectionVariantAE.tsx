/**
 * Variant AE (V28) - Glasmorphism Authority Bar
 * 
 * Research Pattern: Frosted glass overlay for premium feel
 * - backdrop-blur effect
 * - Semi-transparent white background
 * - Combines media logos + key stats
 * - High-end tech aesthetic matching "Smart Video Rechner"
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDIA_LOGOS = ["SRF", "NZZ", "20min", "Blick", "TCS"];

export const MediaLogosSectionVariantAE = memo(function MediaLogosSectionVariantAE() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-3"
    >
      <div className="container mx-auto px-4">
        {/* Glasmorphism Bar */}
        <div className={cn(
          "max-w-4xl mx-auto",
          "bg-white/70 backdrop-blur-xl",
          "border border-white/50 shadow-lg",
          "rounded-2xl overflow-hidden"
        )}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
            {/* Left: Media Logos */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mr-2">
                Bekannt aus:
              </span>
              <div className="flex items-center gap-3">
                {MEDIA_LOGOS.map((logo, idx) => (
                  <motion.span
                    key={logo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className={cn(
                      "text-xs font-bold",
                      "text-muted-foreground/40",
                      "hover:text-foreground transition-colors cursor-default"
                    )}
                  >
                    {logo}
                  </motion.span>
                ))}
              </div>
            </div>
            
            {/* Divider (desktop only) */}
            <div className="hidden md:block h-8 w-px bg-border/50" />
            
            {/* Right: Key Stats */}
            <div className="flex items-center gap-4">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold">4.8/5</span>
              </div>
              
              {/* Separator */}
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              
              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary/70" />
                <span className="text-sm font-medium text-muted-foreground">15'000+ Umzüge</span>
              </div>
              
              {/* Separator */}
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              
              {/* Insurance */}
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-alpine/70" />
                <span className="text-sm font-medium text-muted-foreground">Vollversichert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default MediaLogosSectionVariantAE;
