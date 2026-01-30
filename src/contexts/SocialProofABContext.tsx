/**
 * A/B Testing Context for Social Proof Sections
 * 
 * Controls 6 variants:
 * - Version 1 (A): Original - Colored logos, 15'000+ big number, Video testimonials
 * - Version 2 (B): Monochrome logos, Live Dashboard, Deal Cards
 * - Version 3 (C): Trust Hierarchy (Authority → Logic → Emotion, Logos oben)
 * - Version 4 (D): Trust Stack (kompaktes Modul, Outcome-Tags, Microtrust)
 * - Version 5 (E): Trust Strip 2.0 (Single unified strip, consistent rating, proofy testimonials)
 * - Version 6 (F): Verifiable Trust - State-backed signals (ZEFIX, UID, Insurance, Escrow)
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Variant = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

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
      const validVariants: Variant[] = ['A', 'B', 'C', 'D', 'E', 'F'];
      return validVariants.includes(saved as Variant) ? (saved as Variant) : 'A';
    }
    return 'A';
  });

  const toggleVariant = useCallback(() => {
    setVariant(prev => {
      const variants: Variant[] = ['A', 'B', 'C', 'D', 'E', 'F'];
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
