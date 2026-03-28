/**
 * useForcedRenderMode Hook
 * 
 * Detects "Forced Render Mode" for screenshot automation.
 * When active, flows should:
 * 1. Jump directly to uc_step (no resume from storage)
 * 2. NOT persist state to sessionStorage/localStorage
 * 3. NOT run validation guards that would reset step
 * 4. Disable analytics/tracking
 * 
 * Forced mode is active when ANY of these URL params exist:
 * - uc_render=1
 * - uc_capture=1
 * - uc_step (any value)
 */

import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export interface ForcedRenderModeResult {
  /** True if any forced render param is present */
  isForcedRender: boolean;
  
  /** The forced step index (0-based). Null if not specified. */
  forcedStepIndex: number | null;
  
  /** Original uc_step value (1-based) from URL */
  ucStep: number | null;
  
  /** Whether uc_render=1 is set */
  isRenderMode: boolean;
  
  /** Whether uc_capture=1 is set */
  isCaptureMode: boolean;
}

/**
 * Get forced step index clamped to valid range
 */
export function clampForcedStep(forcedStepIndex: number | null, maxStepIndex: number): number | null {
  if (forcedStepIndex === null) return null;
  return Math.max(0, Math.min(forcedStepIndex, maxStepIndex));
}

/**
 * Hook to detect forced render mode from URL parameters.
 * Use this in flows to bypass storage resume and guards.
 */
export function useForcedRenderMode(): ForcedRenderModeResult {
  const location = useLocation();
  
  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    
    const ucRender = params.get('uc_render') === '1';
    const ucCapture = params.get('uc_capture') === '1';
    const ucStepRaw = params.get('uc_step');
    
    // Parse uc_step (1-based from URL)
    let ucStep: number | null = null;
    if (ucStepRaw !== null) {
      const parsed = parseInt(ucStepRaw, 10);
      if (!isNaN(parsed) && isFinite(parsed)) {
        ucStep = parsed;
      }
    }
    
    // Convert to 0-based index for internal use
    const forcedStepIndex = ucStep !== null ? Math.max(0, ucStep - 1) : null;
    
    // Forced mode is active if ANY of these are true
    const isForcedRender = ucRender || ucCapture || ucStep !== null;
    
    return {
      isForcedRender,
      forcedStepIndex,
      ucStep,
      isRenderMode: ucRender,
      isCaptureMode: ucCapture,
    };
  }, [location.search]);
}

/**
 * Pure function version for use outside React components
 */
export function getForcedRenderMode(search: string): ForcedRenderModeResult {
  const params = new URLSearchParams(search);
  
  const ucRender = params.get('uc_render') === '1';
  const ucCapture = params.get('uc_capture') === '1';
  const ucStepRaw = params.get('uc_step');
  
  let ucStep: number | null = null;
  if (ucStepRaw !== null) {
    const parsed = parseInt(ucStepRaw, 10);
    if (!isNaN(parsed) && isFinite(parsed)) {
      ucStep = parsed;
    }
  }
  
  const forcedStepIndex = ucStep !== null ? Math.max(0, ucStep - 1) : null;
  const isForcedRender = ucRender || ucCapture || ucStep !== null;
  
  return {
    isForcedRender,
    forcedStepIndex,
    ucStep,
    isRenderMode: ucRender,
    isCaptureMode: ucCapture,
  };
}

export default useForcedRenderMode;
