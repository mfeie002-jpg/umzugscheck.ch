import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Prefetch important routes on hover or after idle
const ROUTES_TO_PREFETCH = [
  '/rechner',
  '/firmen',
  '/ratgeber',
  '/kontakt',
  '/regionen',
];

export const PrefetchLinks = () => {
  const location = useLocation();

  useEffect(() => {
    // Prefetch on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        prefetchRoutes();
      });
    } else {
      setTimeout(prefetchRoutes, 2000);
    }

    // Add hover prefetch listeners
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener('mouseenter', handleLinkHover);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener('mouseenter', handleLinkHover);
      });
    };
  }, [location]);

  const prefetchRoutes = () => {
    ROUTES_TO_PREFETCH.forEach((route) => {
      // Create link element for prefetch
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  };

  const handleLinkHover = (e: Event) => {
    const target = e.target as HTMLAnchorElement;
    const href = target.getAttribute('href');
    
    if (href && href.startsWith('/') && !href.includes('#')) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  };

  return null;
};
