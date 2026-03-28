/**
 * PressTrustBar - Premium trust integration for Hero section
 * 
 * Two variants:
 * - "rail": Desktop glassy bar below hero 2-column grid
 * - "inline": Mobile compact version inside form card under CTA
 * 
 * Design: Monochrome logos with grayscale-to-color hover, links to press mentions
 */

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Variant = "rail" | "inline";

const pressLogos = [
  { name: "SRF", href: "/presse#srf" },
  { name: "TCS", href: "/presse#tcs" },
  { name: "NZZ", href: "/presse#nzz" },
  { name: "20 Minuten", href: "/presse#20min" },
  { name: "Blick", href: "/presse#blick" },
];

interface PressTrustBarProps {
  variant?: Variant;
  className?: string;
}

export const PressTrustBar = memo(function PressTrustBar({
  variant = "rail",
  className,
}: PressTrustBarProps) {
  const isRail = variant === "rail";

  if (isRail) {
    // Desktop: Glassy rail below hero grid
    return (
      <div
        className={cn(
          "w-full mt-6 lg:mt-8",
          "backdrop-blur-md bg-white/10 border border-white/20 rounded-xl",
          "py-3 px-4 lg:px-6",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          {/* Label with checkmark */}
          <div className="flex items-center gap-2 text-white/80">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/80 text-primary-foreground">
              <Check className="w-3 h-3" strokeWidth={3} />
            </span>
            <span className="text-sm font-medium">Bekannt aus:</span>
          </div>

          {/* Logo row */}
          <div className="flex items-center gap-4 lg:gap-6 flex-wrap justify-center">
            {pressLogos.map((logo) => (
              <a
                key={logo.name}
                href={logo.href}
                className={cn(
                  "text-sm lg:text-base font-bold",
                  "text-white/50 grayscale opacity-70",
                  "hover:text-white hover:grayscale-0 hover:opacity-100",
                  "transition-all duration-200"
                )}
                title={`Erwähnt in ${logo.name}`}
              >
                {logo.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mobile inline: Compact version inside form card
  return (
    <div
      className={cn(
        "pt-3 mt-3 border-t border-border/50",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Label */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-primary/80 text-primary-foreground">
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
          </span>
          <span className="text-xs font-medium">Bekannt aus:</span>
        </div>

        {/* Logo row - smaller for mobile */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {pressLogos.slice(0, 4).map((logo) => (
            <a
              key={logo.name}
              href={logo.href}
              className={cn(
                "text-[11px] font-bold",
                "text-muted-foreground/60 grayscale",
                "hover:text-foreground hover:grayscale-0",
                "transition-all duration-200"
              )}
              title={`Erwähnt in ${logo.name}`}
            >
              {logo.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PressTrustBar;
