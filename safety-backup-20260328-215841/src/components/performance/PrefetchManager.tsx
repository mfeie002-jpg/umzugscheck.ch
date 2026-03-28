import React, { useEffect } from 'react';

// External domains that should be preconnected
const PRECONNECT_DOMAINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://images.unsplash.com',
  'https://twpyrbhqsfwtoyudkfss.supabase.co',
];

// DNS prefetch for external resources
const DNS_PREFETCH_DOMAINS = [
  'https://www.google-analytics.com',
  'https://www.googletagmanager.com',
  'https://cdn.jsdelivr.net',
];

// Routes that should be prefetched
const PREFETCH_ROUTES = [
  '/umzugsrechner',
  '/umzugsofferten',
  '/umzugsfirmen',
  '/ratgeber',
];

export const PrefetchManager: React.FC = () => {
  useEffect(() => {
    // Add preconnect links
    PRECONNECT_DOMAINS.forEach((domain) => {
      if (!document.querySelector(`link[href="${domain}"][rel="preconnect"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });

    // Add DNS prefetch links
    DNS_PREFETCH_DOMAINS.forEach((domain) => {
      if (!document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

    // Prefetch critical routes after page load
    const prefetchRoutes = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          PREFETCH_ROUTES.forEach((route) => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            link.as = 'document';
            document.head.appendChild(link);
          });
        }, { timeout: 3000 });
      }
    };

    // Wait for page to be fully loaded
    if (document.readyState === 'complete') {
      prefetchRoutes();
    } else {
      window.addEventListener('load', prefetchRoutes);
      return () => window.removeEventListener('load', prefetchRoutes);
    }
  }, []);

  return null;
};

// Hook for prefetching on user intent
export const usePrefetchOnIntent = () => {
  const prefetchedUrls = React.useRef(new Set<string>());

  const prefetch = React.useCallback((url: string) => {
    if (prefetchedUrls.current.has(url)) return;
    
    prefetchedUrls.current.add(url);
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
  }, []);

  const prefetchOnHover = React.useCallback((url: string) => {
    return {
      onMouseEnter: () => prefetch(url),
      onFocus: () => prefetch(url),
    };
  }, [prefetch]);

  return { prefetch, prefetchOnHover };
};

// Preload critical images
export const preloadCriticalImages = (imageSrcs: string[]) => {
  imageSrcs.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};
