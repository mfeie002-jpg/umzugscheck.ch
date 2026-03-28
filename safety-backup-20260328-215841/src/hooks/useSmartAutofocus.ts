/**
 * useSmartAutofocus - Smart autofocus for desktop only
 * 
 * Prevents keyboard popup on mobile devices by only applying
 * autofocus when viewport is above tablet breakpoint (768px)
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseSmartAutofocusOptions {
  enabled?: boolean;
  minViewportWidth?: number;
  delay?: number;
}

export function useSmartAutofocus<T extends HTMLElement>(
  options: UseSmartAutofocusOptions = {}
) {
  const {
    enabled = true,
    minViewportWidth = 768, // md breakpoint
    delay = 100,
  } = options;
  
  const ref = useRef<T>(null);
  const hasAppliedRef = useRef(false);
  
  const shouldAutofocus = useCallback(() => {
    if (typeof window === 'undefined') return false;
    if (!enabled) return false;
    
    // Only autofocus on desktop (viewport > 768px)
    return window.innerWidth >= minViewportWidth;
  }, [enabled, minViewportWidth]);
  
  useEffect(() => {
    if (hasAppliedRef.current) return;
    
    const applyFocus = () => {
      if (!ref.current) return;
      if (!shouldAutofocus()) return;
      
      hasAppliedRef.current = true;
      ref.current.focus();
    };
    
    // Small delay to prevent hydration issues
    const timeout = setTimeout(applyFocus, delay);
    
    return () => clearTimeout(timeout);
  }, [shouldAutofocus, delay]);
  
  return ref;
}

/**
 * Check if we should skip autofocus (for SSR/hydration safety)
 */
export function useIsDesktop(): boolean {
  if (typeof window === 'undefined') return true; // SSR fallback
  return window.innerWidth >= 768;
}
