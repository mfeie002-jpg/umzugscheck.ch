/**
 * DynamicNavigation
 * 
 * Switches between NavigationV16 (with A/B test labels) and NavigationV17
 * based on the active navigation variant.
 */

import { NavigationV16 } from "./navigation/NavigationV16";
import { NavigationV17 } from "./navigation-v17";
import { isVariant17Active } from "@/lib/navigation-variants";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const DynamicNavigation = () => {
  const location = useLocation();
  const [useV17, setUseV17] = useState(false);

  useEffect(() => {
    setUseV17(isVariant17Active());
  }, [location.search]);

  // Listen for localStorage changes (when variant is set via switcher)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nav-variant') {
        setUseV17(isVariant17Active());
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (useV17) {
    return <NavigationV17 />;
  }

  return <NavigationV16 />;
};
