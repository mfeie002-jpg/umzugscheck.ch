import { useState, useEffect, useRef } from 'react';

type ScrollDirection = 'up' | 'down' | null;

export const useScrollDirection = (threshold = 10) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsAtTop(currentScrollY < threshold);

      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
        return;
      }

      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { scrollDirection, isAtTop };
};
