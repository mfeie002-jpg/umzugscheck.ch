/**
 * Hook to get the active navigation variant.
 * Uses the NavigationABContext if available, otherwise falls back to localStorage/URL.
 */

import { useContext } from "react";
import { getActiveVariant, type NavConfig } from "@/lib/navigation-variants";
import { NavigationABContext } from "@/contexts/navigation-context";

export const useNavigationVariant = (): NavConfig => {
  // Try to get from context first
  const context = useContext(NavigationABContext);
  
  // If we're in the context, use it
  if (context) {
    return context.variant;
  }
  
  // Fallback to localStorage/URL for pages outside the provider
  return getActiveVariant();
};
