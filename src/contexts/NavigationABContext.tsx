/**
 * Navigation A/B Testing Context
 * 
 * Controls navigation variants via React context (no page reload needed)
 * Default: Variant 1 (Original/Status Quo)
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { NAV_VARIANTS, type NavConfig, VARIANT_ULTIMATE } from '@/lib/navigation-variants';

interface NavigationABContextType {
  variant: NavConfig;
  setVariant: (id: string) => void;
}

const NavigationABContext = createContext<NavigationABContextType | null>(null);

export const useNavigationAB = () => {
  const context = useContext(NavigationABContext);
  if (!context) {
    throw new Error('useNavigationAB must be used within NavigationABProvider');
  }
  return context;
};

// Get initial variant from URL or localStorage, default to VARIANT_ULTIMATE (Original)
const getInitialVariant = (): NavConfig => {
  if (typeof window === 'undefined') return VARIANT_ULTIMATE;
  
  // Check URL param first
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('nav');
  if (urlVariant) {
    const found = NAV_VARIANTS.find(v => v.id === urlVariant);
    if (found) {
      localStorage.setItem('nav-variant', urlVariant);
      return found;
    }
  }
  
  // Then check localStorage
  const stored = localStorage.getItem('nav-variant');
  if (stored) {
    const found = NAV_VARIANTS.find(v => v.id === stored);
    if (found) return found;
  }
  
  // Default to Original (VARIANT_ULTIMATE)
  return VARIANT_ULTIMATE;
};

export const NavigationABProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariantState] = useState<NavConfig>(getInitialVariant);

  const setVariant = useCallback((id: string) => {
    const found = NAV_VARIANTS.find(v => v.id === id);
    if (found) {
      setVariantState(found);
      localStorage.setItem('nav-variant', id);
      
      // Update URL without reload
      const url = new URL(window.location.href);
      url.searchParams.set('nav', id);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Listen for URL changes (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlVariant = urlParams.get('nav');
      if (urlVariant) {
        const found = NAV_VARIANTS.find(v => v.id === urlVariant);
        if (found) setVariantState(found);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <NavigationABContext.Provider value={{ variant, setVariant }}>
      {children}
    </NavigationABContext.Provider>
  );
};
