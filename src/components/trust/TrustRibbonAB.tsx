/**
 * A/B Wrapper for TrustRibbon
 * Renders either Variant A or B based on context
 */

import { memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { TrustRibbon } from '@/components/trust/TrustRibbon';
import { TrustRibbonVariantB } from '@/components/trust/TrustRibbonVariantB';

interface TrustRibbonABProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonAB = memo(function TrustRibbonAB(props: TrustRibbonABProps) {
  const { variant: abVariant } = useSocialProofAB();
  
  if (abVariant === 'B') {
    return <TrustRibbonVariantB {...props} />;
  }
  
  return <TrustRibbon {...props} />;
});
