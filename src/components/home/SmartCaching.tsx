import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

export const SmartCaching = () => {
  const location = useLocation();

  useEffect(() => {
    // Prefetch critical routes
    const criticalRoutes = [
      '/rechner',
      '/firmen',
      '/kontakt',
      '/regionen',
    ];

    const prefetchRoute = (route: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    };

    // Prefetch routes based on current page
    if (location.pathname === '/') {
      criticalRoutes.forEach(route => {
        setTimeout(() => prefetchRoute(route), 2000);
      });
    }

    // Cache API responses
    const cacheKey = `page-cache-${location.pathname}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
      
      if (isExpired) {
        localStorage.removeItem(cacheKey);
      }
    }

    // Clean old cache entries
    const cleanOldCache = () => {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('page-cache-')) {
          const item = localStorage.getItem(key);
          if (item) {
            const { timestamp } = JSON.parse(item);
            if (Date.now() - timestamp > CACHE_EXPIRY) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    };

    cleanOldCache();
  }, [location]);

  // Preload images on idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const preloadImages = () => {
        const images = [
          '/assets/hero-moving-family.jpg',
          '/assets/swiss-moving-team.jpg',
          '/assets/swiss-professional-movers.jpg',
        ];

        images.forEach(src => {
          const img = new Image();
          img.src = src;
        });
      };

      (window as any).requestIdleCallback(preloadImages);
    }
  }, []);

  return null;
};
