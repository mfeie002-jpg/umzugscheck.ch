/**
 * TrustLogo - Fail-Safe Logo Component
 * 
 * Zeigt ein Trust-Logo mit automatischem Fallback bei 404.
 * Verwendet SVGs aus /public/logos/trust/
 * 
 * Spec: 240×80px Canvas, transparent, zentriert
 */

import { memo, useState } from "react";
import { cn } from "@/lib/utils";

// Offizielles Logo-Asset-Schema
export const TRUST_LOGO_PATHS = {
  astag: "/logos/trust/astag.svg",
  "die-mobiliar": "/logos/trust/die-mobiliar.svg",
  "die-post": "/logos/trust/die-post.svg",
  eumzugch: "/logos/trust/eumzugch.svg",
  "mieterverband": "/logos/trust/mieterverband-schweiz.svg",
  raiffeisen: "/logos/trust/raiffeisen.svg",
  "swiss-hosting": "/logos/trust/swiss-hosting.svg",
  "swiss-label": "/logos/trust/trust-swiss-label.svg",
  "trusted-shops": "/logos/trust/trust-trusted-shops.svg",
  twint: "/logos/trust/twint.svg",
  zkb: "/logos/trust/zkb.svg",
} as const;

// Fallback colors for text display
const LOGO_FALLBACK_COLORS: Record<string, string> = {
  astag: "#003366",
  "die-mobiliar": "#E2001A",
  "die-post": "#FFCC00",
  eumzugch: "#DC0018",
  mieterverband: "#0066B3",
  raiffeisen: "#FFD500",
  "swiss-hosting": "#10B981",
  "swiss-label": "#E2001A",
  "trusted-shops": "#FFDC0F",
  twint: "#000000",
  zkb: "#0033A0",
  // Media logos
  srf: "#C8102E",
  nzz: "#1A1A1A",
  blick: "#E30613",
  "20min": "#E3000F",
  watson: "#FF6B35",
};

export type TrustLogoId = keyof typeof TRUST_LOGO_PATHS;

interface TrustLogoProps {
  id: TrustLogoId | string;
  name: string;
  src?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  grayscale?: boolean;
}

export const TrustLogo = memo(function TrustLogo({
  id,
  name,
  src,
  className,
  size = "md",
  showLabel = false,
  grayscale = false,
}: TrustLogoProps) {
  const [hasError, setHasError] = useState(false);
  
  // Determine the source path
  const logoPath = src || TRUST_LOGO_PATHS[id as TrustLogoId] || `/logos/trust/${id}.svg`;
  const fallbackColor = LOGO_FALLBACK_COLORS[id] || "#666666";
  
  const sizeClasses = {
    sm: "h-6 max-w-[80px]",
    md: "h-8 max-w-[100px]",
    lg: "h-10 max-w-[120px]",
  };
  
  const containerSizeClasses = {
    sm: "h-8 px-2",
    md: "h-12 px-4",
    lg: "h-14 px-5",
  };

  // If image failed to load, show text fallback
  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg bg-muted/50",
          containerSizeClasses[size],
          className
        )}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: fallbackColor }}
        >
          {name.charAt(0)}
        </div>
        {showLabel && (
          <span
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: fallbackColor }}
          >
            {name}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        containerSizeClasses[size],
        className
      )}
    >
      <img
        src={logoPath}
        alt={name}
        loading="lazy"
        className={cn(
          sizeClasses[size],
          "object-contain",
          grayscale && "grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
        )}
        onError={() => setHasError(true)}
      />
      {showLabel && !hasError && (
        <span className="ml-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">
          {name}
        </span>
      )}
    </div>
  );
});

// Media logo text-based component (for media brands where we use styled text)
interface MediaLogoProps {
  name: string;
  className?: string;
}

export const MediaLogo = memo(function MediaLogo({ name, className }: MediaLogoProps) {
  const color = LOGO_FALLBACK_COLORS[name.toLowerCase().replace(/\s/g, "")] || "#1A1A1A";
  
  const logoStyles: Record<string, React.ReactNode> = {
    "SRF": (
      <div className="bg-[#C8102E] text-white font-bold text-xs px-2 py-0.5 rounded">
        SRF
      </div>
    ),
    "NZZ": (
      <span className="font-serif font-bold text-lg text-foreground tracking-tight">
        NZZ
      </span>
    ),
    "Blick": (
      <div className="bg-[#E30613] text-white font-black text-xs px-2 py-0.5 rounded uppercase">
        Blick
      </div>
    ),
    "20 Minuten": (
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-black text-[#E3000F]">20</span>
        <span className="text-sm font-semibold text-foreground">Minuten</span>
      </div>
    ),
    "Watson": (
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 bg-[#FF6B35] rounded-full flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">W</span>
        </div>
        <span className="font-bold text-sm text-foreground lowercase">watson</span>
      </div>
    ),
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {logoStyles[name] || (
        <span className="font-bold text-sm" style={{ color }}>
          {name}
        </span>
      )}
    </div>
  );
});

export default TrustLogo;
