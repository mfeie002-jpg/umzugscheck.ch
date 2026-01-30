/**
 * A/B Wrapper for TrustRibbon
 * CONSOLIDATED: 17 variants (A-Q)
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
    
    // === All other variants use Verifiable Trust style ===
    case 'G':
    case 'H':
    case 'I':
    case 'J':
    case 'K':
    case 'L':
    case 'M':
    case 'N':
    case 'O':
    case 'P':
    case 'Q':
      return <TrustRibbonVariantF {...props} />;
    
    // Default: Original
    default:
      return <TrustRibbon {...mappedProps} />;
  }
});
