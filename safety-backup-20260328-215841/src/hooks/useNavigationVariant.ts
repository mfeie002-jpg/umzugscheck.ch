/**
 * Hook to get the active navigation variant.
 * 
 * Uses the NavigationABContext if available, otherwise falls back to unified config.
 * This is the ONLY hook components should use to get the current nav variant.
 */

import { useContext, useState, useEffect } from "react";
import { type NavConfig } from "@/lib/navigation-variants";
import { NavigationABContext } from "@/contexts/NavigationABContext";
import { getNavVariant } from "@/lib/unified-ab-config";

export const useNavigationVariant = (): NavConfig => {
  // Try to get from context first (for components inside the provider)
  const context = useContext(NavigationABContext);
  
  // State for fallback when outside context
  const [variant, setVariant] = useState<NavConfig>(() => getNavVariant());
  const [, forceUpdate] = useState(0);
  
  // Listen for changes - ALWAYS listen, even with context, to catch external changes
  useEffect(() => {
    const handleChange = () => {
      const newVariant = getNavVariant();
      console.log('[useNavigationVariant] Change detected, variant:', newVariant.id);
      setVariant(newVariant);
      forceUpdate(n => n + 1);
    };

    window.addEventListener('ab-state-changed', handleChange);
    window.addEventListener('nav-variant-changed', handleChange as EventListener);
    window.addEventListener('storage', handleChange);
    window.addEventListener('popstate', handleChange);

    return () => {
      window.removeEventListener('ab-state-changed', handleChange);
      window.removeEventListener('nav-variant-changed', handleChange as EventListener);
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('popstate', handleChange);
    };
  }, []);

  // If we're in the context, use context variant (it should be in sync)
  if (context) {
    return context.variant;
  }
  
  // Fallback to local state
  return variant;
};
