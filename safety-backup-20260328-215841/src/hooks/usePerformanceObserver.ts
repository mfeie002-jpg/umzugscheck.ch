import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  domContentLoaded: number | null;
  loadComplete: number | null;
}

interface ResourceTiming {
  name: string;
  duration: number;
  transferSize: number;
  initiatorType: string;
}

interface UsePerformanceObserverReturn {
  metrics: PerformanceMetrics;
  resources: ResourceTiming[];
  longTasks: number[];
  isSupported: boolean;
  measureCustom: (name: string, callback: () => void) => number;
  mark: (name: string) => void;
  measure: (name: string, startMark: string, endMark?: string) => number | null;
  clearMeasures: () => void;
}

export function usePerformanceObserver(): UsePerformanceObserverReturn {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    domContentLoaded: null,
    loadComplete: null
  });
  const [resources, setResources] = useState<ResourceTiming[]>([]);
  const [longTasks, setLongTasks] = useState<number[]>([]);
  const clsValue = useRef(0);

  const isSupported = typeof window !== 'undefined' && 'PerformanceObserver' in window;

  useEffect(() => {
    if (!isSupported) return;

    const observers: PerformanceObserver[] = [];

    // Paint timing (FCP)
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      observers.push(paintObserver);
    } catch (e) {}

    // LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observers.push(lcpObserver);
    } catch (e) {}

    // FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEventTiming[]) {
          setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observers.push(fidObserver);
    } catch (e) {}

    // CLS
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue.current += entry.value;
            setMetrics(prev => ({ ...prev, cls: clsValue.current }));
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observers.push(clsObserver);
    } catch (e) {}

    // Resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[];
        const newResources = entries.map(entry => ({
          name: entry.name,
          duration: entry.duration,
          transferSize: entry.transferSize,
          initiatorType: entry.initiatorType
        }));
        setResources(prev => [...prev, ...newResources]);
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      observers.push(resourceObserver);
    } catch (e) {}

    // Long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          setLongTasks(prev => [...prev, entry.duration]);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      observers.push(longTaskObserver);
    } catch (e) {}

    // Navigation timing
    try {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceNavigationTiming[]) {
          setMetrics(prev => ({
            ...prev,
            ttfb: entry.responseStart - entry.requestStart,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.startTime,
            loadComplete: entry.loadEventEnd - entry.startTime
          }));
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      observers.push(navObserver);
    } catch (e) {}

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [isSupported]);

  const measureCustom = useCallback((name: string, callback: () => void): number => {
    const start = performance.now();
    callback();
    const end = performance.now();
    const duration = end - start;

    performance.mark(`${name}-start`);
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    return duration;
  }, []);

  const mark = useCallback((name: string) => {
    performance.mark(name);
  }, []);

  const measure = useCallback((name: string, startMark: string, endMark?: string): number | null => {
    try {
      const measureEntry = performance.measure(name, startMark, endMark);
      return measureEntry.duration;
    } catch (e) {
      return null;
    }
  }, []);

  const clearMeasures = useCallback(() => {
    performance.clearMarks();
    performance.clearMeasures();
  }, []);

  return {
    metrics,
    resources,
    longTasks,
    isSupported,
    measureCustom,
    mark,
    measure,
    clearMeasures
  };
}
