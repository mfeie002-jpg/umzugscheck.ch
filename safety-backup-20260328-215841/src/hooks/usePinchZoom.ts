import { useState, useCallback, useRef } from 'react';

interface PinchState {
  scale: number;
  isZooming: boolean;
}

interface UsePinchZoomOptions {
  minScale?: number;
  maxScale?: number;
  onZoomChange?: (scale: number) => void;
}

interface TouchPoint {
  clientX: number;
  clientY: number;
}

export const usePinchZoom = ({
  minScale = 1,
  maxScale = 3,
  onZoomChange,
}: UsePinchZoomOptions = {}) => {
  const [state, setState] = useState<PinchState>({
    scale: 1,
    isZooming: false,
  });

  const initialDistance = useRef<number | null>(null);
  const initialScale = useRef(1);

  const getDistance = (touch1: TouchPoint, touch2: TouchPoint) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1: TouchPoint = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      const touch2: TouchPoint = { clientX: e.touches[1].clientX, clientY: e.touches[1].clientY };
      initialDistance.current = getDistance(touch1, touch2);
      initialScale.current = state.scale;
      setState(prev => ({ ...prev, isZooming: true }));
    }
  }, [state.scale]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance.current !== null) {
      const touch1: TouchPoint = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      const touch2: TouchPoint = { clientX: e.touches[1].clientX, clientY: e.touches[1].clientY };
      const currentDistance = getDistance(touch1, touch2);
      const scaleFactor = currentDistance / initialDistance.current;
      const newScale = Math.min(maxScale, Math.max(minScale, initialScale.current * scaleFactor));
      
      setState(prev => ({ ...prev, scale: newScale }));
      onZoomChange?.(newScale);
    }
  }, [minScale, maxScale, onZoomChange]);

  const onTouchEnd = useCallback(() => {
    initialDistance.current = null;
    setState(prev => ({ ...prev, isZooming: false }));
  }, []);

  const resetZoom = useCallback(() => {
    setState({ scale: 1, isZooming: false });
    onZoomChange?.(1);
  }, [onZoomChange]);

  return {
    scale: state.scale,
    isZooming: state.isZooming,
    resetZoom,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
};
