import { useEffect } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

const reportMetrics = (metrics: PerformanceMetrics) => {
  // Log in development, could send to analytics in production
  if (import.meta.env.DEV) {
    console.log('[Performance]', metrics);
  }
};

export const PerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const metrics: PerformanceMetrics = {};

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        reportMetrics(metrics);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP not supported
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0] as PerformanceEntry & { processingStart: number };
        metrics.fid = firstEntry.processingStart - firstEntry.startTime;
        reportMetrics(metrics);
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // FID not supported
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        metrics.cls = clsValue;
        reportMetrics(metrics);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // CLS not supported
    }

    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcpEntry = entries.find(e => e.name === 'first-contentful-paint');
        if (fcpEntry) {
          metrics.fcp = fcpEntry.startTime;
          reportMetrics(metrics);
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      // FCP not supported
    }

    // Time to First Byte
    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
        reportMetrics(metrics);
      }
    } catch (e) {
      // Navigation timing not supported
    }

  }, []);

  return null;
};
