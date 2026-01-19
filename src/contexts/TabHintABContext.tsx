/**
 * A/B Testing Context for Tab Method Hints
 * 
 * Controls 4 variants for the hero tabs:
 * - Version 1 (Default): No hint - just the tabs
 * - Version A: "ODER" divider line between tabs and form
 * - Version B: Pulsing glow on inactive tabs + hint text
 * - Version C: "Methode wählen" label above tabs
 * - Version D: Arrow pointing at alternatives with badge
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// 'default' = no hint, A/B/C/D = the 4 hint variants
export type TabHintVariant = 'default' | 'A' | 'B' | 'C' | 'D';

interface TabHintABContextType {
  variant: TabHintVariant;
  toggleVariant: () => void;
  setVariant: (v: TabHintVariant) => void;
}

const TabHintABContext = createContext<TabHintABContextType | null>(null);

export const useTabHintAB = () => {
  const context = useContext(TabHintABContext);
  if (!context) {
    throw new Error('useTabHintAB must be used within TabHintABProvider');
  }
  return context;
};

export const TabHintABProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariant] = useState<TabHintVariant>(() => {
    if (typeof window !== 'undefined') {
      // First check URL param
      const params = new URLSearchParams(window.location.search);
      const urlVariant = params.get('tabHint')?.toUpperCase();
      if (urlVariant && ['A', 'B', 'C', 'D'].includes(urlVariant)) {
        return urlVariant as TabHintVariant;
      }
      
      // Then check localStorage
      const saved = localStorage.getItem('tabhint-ab-variant');
      const validVariants: TabHintVariant[] = ['default', 'A', 'B', 'C', 'D'];
      return validVariants.includes(saved as TabHintVariant) ? (saved as TabHintVariant) : 'default';
    }
    return 'default';
  });

  const toggleVariant = useCallback(() => {
    setVariant(prev => {
      const variants: TabHintVariant[] = ['default', 'A', 'B', 'C', 'D'];
      const currentIndex = variants.indexOf(prev);
      const next = variants[(currentIndex + 1) % variants.length];
      localStorage.setItem('tabhint-ab-variant', next);
      return next;
    });
  }, []);

  const handleSetVariant = useCallback((v: TabHintVariant) => {
    setVariant(v);
    localStorage.setItem('tabhint-ab-variant', v);
  }, []);

  return (
    <TabHintABContext.Provider value={{ variant, toggleVariant, setVariant: handleSetVariant }}>
      {children}
    </TabHintABContext.Provider>
  );
};
