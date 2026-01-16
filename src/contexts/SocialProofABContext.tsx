/**
 * A/B Testing Context for Social Proof Sections
 * 
 * Controls variants for:
 * - TrustRibbon (Bekannt aus + Stats)
 * - EnhancedTestimonials (Kundenstimmen)
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Variant = 'A' | 'B';

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
    // Check localStorage for persisted variant
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('socialproof-ab-variant');
      return (saved === 'A' || saved === 'B') ? saved : 'A';
    }
    return 'A';
  });

  const toggleVariant = useCallback(() => {
    setVariant(prev => {
      const next = prev === 'A' ? 'B' : 'A';
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
