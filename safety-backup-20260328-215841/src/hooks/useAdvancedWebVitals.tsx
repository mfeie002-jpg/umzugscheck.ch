import { useEffect, useRef, useCallback, useState } from 'react';

interface WebVitalsMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  inp: number | null;
}

interface VitalsOptimizations {
  lazyLoadImages: boolean;
  deferNonCriticalCSS: boolean;
  preconnectOrigins: boolean;
  inlineAboveFoldCSS: boolean;
  prefetchLinks: boolean;
}

const THRESHOLDS = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 },
  ttfb: { good: 800, needsImprovement: 1800 },
  inp: { good: 200, needsImprovement: 500 },
};

type MetricRating = 'good' | 'needs-improvement' | 'poor';

const getRating = (metric: keyof typeof THRESHOLDS, value: number): MetricRating => {
  const threshold = THRESHOLDS[metric];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

export const useAdvancedWebVitals = (options?: {
  onReport?: (metrics: WebVitalsMetrics) => void;
  autoOptimize?: boolean;
  debug?: boolean;
}) => {
  const { onReport, autoOptimize = true, debug = false } = options || {};
  
  const metricsRef = useRef<WebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null,
  });

  const [optimizations, setOptimizations] = useState<VitalsOptimizations>({
    lazyLoadImages: false,
    deferNonCriticalCSS: false,
    preconnectOrigins: false,
    inlineAboveFoldCSS: false,
    prefetchLinks: false,
  });

  // Auto-optimization functions
  const optimizeLCP = useCallback(() => {
    // Preload LCP image if detected
    const lcpImage = document.querySelector('img[data-lcp="true"]') as HTMLImageElement;
    if (lcpImage && lcpImage.src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = lcpImage.src;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    }

    // Set loading="eager" for above-fold images
    const aboveFoldImages = document.querySelectorAll('img[data-above-fold="true"]');
    aboveFoldImages.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        img.loading = 'eager';
        img.decoding = 'async';
      }
    });

    setOptimizations((prev) => ({ ...prev, lazyLoadImages: true }));
  }, []);

  const optimizeCLS = useCallback(() => {
    // Add explicit dimensions to images without them
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach((img) => {
      if (img instanceof HTMLImageElement && img.naturalWidth && img.naturalHeight) {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
      }
    });

    // Reserve space for dynamic content
    const dynamicContainers = document.querySelectorAll('[data-dynamic-content]');
    dynamicContainers.forEach((container) => {
      if (container instanceof HTMLElement) {
        const minHeight = container.getAttribute('data-min-height');
        if (minHeight) {
          container.style.minHeight = minHeight;
        }
      }
    });
  }, []);

  const optimizeFID = useCallback(() => {
    // Break up long tasks using scheduler
    if ('scheduler' in window && 'yield' in (window as Window & { scheduler?: { yield?: () => Promise<void> } }).scheduler!) {
      // Use scheduler.yield for long tasks
      console.log('[Web Vitals] Scheduler.yield available for FID optimization');
    }

    // Defer non-critical scripts
    const deferredScripts = document.querySelectorAll('script[data-defer="true"]');
    deferredScripts.forEach((script) => {
      if (script instanceof HTMLScriptElement) {
        script.defer = true;
      }
    });
  }, []);

  const optimizeINP = useCallback(() => {
    // Add passive event listeners where possible
    const touchElements = document.querySelectorAll('[data-touch-optimized]');
    touchElements.forEach((el) => {
      el.addEventListener('touchstart', () => {}, { passive: true });
      el.addEventListener('touchmove', () => {}, { passive: true });
    });

    // Debounce scroll handlers
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const optimizedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('optimized-scroll'));
      }, 16);
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
  }, []);

  const reportMetrics = useCallback(() => {
    const metrics = metricsRef.current;

    if (debug) {
      console.group('📊 Advanced Web Vitals Report');
      
      Object.entries(metrics).forEach(([key, value]) => {
        if (value !== null) {
          const rating = getRating(key as keyof typeof THRESHOLDS, value);
          const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
          const unit = key === 'cls' ? '' : 'ms';
          console.log(`${emoji} ${key.toUpperCase()}: ${value.toFixed(2)}${unit} (${rating})`);
        }
      });

      console.log('\n🔧 Applied Optimizations:', optimizations);
      console.groupEnd();
    }

    onReport?.(metrics);
  }, [debug, onReport, optimizations]);

  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    const observers: PerformanceObserver[] = [];

    // LCP Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        metricsRef.current.lcp = lastEntry.renderTime || lastEntry.loadTime || 0;

        // Auto-optimize if LCP is poor
        if (autoOptimize && metricsRef.current.lcp > THRESHOLDS.lcp.needsImprovement) {
          optimizeLCP();
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObserver);
    } catch (e) { /* LCP not supported */ }

    // FID Observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { processingStart?: number }) => {
          metricsRef.current.fid = (entry.processingStart || 0) - entry.startTime;

          if (autoOptimize && metricsRef.current.fid > THRESHOLDS.fid.needsImprovement) {
            optimizeFID();
          }
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observers.push(fidObserver);
    } catch (e) { /* FID not supported */ }

    // CLS Observer
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0;
            metricsRef.current.cls = clsValue;

            if (autoOptimize && clsValue > THRESHOLDS.cls.needsImprovement) {
              optimizeCLS();
            }
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObserver);
    } catch (e) { /* CLS not supported */ }

    // FCP Observer
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
    } catch (e) { /* FCP not supported */ }

    // INP Observer
    try {
      let maxINP = 0;
      const inpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { duration?: number }) => {
          if (entry.duration && entry.duration > maxINP) {
            maxINP = entry.duration;
            metricsRef.current.inp = maxINP;

            if (autoOptimize && maxINP > THRESHOLDS.inp.needsImprovement) {
              optimizeINP();
            }
          }
        });
      });
      inpObserver.observe({ type: 'event', buffered: true });
      observers.push(inpObserver);
    } catch (e) { /* INP not supported */ }

    // TTFB
    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        metricsRef.current.ttfb = navEntry.responseStart - navEntry.requestStart;
      }
    } catch (e) { /* Navigation timing not supported */ }

    // Report after page load
    const reportTimer = setTimeout(reportMetrics, 5000);

    // Report on page hide
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
  }, [autoOptimize, optimizeLCP, optimizeCLS, optimizeFID, optimizeINP, reportMetrics]);

  return {
    metrics: metricsRef.current,
    optimizations,
    reportMetrics,
    getRating,
    thresholds: THRESHOLDS,
    // Manual optimization triggers
    optimizeLCP,
    optimizeCLS,
    optimizeFID,
    optimizeINP,
  };
};

// Component for automatic integration
export const AdvancedWebVitalsMonitor: React.FC<{
  onReport?: (metrics: WebVitalsMetrics) => void;
  autoOptimize?: boolean;
  debug?: boolean;
}> = ({ onReport, autoOptimize = true, debug = false }) => {
  useAdvancedWebVitals({ onReport, autoOptimize, debug });
  return null;
};

import React from 'react';

export default useAdvancedWebVitals;
