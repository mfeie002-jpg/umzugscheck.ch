import { useEffect, useRef, useCallback } from 'react';

interface WebVitalsMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  inp: number | null;
}

interface WebVitalsThresholds {
  lcp: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  cls: { good: number; needsImprovement: number };
  fcp: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
  inp: { good: number; needsImprovement: number };
}

const THRESHOLDS: WebVitalsThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 },
  ttfb: { good: 800, needsImprovement: 1800 },
  inp: { good: 200, needsImprovement: 500 },
};

type MetricRating = 'good' | 'needs-improvement' | 'poor';

const getRating = (
  metric: keyof WebVitalsThresholds,
  value: number
): MetricRating => {
  const threshold = THRESHOLDS[metric];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

export const useWebVitals = (options?: {
  onReport?: (metrics: WebVitalsMetrics) => void;
  debug?: boolean;
}) => {
  const { onReport, debug = process.env.NODE_ENV === 'development' } = options || {};
  const metricsRef = useRef<WebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null,
  });

  const reportMetrics = useCallback(() => {
    const metrics = metricsRef.current;
    
    if (debug) {
      console.group('📊 Core Web Vitals');
      
      Object.entries(metrics).forEach(([key, value]) => {
        if (value !== null) {
          const rating = getRating(key as keyof WebVitalsThresholds, value);
          const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
          const unit = key === 'cls' ? '' : 'ms';
          console.log(`${emoji} ${key.toUpperCase()}: ${value.toFixed(2)}${unit} (${rating})`);
        }
      });
      
      console.groupEnd();
    }

    onReport?.(metrics);
  }, [debug, onReport]);

  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    const observers: PerformanceObserver[] = [];

    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        metricsRef.current.lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObserver);
    } catch (e) {
      // LCP not supported
    }

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { processingStart?: number }) => {
          metricsRef.current.fid = (entry.processingStart || 0) - entry.startTime;
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observers.push(fidObserver);
    } catch (e) {
      // FID not supported
    }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0;
            metricsRef.current.cls = clsValue;
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObserver);
    } catch (e) {
      // CLS not supported
    }

    // FCP - First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metricsRef.current.fcp = entry.startTime;
          }
        });
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      observers.push(fcpObserver);
    } catch (e) {
      // FCP not supported
    }

    // INP - Interaction to Next Paint
    try {
      let maxINP = 0;
      const inpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { duration?: number }) => {
          if (entry.duration && entry.duration > maxINP) {
            maxINP = entry.duration;
            metricsRef.current.inp = maxINP;
          }
        });
      });
      inpObserver.observe({ type: 'event', buffered: true });
      observers.push(inpObserver);
    } catch (e) {
      // INP not supported
    }

    // TTFB - Time to First Byte
    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        metricsRef.current.ttfb = navEntry.responseStart - navEntry.requestStart;
      }
    } catch (e) {
      // Navigation timing not supported
    }

    // Report metrics after page is fully loaded
    const reportTimer = setTimeout(reportMetrics, 5000);

    // Also report on page hide
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reportMetrics();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observers.forEach((obs) => obs.disconnect());
      clearTimeout(reportTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reportMetrics]);

  return {
    metrics: metricsRef.current,
    reportMetrics,
    getRating,
    thresholds: THRESHOLDS,
  };
};

// Component wrapper for easy integration
export const WebVitalsReporter: React.FC<{
  onReport?: (metrics: WebVitalsMetrics) => void;
  debug?: boolean;
}> = ({ onReport, debug }) => {
  useWebVitals({ onReport, debug });
  return null;
};

import React from 'react';
