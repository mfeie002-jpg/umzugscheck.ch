import { useState, useEffect, useCallback } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | null;
  isAtTop: boolean;
  isAtBottom: boolean;
  progress: number;
}

export const useScrollPosition = (element?: HTMLElement | null): ScrollPosition => {
  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: null,
    isAtTop: true,
    isAtBottom: false,
    progress: 0,
  });

  const getScrollPosition = useCallback(() => {
    const target = element || document.documentElement;
    const isWindow = !element;
    
    const scrollTop = isWindow ? window.scrollY : target.scrollTop;
    const scrollLeft = isWindow ? window.scrollX : target.scrollLeft;
    const scrollHeight = target.scrollHeight;
    const clientHeight = isWindow ? window.innerHeight : target.clientHeight;
    
    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    
    return {
      scrollTop,
      scrollLeft,
      isAtTop: scrollTop <= 0,
      isAtBottom: scrollTop >= maxScroll - 1,
      progress: Math.min(1, Math.max(0, progress)),
    };
  }, [element]);

  useEffect(() => {
    let prevScrollTop = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { scrollTop, scrollLeft, isAtTop, isAtBottom, progress } = getScrollPosition();
          
          setPosition({
            x: scrollLeft,
            y: scrollTop,
            direction: scrollTop > prevScrollTop ? 'down' : scrollTop < prevScrollTop ? 'up' : null,
            isAtTop,
            isAtBottom,
            progress,
          });
          
          prevScrollTop = scrollTop;
          ticking = false;
        });
        ticking = true;
      }
    };

    const target = element || window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => target.removeEventListener('scroll', handleScroll);
  }, [element, getScrollPosition]);

  return position;
};
