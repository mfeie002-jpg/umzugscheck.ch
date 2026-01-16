/**
 * Performance Monitoring System
 * Core Web Vitals, custom metrics, and performance tracking
 */

// Types
interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitals {
  LCP?: PerformanceMetric; // Largest Contentful Paint
  FID?: PerformanceMetric; // First Input Delay
  CLS?: PerformanceMetric; // Cumulative Layout Shift
  FCP?: PerformanceMetric; // First Contentful Paint
  TTFB?: PerformanceMetric; // Time to First Byte
  INP?: PerformanceMetric; // Interaction to Next Paint
}

interface CustomMetric {
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
}

// Thresholds based on Google's recommendations
const thresholds = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 }
};

// Rating calculator
function getRating(name: keyof typeof thresholds, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[name];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Performance Monitor Class
class PerformanceMonitor {
  private vitals: WebVitals = {};
  private customMetrics: CustomMetric[] = [];
  private observers: ((vitals: WebVitals) => void)[] = [];
  private marks = new Map<string, number>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initWebVitals();
    }
  }

  private initWebVitals() {
    // Use PerformanceObserver for accurate metrics
    this.observePaint();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeTTFB();
  }

  private observePaint() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.vitals.FCP = {
              name: 'FCP',
              value: entry.startTime,
              rating: getRating('FCP', entry.startTime),
              timestamp: Date.now()
            };
            this.notifyObservers();
          }
        }
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.vitals.LCP = {
            name: 'LCP',
            value: lastEntry.startTime,
            rating: getRating('LCP', lastEntry.startTime),
            timestamp: Date.now()
          };
          this.notifyObservers();
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // Not supported
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          this.vitals.FID = {
            name: 'FID',
            value: fidEntry.processingStart - fidEntry.startTime,
            rating: getRating('FID', fidEntry.processingStart - fidEntry.startTime),
            timestamp: Date.now()
          };
          this.notifyObservers();
        }
      });
      observer.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // Not supported
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.vitals.CLS = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          timestamp: Date.now()
        };
        this.notifyObservers();
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Not supported
    }
  }

  private observeTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        const navigationEntry = list.getEntries()[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
          this.vitals.TTFB = {
            name: 'TTFB',
            value: ttfb,
            rating: getRating('TTFB', ttfb),
            timestamp: Date.now()
          };
          this.notifyObservers();
        }
      });
      observer.observe({ type: 'navigation', buffered: true });
    } catch (e) {
      // Not supported
    }
  }

  private notifyObservers() {
    this.observers.forEach(fn => fn(this.vitals));
  }

  // Public API
  getVitals(): WebVitals {
    return { ...this.vitals };
  }

  subscribe(callback: (vitals: WebVitals) => void): () => void {
    this.observers.push(callback);
    // Immediately call with current vitals
    callback(this.vitals);
    return () => {
      this.observers = this.observers.filter(fn => fn !== callback);
    };
  }

  // Custom timing
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string): number | null {
    const startTime = this.marks.get(startMark);
    if (startTime === undefined) return null;
    
    const duration = performance.now() - startTime;
    this.trackMetric({ name, value: duration, unit: 'ms' });
    return duration;
  }

  // Custom metrics
  trackMetric(metric: CustomMetric): void {
    this.customMetrics.push({
      ...metric,
      tags: {
        ...metric.tags,
        url: window.location.pathname,
        timestamp: Date.now().toString()
      }
    });
  }

  getCustomMetrics(): CustomMetric[] {
    return [...this.customMetrics];
  }

  // Performance score (0-100)
  getScore(): number {
    const weights = {
      LCP: 25,
      FID: 25,
      CLS: 25,
      FCP: 15,
      TTFB: 10
    };

    let totalWeight = 0;
    let weightedScore = 0;

    Object.entries(this.vitals).forEach(([key, metric]) => {
      if (metric && key in weights) {
        const weight = weights[key as keyof typeof weights];
        totalWeight += weight;
        
        const ratingScore = 
          metric.rating === 'good' ? 100 :
          metric.rating === 'needs-improvement' ? 50 : 0;
        
        weightedScore += ratingScore * weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  }

  // Resource timing
  getResourceStats() {
    if (typeof performance === 'undefined') return null;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const stats = {
      total: resources.length,
      totalSize: 0,
      totalDuration: 0,
      byType: {} as Record<string, { count: number; size: number; duration: number }>
    };

    resources.forEach(resource => {
      const type = resource.initiatorType;
      const duration = resource.duration;
      const size = resource.transferSize || 0;

      stats.totalSize += size;
      stats.totalDuration += duration;

      if (!stats.byType[type]) {
        stats.byType[type] = { count: 0, size: 0, duration: 0 };
      }
      stats.byType[type].count++;
      stats.byType[type].size += size;
      stats.byType[type].duration += duration;
    });

    return stats;
  }

  // Long task detection
  observeLongTasks(callback: (duration: number) => void): () => void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry.duration);
        }
      });
      observer.observe({ type: 'longtask', buffered: true });
      return () => observer.disconnect();
    } catch (e) {
      return () => {};
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook
import { useState, useEffect } from 'react';

export function usePerformanceMetrics() {
  const [vitals, setVitals] = useState<WebVitals>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe((newVitals) => {
      setVitals(newVitals);
      setScore(performanceMonitor.getScore());
    });

    return unsubscribe;
  }, []);

  return {
    vitals,
    score,
    getResourceStats: () => performanceMonitor.getResourceStats(),
    trackMetric: (metric: CustomMetric) => performanceMonitor.trackMetric(metric),
    mark: (name: string) => performanceMonitor.mark(name),
    measure: (name: string, startMark: string) => performanceMonitor.measure(name, startMark)
  };
}

// Utility: measure component render time
export function measureRender(componentName: string) {
  const startMark = `${componentName}-render-start`;
  performanceMonitor.mark(startMark);
  
  return () => {
    const duration = performanceMonitor.measure(`${componentName}-render`, startMark);
    if (duration && duration > 16) {
      console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
    }
  };
}

// Utility: track interaction
export function trackInteraction(name: string, callback: () => void | Promise<void>) {
  return async () => {
    const start = performance.now();
    await callback();
    const duration = performance.now() - start;
    
    performanceMonitor.trackMetric({
      name: `interaction-${name}`,
      value: duration,
      unit: 'ms'
    });
  };
}
