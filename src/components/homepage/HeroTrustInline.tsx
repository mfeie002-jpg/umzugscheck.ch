/**
 * HeroTrustInline - Integrated trust bar for Hero section
 * 
 * V25: Best practice integration
 * - Desktop: Left-aligned under CTA, monochrome white logos on dark bg
 * - Mobile: Compact inline in form card footer
 * 
 * Design: Closes the "sales pitch" on the left, uses negative space elegantly
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const PRESS_LOGOS = [
  { name: "SRF", href: "/presse#srf" },
  { name: "TCS", href: "/presse#tcs" },
  { name: "NZZ", href: "/presse#nzz" },
  { name: "20min", href: "/presse#20min" },
  { name: "BLICK", href: "/presse#blick" },
];

interface HeroTrustInlineProps {
  variant: "desktop-left" | "mobile-form";
  className?: string;
}

export const HeroTrustInline = memo(function HeroTrustInline({
  variant,
  className,
}: HeroTrustInlineProps) {
  
  // Desktop: Left-aligned under CTA - WHITE monochrome on dark/image background
  if (variant === "desktop-left") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className={cn("mt-6 space-y-2", className)}
      >
        {/* Label */}
        <p className="text-sm text-white/70 font-medium">
          Vertrauen Sie dem Marktführer – bekannt aus:
        </p>
        
        {/* Monochrome WHITE logos row */}
        <div className="flex items-center gap-4 flex-wrap">
          {PRESS_LOGOS.map((logo, idx) => (
            <motion.a
              key={logo.name}
              href={logo.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + idx * 0.05 }}
              className={cn(
                "text-sm font-bold",
                "text-white/50 grayscale opacity-70",
                "hover:text-white hover:opacity-100",
                "transition-all duration-200"
              )}
              title={`Erwähnt in ${logo.name}`}
            >
              {logo.name}
            </motion.a>
          ))}
        </div>
        
        {/* Rating in white */}
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-white/90">4.8/5</span>
          <span className="text-white/40">•</span>
          <span className="text-white/60">15'000+ Umzüge</span>
        </div>
      </motion.div>
    );
  }
  
  // Mobile: Compact inline inside form card footer
  if (variant === "mobile-form") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={cn(
          "pt-3 mt-3 border-t border-border/40",
          className
        )}
      >
        {/* Compact label */}
        <p className="text-[10px] text-muted-foreground text-center mb-2">
          Bekannt aus:
        </p>
        
        {/* Logo row - smaller, grayscale */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {PRESS_LOGOS.slice(0, 4).map((logo) => (
            <a
              key={logo.name}
              href={logo.href}
              className={cn(
                "text-[11px] font-bold",
                "text-muted-foreground/60",
                "hover:text-foreground",
                "transition-colors duration-200"
              )}
            >
              {logo.name}
            </a>
          ))}
          {/* Rating inline */}
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-medium">4.8</span>
          </span>
        </div>
      </motion.div>
    );
  }
  
  return null;
});

export default HeroTrustInline;
