/**
 * Hook to get the active navigation variant.
 * 
 * Uses the NavigationABContext if available, otherwise falls back to unified config.
 * This is the ONLY hook components should use to get the current nav variant.
 */

import { useContext, useState, useEffect } from "react";
import { type NavConfig } from "@/lib/navigation-variants";
import { NavigationABContext } from "@/contexts/navigation-context";
import { getNavVariant } from "@/lib/unified-ab-config";

export const useNavigationVariant = (): NavConfig => {
  // Try to get from context first (for components inside the provider)
  const context = useContext(NavigationABContext);
  
  // State for fallback when outside context
  const [variant, setVariant] = useState<NavConfig>(getNavVariant);
  
  // Listen for changes when outside context
  useEffect(() => {
    if (context) return; // Don't need to listen if we have context
    
    const handleChange = () => {
      setVariant(getNavVariant());
    };
    
    window.addEventListener('ab-state-changed', handleChange);
    window.addEventListener('storage', handleChange);
    window.addEventListener('popstate', handleChange);
    
    return () => {
      window.removeEventListener('ab-state-changed', handleChange);
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('popstate', handleChange);
    };
  }, [context]);
  
  // If we're in the context, use it
  if (context) {
    return context.variant;
  }
  
  // Fallback to local state
  return variant;
};
