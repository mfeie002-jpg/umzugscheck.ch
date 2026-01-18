/**
 * DynamicNavigation
 * 
 * Switches between NavigationV15, NavigationV16, and NavigationV17
 * based on the active navigation variant.
 * 
 * - variant-o (N15) → NavigationV15
 * - variant-17 → NavigationV17
 * - all others → NavigationV16
 */

import { NavigationV15 } from "./navigation/NavigationV15";
import { NavigationV16 } from "./navigation/NavigationV16";
import { NavigationV17 } from "./navigation-v17";
import { isVariant17Active, getActiveVariant } from "@/lib/navigation-variants";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type NavVersion = 'v15' | 'v16' | 'v17';

const getNavVersion = (): NavVersion => {
  if (isVariant17Active()) return 'v17';
  
  const variant = getActiveVariant();
  // variant-o (N15 / ChatGPT Feedback v15) uses NavigationV15
  if (variant.id === 'variant-o') return 'v15';
  
  return 'v16';
};

export const DynamicNavigation = () => {
  const location = useLocation();
  const [navVersion, setNavVersion] = useState<NavVersion>('v16');

  useEffect(() => {
    setNavVersion(getNavVersion());
  }, [location.search]);

  // Listen for localStorage changes (when variant is set via switcher)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nav-variant') {
        setNavVersion(getNavVersion());
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Also listen for custom events from the variant switcher
  useEffect(() => {
    const handleVariantChange = () => {
      setNavVersion(getNavVersion());
    };
    
    window.addEventListener('nav-variant-changed', handleVariantChange);
    return () => window.removeEventListener('nav-variant-changed', handleVariantChange);
  }, []);

  if (navVersion === 'v17') {
    return <NavigationV17 />;
  }
  
  if (navVersion === 'v15') {
    return <NavigationV15 />;
  }

  return <NavigationV16 />;
};
