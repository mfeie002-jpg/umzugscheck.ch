/**
 * KnownFromRow - Integrated trust element for hero section
 * 
 * Based on research:
 * - Prominent yet subtle: below form/CTA to leverage halo effect
 * - Grayscale logos with hover color pop for visual harmony
 * - Clickable to original sources for authenticity
 * - Responsive: stack/carousel on mobile
 * - 80-90% scale for subtlety
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MEDIA_LOGOS = [
  { 
    name: "SRF", 
    href: "https://www.srf.ch",
    tooltip: "Schweizer Radio und Fernsehen",
    color: "hover:text-red-600"
  },
  { 
    name: "TCS", 
    href: "https://www.tcs.ch",
    tooltip: "Touring Club Schweiz",
    color: "hover:text-yellow-600"
  },
  { 
    name: "NZZ", 
    href: "https://www.nzz.ch",
    tooltip: "Neue Zürcher Zeitung",
    color: "hover:text-blue-800"
  },
  { 
    name: "20min", 
    href: "https://www.20min.ch",
    tooltip: "20 Minuten",
    color: "hover:text-blue-600"
  },
  { 
    name: "BLICK", 
    href: "https://www.blick.ch",
    tooltip: "Blick",
    color: "hover:text-red-500"
  },
];

interface KnownFromRowProps {
  variant?: "below-form" | "cta-adjacent" | "hero-footer";
  className?: string;
  showAlways?: boolean;
}

export const KnownFromRow = memo(function KnownFromRow({
  variant = "below-form",
  className,
}: KnownFromRowProps) {
  
  // Hero footer: Slim bar at bottom of hero section (inside hero container)
  if (variant === "hero-footer") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className={cn(
          "w-full py-4 mt-6",
          "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10",
          className
        )}
      >
        <div className="flex items-center justify-center gap-4 flex-wrap px-4">
          <div className="flex items-center gap-2 text-white/80">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">
              Vertrauen Sie dem Marktführer. Bekannt aus:
            </span>
          </div>
          
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-4">
              {MEDIA_LOGOS.map((logo) => (
                <Tooltip key={logo.name}>
                  <TooltipTrigger asChild>
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "text-sm font-bold tracking-wide",
                        "text-white/40 grayscale",
                        "hover:text-white hover:grayscale-0",
                        "transition-all duration-300",
                        "hover:scale-105"
                      )}
                    >
                      {logo.name}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <span className="flex items-center gap-1">
                      Featured on {logo.tooltip}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </motion.div>
    );
  }
  
  // CTA-adjacent: Compact row directly below CTA button
  if (variant === "cta-adjacent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={cn("py-3", className)}
      >
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground font-medium">
              Bekannt aus
            </span>
            
            {/* Desktop: all logos with tooltips */}
            <div className="hidden sm:flex items-center gap-3">
              {MEDIA_LOGOS.map((logo) => (
                <Tooltip key={logo.name}>
                  <TooltipTrigger asChild>
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "text-xs font-bold",
                        "text-muted-foreground/40 grayscale",
                        "hover:grayscale-0",
                        logo.color,
                        "transition-all duration-200",
                        "hover:scale-110"
                      )}
                    >
                      {logo.name}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {logo.tooltip}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            
            {/* Mobile: 3 logos + "+2" */}
            <div className="flex sm:hidden items-center gap-2">
              {MEDIA_LOGOS.slice(0, 3).map((logo) => (
                <a
                  key={logo.name}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-[11px] font-bold",
                    "text-muted-foreground/40",
                    logo.color,
                    "transition-colors"
                  )}
                >
                  {logo.name}
                </a>
              ))}
              <span className="text-[10px] text-muted-foreground/30">+2</span>
            </div>
          </div>
        </TooltipProvider>
      </motion.div>
    );
  }
  
  // Below form: Default - subtle bar below the form card
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={cn("pt-4 mt-4", className)}
    >
      <Separator className="mb-4 opacity-50" />
      
      <TooltipProvider delayDuration={200}>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary/70" />
            <span className="text-[11px] font-medium opacity-70">Bekannt aus</span>
          </div>
          
          {/* Horizontal scrollable on mobile, flex on desktop */}
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {MEDIA_LOGOS.map((logo) => (
              <Tooltip key={logo.name}>
                <TooltipTrigger asChild>
                  <a
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-[11px] font-bold shrink-0 tracking-wide",
                      "text-muted-foreground/30 grayscale",
                      "hover:grayscale-0",
                      logo.color,
                      "transition-all duration-200",
                      "hover:scale-110"
                    )}
                  >
                    {logo.name}
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <span className="flex items-center gap-1">
                    {logo.tooltip}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </span>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>
    </motion.div>
  );
});

export default KnownFromRow;
