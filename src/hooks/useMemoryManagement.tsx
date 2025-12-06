import { useEffect, useCallback, useRef } from 'react';

interface MemoryInfo {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

declare global {
  interface Performance {
    memory?: MemoryInfo;
  }
}

export const useMemoryManagement = (options?: {
  warningThreshold?: number; // Percentage (0-1)
  onMemoryWarning?: (usage: number) => void;
}) => {
  const { warningThreshold = 0.8, onMemoryWarning } = options || {};
  const intervalRef = useRef<number | null>(null);

  const getMemoryUsage = useCallback((): number | null => {
    if (!performance.memory) return null;
    
    const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
    if (!usedJSHeapSize || !jsHeapSizeLimit) return null;
    
    return usedJSHeapSize / jsHeapSizeLimit;
  }, []);

  const checkMemory = useCallback(() => {
    const usage = getMemoryUsage();
    if (usage !== null && usage > warningThreshold) {
      onMemoryWarning?.(usage);
      
      // Attempt garbage collection hint
      if (typeof gc === 'function') {
        gc();
      }
    }
  }, [getMemoryUsage, warningThreshold, onMemoryWarning]);

  useEffect(() => {
    if (!performance.memory) return;

    intervalRef.current = window.setInterval(checkMemory, 30000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkMemory]);

  // Clear image cache when memory is high
  const clearImageCache = useCallback(() => {
    const images = document.querySelectorAll('img[data-cached]');
    images.forEach(img => {
      if (img instanceof HTMLImageElement && !isElementInViewport(img)) {
        img.src = '';
      }
    });
  }, []);

  return { getMemoryUsage, clearImageCache };
};

function isElementInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= -100 &&
    rect.left >= -100 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + 100
  );
}

// Cleanup hook for component unmount
export const useCleanup = (cleanup: () => void) => {
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);
};
