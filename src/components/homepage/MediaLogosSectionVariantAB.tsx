/**
 * Variant AB (V25) - Eyebrow Badge / Pre-Headline Trust
 * 
 * CRO Research Pattern: "Authority-First" framing
 * - Trust badge positioned ABOVE the main headline
 * - Establishes authority before the sales pitch
 * - Pill/badge design with rating + media names
 * - Sets context: "This is validated, now listen to the pitch"
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MEDIA_NAMES = ["SRF", "NZZ", "TCS"];

export const MediaLogosSectionVariantAB = memo(function MediaLogosSectionVariantAB() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-6"
      aria-label="Eyebrow Trust Badge"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow Badge - Authority First */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "inline-flex items-center gap-2 md:gap-3 mb-4",
              "px-3 md:px-4 py-2 rounded-full",
              "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
              "border border-primary/20"
            )}
          >
            {/* Nr. 1 Claim */}
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm font-semibold text-foreground">
                Die Nr. 1 der Schweiz
              </span>
            </div>
            
            {/* Divider */}
            <span className="h-4 w-px bg-border hidden sm:block" />
            
            {/* Media Names - Monochrome */}
            <div className="hidden sm:flex items-center gap-2">
              {MEDIA_NAMES.map((name) => (
                <span 
                  key={name}
                  className={cn(
                    "text-[10px] md:text-[11px] font-bold",
                    "text-muted-foreground/50 grayscale opacity-70",
                    "hover:text-foreground hover:opacity-100",
                    "transition-all duration-200"
                  )}
                >
                  {name}
                </span>
              ))}
            </div>
            
            {/* Divider */}
            <span className="h-4 w-px bg-border hidden sm:block" />
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs md:text-sm font-semibold">4.8</span>
            </div>
          </motion.div>
          
          {/* Simulated Headline (for context) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Der beste Deal der ganzen Schweiz
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Vergleichen Sie 200+ geprüfte Umzugsfirmen und sparen Sie bis zu 40%
            </p>
            
            {/* Stats row */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>15'000+ Umzüge</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>100% kostenlos</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

export default MediaLogosSectionVariantAB;
