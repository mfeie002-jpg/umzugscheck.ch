/**
 * Navigation A/B Testing Context
 * 
 * Controls navigation variants via React context (no page reload needed)
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { NAV_VARIANTS, type NavConfig } from '@/lib/navigation-variants';

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

export const NavigationABProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariantState] = useState<NavConfig>(() => {
    if (typeof window === 'undefined') return NAV_VARIANTS[0]; // ultimate = original
    
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
    
    return NAV_VARIANTS[0]; // Default to original (ultimate)
  });

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

  // Listen for URL changes
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
