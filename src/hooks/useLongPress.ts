import { useCallback, useRef, useState } from 'react';
import { useHaptic } from './use-haptic';

interface UseLongPressOptions {
  onLongPress: () => void;
  onPress?: () => void;
  delay?: number;
  hapticFeedback?: boolean;
}

export const useLongPress = ({
  onLongPress,
  onPress,
  delay = 500,
  hapticFeedback = true,
}: UseLongPressOptions) => {
  const { trigger } = useHaptic();
  const [isPressed, setIsPressed] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback(() => {
    isLongPress.current = false;
    setIsPressed(true);
    
    timeout.current = setTimeout(() => {
      isLongPress.current = true;
      if (hapticFeedback) {
        trigger('heavy');
      }
      onLongPress();
    }, delay);
  }, [delay, hapticFeedback, onLongPress, trigger]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    setIsPressed(false);
    
    if (!isLongPress.current && onPress) {
      onPress();
    }
  }, [onPress]);

  return {
    isPressed,
    handlers: {
      onMouseDown: start,
      onMouseUp: clear,
      onMouseLeave: clear,
      onTouchStart: start,
      onTouchEnd: clear,
    },
  };
};
