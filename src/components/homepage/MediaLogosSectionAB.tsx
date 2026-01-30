/**
 * A/B Wrapper for MediaLogosSection (Trust Bar)
 * 
 * Renders Variant A-O based on Social Proof A/B context:
 * - V1 (A): Original - Swiss Trust Icons (Mobiliar, ASTAG, Handelsregister, Google)
 * - V2 (B): Live Dashboard - Dynamic stats + media logos
 * - V3 (C): Trust Hierarchy - Authority logos oben (NZZ, SRF, etc.)
 * - V4 (D): Trust Stack - Kompakte Pills
 * - V5 (E): "Bekannt aus" - Media logos with websites
 * - V6 (F): Verifiable Trust - State-backed, no logo soup (ZEFIX, UID, Insurance, Escrow)
 * - V7 (G): Swiss Infrastructure - eUmzugCH, Post, ASTAG, Swiss Made
 * - V8 (H): Pain vs Gain - Problem solver cards
 * - V9 (I): Hybrid Trust Bar - Psychological ordering
 * - V10 (J): Trust Ecosystem - Comprehensive grid
 * - V11 (K): Minimal Proof Strip - Grayscale CSS logos
 * - V12 (L): Swiss Standards Bar - Official process integration
 * - V13 (M): Hero Reassurance - Trust in Hero, minimal below
 * - V14 (N): Hero Form Footer - Trust in form, minimal below
 * - V15 (O): Hero Eyebrow - Trust above headline, complementary below
 */

import { memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { MediaLogosSection } from './MediaLogosSection';
import { MediaLogosSectionVariantB } from './MediaLogosSectionVariantB';
import { MediaLogosSectionVariantC } from './MediaLogosSectionVariantC';
import { MediaLogosSectionVariantD } from './MediaLogosSectionVariantD';
import { MediaLogosSectionVariantE } from './MediaLogosSectionVariantE';
import { MediaLogosSectionVariantF } from './MediaLogosSectionVariantF';
import { MediaLogosSectionVariantG } from './MediaLogosSectionVariantG';
import { MediaLogosSectionVariantH } from './MediaLogosSectionVariantH';
import { MediaLogosSectionVariantI } from './MediaLogosSectionVariantI';
import { MediaLogosSectionVariantJ } from './MediaLogosSectionVariantJ';
import { MediaLogosSectionVariantK } from './MediaLogosSectionVariantK';
import { MediaLogosSectionVariantL } from './MediaLogosSectionVariantL';
import { MediaLogosSectionVariantM } from './MediaLogosSectionVariantM';
import { MediaLogosSectionVariantN } from './MediaLogosSectionVariantN';
import { MediaLogosSectionVariantO } from './MediaLogosSectionVariantO';

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
    case 'G':
      return <MediaLogosSectionVariantG />;
    case 'H':
      return <MediaLogosSectionVariantH />;
    case 'I':
      return <MediaLogosSectionVariantI />;
    case 'J':
      return <MediaLogosSectionVariantJ />;
    case 'K':
      return <MediaLogosSectionVariantK />;
    case 'L':
      return <MediaLogosSectionVariantL />;
    case 'M':
      return <MediaLogosSectionVariantM />;
    case 'N':
      return <MediaLogosSectionVariantN />;
    case 'O':
      return <MediaLogosSectionVariantO />;
    default:
      return <MediaLogosSection />;
  }
});