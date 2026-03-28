import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Critical resources to preload based on route
const routeResources: Record<string, string[]> = {
  '/': [
    '/lovable-uploads/d4aa8c36-01f9-47b7-8e18-bd2a8e22467a.png'
  ],
  '/rechner': [],
  '/firmen': [],
  '/umzugsofferten': []
};

// Preconnect to external domains used in the app
const preconnectDomains = [
  'https://twpyrbhqsfwtoyudkfss.supabase.co',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

export function PreloadResources() {
  const location = useLocation();

  useEffect(() => {
    // Add preconnect links for external domains
    preconnectDomains.forEach(domain => {
      const existing = document.querySelector(`link[href="${domain}"][rel="preconnect"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }, []);

  useEffect(() => {
    // Preload route-specific resources
    const resources = routeResources[location.pathname] || [];
    
    resources.forEach(resource => {
      const existing = document.querySelector(`link[href="${resource}"][rel="preload"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? 'image' : 'fetch';
        document.head.appendChild(link);
      }
    });

    // Prefetch likely next pages
    const prefetchRoutes = getPrefetchRoutes(location.pathname);
    prefetchRoutes.forEach(route => {
      const existing = document.querySelector(`link[href="${route}"][rel="prefetch"]`);
      if (!existing && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          document.head.appendChild(link);
        });
      }
    });
  }, [location.pathname]);

  return null;
}

function getPrefetchRoutes(currentPath: string): string[] {
  const prefetchMap: Record<string, string[]> = {
    '/': ['/rechner', '/firmen', '/umzugsofferten'],
    '/rechner': ['/ergebnis', '/firmen'],
    '/firmen': ['/umzugsofferten'],
    '/umzugsofferten': ['/rechner']
  };
  
  return prefetchMap[currentPath] || [];
}

// Hook to preload images programmatically
export function usePreloadImages(images: string[]) {
  useEffect(() => {
    const preloadedImages: HTMLImageElement[] = [];
    
    images.forEach(src => {
      const img = new Image();
      img.src = src;
      preloadedImages.push(img);
    });

    return () => {
      preloadedImages.forEach(img => {
        img.src = '';
      });
    };
  }, [images]);
}
