/**
 * Unified A/B Testing Hook
 * 
 * Single hook for getting current Nav + Flow variants
 * and the correct flow path for CTAs
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
  type UnifiedABState,
  AB_STORAGE_KEYS,
  FLOW_VARIANTS,
  type FlowVariantKey,
} from '@/lib/unified-ab-config';
import { NAV_VARIANTS, type NavVariant } from '@/lib/navigation-variants';

export const useUnifiedAB = () => {
  const [state, setState] = useState<UnifiedABState>(getUnifiedABState);
  
  // Listen for changes
  useEffect(() => {
    const handleChange = () => {
      setState(getUnifiedABState());
    };
    
    window.addEventListener('ab-state-changed', handleChange);
    window.addEventListener('storage', handleChange);
    
    return () => {
      window.removeEventListener('ab-state-changed', handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);
  
  // Set nav variant
  const setNav = useCallback((variantId: NavVariant) => {
    setNavVariant(variantId);
    setState(getUnifiedABState());
  }, []);
  
  // Set flow variant
  const setFlow = useCallback((variantId: string) => {
    setFlowVariant(variantId);
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
  
  return {
    ...state,
    // Convenience getters
    flowPath: state.flowPath,
    navId: state.navVariant.id,
    flowId: state.flowVariant.id,
    
    // Actions
    setNav,
    setFlow,
    resetNav,
    resetFlow,
    resetAll,
    
    // Data
    allNavVariants: NAV_VARIANTS,
    allFlowVariants: Object.values(FLOW_VARIANTS),
  };
};

// Simple hook just for getting the flow path (for CTAs)
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
