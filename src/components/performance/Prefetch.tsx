/**
 * Prefetch & Preload Utilities
 * 
 * Features:
 * - Link prefetching on hover
 * - Critical resource preloading
 * - Intelligent prefetching based on viewport
 * - Data prefetching
 */

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetchDelay?: number;
}

/**
 * Link that prefetches on hover
 */
export function PrefetchLink({ 
  href, 
  children, 
  className,
  prefetchDelay = 100 
}: PrefetchLinkProps) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const prefetchedRef = useRef(false);

  const prefetch = useCallback(() => {
    if (prefetchedRef.current) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    prefetchedRef.current = true;
  }, [href]);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(prefetch, prefetchDelay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
    </a>
  );
}

/**
 * Hook for viewport-based prefetching
 */
export function useViewportPrefetch(urls: string[]) {
  const prefetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as unknown as { connection: { saveData?: boolean; effectiveType?: string } }).connection;
      // Don't prefetch on slow connections or data saver
      if (connection.saveData || connection.effectiveType === '2g') {
        return;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const href = (entry.target as HTMLElement).dataset.prefetch;
            if (href && !prefetchedRef.current.has(href)) {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = href;
              document.head.appendChild(link);
              prefetchedRef.current.add(href);
            }
          }
        });
      },
      { rootMargin: '100px' }
    );

    // Find all elements with data-prefetch attribute
    document.querySelectorAll('[data-prefetch]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [urls]);
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  const criticalFonts = [
    '/fonts/inter-var.woff2',
  ];

  criticalFonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = font;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Hook for data prefetching with React Query
 */
export function useDataPrefetch() {
  const queryClient = useQueryClient();

  const prefetchQuery = useCallback(
    async <T,>(
      queryKey: unknown[],
      queryFn: () => Promise<T>,
      staleTime = 5 * 60 * 1000 // 5 minutes
    ) => {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
      });
    },
    [queryClient]
  );

  return { prefetchQuery };
}

/**
 * Prefetch images
 */
export function prefetchImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        })
    )
  );
}

/**
 * Component that preloads LCP image
 */
export function PreloadLCPImage({ src, fetchPriority = 'high' }: { src: string; fetchPriority?: 'high' | 'low' | 'auto' }) {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = fetchPriority;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [src, fetchPriority]);

  return null;
}

/**
 * DNS prefetch for external domains
 */
export function DNSPrefetch({ domains }: { domains: string[] }) {
  useEffect(() => {
    const links = domains.map((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, [domains]);

  return null;
}
