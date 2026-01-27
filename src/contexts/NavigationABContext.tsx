/**
 * Navigation A/B Testing Context
 * 
 * Controls navigation variants via React context (no page reload needed)
 * Uses the unified A/B config as source of truth
 */

import { useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { NAV_VARIANTS, type NavConfig, VARIANT_ULTIMATE } from '@/lib/navigation-variants';
import { NavigationABContext, type NavigationABContextType } from '@/contexts/navigation-context';
import { 
  getNavVariant, 
  setNavVariant as setStoredNavVariant,
  AB_STORAGE_KEYS 
} from '@/lib/unified-ab-config';

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

  const setVariant = useCallback((id: string) => {
    const found = NAV_VARIANTS.find(v => v.id === id);
    if (found) {
      setVariantState(found);
      setStoredNavVariant(id as any);
      
      // Update URL without reload
      const url = new URL(window.location.href);
      url.searchParams.set('nav', id);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Listen for URL changes and ab-state-changed events
  useEffect(() => {
    const handleChange = () => {
      const newVariant = getNavVariant();
      setVariantState(newVariant);
    };
    
    window.addEventListener('popstate', handleChange);
    window.addEventListener('ab-state-changed', handleChange);
    // Backwards-compat: some older switchers only dispatch this event
    window.addEventListener('nav-variant-changed', handleChange as EventListener);
    // Also react to direct localStorage edits (e.g. devtools or other tabs)
    window.addEventListener('storage', handleChange);
    
    return () => {
      window.removeEventListener('popstate', handleChange);
      window.removeEventListener('ab-state-changed', handleChange);
      window.removeEventListener('nav-variant-changed', handleChange as EventListener);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  return (
    <NavigationABContext.Provider value={{ variant, setVariant }}>
      {children}
    </NavigationABContext.Provider>
  );
};

// Re-export the context type for consumers
export type { NavigationABContextType };
