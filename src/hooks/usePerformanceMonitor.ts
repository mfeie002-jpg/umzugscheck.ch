import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
}

export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
    const renderTime = performance.now() - startTime.current;

    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(
        `[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
      );
    }
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`[LCP] ${componentName}: ${entry.startTime.toFixed(2)}ms`);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      // LCP not supported
    }

    return () => observer.disconnect();
  }, [componentName]);
}

export function measureInteraction(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  
  if (duration > 100) {
    console.warn(`[Interaction] ${name} took ${duration.toFixed(2)}ms`);
  }
}
