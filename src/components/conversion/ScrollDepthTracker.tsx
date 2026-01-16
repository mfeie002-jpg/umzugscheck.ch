/**
 * SCROLL DEPTH TRACKER
 * 
 * Tracks how far users scroll on the page for analytics.
 * Reports at 25%, 50%, 75%, 90% thresholds.
 */

import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/realtime-metrics';

interface ScrollDepthTrackerProps {
  onDepthReached?: (depth: number) => void;
}

export const ScrollDepthTracker = ({ onDepthReached }: ScrollDepthTrackerProps) => {
  const reachedThresholds = useRef<Set<number>>(new Set());
  
  useEffect(() => {
    const thresholds = [25, 50, 75, 90, 100];
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !reachedThresholds.current.has(threshold)) {
          reachedThresholds.current.add(threshold);
          trackScrollDepth(threshold);
          onDepthReached?.(threshold);
        }
      });
    };
    
    // Throttle scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [onDepthReached]);
  
  return null;
};
