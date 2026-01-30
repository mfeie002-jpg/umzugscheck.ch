/**
 * A/B Wrapper for MediaLogosSection (Trust Bar)
 * 
 * EXPANDED: 28 variants (A-AB) - includes research-based + CRO patterns
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
 * === Hero-Integrated ===
 * - V9-V13 (I-M): Various hero placements → minimal section below
 * 
 * === Psychological ===
 * - V14-V17 (N-Q): Bandwagon, Local Trust, Data Security, In-Form
 * 
 * === Research-Based ===
 * - V18-V22 (R-V): Grid, Hierarchy, Comparison, Tabs, Pain Combo
 * 
 * === CRO Patterns (NEW) ===
 * - V23 (W): Trust Floor / Anker
 * - V24 (X): Form Anchor
 * - V25 (Y): Eyebrow Badge
 * - V26 (Z): Floating Cards
 * - V27 (AA): Trust Ticker
 * - V28 (AB): Glasmorphism Authority
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
import { MediaLogosSectionVariantU } from './MediaLogosSectionVariantU';
import { MediaLogosSectionVariantV } from './MediaLogosSectionVariantV';
import { MediaLogosSectionVariantW } from './MediaLogosSectionVariantW';
import { MediaLogosSectionVariantX } from './MediaLogosSectionVariantX';
import { MediaLogosSectionVariantY } from './MediaLogosSectionVariantY';
// CRO Pattern imports
import { MediaLogosSectionVariantZ } from './MediaLogosSectionVariantZ';
import { MediaLogosSectionVariantAA } from './MediaLogosSectionVariantAA';
import { MediaLogosSectionVariantAB } from './MediaLogosSectionVariantAB';
import { MediaLogosSectionVariantAC } from './MediaLogosSectionVariantAC';
import { MediaLogosSectionVariantAD } from './MediaLogosSectionVariantAD';
import { MediaLogosSectionVariantAE } from './MediaLogosSectionVariantAE';

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
    
    // === Research-Based (R-V) NEW ===
    case 'R':
      // V18: Scannable Grid
      return <MediaLogosSectionVariantU />;
    case 'S':
      // V19: Hierarchy Strip
      return <MediaLogosSectionVariantV />;
    case 'T':
      // V20: Comparison Preview
      return <MediaLogosSectionVariantW />;
    case 'U':
      // V21: Mobile-First Tabs
      return <MediaLogosSectionVariantX />;
    case 'V':
      // V22: Trust + Pain Combo
      return <MediaLogosSectionVariantY />;
    
    // === CRO Patterns (W-AB) NEW ===
    case 'W':
      // V23: Trust Floor / Anker
      return <MediaLogosSectionVariantZ />;
    case 'X':
      // V24: Form Anchor
      return <MediaLogosSectionVariantAA />;
    case 'Y':
      // V25: Eyebrow Badge
      return <MediaLogosSectionVariantAB />;
    case 'Z':
      // V26: Floating Cards
      return <MediaLogosSectionVariantAC />;
    case 'AA':
      // V27: Trust Ticker
      return <MediaLogosSectionVariantAD />;
    case 'AB':
      // V28: Glasmorphism Authority
      return <MediaLogosSectionVariantAE />;
    
    // Default: Original
    default:
      return <MediaLogosSection />;
  }
});
