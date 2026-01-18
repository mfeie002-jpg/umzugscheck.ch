/**
 * DynamicNavigation
 *
 * Switches between NavigationV15, NavigationV16, and NavigationV17
 * based on the active navigation variant.
 *
 * Notes:
 * - Uses the NavigationABProvider (context) when available
 * - Falls back to URL/localStorage when rendered outside the provider
 */

import { NavigationV15 } from "./navigation/NavigationV15";
import { NavigationV16 } from "./navigation/NavigationV16";
import { NavigationV17 } from "./navigation-v17";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";

export const DynamicNavigation = () => {
  const variant = useNavigationVariant();

  if (variant.id === "variant-17") {
    return <NavigationV17 />;
  }

  // variant-o (N15 / ChatGPT Feedback v15) uses NavigationV15
  if (variant.id === "variant-o") {
    return <NavigationV15 />;
  }

  // Default to NavigationV15 (with emojis) for better UX
  return <NavigationV15 />;
};

