/**
 * HeroInlineTrust - Trust logos integrated directly into Hero section
 * 
 * Used for Social Proof A/B variants M, N, O:
 * - M (V13): Hero Reassurance - under left CTA
 * - N (V14): Hero Form Footer - inside form card
 * - O (V15): Hero Eyebrow - above headline
 * 
 * All logos are grayscale to not compete with primary CTAs
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Monochrome trust logos - text-based for clean display
const trustLogos = [
  { name: "SRF", label: "Schweizer Radio" },
  { name: "NZZ", label: "Neue Zürcher Zeitung" },
  { name: "Blick", label: "Blick.ch" },
  { name: "TCS", label: "Touring Club" },
];

interface HeroInlineTrustProps {
  variant: 'reassurance' | 'form-footer' | 'eyebrow';
  className?: string;
}

export const HeroInlineTrust = memo(function HeroInlineTrust({ 
  variant, 
  className 
}: HeroInlineTrustProps) {
  
  // Variant M: Reassurance under left CTA
  if (variant === 'reassurance') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={cn("mt-6 space-y-2", className)}
      >
        <p className="text-xs text-muted-foreground">
          Vertrauen Sie dem Marktführer – bekannt aus:
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          {trustLogos.map((logo) => (
            <div 
              key={logo.name}
              className="text-sm font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              title={logo.label}
            >
              {logo.name}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">4.8/5</span>
          <span className="text-muted-foreground/60">• 15'000+ Umzüge</span>
        </div>
      </motion.div>
    );
  }

  // Variant N: Form Footer (compact, inside form card)
  if (variant === 'form-footer') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={cn(
          "pt-3 mt-3 border-t border-border/50",
          className
        )}
      >
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {trustLogos.slice(0, 3).map((logo) => (
            <span 
              key={logo.name}
              className="text-[10px] font-medium text-muted-foreground/50"
            >
              {logo.name}
            </span>
          ))}
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            4.8
          </span>
        </div>
      </motion.div>
    );
  }

  // Variant O: Eyebrow (above headline)
  if (variant === 'eyebrow') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "inline-flex items-center gap-3 mb-4 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50",
          className
        )}
      >
        <span className="text-xs font-medium text-muted-foreground">
          Die Nr. 1 der Schweiz
        </span>
        <span className="h-3 w-px bg-border" />
        <div className="flex items-center gap-2">
          {trustLogos.slice(0, 3).map((logo) => (
            <span 
              key={logo.name}
              className="text-[10px] font-semibold text-muted-foreground/60"
            >
              {logo.name}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-0.5 text-xs">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-muted-foreground">4.8</span>
        </span>
      </motion.div>
    );
  }

  return null;
});

export default HeroInlineTrust;
