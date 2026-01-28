/**
 * DynamicNavigation
 *
 * Switches between different navigation components based on the active A/B variant.
 * 
 * All 17 navigation variants are now properly mapped:
 * - Variants 1-10 (ultimate, variant-b to variant-j): Use NavigationV16 with variant config
 * - Variants 11-13 (variant-k, variant-l, variant-m): Use dedicated NavigationV11/12/13
 * - Variant 14 (variant-n): Use NavigationV14 
 * - Variant 15 (variant-o): Use NavigationV15 (emoji style)
 * - Variant 16 (variant-p): Use NavigationV16 (premium mega-dropdowns)
 * - Variant 17 (variant-17): Use NavigationV17 (conversion-killer)
 */

import { NavigationV11 } from "./navigation/NavigationV11";
import { NavigationV12 } from "./navigation/NavigationV12";
import { NavigationV13 } from "./navigation/NavigationV13";
import { NavigationV14 } from "./navigation/NavigationV14";
import { NavigationV15 } from "./navigation/NavigationV15";
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
  switch (variantId) {
    // Variant 17: NavigationV17 (Conversion-Killer Architecture)
    case 'variant-17':
      return <NavigationV17 />;

    // Variant 16: NavigationV16 with premium mega-dropdowns (variant-p)
    case 'variant-p':
      return <NavigationV16 />;

    // Variant 15: NavigationV15 with emojis (variant-o)
    case 'variant-o':
      return <NavigationV15 />;

    // Variant 14: NavigationV14 (Aggressive Funnel)
    case 'variant-n':
      return <NavigationV14 />;

    // Variant 13: NavigationV13 (Mixed Approach)
    case 'variant-m':
      return <NavigationV13 />;

    // Variant 12: NavigationV12 (Swiss Archetype)
    case 'variant-l':
      return <NavigationV12 />;

    // Variant 11: NavigationV11 (Simpel & Clean)
    case 'variant-k':
      return <NavigationV11 />;

    // Variants 1-10: Use NavigationV16 which reads the variant config dynamically
    // These variants use the same component but different labels/microcopy from NavConfig
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
    default:
      return <NavigationV16 />;
  }
};
