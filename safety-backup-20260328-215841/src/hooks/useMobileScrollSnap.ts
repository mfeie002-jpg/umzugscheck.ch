import { useRef, useEffect, useState, useCallback } from 'react';

interface UseMobileScrollSnapOptions {
  itemCount: number;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  onIndexChange?: (index: number) => void;
}

export function useMobileScrollSnap({
  itemCount,
  autoScroll = false,
  autoScrollInterval = 4000,
  onIndexChange,
}: UseMobileScrollSnapOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Calculate current index based on scroll position
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.scrollWidth / itemCount;
    const newIndex = Math.round(scrollLeft / itemWidth);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < itemCount) {
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  }, [currentIndex, itemCount, onIndexChange]);

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current || index < 0 || index >= itemCount) return;

    const container = scrollRef.current;
    const itemWidth = container.scrollWidth / itemCount;
    
    setIsScrolling(true);
    container.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth',
    });
    
    setTimeout(() => setIsScrolling(false), 500);
  }, [itemCount]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || isScrolling) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % itemCount;
      scrollToIndex(nextIndex);
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, currentIndex, itemCount, isScrolling, scrollToIndex]);

  // Scroll event listener with debounce
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeout: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScroll, 50);
    };

    container.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeout);
    };
  }, [handleScroll]);

  return {
    scrollRef,
    currentIndex,
    scrollToIndex,
    scrollContainerProps: {
      className: 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x',
      style: { 
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
      } as React.CSSProperties,
    },
    itemProps: {
      className: 'snap-center flex-shrink-0',
      style: { scrollSnapAlign: 'center' } as React.CSSProperties,
    },
  };
}
