/**
 * Performance Optimization Utilities
 * Comprehensive utilities for Core Web Vitals optimization
 */

// Image lazy loading with IntersectionObserver
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach((img) => {
      imageObserver.observe(img);
    });
  }
};

// Preload critical resources
export const preloadCriticalAssets = () => {
  // Preconnect to external domains
  const preconnects = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.unsplash.com',
  ];

  preconnects.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Measure and report Core Web Vitals
export const measureCoreWebVitals = () => {
  if ('PerformanceObserver' in window) {
    const metrics: Record<string, number> = {};

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP not supported
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { processingStart?: number }) => {
          metrics.fid = (entry.processingStart || 0) - entry.startTime;
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // FID not supported
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0;
            metrics.cls = clsValue;
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // CLS not supported
    }

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
          }
        });
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      // FCP not supported
    }

    // Time to First Byte (TTFB)
    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }
    } catch (e) {
      // Navigation timing not supported
    }

    // Report metrics after page load
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        console.log('[Performance]', metrics);
      }, 3000);
    }

    return metrics;
  }
};

// Defer non-critical JavaScript
export const deferNonCriticalJS = () => {
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    newScript.src = script.getAttribute('src') || '';
    newScript.defer = true;
    document.body.appendChild(newScript);
    script.remove();
  });
};

// Register service worker - DEPRECATED: SW registration is now handled in main.tsx
// This function is kept for backwards compatibility but does nothing
export const registerServiceWorker = async () => {
  // SW registration moved to main.tsx with hostname-gating
  // See setupServiceWorkerPolicy() in main.tsx
  console.log("[Performance] SW registration handled by main.tsx");
};

// Optimize long tasks
export const breakLongTask = async (task: () => void) => {
  return new Promise<void>((resolve) => {
    if ('scheduler' in window && 'postTask' in (window as unknown as { scheduler: { postTask: (task: () => void) => void } }).scheduler) {
      (window as unknown as { scheduler: { postTask: (task: () => void, options: { priority: string }) => Promise<void> } }).scheduler
        .postTask(task, { priority: 'background' })
        .then(resolve);
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        task();
        resolve();
      });
    } else {
      setTimeout(() => {
        task();
        resolve();
      }, 0);
    }
  });
};

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      lazyLoadImages();
      preloadCriticalAssets();
      registerServiceWorker();
      if (process.env.NODE_ENV === 'development') {
        measureCoreWebVitals();
      }
    });
  } else {
    lazyLoadImages();
    preloadCriticalAssets();
    registerServiceWorker();
    if (process.env.NODE_ENV === 'development') {
      measureCoreWebVitals();
    }
  }
};

// Export for use in components
export default {
  lazyLoadImages,
  preloadCriticalAssets,
  measureCoreWebVitals,
  deferNonCriticalJS,
  registerServiceWorker,
  breakLongTask,
  initPerformanceOptimizations,
};
