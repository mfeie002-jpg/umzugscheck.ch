/**
 * KnownFromRow - Integrated trust element for hero section (Golden Flow V10)
 * 
 * Based on detailed research:
 * 
 * Option 1 (below-cta): Trust block inside form card, below CTA button
 *   - Conversion-oriented: trust at the point of decision
 *   - Mobile: 3 logos + "+3" indicator
 *   - Desktop: all 6 logos in a row
 * 
 * Option 2 (hero-footer): Horizontal strip at bottom of hero section
 *   - Full-width with subtle background
 *   - Monochrome logos with hover color effect
 *   - "Bekannt aus" label with Shield icon
 * 
 * Option 3 (swiss-partners): 4 Swiss Partner Logos
 *   - eUmzugCH, Die Post, ASTAG, Swiss Made
 *   - Ordered by relevance, mobile-optimized
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shield, Newspaper, Building2 } from "lucide-react";
import { 
  ColoredMediaLogo, 
  MonochromeMediaLogo,
} from "@/components/trust/media-logos";

// Top 6 media partners for trust display
const DISPLAY_LOGOS = ["SRF", "NZZ", "Blick", "20 Minuten", "Watson", "newhome"];
const MOBILE_LOGOS = ["SRF", "NZZ", "Blick"]; // Top 3 for mobile
const REMAINING_COUNT = DISPLAY_LOGOS.length - MOBILE_LOGOS.length;

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
              Bekannt aus
            </span>
          </div>
          
          {/* Desktop: All logos monochrome with hover effect */}
          <div className="hidden md:flex items-center gap-4">
            {DISPLAY_LOGOS.map((name) => (
              <div 
                key={name}
                className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200 cursor-pointer"
              >
                <ColoredMediaLogo name={name} size="sm" />
              </div>
            ))}
          </div>
          
          {/* Mobile: 3 logos + "&amp; mehr" */}
          <div className="flex md:hidden items-center gap-3">
            {MOBILE_LOGOS.map((name) => (
              <div 
                key={name}
                className="grayscale opacity-70"
              >
                <ColoredMediaLogo name={name} size="sm" />
              </div>
            ))}
            <span className="text-xs font-semibold text-muted-foreground">
              & mehr
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
        <span className="text-[10px] text-muted-foreground font-medium">Bekannt aus:</span>
        <div className="flex items-center gap-2">
          {MOBILE_LOGOS.map((name) => (
            <MonochromeMediaLogo key={name} name={name} size="sm" />
          ))}
          <span className="text-[10px] font-semibold text-muted-foreground/60">+{REMAINING_COUNT}</span>
        </div>
      </motion.div>
    );
  }
  
  // Option 1 (default): Below CTA in form card
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={cn("mt-3", className)}
    >
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        {/* Shield + Label */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Shield className="w-3 h-3 text-primary" />
          <span className="font-semibold">Bekannt aus:</span>
        </div>
        
        {/* Desktop: All 6 logos */}
        <div className="hidden sm:flex items-center gap-2">
          {DISPLAY_LOGOS.map((name) => (
            <div 
              key={name}
              className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200"
            >
              <ColoredMediaLogo name={name} size="sm" />
            </div>
          ))}
        </div>
        
        {/* Mobile: 3 logos + "+3" */}
        <div className="flex sm:hidden items-center gap-2">
          {MOBILE_LOGOS.map((name) => (
            <div 
              key={name}
              className="grayscale opacity-60"
            >
              <ColoredMediaLogo name={name} size="sm" />
            </div>
          ))}
          <span className="font-semibold text-muted-foreground/60">+{REMAINING_COUNT}</span>
        </div>
      </div>
    </motion.div>
  );
});

export default KnownFromRow;
