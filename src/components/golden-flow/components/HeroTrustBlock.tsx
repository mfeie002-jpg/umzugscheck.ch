/**
 * HeroTrustBlock - "Bekannt aus" Trust Integration for Golden Flow Hero
 * 
 * Based on CRO research feedback:
 * - Option 1: Inside form card, under CTA (Conversion-oriented)
 * - Option 2: Horizontal strip at hero bottom (full-width)
 * 
 * Mobile: Max 3 logos + "+X" indicator
 * Desktop: All logos in row
 */

import { memo } from "react";
import { Shield, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColoredMediaLogo, MonochromeMediaLogo } from "@/components/trust/media-logos";

// Priority logos for Swiss trust
const TRUST_LOGOS = ["SRF", "NZZ", "Blick", "20 Minuten", "Watson", "newhome"] as const;
const MOBILE_LIMIT = 3;

interface HeroTrustBlockProps {
  variant: "form-footer" | "hero-strip" | "compact";
  className?: string;
  colored?: boolean;
}

export const HeroTrustBlock = memo(function HeroTrustBlock({
  variant,
  className,
  colored = false,
}: HeroTrustBlockProps) {
  const LogoComponent = colored ? ColoredMediaLogo : MonochromeMediaLogo;
  const remainingCount = TRUST_LOGOS.length - MOBILE_LIMIT;

  // Option 1: Inside Form Card Footer (under CTA)
  if (variant === "form-footer") {
    return (
      <div
        className={cn(
          "mt-4 pt-4 border-t border-border/40",
          className
        )}
      >
        <div className="flex flex-col items-center gap-2">
          {/* Label with shield icon */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold">Bekannt aus:</span>
          </div>
          
          {/* Logos - Mobile: 3 + count, Desktop: all */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {/* Mobile: Show first 3 */}
            <div className="flex items-center gap-2 sm:hidden">
              {TRUST_LOGOS.slice(0, MOBILE_LIMIT).map((name) => (
                <LogoComponent key={name} name={name} size="sm" />
              ))}
              {remainingCount > 0 && (
                <span className="text-xs font-semibold text-muted-foreground">
                  +{remainingCount}
                </span>
              )}
            </div>
            
            {/* Desktop: Show all */}
            <div className="hidden sm:flex items-center gap-3">
              {TRUST_LOGOS.slice(0, 5).map((name) => (
                <LogoComponent key={name} name={name} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Option 2: Hero Strip (full-width at hero bottom)
  if (variant === "hero-strip") {
    return (
      <div
        className={cn(
          "py-4 bg-white/90 backdrop-blur-sm border-t border-border/30",
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            {/* Label with newspaper icon */}
            <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-wide">
              <Newspaper className="w-4 h-4" />
              <span>Bekannt aus</span>
            </div>
            
            {/* Logos row */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {/* Mobile: Show first 3 */}
              <div className="flex items-center gap-3 sm:hidden">
                {TRUST_LOGOS.slice(0, MOBILE_LIMIT).map((name) => (
                  <MonochromeMediaLogo key={name} name={name} size="sm" />
                ))}
                <span className="text-xs font-medium text-muted-foreground">
                  & mehr
                </span>
              </div>
              
              {/* Desktop: Show all */}
              <div className="hidden sm:flex items-center gap-4">
                {TRUST_LOGOS.slice(0, 5).map((name) => (
                  <MonochromeMediaLogo key={name} name={name} size="md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant (minimal, inline)
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-xs text-muted-foreground",
        className
      )}
    >
      <Shield className="w-3 h-3 text-primary" />
      <span className="font-medium">Bekannt aus:</span>
      <div className="flex items-center gap-2">
        {TRUST_LOGOS.slice(0, 3).map((name, i) => (
          <span key={name}>
            <span className="font-semibold text-foreground/70">{name}</span>
            {i < 2 && <span className="ml-1 text-muted-foreground/50">•</span>}
          </span>
        ))}
      </div>
    </div>
  );
});

export default HeroTrustBlock;
