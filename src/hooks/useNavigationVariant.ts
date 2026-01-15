/**
 * Hook to get the active navigation variant.
 * Reacts to URL query changes (?nav=...) and localStorage changes.
 */

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getActiveVariant, type NavConfig, VARIANT_ULTIMATE } from "@/lib/navigation-variants";

export const useNavigationVariant = (): NavConfig => {
  const location = useLocation();
  const [variant, setVariant] = useState<NavConfig>(VARIANT_ULTIMATE);

  useEffect(() => {
    setVariant(getActiveVariant());
  }, [location.search]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "nav-variant") {
        setVariant(getActiveVariant());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return variant;
};
