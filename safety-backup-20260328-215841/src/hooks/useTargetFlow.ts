/**
 * useTargetFlow - Hook for reading target flow from URL params
 * 
 * Used by the A/B Comparison Lab to specify which flow CTAs should navigate to.
 * When ab-flow parameter is set, all "Offerten erhalten" CTAs should redirect
 * to the specified flow instead of the default.
 * 
 * Parameters:
 * - ab-flow: Flow variant ID (e.g., 'v9a', 'swiss-premium', 'golden-v10')
 */

import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

// Flow variant mapping - must match FLOW_VARIANTS in ABComparisonLab.tsx
export const FLOW_PATH_MAP: Record<string, string> = {
  // V1 Familie
  'v1': '/umzugsofferten-v1',
  'v1a': '/umzugsofferten-v1a',
  'v1b': '/umzugsofferten-v1b',
  'v1c': '/umzugsofferten-v1c',
  'v1d': '/umzugsofferten-v1d',
  'v1e': '/umzugsofferten-v1e',
  'v1f': '/umzugsofferten-v1f',
  'v1g': '/umzugsofferten-v1g',
  
  // V2 Familie
  'v2': '/umzugsofferten-v2',
  'v2a': '/umzugsofferten-v2a',
  'v2b': '/umzugsofferten-v2b',
  'v2c': '/umzugsofferten-v2c',
  'v2d': '/umzugsofferten-v2d',
  'v2f': '/umzugsofferten-v2f',
  'v2-archetyp': '/umzugsofferten-v2-archetyp',
  
  // V3 Familie
  'v3': '/umzugsofferten-v3',
  'v3a': '/umzugsofferten-v3a',
  'v3b': '/umzugsofferten-v3b',
  'v3c': '/umzugsofferten-v3c',
  'v3d': '/umzugsofferten-v3d',
  'v3e': '/umzugsofferten-v3e',
  
  // V4 Familie
  'v4': '/umzugsofferten-v4',
  'v4a': '/umzugsofferten-v4a',
  'v4b': '/umzugsofferten-v4b',
  'v4c': '/umzugsofferten-v4c',
  'v4d': '/umzugsofferten-v4d',
  'v4e': '/umzugsofferten-v4e',
  'v4f': '/umzugsofferten-v4f',
  
  // V5 Familie (Marketplace)
  'v5': '/umzugsofferten-v5',
  'v5a': '/umzugsofferten-v5a',
  'v5b': '/umzugsofferten-v5b',
  'v5c': '/umzugsofferten-v5c',
  'v5d': '/umzugsofferten-v5d',
  'v5e': '/umzugsofferten-v5e',
  'v5f': '/umzugsofferten-v5f',
  
  // V6 Familie (Ultimate)
  'v6': '/umzugsofferten-v6',
  'v6a': '/umzugsofferten-v6a',
  'v6b': '/umzugsofferten-v6b',
  'v6c': '/umzugsofferten-v6c',
  'v6d': '/umzugsofferten-v6d',
  'v6e': '/umzugsofferten-v6e',
  'v6f': '/umzugsofferten-v6f',
  
  // V7 Familie
  'v7': '/umzugsofferten-v7',
  'v7a': '/umzugsofferten-v7a',
  
  // V8 Familie (Decision-Free)
  'v8': '/umzugsofferten-v8',
  'v8a': '/umzugsofferten-v8a',
  
  // V9 Familie (Zero Friction)
  'v9': '/umzugsofferten-v9',
  'v9a': '/umzugsofferten-v9a',
  'v9b': '/umzugsofferten-v9b',
  'v9c': '/umzugsofferten-v9c',
  'v9d': '/umzugsofferten-v9d',
  
  // ChatGPT Flows
  'chatgpt-1': '/chatgpt-flow-1',
  'chatgpt-2': '/chatgpt-flow-2',
  'chatgpt-3': '/chatgpt-flow-3',
  
  // Swiss Premium Flows
  'swiss-premium': '/swiss-premium-choice',
  'swiss-lightning': '/swiss-lightning',
  'swiss-concierge': '/swiss-concierge-hybrid',
  
  // Ultimate / Golden
  'ultimate-best36': '/umzugsofferten-ultimate-best36',
  'ultimate-v7': '/umzugsofferten-ultimate-v7',
  'golden-v10': '/golden-flow-v10',
};

export interface TargetFlowInfo {
  /** Flow ID from URL param (e.g., 'v9a') */
  flowId: string | null;
  /** Full path to the flow (e.g., '/umzugsofferten-v9a') */
  flowPath: string | null;
  /** Whether a target flow is set */
  hasTargetFlow: boolean;
  /** Get the target URL for CTAs - returns flow path if set, otherwise default */
  getTargetUrl: (defaultPath?: string) => string;
}

/**
 * Hook to read the target flow from URL parameters
 * 
 * @example
 * const { hasTargetFlow, getTargetUrl } = useTargetFlow();
 * 
 * // In a CTA button:
 * <Button onClick={() => navigate(getTargetUrl('/umzugsofferten'))}>
 *   Offerten erhalten
 * </Button>
 */
export function useTargetFlow(): TargetFlowInfo {
  const [searchParams] = useSearchParams();
  
  return useMemo(() => {
    const flowParam = searchParams.get('ab-flow');
    
    if (!flowParam || flowParam === 'none') {
      return {
        flowId: null,
        flowPath: null,
        hasTargetFlow: false,
        getTargetUrl: (defaultPath = '/umzugsofferten') => defaultPath,
      };
    }
    
    const flowPath = FLOW_PATH_MAP[flowParam.toLowerCase()] || null;
    
    return {
      flowId: flowParam,
      flowPath,
      hasTargetFlow: !!flowPath,
      getTargetUrl: (defaultPath = '/umzugsofferten') => flowPath || defaultPath,
    };
  }, [searchParams]);
}

/**
 * Get flow path by ID (for non-hook usage)
 */
export function getFlowPath(flowId: string): string | null {
  return FLOW_PATH_MAP[flowId.toLowerCase()] || null;
}

export default useTargetFlow;
