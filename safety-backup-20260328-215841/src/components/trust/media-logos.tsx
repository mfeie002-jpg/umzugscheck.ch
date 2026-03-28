/**
 * Swiss Media Partners - Shared Logo Components
 * 
 * Used across TrustRibbon variants, KnownFromRow, and MediaTrustSection.
 * Features real PNG logos with grayscale hover effects.
 */

import { memo, useState } from "react";

// Swiss Media & Partners with real logo paths
// IMPORTANT: 7 unique Swiss media partners - no duplicates!
// Order: SRF, NZZ, 20 Minuten, Watson, Mieterverband, TCS, Trustpilot
export const SWISS_MEDIA_PARTNERS = [
  {
    name: "SRF",
    shortName: "SRF",
    website: "srf.ch",
    brandColor: "#C8102E",
    logo: "/logos/media/srf.png",
  },
  {
    name: "NZZ",
    shortName: "NZZ",
    website: "nzz.ch",
    brandColor: "#1A1A1A",
    logo: "/logos/media/nzz.png",
  },
  {
    name: "20 Minuten",
    shortName: "20min",
    website: "20min.ch",
    brandColor: "#4361EE",
    logo: "/logos/media/20min-new.png",
  },
  {
    name: "Watson",
    shortName: "watson",
    website: "watson.ch",
    brandColor: "#1A1A1A",
    logo: "/logos/media/watson.png",
  },
  {
    name: "Mieterverband",
    shortName: "MV",
    website: "mieterverband.ch",
    brandColor: "#003D7A",
    logo: "/logos/media/mieterverband.png",
  },
  {
    name: "TCS",
    shortName: "TCS",
    website: "tcs.ch",
    brandColor: "#1E4B8E",
    logo: "/logos/media/tcs.png",
  },
  {
    name: "Trustpilot",
    shortName: "Trustpilot",
    website: "trustpilot.com",
    brandColor: "#00B67A",
    logo: "/logos/media/trustpilot.png",
  },
] as const;

// Real Media Logo component using actual PNG images
export const RealMediaLogo = memo(({ 
  name, 
  size = "md",
  grayscale = true,
}: { 
  name: string; 
  size?: "sm" | "md" | "lg";
  grayscale?: boolean;
}) => {
  const [hasError, setHasError] = useState(false);
  const partner = SWISS_MEDIA_PARTNERS.find(p => p.name === name);
  
  const heights = {
    sm: "h-5 sm:h-6",
    md: "h-6 sm:h-7",
    lg: "h-7 sm:h-8",
  };
  
  const maxWidths = {
    sm: "max-w-[60px] sm:max-w-[75px]",
    md: "max-w-[75px] sm:max-w-[90px]",
    lg: "max-w-[90px] sm:max-w-[110px]",
  };
  
  if (!partner?.logo || hasError) {
    return (
      <span className={`font-bold text-xs text-foreground/50`}>
        {partner?.shortName || name}
      </span>
    );
  }
  
  return (
    <img 
      src={partner.logo} 
      alt={partner.name}
      className={`
        ${heights[size]} 
        ${maxWidths[size]} 
        w-auto object-contain
        ${grayscale ? 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100' : ''}
        transition-all duration-300
      `}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
});

RealMediaLogo.displayName = "RealMediaLogo";

// Colored logo component - NOW USES PNG IMAGES (same as RealMediaLogo)
// Legacy wrapper for backwards compatibility
export const ColoredMediaLogo = memo(({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) => {
  // Use RealMediaLogo with colored (non-grayscale) styling
  return <RealMediaLogo name={name} size={size} grayscale={false} />;
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
