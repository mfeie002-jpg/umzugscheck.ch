/**
 * Swiss Media Partners - Shared Logo Components
 * 
 * Used across TrustRibbon variants and MediaTrustSection.
 * Features real brand colors and website URLs for the 6 key media partners.
 */

import { memo } from "react";

// Swiss Media Partners with real brand styling
export const SWISS_MEDIA_PARTNERS = [
  {
    name: "20 Minuten",
    shortName: "20min",
    website: "20min.ch",
    brandColor: "#E3000F",
  },
  {
    name: "SRF",
    shortName: "SRF",
    website: "srf.ch",
    brandColor: "#C8102E",
  },
  {
    name: "Blick",
    shortName: "BLICK",
    website: "blick.ch",
    brandColor: "#E30613",
  },
  {
    name: "NZZ",
    shortName: "NZZ",
    website: "nzz.ch",
    brandColor: "#1A1A1A",
  },
  {
    name: "Watson",
    shortName: "watson",
    website: "watson.ch",
    brandColor: "#FF6B35",
  },
  {
    name: "newhome",
    shortName: "newhome",
    website: "newhome.ch",
    brandColor: "#00A859",
  },
] as const;

// Colored logo component (for prominent usage)
export const ColoredMediaLogo = memo(({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: { text: "text-sm", badge: "text-xs px-2 py-0.5" },
    md: { text: "text-base sm:text-lg", badge: "text-xs sm:text-sm px-2 sm:px-3 py-1" },
    lg: { text: "text-lg sm:text-xl", badge: "text-sm px-3 py-1.5" },
  };
  
  const s = sizeClasses[size];
  
  const logos: Record<string, JSX.Element> = {
    "20 Minuten": (
      <div className="flex items-baseline gap-0.5">
        <span className={`${size === "sm" ? "text-lg" : "text-xl sm:text-2xl"} font-black text-[#E3000F]`}>20</span>
        <span className={`${s.text} font-semibold text-foreground`}>Minuten</span>
      </div>
    ),
    "SRF": (
      <div className={`bg-[#C8102E] text-white font-bold ${s.badge} rounded`}>
        SRF
      </div>
    ),
    "Blick": (
      <div className={`bg-[#E30613] text-white font-black ${s.badge} rounded`}>
        BLICK
      </div>
    ),
    "NZZ": (
      <span className={`font-serif font-bold ${size === "sm" ? "text-lg" : "text-xl sm:text-2xl"} text-foreground tracking-tight`}>
        NZZ
      </span>
    ),
    "Watson": (
      <div className="flex items-center gap-1">
        <div className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5 sm:w-6 sm:h-6"} bg-[#FF6B35] rounded-full flex items-center justify-center`}>
          <span className="text-white text-[10px] sm:text-xs font-bold">W</span>
        </div>
        <span className={`font-bold ${s.text} text-foreground lowercase`}>watson</span>
      </div>
    ),
    "newhome": (
      <div className="flex items-center gap-1">
        <div className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5 sm:w-6 sm:h-6"} bg-[#00A859] rounded flex items-center justify-center`}>
          <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor">
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.25L18 10v9H6v-9l6-4.75z"/>
            <rect x="10" y="14" width="4" height="5"/>
          </svg>
        </div>
        <span className={`font-semibold ${s.text} text-[#00A859]`}>newhome</span>
      </div>
    ),
  };
  
  return logos[name] || <span className={`font-bold ${s.text}`}>{name}</span>;
});

ColoredMediaLogo.displayName = "ColoredMediaLogo";

// Monochrome logo component (for subtle/premium usage)
export const MonochromeMediaLogo = memo(({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };
  
  const logos: Record<string, JSX.Element> = {
    "20 Minuten": (
      <span className={`font-bold ${sizeClasses[size]} text-foreground/70 hover:text-foreground transition-colors`}>
        20 Minuten
      </span>
    ),
    "SRF": (
      <span className={`font-bold ${sizeClasses[size]} text-foreground/70 hover:text-foreground transition-colors`}>
        SRF
      </span>
    ),
    "Blick": (
      <span className={`font-bold ${sizeClasses[size]} text-foreground/70 hover:text-foreground transition-colors uppercase`}>
        Blick
      </span>
    ),
    "NZZ": (
      <span className={`font-serif font-bold ${size === "sm" ? "text-sm" : "text-base"} text-foreground/70 hover:text-foreground transition-colors`}>
        NZZ
      </span>
    ),
    "Watson": (
      <span className={`font-bold ${sizeClasses[size]} text-foreground/70 hover:text-foreground transition-colors lowercase`}>
        watson
      </span>
    ),
    "newhome": (
      <span className={`font-semibold ${sizeClasses[size]} text-foreground/70 hover:text-foreground transition-colors`}>
        newhome.ch
      </span>
    ),
  };
  
  return logos[name] || <span className={`font-bold ${sizeClasses[size]} text-foreground/70`}>{name}</span>;
});

MonochromeMediaLogo.displayName = "MonochromeMediaLogo";

// Get partner by name
export function getMediaPartner(name: string) {
  return SWISS_MEDIA_PARTNERS.find(p => p.name === name || p.shortName === name);
}
