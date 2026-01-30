/**
 * A/B Wrapper for MediaLogosSection (Trust Bar)
 * 
 * Renders Variant A, B, C, D, E, or F based on Social Proof A/B context:
 * - V1 (A): Original - Swiss Trust Icons (Mobiliar, ASTAG, Handelsregister, Google)
 * - V2 (B): Live Dashboard - Dynamic stats + media logos
 * - V3 (C): Trust Hierarchy - Authority logos oben (NZZ, SRF, etc.)
 * - V4 (D): Trust Stack - Kompakte Pills
 * - V5 (E): "Bekannt aus" - Media logos with websites
 * - V6 (F): Verifiable Trust - State-backed, no logo soup (ZEFIX, UID, Insurance, Escrow)
 */

import { memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { MediaLogosSection } from './MediaLogosSection';
import { MediaLogosSectionVariantB } from './MediaLogosSectionVariantB';
import { MediaLogosSectionVariantC } from './MediaLogosSectionVariantC';
import { MediaLogosSectionVariantD } from './MediaLogosSectionVariantD';
import { MediaLogosSectionVariantE } from './MediaLogosSectionVariantE';
import { MediaLogosSectionVariantF } from './MediaLogosSectionVariantF';

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
    case 'F':
      return <MediaLogosSectionVariantF />;
    default:
      return <MediaLogosSection />;
  }
});
