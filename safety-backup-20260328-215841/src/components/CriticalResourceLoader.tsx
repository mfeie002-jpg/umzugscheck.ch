import { useEffect } from 'react';

// Critical above-the-fold images to preload
const CRITICAL_IMAGES = [
  '/src/assets/hero-navy-alpine.jpg',
];

// Secondary images to preload after initial render
const SECONDARY_IMAGES = [
  '/src/assets/service-packing-branded.jpg',
  '/src/assets/service-office-branded.jpg',
];

/**
 * Component that handles critical resource loading and prioritization
 * - Preloads LCP-critical images with high priority
 * - Preconnects to external origins
 * - Prefetches likely navigation routes
 * - Defers non-critical resource loading
 */
export default function CriticalResourceLoader() {
  useEffect(() => {
    // Track added links for cleanup
    const addedLinks: HTMLLinkElement[] = [];

    // Helper to add link elements
    const addLink = (attrs: Record<string, string>) => {
      const link = document.createElement('link');
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'crossOrigin') {
          link.crossOrigin = value;
        } else if (key === 'fetchPriority') {
          (link as any).fetchPriority = value;
        } else {
          link.setAttribute(key, value);
        }
      });
      document.head.appendChild(link);
      addedLinks.push(link);
      return link;
    };

    // 1. Preload critical LCP images immediately
    CRITICAL_IMAGES.forEach((src) => {
      addLink({
        rel: 'preload',
        as: 'image',
        href: src,
        fetchPriority: 'high',
      });
    });

    // 2. Preconnect to external origins
    addLink({ rel: 'preconnect', href: 'https://fonts.googleapis.com' });
    addLink({ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' });

    // 3. Prefetch secondary images after a delay
    const prefetchSecondary = () => {
      SECONDARY_IMAGES.forEach((src) => {
        addLink({
          rel: 'prefetch',
          as: 'image',
          href: src,
        });
      });
    };

    // 4. Prefetch likely navigation routes
    const prefetchRoutes = () => {
      const routes = ['/contact', '/plan', '/area/zurich', '/booking', '/calculator'];
      routes.forEach((route) => {
        addLink({ rel: 'prefetch', href: route });
      });
    };

    // Schedule non-critical preloads during idle time
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        prefetchSecondary();
        prefetchRoutes();
      }, { timeout: 3000 });
    } else {
      setTimeout(() => {
        prefetchSecondary();
        prefetchRoutes();
      }, 2000);
    }

    // 5. Observe viewport for images entering view
    const observeViewportImages = () => {
      if (!('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target instanceof HTMLImageElement) {
              const src = entry.target.dataset.src || entry.target.src;
              if (src && !src.startsWith('data:')) {
                // Preload image about to enter viewport
                const img = new Image();
                img.src = src;
              }
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '200px 0px', // Start loading 200px before visible
          threshold: 0,
        }
      );

      // Observe all lazy images
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        observer.observe(img);
      });

      return observer;
    };

    let observer: IntersectionObserver | undefined;
    setTimeout(() => {
      observer = observeViewportImages();
    }, 1000);

    // Cleanup
    return () => {
      addedLinks.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
      observer?.disconnect();
    };
  }, []);

  return null;
}
