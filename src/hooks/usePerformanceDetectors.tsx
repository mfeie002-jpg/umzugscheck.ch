import { useEffect, useRef } from 'react';

// Detects long tasks that block the main thread
export const useLongTaskDetector = (
  onLongTask?: (duration: number) => void,
  threshold: number = 50
) => {
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    try {
      observerRef.current = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > threshold) {
            if (import.meta.env.DEV) {
              console.warn(`[Long Task] Duration: ${entry.duration.toFixed(2)}ms`);
            }
            onLongTask?.(entry.duration);
          }
        }
      });

      observerRef.current.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task observer not supported
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [onLongTask, threshold]);
};

// Memory usage monitoring
export const useMemoryMonitor = (
  onHighMemory?: (usage: number) => void,
  threshold: number = 0.8 // 80% of available memory
) => {
  useEffect(() => {
    // @ts-ignore - Memory API is non-standard
    const memory = (performance as any).memory;
    if (!memory) return;

    const checkMemory = () => {
      const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      if (usageRatio > threshold) {
        onHighMemory?.(usageRatio);
      }
    };

    const interval = setInterval(checkMemory, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [onHighMemory, threshold]);
};
