/**
 * TrustRibbon VARIANT H - Minimal Proof Strip
 * 
 * VERSION 8: Clean grayscale logos with minimal design
 * - height: 40px fixed for harmony
 * - grayscale(100%) opacity(0.6) default
 * - Full color on hover
 * - No carousel/slider (Swiss users prefer static)
 */

import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { TRUST } from "@/content/trust";
import { Star, CheckCircle2 } from "lucide-react";

interface LogoItem {
  name: string;
  src: string;
  url?: string;
  label: string;
}

const trustLogos: LogoItem[] = [
  {
    name: "Swiss Made Software",
    src: "/logos/swiss-made-software.png",
    url: "https://www.swissmadesoftware.org/",
    label: "Swiss Made",
  },
  {
    name: "eUmzugCH",
    src: "/logos/eumzugch.png",
    url: "https://www.eumzug.swiss/",
    label: "eUmzugCH",
  },
  {
    name: "ASTAG",
    src: "/logos/astag.png",
    url: "https://www.astag.ch/",
    label: "ASTAG",
  },
  {
    name: "Die Post",
    src: "/logos/diepost.png",
    url: "https://www.post.ch/",
    label: "Die Post",
  },
];

const TrustLogo = memo(({ logo }: { logo: LogoItem }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <a
        href={logo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        {logo.name}
      </a>
    );
  }
  
  return (
    <a
      href={logo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <img
        src={logo.src}
        alt={logo.label}
        className={cn(
          "h-6 md:h-8 w-auto object-contain transition-all duration-200",
          "grayscale opacity-60",
          "group-hover:grayscale-0 group-hover:opacity-100"
        )}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </a>
  );
});

TrustLogo.displayName = 'TrustLogo';

interface TrustRibbonVariantHProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonVariantH = memo(function TrustRibbonVariantH({
  variant = "full",
  className,
}: TrustRibbonVariantHProps) {
  
  if (variant === "compact") {
    return (
      <div className={cn("py-2 bg-card border-b border-border/50", className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6">
            {trustLogos.slice(0, 3).map((logo) => (
              <TrustLogo key={logo.name} logo={logo} />
            ))}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm">{TRUST.ratingDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={cn("py-3 md:py-4 bg-card border-b border-border/50", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <h2 className="text-center text-sm md:text-base font-bold text-primary mb-3 tracking-wide uppercase">
            Der Schweizer Standard für Ihren Umzug
          </h2>
          
          {/* Logo grid */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 w-full max-w-4xl mb-3">
            {trustLogos.map((logo) => (
              <TrustLogo key={logo.name} logo={logo} />
            ))}
            
            {/* Rating as final element */}
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{TRUST.ratingDisplay}</span>
              <span className="text-xs text-muted-foreground">
                ({TRUST.ratingCount.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Micro trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-border/30">
            <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Alle Partner versichert</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>UID-Register geprüft</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
