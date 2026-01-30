/**
 * Variant AB (V25) - Eyebrow Badge / Pre-Headline Trust
 * 
 * Research Pattern: Trust badge positioned above the main headline
 * - "Authority-first" framing
 * - Pill/badge design with rating
 * - Sets context before the value proposition
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDIA_NAMES = ["SRF", "NZZ", "Blick"];

export const MediaLogosSectionVariantAB = memo(function MediaLogosSectionVariantAB() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-6"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow Badge - Above Headline */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "inline-flex items-center gap-3 mb-4",
              "px-4 py-2 rounded-full",
              "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
              "border border-primary/20"
            )}
          >
            {/* Nr. 1 Claim */}
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Die Nr. 1 der Schweiz
              </span>
            </div>
            
            {/* Divider */}
            <span className="h-4 w-px bg-border" />
            
            {/* Media Names */}
            <div className="flex items-center gap-2">
              {MEDIA_NAMES.map((name) => (
                <span 
                  key={name}
                  className="text-[11px] font-bold text-muted-foreground/60"
                >
                  {name}
                </span>
              ))}
            </div>
            
            {/* Divider */}
            <span className="h-4 w-px bg-border" />
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">4.8</span>
            </div>
          </motion.div>
          
          {/* Simulated Headline (for context) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Der beste Deal der ganzen Schweiz
            </h2>
            <p className="text-muted-foreground">
              Vergleichen Sie 200+ geprüfte Umzugsfirmen...
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

export default MediaLogosSectionVariantAB;
