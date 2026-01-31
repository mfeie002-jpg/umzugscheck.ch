/**
 * A/B Wrapper for TrustRibbon
 * CONSOLIDATED: 17 variants (A-Q) - NOW ALL UNIQUE
 * 
 * A: Original TrustRibbon
 * B: Live Dashboard (monochrome logos, activity ticker)
 * C: Trust Hierarchy (Authority → Logic → Emotion)
 * D: Trust Stack (compact module with proof chips)
 * E: Trust Strip 2.0 (unified strip)
 * F: Verifiable Trust (Swiss Trust Triumvirate)
 * G: Swiss Infrastructure (eUmzugCH, Post, ASTAG)
 * H: Minimal Proof Strip (grayscale logos)
 * I-M: Hero-integrated (trust IN hero, minimal below)
 * N: Bandwagon Effect (live activity)
 * O: Local Trust (regional badges)
 * P: Data Security (SSL/GDPR focus)
 * Q: In-Form Container (trust inside form, minimal below)
 */

import { memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { TrustRibbon } from '@/components/trust/TrustRibbon';
import { TrustRibbonVariantB } from '@/components/trust/TrustRibbonVariantB';
import { TrustRibbonVariantC } from '@/components/trust/TrustRibbonVariantC';
import { TrustRibbonVariantD } from '@/components/trust/TrustRibbonVariantD';
import { TrustRibbonVariantE } from '@/components/trust/TrustRibbonVariantE';
import { TrustRibbonVariantF } from '@/components/trust/TrustRibbonVariantF';
import { TrustRibbonVariantG } from '@/components/trust/TrustRibbonVariantG';
import { TrustRibbonVariantH } from '@/components/trust/TrustRibbonVariantH';
import { TrustRibbonMinimal } from '@/components/trust/TrustRibbonMinimal';
import { TrustRibbonVariantN } from '@/components/trust/TrustRibbonVariantN';
import { TrustRibbonVariantO } from '@/components/trust/TrustRibbonVariantO';
import { TrustRibbonVariantP } from '@/components/trust/TrustRibbonVariantP';

interface TrustRibbonABProps {
  variant?: "full" | "compact" | "trust" | "media";
  className?: string;
}

export const TrustRibbonAB = memo(function TrustRibbonAB(props: TrustRibbonABProps) {
  const { variant: abVariant } = useSocialProofAB();
  
  // Map variant prop for components that don't support all variants
  const mappedProps = {
    ...props,
    variant: props.variant === "trust" || props.variant === "media" 
      ? "full" as const 
      : props.variant,
  };
  
  switch (abVariant) {
    // === Standalone Sections (A-F) ===
    case 'B':
      return <TrustRibbonVariantB {...mappedProps} />;
    case 'C':
      return <TrustRibbonVariantC {...mappedProps} />;
    case 'D':
      return <TrustRibbonVariantD {...mappedProps} />;
    case 'E':
      return <TrustRibbonVariantE {...mappedProps} />;
    case 'F':
      return <TrustRibbonVariantF {...props} />;
    
    // === Swiss-specific (G-H) ===
    case 'G':
      // V7: Swiss Infrastructure (eUmzugCH, Post, ASTAG)
      return <TrustRibbonVariantG {...mappedProps} />;
    case 'H':
      // V8: Minimal Proof Strip (grayscale logos)
      return <TrustRibbonVariantH {...mappedProps} />;
    
    // === Hero-Integrated (I-M) - trust is IN the hero, minimal section below ===
    // NOTE: These only show full trust IN HERO when Homepage Hero = A
    case 'I':
    case 'J':
    case 'K':
    case 'L':
    case 'M':
      // Minimal stats strip (trust already shown in hero)
      return <TrustRibbonMinimal className={props.className} />;
    
    // === Psychological Triggers (N-Q) ===
    case 'N':
      // V14: Bandwagon Effect (live activity)
      return <TrustRibbonVariantN {...mappedProps} />;
    case 'O':
      // V15: Local Trust (regional badges)
      return <TrustRibbonVariantO {...mappedProps} />;
    case 'P':
      // V16: Data Security (SSL/GDPR focus)
      return <TrustRibbonVariantP {...mappedProps} />;
    case 'Q':
      // V17: In-Form Container (trust inside form, minimal below)
      return <TrustRibbonMinimal className={props.className} />;
    
    // Default: Original
    default:
      return <TrustRibbon {...mappedProps} />;
  }
});
