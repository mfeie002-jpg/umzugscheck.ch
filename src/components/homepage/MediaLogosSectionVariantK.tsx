/**
 * MediaLogosSection VARIANT K - "Minimal Proof Strip"
 * 
 * VERSION 11: Clean grayscale logos with CSS hover effects
 * Based on feedback: "Minimal CSS-based approach"
 * 
 * Features:
 * - height: 40px fixed for harmony
 * - grayscale(100%) opacity(0.6) default
 * - Full color on hover
 * - No carousel/slider (Swiss users prefer static)
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TRUST } from "@/content/trust";
import { Star, CheckCircle2 } from "lucide-react";

interface LogoItem {
  name: string;
  src: string;
  url?: string;
  label: string;
}

// Only show logos we can actually prove
const trustLogos: LogoItem[] = [
  {
    name: "Swiss Made Software",
    src: "/logos/swiss-made-software.png",
    url: "https://www.swissmadesoftware.org/",
    label: "Swiss Made Software",
  },
  {
    name: "eUmzugCH",
    src: "/logos/eumzugch.png",
    url: "https://www.eumzug.swiss/",
    label: "eUmzugCH kompatibel",
  },
  {
    name: "ASTAG",
    src: "/logos/astag.png",
    url: "https://www.astag.ch/",
    label: "ASTAG zertifiziert",
  },
  {
    name: "Die Post",
    src: "/logos/diepost.png",
    url: "https://www.post.ch/",
    label: "Post Nachsendeauftrag",
  },
];

const TrustLogo = memo(({ logo }: { logo: LogoItem }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    // Text fallback
    return (
      <a
        href={logo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                   text-muted-foreground hover:text-foreground"
      >
        <span className="text-sm font-semibold">{logo.name}</span>
        <span className="text-[10px]">{logo.label}</span>
      </a>
    );
  }
  
  return (
    <a
      href={logo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                 focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <img
        src={logo.src}
        alt={logo.label}
        className={cn(
          "h-8 md:h-10 w-auto object-contain transition-all duration-200",
          // CSS-based grayscale effect
          "grayscale opacity-60",
          "group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-md"
        )}
        loading="lazy"
        onError={() => setHasError(true)}
      />
      <span className="text-[10px] md:text-xs text-muted-foreground group-hover:text-primary 
                       font-medium text-center transition-colors">
        {logo.label}
      </span>
    </a>
  );
});

TrustLogo.displayName = 'TrustLogo';

export const MediaLogosSectionVariantK = memo(function MediaLogosSectionVariantK() {
  return (
    <section className="py-2 md:py-3 bg-card border-b border-border/50">
      <div className="container mx-auto px-4">
        {/* Minimal header */}
        <div className="flex flex-col items-center">
          <h2 className="text-center text-sm md:text-base font-bold text-primary mb-2 tracking-wide uppercase">
            Der Schweizer Standard für Ihren Umzug
          </h2>
          
          {/* Logo grid - 2 cols on mobile, 4+ on desktop */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full max-w-4xl">
            {trustLogos.map((logo) => (
              <TrustLogo key={logo.name} logo={logo} />
            ))}
            
            {/* Rating as final "logo" */}
            <div className="flex flex-col items-center gap-1 px-3 py-2">
              <div className="flex items-center gap-1 h-8 md:h-10">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold">{TRUST.ratingDisplay}</span>
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-medium text-center">
                {TRUST.ratingCount.toLocaleString()} Bewertungen
              </span>
            </div>
          </div>

          {/* Micro trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 pt-2 border-t border-border/30">
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

export default MediaLogosSectionVariantK;
