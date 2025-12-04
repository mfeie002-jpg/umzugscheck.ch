import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from './use-haptic';

export const useGestureNavigation = () => {
  const navigate = useNavigate();
  const { trigger } = useHaptic();
  const startX = useRef(0);
  const startY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const diffX = startX.current - endX;
    const diffY = startY.current - endY;
    
    // Check if it's a horizontal swipe from the left edge (back gesture)
    if (
      startX.current < 30 && // Started from left edge
      diffX < -100 && // Swiped right
      Math.abs(diffY) < 50 && // Not too much vertical movement
      window.history.length > 1
    ) {
      trigger('light');
      navigate(-1);
    }
  }, [navigate, trigger]);

  return {
    gestureHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
};
