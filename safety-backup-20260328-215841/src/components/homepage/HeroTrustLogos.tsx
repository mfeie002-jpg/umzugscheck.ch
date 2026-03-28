/**
 * HeroTrustLogos - 4 Swiss Trust Logos for Hero Section
 * 
 * Order: eUmzugCH → Die Post → ASTAG → Swiss Made
 * Mobile-first: 4 logos in a row, responsive sizing
 */

import { memo } from "react";
import { cn } from "@/lib/utils";

interface TrustLogo {
  id: string;
  name: string;
  src: string;
  alt: string;
  link: string;
}

const TRUST_LOGOS: TrustLogo[] = [
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
    link: "https://www.post.ch/de/empfangen/nachsenden-umleiten/nachsendeauftrag",
  },
  {
    id: "astag",
    name: "ASTAG",
    src: "/logos/astag-logo.png",
    alt: "ASTAG - Schweizerischer Nutzfahrzeugverband",
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

interface HeroTrustLogosProps {
  className?: string;
  variant?: "default" | "compact";
}

export const HeroTrustLogos = memo(function HeroTrustLogos({
  className,
  variant = "default",
}: HeroTrustLogosProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 sm:gap-4 md:gap-6",
        variant === "compact" && "gap-2 sm:gap-3",
        className
      )}
      role="list"
      aria-label="Partner und Zertifizierungen"
    >
      {TRUST_LOGOS.map((logo) => (
        <a
          key={logo.id}
          href={logo.link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center justify-center",
            "transition-all duration-300",
            "grayscale opacity-60 hover:grayscale-0 hover:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 rounded"
          )}
          title={logo.name}
          role="listitem"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            className={cn(
              "object-contain",
              // Mobile-first responsive sizing
              variant === "default" && "h-6 sm:h-7 md:h-8 w-auto max-w-[60px] sm:max-w-[80px] md:max-w-[100px]",
              variant === "compact" && "h-5 sm:h-6 w-auto max-w-[50px] sm:max-w-[70px]"
            )}
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
});

export default HeroTrustLogos;
