/**
 * KnownFromRow - Integrated trust element for hero section
 * 
 * "Bekannt aus & Partner" - Shows media mentions and partner logos
 * Uses real PNG logos with grayscale-to-color hover effects
 * 
 * Variants:
 * - below-cta: Trust block inside form card, below CTA button
 * - hero-footer: Horizontal strip at bottom of hero section
 * - compact: Minimal inline display
 * - swiss-partners: 4 Swiss Partner Logos (eUmzugCH, Post, ASTAG, Swiss Made)
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shield, Newspaper, Building2 } from "lucide-react";
import { RealMediaLogo, SWISS_MEDIA_PARTNERS } from "@/components/trust/media-logos";

// Display order is the order in SWISS_MEDIA_PARTNERS (single source of truth)
const DISPLAY_LOGOS = SWISS_MEDIA_PARTNERS.map((p) => p.name);
const MOBILE_LOGOS = DISPLAY_LOGOS.slice(0, 4); // Top 4 for mobile
const REMAINING_COUNT = Math.max(0, DISPLAY_LOGOS.length - MOBILE_LOGOS.length);

// Swiss Partner Logos (Infrastructure + Authority)
const SWISS_PARTNERS = [
  {
    id: "eumzug",
    name: "eUmzugCH",
    src: "/logos/eumzugch.png",
    alt: "eUmzugCH - Offizielle Umzugsmeldung",
    link: "https://www.eumzug.swiss/",
  },
  {
    id: "post",
    name: "Die Post",
    src: "/logos/post-logo.png",
    alt: "Die Post - Schweizer Post",
    link: "https://www.post.ch/",
  },
  {
    id: "astag",
    name: "ASTAG",
    src: "/logos/astag-logo.png",
    alt: "ASTAG - Branchenverband",
    link: "https://www.astag.ch/",
  },
  {
    id: "swissmade",
    name: "Swiss Made",
    src: "/logos/swiss-made.png",
    alt: "Swiss Made - Schweizer Qualität",
    link: "https://swisslabel.ch/",
  },
];

interface KnownFromRowProps {
  variant?: "below-cta" | "hero-footer" | "compact" | "swiss-partners";
  className?: string;
}

export const KnownFromRow = memo(function KnownFromRow({
  variant = "below-cta",
  className,
}: KnownFromRowProps) {
  
  // Swiss Partners variant: 4 logos in a row (eUmzugCH, Post, ASTAG, Swiss Made)
  if (variant === "swiss-partners") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn("mt-4", className)}
      >
        {/* Label */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <Building2 className="w-3 h-3 text-primary/70" />
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Partner & Zertifizierungen
          </span>
        </div>
        
        {/* Logo Row - Mobile optimized */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {SWISS_PARTNERS.map((partner) => (
            <a
              key={partner.id}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center",
                "transition-all duration-300",
                "grayscale opacity-50 hover:grayscale-0 hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 rounded"
              )}
              title={partner.name}
            >
              <img
                src={partner.src}
                alt={partner.alt}
                className="h-5 sm:h-6 md:h-7 w-auto object-contain max-w-[55px] sm:max-w-[70px] md:max-w-[85px]"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </motion.div>
    );
  }
  
  // Option 2: Hero footer strip (full-width at bottom of hero)
  if (variant === "hero-footer") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className={cn(
          "py-3 bg-muted/30 border-t border-border/30",
          className
        )}
      >
        <div className="container flex items-center justify-center gap-4 flex-wrap">
          {/* Label with icon */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="font-semibold uppercase tracking-wide text-primary">
              Bekannt aus & Partner
            </span>
          </div>
          
          {/* Desktop: All logos */}
          <div className="hidden md:flex items-center gap-4">
            {DISPLAY_LOGOS.map((name) => (
              <RealMediaLogo key={name} name={name} size="sm" grayscale />
            ))}
          </div>
          
          {/* Mobile: 4 logos + "& 2 weitere" */}
          <div className="flex md:hidden items-center gap-3">
            {MOBILE_LOGOS.map((name) => (
              <RealMediaLogo key={name} name={name} size="sm" grayscale />
            ))}
            <span className="text-xs font-medium text-muted-foreground">
              & {REMAINING_COUNT} weitere
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Compact variant: Minimal inline display
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={cn("flex items-center justify-center gap-2 py-2", className)}
      >
        <Shield className="w-3 h-3 text-primary/70 shrink-0" />
        <span className="text-[10px] text-muted-foreground font-medium">Bekannt aus & Partner:</span>
        <div className="flex items-center gap-2">
          {MOBILE_LOGOS.slice(0, 3).map((name) => (
            <RealMediaLogo key={name} name={name} size="sm" grayscale />
          ))}
          <span className="text-[10px] font-semibold text-muted-foreground/60">+{DISPLAY_LOGOS.length - 3}</span>
        </div>
      </motion.div>
    );
  }
  
  // Option 1 (default): Below CTA in form card - "Bekannt aus & Partner"
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={cn("mt-3", className)}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Shield + Label */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="w-3 h-3 text-primary" />
          <span className="font-semibold">Bekannt aus & Partner:</span>
        </div>
        
        {/* Desktop: All 6 logos */}
        <div className="hidden sm:flex items-center justify-center gap-3">
          {DISPLAY_LOGOS.map((name) => (
            <RealMediaLogo key={name} name={name} size="sm" grayscale />
          ))}
        </div>
        
        {/* Mobile: 4 logos + "+2" */}
        <div className="flex sm:hidden items-center justify-center gap-2">
          {MOBILE_LOGOS.map((name) => (
            <RealMediaLogo key={name} name={name} size="sm" grayscale />
          ))}
          <span className="text-xs font-semibold text-muted-foreground/60">+{REMAINING_COUNT}</span>
        </div>
      </div>
    </motion.div>
  );
});

export default KnownFromRow;
