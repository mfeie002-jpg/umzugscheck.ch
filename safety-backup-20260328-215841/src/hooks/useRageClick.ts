/**
 * Rage Click Detection Hook
 * 
 * Detects when a user clicks the same element 3+ times in 1.5 seconds
 * Fires analytics event for debugging frustrated users
 */

import { useRef, useCallback } from 'react';
import { useAnalytics } from '@/lib/analytics';

interface RageClickOptions {
  threshold?: number; // Number of clicks to trigger (default: 3)
  timeWindow?: number; // Time window in ms (default: 1500)
  element?: string; // Element identifier for tracking
  step?: number; // Current step number
}

export function useRageClick(options: RageClickOptions = {}) {
  const {
    threshold = 3,
    timeWindow = 1500,
    element = 'unknown',
    step = 0
  } = options;

  const clickTimestamps = useRef<number[]>([]);
  const hasTriggered = useRef(false);
  const analytics = useAnalytics();

  const trackClick = useCallback(() => {
    const now = Date.now();
    
    // Remove old clicks outside the time window
    clickTimestamps.current = clickTimestamps.current.filter(
      ts => now - ts < timeWindow
    );
    
    // Add current click
    clickTimestamps.current.push(now);
    
    // Check if rage click threshold reached
    if (clickTimestamps.current.length >= threshold && !hasTriggered.current) {
      hasTriggered.current = true;
      
      // Fire rage click event
      analytics.track('rage_click' as any, {
        step,
        element,
        click_count: clickTimestamps.current.length,
        time_window_ms: timeWindow
      });
      
      // Reset after a cooldown
      setTimeout(() => {
        hasTriggered.current = false;
        clickTimestamps.current = [];
      }, 5000);
    }
  }, [analytics, element, step, threshold, timeWindow]);

  const reset = useCallback(() => {
    clickTimestamps.current = [];
    hasTriggered.current = false;
  }, []);

  return { trackClick, reset };
}

export default useRageClick;
