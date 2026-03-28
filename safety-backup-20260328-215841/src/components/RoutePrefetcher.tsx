import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define important routes to prefetch based on current location
const prefetchMap: Record<string, string[]> = {
  '/': ['/contact', '/plan', '/calculator', '/about'],
  '/plan': ['/plan/private', '/plan/office', '/plan/full', '/contact'],
  '/about': ['/team', '/references', '/contact'],
  '/calculator': ['/contact', '/booking'],
  '/contact': ['/booking', '/concierge/faq'],
};

const RoutePrefetcher = () => {
  const location = useLocation();

  useEffect(() => {
    const routesToPrefetch = prefetchMap[location.pathname] || [];
    
    // Use requestIdleCallback for non-blocking prefetch
    const prefetch = () => {
      routesToPrefetch.forEach((route) => {
        // Create a prefetch link
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        link.as = 'document';
        
        // Check if already prefetched
        const existing = document.querySelector(`link[href="${route}"][rel="prefetch"]`);
        if (!existing) {
          document.head.appendChild(link);
        }
      });
    };

    // Use idle callback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 2000 });
    } else {
      setTimeout(prefetch, 1000);
    }
  }, [location.pathname]);

  return null;
};

export default RoutePrefetcher;