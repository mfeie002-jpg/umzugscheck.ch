import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

const metrics: PerformanceMetrics = {
  fcp: null,
  lcp: null,
  fid: null,
  cls: null,
  ttfb: null
};

function reportMetric(name: string, value: number) {
  // Store metrics locally
  const storedMetrics = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
  storedMetrics.push({
    name,
    value,
    timestamp: new Date().toISOString(),
    url: window.location.pathname
  });
  
  // Keep only last 100 entries
  if (storedMetrics.length > 100) {
    storedMetrics.shift();
  }
  
  localStorage.setItem('performance-metrics', JSON.stringify(storedMetrics));
}

export function PerformanceMonitor() {
  useEffect(() => {
    // First Contentful Paint
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
          reportMetric('FCP', entry.startTime);
        }
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.lcp = lastEntry.startTime;
      reportMetric('LCP', lastEntry.startTime);
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming;
        metrics.fid = fidEntry.processingStart - fidEntry.startTime;
        reportMetric('FID', metrics.fid);
      }
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as any;
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
          metrics.cls = clsValue;
        }
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Browser doesn't support this observer
    }

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      reportMetric('TTFB', metrics.ttfb);
    }

    // Report CLS on page hide
    const reportCLS = () => {
      if (metrics.cls !== null) {
        reportMetric('CLS', metrics.cls);
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCLS();
      }
    });

    return () => {
      paintObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return null;
}

export function getPerformanceMetrics(): PerformanceMetrics {
  return { ...metrics };
}

export default PerformanceMonitor;
