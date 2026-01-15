/**
 * Hook to get the active navigation variant
 */

import { useState, useEffect } from 'react';
import { getActiveVariant, type NavConfig, VARIANT_ULTIMATE } from '@/lib/navigation-variants';

export const useNavigationVariant = (): NavConfig => {
  const [variant, setVariant] = useState<NavConfig>(VARIANT_ULTIMATE);

  useEffect(() => {
    // Get variant on client side
    setVariant(getActiveVariant());
  }, []);

  return variant;
};
