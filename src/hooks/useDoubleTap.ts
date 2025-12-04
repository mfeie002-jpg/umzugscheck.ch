import { useCallback, useRef } from 'react';

interface UseDoubleTapOptions {
  onDoubleTap: () => void;
  onSingleTap?: () => void;
  delay?: number;
}

export const useDoubleTap = ({
  onDoubleTap,
  onSingleTap,
  delay = 300,
}: UseDoubleTapOptions) => {
  const lastTap = useRef(0);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.current;

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      // Double tap detected
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      onDoubleTap();
    } else {
      // Potential single tap - wait to see if it's a double tap
      if (onSingleTap) {
        timeout.current = setTimeout(() => {
          onSingleTap();
        }, delay);
      }
    }

    lastTap.current = now;
  }, [delay, onDoubleTap, onSingleTap]);

  return { onClick: handleTap };
};
