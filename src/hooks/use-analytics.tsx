import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '@/lib/analytics';

/**
 * Hook for automatic page view tracking
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const title = document.title;
    
    analytics.trackPageView(title, path);
  }, [location]);
};

/**
 * Combined analytics initialization
 */
export const useFullAnalytics = () => {
  usePageTracking();
};
