import { useEffect } from 'react';

/**
 * Core Web Vitals Optimizer
 * Implements best practices for LCP, FID, and CLS optimization
 */
export default function CoreWebVitalsOptimizer() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // === LCP OPTIMIZATION ===
    const preloadCriticalResources = () => {
      // Preconnect to critical origins
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
      ];

      preconnectDomains.forEach(domain => {
        const existing = document.querySelector(`link[rel="preconnect"][href="${domain}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };

    // === FID OPTIMIZATION ===
    const deferNonCriticalJS = () => {
      // Prefetch routes during idle time
      const prefetchOnIdle = () => {
        const routes = ['/contact', '/booking', '/calculator', '/plan'];
        routes.forEach(route => {
          const existing = document.querySelector(`link[rel="prefetch"][href="${route}"]`);
          if (!existing) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            document.head.appendChild(link);
          }
        });
      };

      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
          .requestIdleCallback(prefetchOnIdle, { timeout: 3000 });
      } else {
        setTimeout(prefetchOnIdle, 2000);
      }
    };

    // === CLS OPTIMIZATION ===
    const preventLayoutShifts = () => {
      // Add font-display: swap hint
      const style = document.createElement('style');
      style.id = 'font-display-hint';
      if (!document.getElementById('font-display-hint')) {
        style.textContent = `
          @font-face {
            font-display: swap !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    // === PERFORMANCE MONITORING ===
    const monitorPerformance = () => {
      if (!('PerformanceObserver' in window)) return;

      // Monitor LCP
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          if (lastEntry && 'startTime' in lastEntry) {
            const lcp = lastEntry.startTime;
            
            // Store for analytics
            (window as unknown as { __webVitals?: Record<string, number> }).__webVitals = 
              (window as unknown as { __webVitals?: Record<string, number> }).__webVitals || {};
            (window as unknown as { __webVitals: Record<string, number> }).__webVitals.lcp = lcp;
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {
        // Observer not supported
      }

      // Monitor CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
              clsValue += layoutShiftEntry.value;
            }
          }
          
          (window as unknown as { __webVitals?: Record<string, number> }).__webVitals = 
            (window as unknown as { __webVitals?: Record<string, number> }).__webVitals || {};
          (window as unknown as { __webVitals: Record<string, number> }).__webVitals.cls = clsValue;
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch {
        // Observer not supported
      }

      // Monitor FID
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const firstInput = entryList.getEntries()[0] as PerformanceEntry & { processingStart?: number };
          if (firstInput && firstInput.processingStart) {
            const fid = firstInput.processingStart - firstInput.startTime;
            
            (window as unknown as { __webVitals?: Record<string, number> }).__webVitals = 
              (window as unknown as { __webVitals?: Record<string, number> }).__webVitals || {};
            (window as unknown as { __webVitals: Record<string, number> }).__webVitals.fid = fid;
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch {
        // Observer not supported
      }
    };

    // Execute optimizations
    preloadCriticalResources();
    deferNonCriticalJS();
    preventLayoutShifts();
    monitorPerformance();
  }, []);

  return null;
}

/**
 * Hook to get current Web Vitals values
 */
export function useWebVitals(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  return (window as unknown as { __webVitals?: Record<string, number> }).__webVitals || {};
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(onReport: (metric: { name: string; value: number }) => void) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  // LCP
  try {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry && 'startTime' in lastEntry) {
        onReport({ name: 'LCP', value: lastEntry.startTime });
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // Observer not supported
  }

  // FID
  try {
    new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0] as PerformanceEntry & { processingStart?: number };
      if (firstInput && firstInput.processingStart) {
        onReport({ name: 'FID', value: firstInput.processingStart - firstInput.startTime });
      }
    }).observe({ type: 'first-input', buffered: true });
  } catch {
    // Observer not supported
  }

  // CLS
  try {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
          clsValue += layoutShiftEntry.value;
        }
      }
      onReport({ name: 'CLS', value: clsValue });
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Observer not supported
  }
}
