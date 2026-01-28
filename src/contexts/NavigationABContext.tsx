/**
 * Navigation A/B Testing Context
 * 
 * Controls navigation variants via React context (no page reload needed)
 * Uses the unified A/B config as source of truth
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { NAV_VARIANTS, type NavConfig, VARIANT_ULTIMATE } from '@/lib/navigation-variants';
import { 
  getNavVariant, 
  AB_STORAGE_KEYS 
} from '@/lib/unified-ab-config';

export interface NavigationABContextType {
  variant: NavConfig;
  setVariant: (id: string) => void;
}

export const NavigationABContext = createContext<NavigationABContextType | null>(null);

export const useNavigationAB = (): NavigationABContextType => {
  const context = useContext(NavigationABContext);
  if (!context) {
    throw new Error('useNavigationAB must be used within NavigationABProvider');
  }
  return context;
};

// Get initial variant using unified config
const getInitialVariant = (): NavConfig => {
  return getNavVariant();
};

export const NavigationABProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariantState] = useState<NavConfig>(getInitialVariant);
  const [updateKey, setUpdateKey] = useState(0);

  const setVariant = useCallback((id: string) => {
    const found = NAV_VARIANTS.find(v => v.id === id);
    if (found) {
      console.log('[NavigationAB] Setting variant to:', id, found.name);
      
      // Update state FIRST so React re-renders immediately
      setVariantState(found);
      
      // Force re-render of consuming components
      setUpdateKey(k => k + 1);
      
      // Persist to localStorage
      localStorage.setItem(AB_STORAGE_KEYS.NAV_VARIANT, id);
      
      // Update URL without reload
      const url = new URL(window.location.href);
      url.searchParams.set('nav', id);
      window.history.replaceState({}, '', url.toString());
      
      // Dispatch events for other listeners
      window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'nav', variantId: id } }));
      window.dispatchEvent(new CustomEvent('nav-variant-changed', { detail: id }));
      
      console.log('[NavigationAB] Variant changed successfully to:', id);
    } else {
      console.warn('[NavigationAB] Variant not found:', id);
    }
  }, []);

  // Listen for external changes (URL, localStorage, other tabs)
  useEffect(() => {
    const handleChange = () => {
      const newVariant = getNavVariant();
      console.log('[NavigationAB] External change detected, new variant:', newVariant.id);
      setVariantState(newVariant);
      setUpdateKey(k => k + 1);
    };
    
    window.addEventListener('popstate', handleChange);
    window.addEventListener('ab-state-changed', handleChange);
    window.addEventListener('nav-variant-changed', handleChange as EventListener);
    window.addEventListener('storage', handleChange);
    
    return () => {
      window.removeEventListener('popstate', handleChange);
      window.removeEventListener('ab-state-changed', handleChange);
      window.removeEventListener('nav-variant-changed', handleChange as EventListener);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  // Debug: Log current variant on mount and changes
  useEffect(() => {
    console.log('[NavigationAB] Current variant:', variant.id, variant.name, 'updateKey:', updateKey);
  }, [variant, updateKey]);

  return (
    <NavigationABContext.Provider value={{ variant, setVariant }}>
      {children}
    </NavigationABContext.Provider>
  );
};

// Re-export the context type for consumers
export type { NavigationABContextType };
