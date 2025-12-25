import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, EngagementEvents } from '@/lib/analytics-tracking';

/**
 * Hook to automatically track page views and time spent on page
 */
export function usePageTracking() {
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const lastPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    // Track page view on route change
    const pageName = location.pathname || '/';
    trackPageView(pageName);
    
    // Reset timer for new page
    startTimeRef.current = Date.now();
    lastPathRef.current = pageName;

    // Track time spent when leaving page
    return () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 5) { // Only track if user spent more than 5 seconds
        EngagementEvents.timeSpent({ 
          page: lastPathRef.current, 
          seconds: timeSpent 
        });
      }
    };
  }, [location.pathname]);
}
