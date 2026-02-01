/**
 * HeroFormTrust - "Bekannt aus" trust logos for Hero form card
 * Addresses the "Gatekeeper Moment" with in-form trust signals
 */

import { memo } from "react";
import { cn } from "@/lib/utils";

interface HeroFormTrustProps {
  className?: string;
  variant?: "compact" | "full";
}

export const HeroFormTrust = memo(function HeroFormTrust({
  className,
  variant = "compact",
}: HeroFormTrustProps) {
  if (variant === "full") {
    return (
      <div className={cn("border-t border-border/50 pt-3 mt-4", className)}>
        <p className="text-[10px] text-muted-foreground text-center mb-2">
          Bekannt aus
        </p>
        <div className="flex justify-center items-center gap-4 opacity-60">
          {/* SRF Logo */}
          <div className="bg-[#C8102E] text-white font-bold text-[10px] px-1.5 py-0.5 rounded">
            SRF
          </div>
          
          {/* NZZ Logo */}
          <span className="font-serif font-bold text-sm text-foreground/70">
            NZZ
          </span>
          
          {/* 20 Minuten Logo */}
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-black text-[#E3000F]">20</span>
            <span className="text-[10px] font-semibold text-foreground/70">Min</span>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant - single line
  return (
    <div className={cn(
      "flex items-center justify-center gap-3 text-[10px] text-muted-foreground",
      className
    )}>
      <span>Bekannt aus:</span>
      <div className="flex items-center gap-2 opacity-70">
        {/* SRF */}
        <span className="bg-[#C8102E]/80 text-white font-bold text-[8px] px-1 py-0.5 rounded">
          SRF
        </span>
        
        {/* NZZ */}
        <span className="font-serif font-bold text-xs text-foreground/60">
          NZZ
        </span>
        
        {/* 20min */}
        <span className="font-black text-xs text-[#E3000F]/70">
          20min
        </span>
      </div>
    </div>
  );
});

export default HeroFormTrust;
