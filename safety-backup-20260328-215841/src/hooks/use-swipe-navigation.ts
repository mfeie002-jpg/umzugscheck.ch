import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeable, SwipeEventData } from 'react-swipeable';
import { useHaptic } from '@/hooks/use-haptic';
import { useIsMobile } from '@/hooks/use-mobile';

// Define navigation order for swipe gestures
const navigationOrder = [
  '/',
  '/umzugsrechner',
  '/umzugsofferten',
  '/umzugsfirmen',
  '/dienstleistungen',
  '/regionen',
  '/ratgeber',
];

interface UseSwipeNavigationOptions {
  enabled?: boolean;
  threshold?: number;
  preventScrollOnSwipe?: boolean;
}

export const useSwipeNavigation = (options: UseSwipeNavigationOptions = {}) => {
  const { enabled = true, threshold = 80, preventScrollOnSwipe = false } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const { trigger } = useHaptic();
  const isMobile = useIsMobile();

  const getCurrentIndex = useCallback(() => {
    return navigationOrder.indexOf(location.pathname);
  }, [location.pathname]);

  const navigateToIndex = useCallback((index: number) => {
    if (index >= 0 && index < navigationOrder.length) {
      trigger('light');
      navigate(navigationOrder[index]);
    }
  }, [navigate, trigger]);

  const handleSwipeLeft = useCallback(() => {
    if (!enabled || !isMobile) return;
    const currentIndex = getCurrentIndex();
    if (currentIndex === -1) return; // Current page not in navigation order
    
    const nextIndex = currentIndex + 1;
    if (nextIndex < navigationOrder.length) {
      navigateToIndex(nextIndex);
    }
  }, [enabled, isMobile, getCurrentIndex, navigateToIndex]);

  const handleSwipeRight = useCallback(() => {
    if (!enabled || !isMobile) return;
    const currentIndex = getCurrentIndex();
    if (currentIndex === -1) return; // Current page not in navigation order
    
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      navigateToIndex(prevIndex);
    }
  }, [enabled, isMobile, getCurrentIndex, navigateToIndex]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData: SwipeEventData) => {
      if (Math.abs(eventData.deltaX) > threshold) {
        handleSwipeLeft();
      }
    },
    onSwipedRight: (eventData: SwipeEventData) => {
      if (Math.abs(eventData.deltaX) > threshold) {
        handleSwipeRight();
      }
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe,
    delta: 50,
  });

  const currentIndex = getCurrentIndex();
  const canSwipeLeft = currentIndex !== -1 && currentIndex < navigationOrder.length - 1;
  const canSwipeRight = currentIndex !== -1 && currentIndex > 0;

  return {
    swipeHandlers: isMobile && enabled ? swipeHandlers : {},
    canSwipeLeft,
    canSwipeRight,
    currentIndex,
    totalPages: navigationOrder.length,
    currentPage: navigationOrder[currentIndex] || null,
    nextPage: canSwipeLeft ? navigationOrder[currentIndex + 1] : null,
    prevPage: canSwipeRight ? navigationOrder[currentIndex - 1] : null,
  };
};
