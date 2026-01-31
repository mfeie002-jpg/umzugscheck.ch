/**
 * A/B Testing Context for Social Proof Sections
 * 
 * EXPANDED: 28 variants (A–AB) - includes research-based + CRO patterns
 * 
 * === Standalone Sections (below Hero) ===
 * - Version 1 (A): Original - Colored logos, 15'000+ big number, Video testimonials
 * - Version 2 (B): Live Dashboard - Monochrome logos, Deal Cards, Activity Ticker
 * - Version 3 (C): Trust Hierarchy - Authority → Logic → Emotion flow
 * - Version 4 (D): Trust Stack - Compact module with Outcome-Tags
 * - Version 5 (E): Trust Strip 2.0 - Single unified strip, consistent rating
 * - Version 6 (F): Verifiable Trust - ZEFIX, UID, Insurance, Escrow signals
 * 
 * === Hybrid/Swiss-specific ===
 * - Version 7 (G): Swiss Infrastructure - eUmzugCH, Post, ASTAG focused
 * - Version 8 (H): Minimal Proof Strip - Clean grayscale logos only
 * 
 * === Hero-Integrated (Best 5 + Psychological) ===
 * - Version 9 (I): Card CTA Trust 🎯 - Trust directly at CTA decision point
 * - Version 10 (J): Press Trust Bar - Desktop rail + Mobile inline
 * - Version 11 (K): Glassmorphism Bar - Premium overlay at hero bottom
 * - Version 12 (L): Hero Left + Form - Desktop left + Mobile form footer
 * - Version 13 (M): Left Under CTA - Monochrome white logos
 * 
 * === Psychological Triggers ===
 * - Version 14 (N): Bandwagon Effect - Live activity
 * - Version 15 (O): Local Trust - Regional badges
 * - Version 16 (P): Data Security - SSL, GDPR, Swiss Made focus
 * - Version 17 (Q): In-Form Container - Trust bar inside form box
 * 
 * === Research-Based (PDF Analysis) ===
 * - Version 18 (R): Scannable Grid - 4-card grid for quick scanning
 * - Version 19 (S): Hierarchy Strip - Micro-testimonial + core stats
 * - Version 20 (T): Comparison Preview - Visual price comparison table
 * - Version 21 (U): Mobile-First Tabs - Tab interface for mobile
 * - Version 22 (V): Trust + Pain Combo - Pain points paired with solutions
 * 
 * === CRO Patterns (NEW - Hero Integration Research) ===
 * - Version 23 (W): Trust Floor / Anker - Full-width bar at hero bottom
 * - Version 24 (X): Form Anchor - Trust integrated in form card footer
 * - Version 25 (Y): Eyebrow Badge - Trust above main headline
 * - Version 26 (Z): Floating Cards - UI cards overlaying hero image
 * - Version 27 (AA): Trust Ticker - Infinite scroll marquee for mobile
 * - Version 28 (AB): Glasmorphism Authority - Frosted glass premium bar
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Expanded to 28 variants including CRO patterns
type Variant = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | 'AA' | 'AB';

// Mapping from old variants to new (for migration)
export const VARIANT_MIGRATION_MAP: Record<string, Variant> = {
  // Standalone (unchanged)
  'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F',
  // Swiss Infrastructure
  'G': 'G',
  // Merged into G or H
  'H': 'G', // Pain vs Gain → Swiss Infrastructure
  'I': 'G', // Hybrid Trust Bar → Swiss Infrastructure
  'J': 'G', // Trust Ecosystem → Swiss Infrastructure
  // Minimal (was K)
  'K': 'H',
  // Swiss Standards (merged into H)
  'L': 'H',
  // Old Hero-integrated M-O → merged into I (Card CTA Trust)
  'M': 'I', 'N': 'I', 'O': 'I',
  // Old P (CTA Adjacent) → merged into I
  'P': 'I',
  // Bandwagon (was Q)
  'Q': 'N',
  // Local Trust (was R)
  'R': 'O',
  // Data Security (was S)
  'S': 'P',
  // Safety Architecture (merged into P)
  'T': 'P',
  // Left Under CTA (was U)
  'U': 'M',
  // In-Form Container (was V)
  'V': 'Q',
  // Glassmorphism (was W)
  'W': 'K',
  // Press Trust Bar (was X)
  'X': 'J',
  // Hero Left + Form (was Y)
  'Y': 'L',
  // Card CTA Trust (was Z) - now the recommended I
  'Z': 'I',
};

interface SocialProofABContextType {
  variant: Variant;
  toggleVariant: () => void;
  setVariant: (v: Variant) => void;
}

const SocialProofABContext = createContext<SocialProofABContextType | null>(null);

export const useSocialProofAB = () => {
  const context = useContext(SocialProofABContext);
  if (!context) {
    throw new Error('useSocialProofAB must be used within SocialProofABProvider');
  }
  return context;
};

const VALID_VARIANTS: Variant[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB'];

export const SocialProofABProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariant] = useState<Variant>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('socialproof-ab-variant');
      if (saved) {
        // Migrate old variants to new
        const migrated = VARIANT_MIGRATION_MAP[saved];
        if (migrated) {
          localStorage.setItem('socialproof-ab-variant', migrated);
          return migrated;
        }
        if (VALID_VARIANTS.includes(saved as Variant)) {
          return saved as Variant;
        }
      }
    }
    return 'I'; // Default to Card CTA Trust - best for hero-integrated conversion
  });

  const toggleVariant = useCallback(() => {
    setVariant(prev => {
      const currentIndex = VALID_VARIANTS.indexOf(prev);
      const next = VALID_VARIANTS[(currentIndex + 1) % VALID_VARIANTS.length];
      localStorage.setItem('socialproof-ab-variant', next);
      return next;
    });
  }, []);

  const handleSetVariant = useCallback((v: Variant) => {
    setVariant(v);
    localStorage.setItem('socialproof-ab-variant', v);
  }, []);

  return (
    <SocialProofABContext.Provider value={{ variant, toggleVariant, setVariant: handleSetVariant }}>
      {children}
    </SocialProofABContext.Provider>
  );
};
