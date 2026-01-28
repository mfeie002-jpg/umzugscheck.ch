/**
 * DynamicNavigation
 *
 * Switches between different navigation components based on the active A/B variant.
 * 
 * All 17 navigation variants now use dynamic labels from their variant config:
 * - Variants 1-16: Use NavigationV16 which reads labels/microcopy dynamically
 * - Variant 17 (variant-17): Use NavigationV17 (conversion-killer with special dropdowns)
 * 
 * Each variant's unique labels are defined in src/lib/navigation-variants.ts
 */

import { NavigationV16 } from "./navigation/NavigationV16";
import { NavigationV17 } from "./navigation-v17";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";
import { useEffect } from "react";

export const DynamicNavigation = () => {
  const variant = useNavigationVariant();

  // Debug log to verify variant changes are being received
  useEffect(() => {
    console.log('[DynamicNavigation] Variant changed:', variant.id, variant.name);
  }, [variant.id, variant.name]);

  const variantId = variant.id;

  // Map each variant ID to its correct navigation component
  // ALL variants now use NavigationV16 or NavigationV17 which dynamically read from variant config
  switch (variantId) {
    // Variant 17: NavigationV17 (Conversion-Killer Architecture with special dropdowns)
    case 'variant-17':
      return <NavigationV17 />;

    // ALL other variants (1-16): Use NavigationV16 which dynamically reads labels/microcopy
    // from the variant config. Each variant has unique labels defined in navigation-variants.ts
    case 'ultimate':
    case 'variant-b':
    case 'variant-c':
    case 'variant-d':
    case 'variant-e':
    case 'variant-f':
    case 'variant-g':
    case 'variant-h':
    case 'variant-i':
    case 'variant-j':
    case 'variant-k':  // Variant 11: Simpel & Clean
    case 'variant-l':  // Variant 12: Best-of-Breed
    case 'variant-m':  // Variant 13: Mobile-First Optimiert
    case 'variant-n':  // Variant 14: 2026 Design
    case 'variant-o':  // Variant 15: ChatGPT v15
    case 'variant-p':  // Variant 16: SEO-Optimiert
    default:
      return <NavigationV16 />;
  }
};
