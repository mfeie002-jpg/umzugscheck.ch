/**
 * A/B Testing Context for Social Proof Sections
 * 
 * Controls 15 variants (A–O):
 * - Version 1 (A): Original - Colored logos, 15'000+ big number, Video testimonials
 * - Version 2 (B): Monochrome logos, Live Dashboard, Deal Cards
 * - Version 3 (C): Trust Hierarchy (Authority → Logic → Emotion, Logos oben)
 * - Version 4 (D): Trust Stack (kompaktes Modul, Outcome-Tags, Microtrust)
 * - Version 5 (E): Trust Strip 2.0 (Single unified strip, consistent rating, proofy testimonials)
 * - Version 6 (F): Verifiable Trust - State-backed signals (ZEFIX, UID, Insurance, Escrow)
 * - Version 7 (G): Swiss Infrastructure - eUmzugCH, Post, ASTAG focused
 * - Version 8 (H): Pain vs Gain - Problem solver cards approach  
 * - Version 9 (I): Hybrid Trust Bar - Psychological ordering (Risk→Infrastructure→Payment)
 * - Version 10 (J): Trust Ecosystem - Comprehensive trust grid
 * - Version 11 (K): Minimal Proof Strip - Clean grayscale logos only
 * - Version 12 (L): Swiss Standards Bar - "Der Schweizer Standard" headline
 * - Version 13 (M): Hero Reassurance - Trust logos under left CTA (in Hero)
 * - Version 14 (N): Hero Form Footer - Trust logos inside form card (in Hero)
 * - Version 15 (O): Hero Eyebrow - Trust logos above headline (in Hero)
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Variant = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O';

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

export const SocialProofABProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariant] = useState<Variant>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('socialproof-ab-variant');
      const validVariants: Variant[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
      return validVariants.includes(saved as Variant) ? (saved as Variant) : 'A';
    }
    return 'A';
  });

  const toggleVariant = useCallback(() => {
    setVariant(prev => {
      const variants: Variant[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
      const currentIndex = variants.indexOf(prev);
      const next = variants[(currentIndex + 1) % variants.length];
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