import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Memory Optimization Hooks
 * Prevent memory leaks and optimize memory usage
 */

/**
 * Cleanup hook - automatically cleans up subscriptions and timers
 */
export function useCleanup() {
  const cleanupFns = useRef<Array<() => void>>([]);

  const addCleanup = useCallback((fn: () => void) => {
    cleanupFns.current.push(fn);
  }, []);

  useEffect(() => {
    return () => {
      cleanupFns.current.forEach(fn => {
        try {
          fn();
        } catch (e) {
          console.warn('Cleanup error:', e);
        }
      });
      cleanupFns.current = [];
    };
  }, []);

  return addCleanup;
}

/**
 * Safe state hook - prevents state updates on unmounted components
 */
export function useSafeState<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialValue);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setSafeState = useCallback((value: T | ((prev: T) => T)) => {
    if (isMounted.current) {
      setState(value);
    }
  }, []);

  return [state, setSafeState];
}

/**
 * Memory monitor hook - tracks memory usage
 */
export function useMemoryMonitor(threshold = 0.9) {
  const [memoryWarning, setMemoryWarning] = useState(false);

  useEffect(() => {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        setMemoryWarning(usedRatio > threshold);
      }
    };

    const interval = setInterval(checkMemory, 10000);
    checkMemory();

    return () => clearInterval(interval);
  }, [threshold]);

  return memoryWarning;
}

/**
 * Cache with size limit and LRU eviction
 */
export function useCache<K, V>(maxSize = 100) {
  const cache = useRef(new Map<K, V>());
  const accessOrder = useRef<K[]>([]);

  const get = useCallback((key: K): V | undefined => {
    const value = cache.current.get(key);
    if (value !== undefined) {
      // Move to end of access order (most recently used)
      accessOrder.current = accessOrder.current.filter(k => k !== key);
      accessOrder.current.push(key);
    }
    return value;
  }, []);

  const set = useCallback((key: K, value: V) => {
    // Evict if at capacity
    while (cache.current.size >= maxSize && accessOrder.current.length > 0) {
      const lruKey = accessOrder.current.shift()!;
      cache.current.delete(lruKey);
    }

    cache.current.set(key, value);
    accessOrder.current = accessOrder.current.filter(k => k !== key);
    accessOrder.current.push(key);
  }, [maxSize]);

  const clear = useCallback(() => {
    cache.current.clear();
    accessOrder.current = [];
  }, []);

  const remove = useCallback((key: K) => {
    cache.current.delete(key);
    accessOrder.current = accessOrder.current.filter(k => k !== key);
  }, []);

  return { get, set, clear, remove, size: cache.current.size };
}

/**
 * Debounced callback with cleanup
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Throttled callback with cleanup
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottleRef = useRef(false);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    return () => {
      inThrottleRef.current = false;
      lastArgsRef.current = null;
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      lastArgsRef.current = args;
      
      if (!inThrottleRef.current) {
        callback(...args);
        inThrottleRef.current = true;
        
        setTimeout(() => {
          inThrottleRef.current = false;
          if (lastArgsRef.current) {
            callback(...lastArgsRef.current);
          }
        }, limit);
      }
    }) as T,
    [callback, limit]
  );
}

/**
 * Object pool for reusable objects
 */
export function useObjectPool<T>(
  factory: () => T,
  reset: (obj: T) => void,
  initialSize = 10
) {
  const pool = useRef<T[]>([]);

  // Initialize pool
  useEffect(() => {
    for (let i = 0; i < initialSize; i++) {
      pool.current.push(factory());
    }
    return () => {
      pool.current = [];
    };
  }, [factory, initialSize]);

  const acquire = useCallback((): T => {
    if (pool.current.length > 0) {
      return pool.current.pop()!;
    }
    return factory();
  }, [factory]);

  const release = useCallback((obj: T) => {
    reset(obj);
    pool.current.push(obj);
  }, [reset]);

  return { acquire, release };
}

export default {
  useCleanup,
  useSafeState,
  useMemoryMonitor,
  useCache,
  useDebouncedCallback,
  useThrottledCallback,
  useObjectPool,
};
