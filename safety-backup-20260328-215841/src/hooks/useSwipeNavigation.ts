import { useState, useCallback, TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseSwipeNavigationOptions {
  prevPage?: string;
  nextPage?: string;
  threshold?: number;
}

export function useSwipeNavigation({ prevPage, nextPage, threshold = 100 }: UseSwipeNavigationOptions) {
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && nextPage) {
      navigate(nextPage);
    } else if (isRightSwipe && prevPage) {
      navigate(prevPage);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, threshold, navigate, prevPage, nextPage]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

// Service pages navigation order
export const servicePages = [
  { path: '/plan/private', label: 'Privatumzug' },
  { path: '/plan/office', label: 'Büroumzug' },
  { path: '/plan/international', label: 'International' },
  { path: '/plan/senior', label: 'Seniorenumzug' },
  { path: '/plan/vip', label: 'VIP Service' },
  { path: '/plan/packing', label: 'Verpackung' },
  { path: '/plan/storage', label: 'Einlagerung' },
  { path: '/plan/assembly', label: 'Möbelmontage' },
];

export function getAdjacentPages(currentPath: string) {
  const currentIndex = servicePages.findIndex(p => p.path === currentPath);
  if (currentIndex === -1) return { prevPage: undefined, nextPage: undefined };
  
  return {
    prevPage: currentIndex > 0 ? servicePages[currentIndex - 1] : undefined,
    nextPage: currentIndex < servicePages.length - 1 ? servicePages[currentIndex + 1] : undefined,
  };
}