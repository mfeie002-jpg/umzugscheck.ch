/**
 * A/B Wrapper for MediaLogosSection (Trust Bar)
 * 
 * CONSOLIDATED: 17 variants (A-Q)
 * 
 * === Standalone Sections ===
 * - V1 (A): Original - Swiss Trust Icons
 * - V2 (B): Live Dashboard - Dynamic stats
 * - V3 (C): Trust Hierarchy - Authority logos
 * - V4 (D): Trust Stack - Kompakte Pills
 * - V5 (E): "Bekannt aus" - Media logos
 * - V6 (F): Verifiable Trust - State-backed
 * 
 * === Hybrid/Swiss ===
 * - V7 (G): Swiss Infrastructure
 * - V8 (H): Minimal Proof Strip
 * 
 * === Hero-Integrated (use minimal section below) ===
 * - V9-V13 (I-M): Various hero placements → minimal section below
 * 
 * === Psychological ===
 * - V14 (N): Bandwagon Effect
 * - V15 (O): Local Trust
 * - V16 (P): Data Security
 * - V17 (Q): In-Form Container
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
import { MediaLogosSectionVariantK } from './MediaLogosSectionVariantK';
import { MediaLogosSectionVariantM } from './MediaLogosSectionVariantM';
import { MediaLogosSectionVariantQ } from './MediaLogosSectionVariantQ';

export const MediaLogosSectionAB = memo(function MediaLogosSectionAB() {
  const { variant } = useSocialProofAB();
  
  switch (variant) {
    // === Standalone Sections (A-F) ===
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
    
    // === Hybrid/Swiss (G-H) ===
    case 'G':
      return <MediaLogosSectionVariantG />;
    case 'H':
      // Minimal Proof Strip (was K)
      return <MediaLogosSectionVariantK />;
    
    // === Hero-Integrated (I-M) - use minimal section below ===
    case 'I':
    case 'J':
    case 'K':
    case 'L':
    case 'M':
      // Hero variants use minimal media section below (trust is in hero)
      return <MediaLogosSectionVariantM />;
    
    // === Psychological (N-Q) ===
    case 'N':
      // Bandwagon Effect
      return <MediaLogosSectionVariantQ />;
    case 'O':
      // Local Trust → use original with additions
      return <MediaLogosSection />;
    case 'P':
      // Data Security → use Verifiable Trust variant
      return <MediaLogosSectionVariantF />;
    case 'Q':
      // In-Form Container → minimal below
      return <MediaLogosSectionVariantM />;
    
    // Default: Original
    default:
      return <MediaLogosSection />;
  }
});
