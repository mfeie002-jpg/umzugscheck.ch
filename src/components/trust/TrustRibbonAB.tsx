/**
 * A/B Wrapper for TrustRibbon
 * Renders Variant A-L based on context
 * 
 * Variants:
 * - A: Original - Colored logos, 15'000+ big number
 * - B: Live Dashboard, Deal Cards
 * - C: Trust Hierarchy (Authority → Logic → Emotion)
 * - D: Trust Stack (kompakt, Outcome-Tags)
 * - E: Trust Strip 2.0 (unified strip)
 * - F: Verifiable Trust (ZEFIX, UID, Insurance, Escrow)
 * - G-L: Use same ribbon variants (MediaLogos handles visual differences)
 */

import { memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { TrustRibbon } from '@/components/trust/TrustRibbon';
import { TrustRibbonVariantB } from '@/components/trust/TrustRibbonVariantB';
import { TrustRibbonVariantC } from '@/components/trust/TrustRibbonVariantC';
import { TrustRibbonVariantD } from '@/components/trust/TrustRibbonVariantD';
import { TrustRibbonVariantE } from '@/components/trust/TrustRibbonVariantE';
import { TrustRibbonVariantF } from '@/components/trust/TrustRibbonVariantF';

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
  
  // Variants G-L reuse the F variant for TrustRibbon (MediaLogos handles the differences)
  switch (abVariant) {
    case 'B':
      return <TrustRibbonVariantB {...mappedProps} />;
    case 'C':
      return <TrustRibbonVariantC {...mappedProps} />;
    case 'D':
      return <TrustRibbonVariantD {...mappedProps} />;
    case 'E':
      return <TrustRibbonVariantE {...mappedProps} />;
    case 'F':
    case 'G':
    case 'H':
    case 'I':
    case 'J':
    case 'K':
    case 'L':
    case 'M':
    case 'N':
    case 'O':
      return <TrustRibbonVariantF {...props} />;
    default:
      return <TrustRibbon {...mappedProps} />;
  }
});