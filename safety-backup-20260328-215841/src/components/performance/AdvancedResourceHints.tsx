import { useEffect, useCallback } from 'react';

interface ResourceHint {
  href: string;
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch' | 'modulepreload';
  as?: 'script' | 'style' | 'image' | 'font' | 'document' | 'fetch';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  priority?: 'high' | 'low' | 'auto';
}

// Critical preconnects - establish connections early
const CRITICAL_PRECONNECTS: ResourceHint[] = [
  { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
  { href: 'https://fonts.gstatic.com', rel: 'preconnect', crossOrigin: 'anonymous' },
  { href: 'https://vgitgdvxanodfgokokix.supabase.co', rel: 'preconnect', crossOrigin: 'anonymous' },
  { href: 'https://images.unsplash.com', rel: 'preconnect', crossOrigin: 'anonymous' },
];

// DNS prefetch for third-party resources
const DNS_PREFETCH: ResourceHint[] = [
  { href: 'https://www.google-analytics.com', rel: 'dns-prefetch' },
  { href: 'https://www.googletagmanager.com', rel: 'dns-prefetch' },
  { href: 'https://cdn.jsdelivr.net', rel: 'dns-prefetch' },
  { href: 'https://api.screenshotmachine.com', rel: 'dns-prefetch' },
];

// Critical fonts to preload
const CRITICAL_FONTS: ResourceHint[] = [
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    rel: 'preload',
    as: 'style',
  },
];

export const AdvancedResourceHints = () => {
  const addResourceHint = useCallback((hint: ResourceHint) => {
    const existing = document.querySelector(
      `link[href="${hint.href}"][rel="${hint.rel}"]`
    );
    if (existing) return;

    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;

    if (hint.as) link.setAttribute('as', hint.as);
    if (hint.type) link.type = hint.type;
    if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
    if (hint.priority) link.setAttribute('fetchpriority', hint.priority);

    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    // Add critical preconnects immediately
    CRITICAL_PRECONNECTS.forEach(addResourceHint);
    
    // Add DNS prefetches
    DNS_PREFETCH.forEach(addResourceHint);

    // Preload critical fonts
    CRITICAL_FONTS.forEach(addResourceHint);

    // Add priority hints for critical resources
    const criticalImages = document.querySelectorAll('img[data-priority="high"]');
    criticalImages.forEach((img) => {
      if (img instanceof HTMLImageElement && img.src) {
        addResourceHint({
          href: img.src,
          rel: 'preload',
          as: 'image',
          priority: 'high',
        });
      }
    });
  }, [addResourceHint]);

  // Add speculative preloading for next navigation
  useEffect(() => {
    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const path = new URL(link.href).pathname;
        
        // Don't prefetch current page
        if (path === window.location.pathname) return;

        // Prefetch on hover
        addResourceHint({
          href: path,
          rel: 'prefetch',
          as: 'document',
        });
      }
    };

    // Use event delegation for efficiency
    document.addEventListener('mouseover', handleLinkHover, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
    };
  }, [addResourceHint]);

  return null;
};

// Utility to preload critical route chunks
export const preloadRouteChunk = (routePath: string) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = routePath;
  document.head.appendChild(link);
};

// Preload images on demand
export const preloadCriticalImage = (
  src: string,
  options?: { priority?: 'high' | 'low'; fetchpriority?: string }
) => {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    if (options?.priority) {
      link.setAttribute('fetchpriority', options.priority);
    }

    link.onload = () => resolve();
    link.onerror = reject;

    document.head.appendChild(link);
  });
};

// Network-aware prefetching
export const useNetworkAwarePrefetch = () => {
  const shouldPrefetch = useCallback(() => {
    // Check if user is on a slow connection
    const connection = (navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        saveData?: boolean;
      };
    }).connection;

    if (connection?.saveData) return false;
    if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
      return false;
    }

    return true;
  }, []);

  const prefetch = useCallback(
    (url: string) => {
      if (!shouldPrefetch()) return;

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    },
    [shouldPrefetch]
  );

  return { prefetch, shouldPrefetch };
};

export default AdvancedResourceHints;
