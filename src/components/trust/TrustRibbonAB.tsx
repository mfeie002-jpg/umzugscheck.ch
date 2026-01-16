/**
 * A/B Wrapper for TrustRibbon
 * Renders Variant A, B, C, or D based on context
 */

import { memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { TrustRibbon } from '@/components/trust/TrustRibbon';
import { TrustRibbonVariantB } from '@/components/trust/TrustRibbonVariantB';
import { TrustRibbonVariantC } from '@/components/trust/TrustRibbonVariantC';
import { TrustRibbonVariantD } from '@/components/trust/TrustRibbonVariantD';

interface TrustRibbonABProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonAB = memo(function TrustRibbonAB(props: TrustRibbonABProps) {
  const { variant: abVariant } = useSocialProofAB();
  
  switch (abVariant) {
    case 'B':
      return <TrustRibbonVariantB {...props} />;
    case 'C':
      return <TrustRibbonVariantC {...props} />;
    case 'D':
      return <TrustRibbonVariantD {...props} />;
    default:
      return <TrustRibbon {...props} />;
  }
});
