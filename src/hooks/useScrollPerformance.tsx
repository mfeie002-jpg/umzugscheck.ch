import { useRef, useCallback, useEffect, MutableRefObject } from 'react';

interface UseScrollPerformanceOptions {
  threshold?: number;
  onScrollEnd?: () => void;
  onScrollStart?: () => void;
}

export const useScrollPerformance = (options: UseScrollPerformanceOptions = {}) => {
  const { threshold = 100, onScrollEnd, onScrollStart } = options;
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');
  const frameId = useRef<number>();

  const handleScroll = useCallback(() => {
    // Cancel any pending animation frame
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }

    // Use requestAnimationFrame for smooth performance
    frameId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      scrollDirection.current = currentScrollY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentScrollY;

      // Handle scroll start
      if (!isScrolling.current) {
        isScrolling.current = true;
        onScrollStart?.();
      }

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set new timeout for scroll end
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
        onScrollEnd?.();
      }, threshold);
    });
  }, [threshold, onScrollEnd, onScrollStart]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [handleScroll]);

  return {
    isScrolling,
    scrollDirection,
    scrollY: lastScrollY
  };
};

// Utility to lock scroll
export const useScrollLock = () => {
  const scrollPosition = useRef(0);

  const lock = useCallback(() => {
    scrollPosition.current = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition.current}px`;
    document.body.style.width = '100%';
  }, []);

  const unlock = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition.current);
  }, []);

  return { lock, unlock };
};
