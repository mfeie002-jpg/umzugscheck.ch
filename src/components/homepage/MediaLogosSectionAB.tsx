/**
 * A/B Wrapper for MediaLogosSection (Trust Bar)
 * 
 * Renders Variant A, B, C, D, or E based on Social Proof A/B context:
 * - V1 (A): Original - Swiss Trust Icons (Mobiliar, ASTAG, Handelsregister, Google)
 * - V2 (B): Live Dashboard - Dynamic stats + media logos
 * - V3 (C): Trust Hierarchy - Authority logos oben (NZZ, SRF, etc.)
 * - V4 (D): Trust Stack - Kompakte Pills
 * - V5 (E): Trust Strip 2.0 - Unified minimalist strip
 */

import { memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { MediaLogosSection } from './MediaLogosSection';
import { MediaLogosSectionVariantB } from './MediaLogosSectionVariantB';
import { MediaLogosSectionVariantC } from './MediaLogosSectionVariantC';
import { MediaLogosSectionVariantD } from './MediaLogosSectionVariantD';
import { MediaLogosSectionVariantE } from './MediaLogosSectionVariantE';

export const MediaLogosSectionAB = memo(function MediaLogosSectionAB() {
  const { variant } = useSocialProofAB();
  
  switch (variant) {
    case 'B':
      return <MediaLogosSectionVariantB />;
    case 'C':
      return <MediaLogosSectionVariantC />;
    case 'D':
      return <MediaLogosSectionVariantD />;
    case 'E':
      return <MediaLogosSectionVariantE />;
    default:
      return <MediaLogosSection />;
  }
});
