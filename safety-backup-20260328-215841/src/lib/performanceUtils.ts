// Advanced Performance Utilities

// Debounce with leading edge option
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  const { leading = false, trailing = true } = options || {};

  return function (this: unknown, ...args: Parameters<T>) {
    const callNow = leading && !timeout;
    lastArgs = args;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      if (trailing && lastArgs) {
        func.apply(this, lastArgs);
        lastArgs = null;
      }
    }, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

// Throttle with RAF support
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
  options?: { useRAF?: boolean }
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let rafId: number | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastCall = now;
      func.apply(this, args);
    } else if (options?.useRAF && !rafId) {
      rafId = requestAnimationFrame(() => {
        lastCall = Date.now();
        rafId = null;
        func.apply(this, args);
      });
    }
  };
}

// Memoize function results
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  options?: { maxSize?: number; keyGenerator?: (...args: Parameters<T>) => string }
): T & { cache: Map<string, ReturnType<T>>; clear: () => void } {
  const cache = new Map<string, ReturnType<T>>();
  const { maxSize = 100, keyGenerator = (...args) => JSON.stringify(args) } = options || {};

  const memoized = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = keyGenerator(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func.apply(this, args) as ReturnType<T>;

    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };

  (memoized as typeof memoized & { cache: typeof cache; clear: () => void }).cache = cache;
  (memoized as typeof memoized & { cache: typeof cache; clear: () => void }).clear = () => cache.clear();

  return memoized as T & { cache: Map<string, ReturnType<T>>; clear: () => void };
}

// Request Idle Callback polyfill and wrapper
export function runWhenIdle(
  callback: (deadline: IdleDeadline) => void,
  options?: { timeout?: number }
): () => void {
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(callback, options);
    return () => cancelIdleCallback(id);
  }

  const start = Date.now();
  const timeRemaining = () => Math.max(0, 50 - (Date.now() - start));
  
  const timeout = setTimeout(() => {
    callback({
      didTimeout: true,
      timeRemaining,
    } as IdleDeadline);
  }, 1);

  return () => clearTimeout(timeout);
}

// Batch DOM reads/writes to prevent layout thrashing
export const batchDOM = {
  reads: [] as (() => void)[],
  writes: [] as (() => void)[],
  scheduled: false,

  read(fn: () => void) {
    this.reads.push(fn);
    this.schedule();
  },

  write(fn: () => void) {
    this.writes.push(fn);
    this.schedule();
  },

  schedule() {
    if (this.scheduled) return;
    this.scheduled = true;

    requestAnimationFrame(() => {
      // Execute all reads first
      const reads = this.reads.slice();
      this.reads.length = 0;
      reads.forEach((fn) => fn());

      // Then all writes
      const writes = this.writes.slice();
      this.writes.length = 0;
      writes.forEach((fn) => fn());

      this.scheduled = false;
    });
  },
};

// Intersection Observer with reuse
const observerCache = new Map<string, IntersectionObserver>();

export function getSharedObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const key = JSON.stringify(options || {});

  if (!observerCache.has(key)) {
    const observer = new IntersectionObserver(callback, options);
    observerCache.set(key, observer);
  }

  return observerCache.get(key)!;
}

// Image loading utilities
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map(preloadImage));
}

// Network quality detection
export function getNetworkQuality(): 'fast' | 'slow' | 'offline' {
  if (!navigator.onLine) return 'offline';

  const connection = (navigator as Navigator & {
    connection?: {
      effectiveType?: string;
      saveData?: boolean;
      downlink?: number;
    };
  }).connection;

  if (connection?.saveData) return 'slow';

  const effectiveType = connection?.effectiveType;
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
  if (effectiveType === '3g' && (connection?.downlink || 0) < 1.5) return 'slow';

  return 'fast';
}

// Resource timing utilities
export function getResourceTiming(resourceType?: string): PerformanceResourceTiming[] {
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  if (!resourceType) return entries;
  
  return entries.filter((entry) => entry.initiatorType === resourceType);
}

export function getTotalTransferSize(): number {
  return getResourceTiming().reduce((total, entry) => total + (entry.transferSize || 0), 0);
}

// Memory usage (Chrome only)
export function getMemoryUsage(): { used: number; total: number; limit: number } | null {
  const memory = (performance as Performance & { memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } }).memory;

  if (!memory) return null;

  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit,
  };
}

// Long task detection
export function onLongTask(callback: (duration: number) => void): () => void {
  if (!('PerformanceObserver' in window)) return () => {};

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        callback(entry.duration);
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
    return () => observer.disconnect();
  } catch {
    return () => {};
  }
}

// Paint timing
export function onPaint(
  callback: (type: 'first-paint' | 'first-contentful-paint', time: number) => void
): () => void {
  if (!('PerformanceObserver' in window)) return () => {};

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-paint' || entry.name === 'first-contentful-paint') {
          callback(entry.name as 'first-paint' | 'first-contentful-paint', entry.startTime);
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    return () => observer.disconnect();
  } catch {
    return () => {};
  }
}

// Export all utilities
export default {
  debounce,
  throttle,
  memoize,
  runWhenIdle,
  batchDOM,
  getSharedObserver,
  preloadImage,
  preloadImages,
  getNetworkQuality,
  getResourceTiming,
  getTotalTransferSize,
  getMemoryUsage,
  onLongTask,
  onPaint,
};
