/**
 * Homepage Hero A/B Testing Context
 * 
 * 3 Variants:
 * - A: "Original" - Split layout with form card on right (Screenshot-style)
 * - B: "Premium" - IndexPremium with 4 Tabs (Formular/Video/KI-Chat/WhatsApp)
 * - C: "SmartRouter" - Current PLZ-first minimal wizard
 */

import React, { createContext, useContext, useState, useCallback, useEffect, memo, ReactNode } from 'react';

export type HomepageVariant = 'A' | 'B' | 'C';

interface HomepageABContextValue {
  variant: HomepageVariant;
  setVariant: (v: HomepageVariant) => void;
}

const STORAGE_KEY = 'homepage_hero_variant';

const HomepageABContext = createContext<HomepageABContextValue | undefined>(undefined);

export const HomepageABProvider = memo(function HomepageABProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<HomepageVariant>(() => {
    if (typeof window === 'undefined') return 'A';
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'A' || stored === 'B' || stored === 'C') return stored;
    return 'A'; // Default to Original (Screenshot-style with form card)
  });

  const setVariant = useCallback((v: HomepageVariant) => {
    setVariantState(v);
    localStorage.setItem(STORAGE_KEY, v);
    window.dispatchEvent(new CustomEvent('homepage-variant-changed', { detail: v }));
  }, []);

  // Listen for external changes
  useEffect(() => {
    const handleChange = (e: CustomEvent<HomepageVariant>) => {
      setVariantState(e.detail);
    };
    window.addEventListener('homepage-variant-changed', handleChange as EventListener);
    return () => window.removeEventListener('homepage-variant-changed', handleChange as EventListener);
  }, []);

  return (
    <HomepageABContext.Provider value={{ variant, setVariant }}>
      {children}
    </HomepageABContext.Provider>
  );
});

export function useHomepageAB() {
  const context = useContext(HomepageABContext);
  if (!context) {
    // Return safe default if used outside provider
    return { variant: 'A' as HomepageVariant, setVariant: () => {} };
  }
  return context;
}
