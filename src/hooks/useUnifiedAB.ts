/**
 * Unified A/B Testing Hook
 * 
 * SINGLE HOOK for accessing and managing all A/B test state:
 * - Navigation variants
 * - Flow variants (Offerten funnel)
 * 
 * This hook is the ONLY way components should interact with A/B testing.
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getUnifiedABState, 
  getCurrentFlowPath,
  resetAllAB,
  resetNavAB,
  resetFlowAB,
  setNavVariant,
  setFlowVariant,
  setNavABActive,
  setFlowABActive,
  assignRandomFlowVariant,
  type UnifiedABState,
  FLOW_VARIANTS,
  type FlowVariant,
} from '@/lib/unified-ab-config';
import { NAV_VARIANTS, type NavVariant } from '@/lib/navigation-variants';

export const useUnifiedAB = () => {
  const [state, setState] = useState<UnifiedABState>(getUnifiedABState);
  
  // Listen for any A/B state changes
  useEffect(() => {
    const handleChange = () => {
      setState(getUnifiedABState());
    };

    window.addEventListener('ab-state-changed', handleChange);
    window.addEventListener('nav-variant-changed', handleChange as EventListener);
    window.addEventListener('storage', handleChange);
    window.addEventListener('popstate', handleChange);

    return () => {
      window.removeEventListener('ab-state-changed', handleChange);
      window.removeEventListener('nav-variant-changed', handleChange as EventListener);
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('popstate', handleChange);
    };
  }, []);

  // Set navigation variant
  const setNav = useCallback((variantId: NavVariant) => {
    setNavVariant(variantId);
    setState(getUnifiedABState());
  }, []);
  
  // Set flow variant
  const setFlow = useCallback((variantId: string) => {
    setFlowVariant(variantId);
    setState(getUnifiedABState());
  }, []);
  
  // Toggle Nav A/B active state
  const toggleNavAB = useCallback((active: boolean) => {
    setNavABActive(active);
    setState(getUnifiedABState());
  }, []);
  
  // Toggle Flow A/B active state
  const toggleFlowAB = useCallback((active: boolean) => {
    setFlowABActive(active);
    setState(getUnifiedABState());
  }, []);
  
  // Reset functions
  const resetNav = useCallback(() => {
    resetNavAB();
    setState(getUnifiedABState());
  }, []);
  
  const resetFlow = useCallback(() => {
    resetFlowAB();
    setState(getUnifiedABState());
  }, []);
  
  const resetAll = useCallback(() => {
    resetAllAB();
    setState(getUnifiedABState());
  }, []);
  
  // Assign random flow variant
  const assignRandomFlow = useCallback(() => {
    const variant = assignRandomFlowVariant();
    setState(getUnifiedABState());
    return variant;
  }, []);
  
  return {
    // Current state
    ...state,
    
    // Convenience getters
    flowPath: state.flowPath,
    navId: state.navVariant.id,
    flowId: state.flowVariant.id,
    
    // Actions
    setNav,
    setFlow,
    toggleNavAB,
    toggleFlowAB,
    resetNav,
    resetFlow,
    resetAll,
    assignRandomFlow,
    
    // All available variants
    allNavVariants: NAV_VARIANTS,
    allFlowVariants: Object.values(FLOW_VARIANTS) as FlowVariant[],
  };
};

/**
 * Simple hook just for getting the current flow path
 * Use this in CTAs that need to navigate to the A/B assigned flow
 */
export const useFlowPath = (): string => {
  const [flowPath, setFlowPath] = useState(getCurrentFlowPath);
  
  useEffect(() => {
    const handleChange = () => {
      setFlowPath(getCurrentFlowPath());
    };
    
    window.addEventListener('ab-state-changed', handleChange);
    window.addEventListener('storage', handleChange);
    
    return () => {
      window.removeEventListener('ab-state-changed', handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);
  
  return flowPath;
};

/**
 * Simple hook for getting current flow variant
 */
export const useFlowVariant = (): FlowVariant => {
  const { flowVariant } = useUnifiedAB();
  return flowVariant;
};
