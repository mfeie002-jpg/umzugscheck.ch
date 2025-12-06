import { useEffect, useRef, useCallback } from 'react';

type IdleCallbackHandle = number;

interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

// Polyfill for requestIdleCallback
const requestIdleCallback = 
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (cb: (deadline: IdleDeadline) => void, options?: { timeout?: number }) => {
        const start = Date.now();
        return setTimeout(() => {
          cb({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          });
        }, options?.timeout || 1) as unknown as IdleCallbackHandle;
      };

const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: IdleCallbackHandle) => clearTimeout(id as unknown as number);

export const useRequestIdleCallback = (
  callback: (deadline: IdleDeadline) => void,
  options?: { timeout?: number }
) => {
  const handleRef = useRef<IdleCallbackHandle | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const schedule = useCallback(() => {
    if (handleRef.current !== null) {
      cancelIdleCallback(handleRef.current);
    }
    
    handleRef.current = requestIdleCallback((deadline) => {
      callbackRef.current(deadline);
    }, options);
  }, [options]);

  const cancel = useCallback(() => {
    if (handleRef.current !== null) {
      cancelIdleCallback(handleRef.current);
      handleRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return { schedule, cancel };
};

// Run non-critical tasks during idle time
export const useIdleTask = (
  task: () => void,
  deps: React.DependencyList = [],
  options?: { timeout?: number; runOnMount?: boolean }
) => {
  const { schedule, cancel } = useRequestIdleCallback(task, options);

  useEffect(() => {
    if (options?.runOnMount !== false) {
      schedule();
    }
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  return { schedule, cancel };
};
