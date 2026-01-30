/**
 * KnownFromRow - Trust element for inside the form card
 * 
 * V26 (Z): Best practice - Trust directly at the CTA decision point
 * 
 * Design:
 * - Compact row with shield icon + "Bekannt aus" + logos
 * - Monochrome/dimmed logos, full opacity on hover
 * - Mobile: max 3 logos + "+2" or horizontal scroll
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const MEDIA_LOGOS = [
  { name: "SRF", href: "/presse#srf" },
  { name: "TCS", href: "/presse#tcs" },
  { name: "NZZ", href: "/presse#nzz" },
  { name: "20min", href: "/presse#20min" },
  { name: "Blick", href: "/presse#blick" },
];

interface KnownFromRowProps {
  variant?: "card-footer" | "card-header" | "cta-adjacent";
  className?: string;
}

export const KnownFromRow = memo(function KnownFromRow({
  variant = "card-footer",
  className,
}: KnownFromRowProps) {
  
  // CTA-adjacent: Directly between CTA button and micro-trust badges
  if (variant === "cta-adjacent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={cn("py-3", className)}
      >
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-muted-foreground font-medium">
            Bekannt aus
          </span>
          
          {/* Desktop: all logos */}
          <div className="hidden sm:flex items-center gap-3">
            {MEDIA_LOGOS.map((logo) => (
              <a
                key={logo.name}
                href={logo.href}
                className={cn(
                  "text-xs font-bold",
                  "text-muted-foreground/50 grayscale opacity-70",
                  "hover:text-foreground hover:grayscale-0 hover:opacity-100",
                  "transition-all duration-200"
                )}
              >
                {logo.name}
              </a>
            ))}
          </div>
          
          {/* Mobile: 3 logos + "+2" */}
          <div className="flex sm:hidden items-center gap-2">
            {MEDIA_LOGOS.slice(0, 3).map((logo) => (
              <a
                key={logo.name}
                href={logo.href}
                className={cn(
                  "text-[11px] font-bold",
                  "text-muted-foreground/50",
                  "hover:text-foreground",
                  "transition-colors"
                )}
              >
                {logo.name}
              </a>
            ))}
            <span className="text-[10px] text-muted-foreground/40">+2</span>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Card header: Under "Wie möchten Sie starten?"
  if (variant === "card-header") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn("flex items-center justify-center gap-2 py-2", className)}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-primary/70" />
        <span className="text-[10px] text-muted-foreground">Bekannt aus:</span>
        <div className="flex items-center gap-2">
          {MEDIA_LOGOS.slice(0, 4).map((logo) => (
            <span
              key={logo.name}
              className="text-[10px] font-semibold text-muted-foreground/50"
            >
              {logo.name}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }
  
  // Card footer: Below the form content with separator
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={cn("pt-4 mt-4", className)}
    >
      <Separator className="mb-4" />
      
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">Bekannt aus</span>
        </div>
        
        {/* Horizontal scrollable on mobile, flex on desktop */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {MEDIA_LOGOS.map((logo) => (
            <a
              key={logo.name}
              href={logo.href}
              className={cn(
                "text-xs font-bold shrink-0",
                "text-muted-foreground/50 grayscale opacity-70",
                "hover:text-foreground hover:grayscale-0 hover:opacity-100",
                "transition-all duration-200"
              )}
            >
              {logo.name}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

export default KnownFromRow;
