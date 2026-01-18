/**
 * Navigation Context Definition
 * 
 * This file exists to avoid circular dependencies between
 * NavigationABContext.tsx and useNavigationVariant.ts
 */

import { createContext } from 'react';
import { type NavConfig, VARIANT_ULTIMATE } from '@/lib/navigation-variants';

export interface NavigationABContextType {
  variant: NavConfig;
  setVariant: (id: string) => void;
}

export const NavigationABContext = createContext<NavigationABContextType | null>(null);

// Default value for when used outside provider
export const defaultNavigationValue: NavigationABContextType = {
  variant: VARIANT_ULTIMATE,
  setVariant: () => {},
};
