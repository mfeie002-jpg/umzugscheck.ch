import { useState, useEffect, useCallback } from 'react';

interface UsePageVisibilityOptions {
  onVisible?: () => void;
  onHidden?: () => void;
  onChange?: (isVisible: boolean) => void;
}

interface UsePageVisibilityReturn {
  isVisible: boolean;
  visibilityState: DocumentVisibilityState;
  lastVisibleTime: Date | null;
  hiddenDuration: number;
}

export function usePageVisibility(options: UsePageVisibilityOptions = {}): UsePageVisibilityReturn {
  const { onVisible, onHidden, onChange } = options;

  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [visibilityState, setVisibilityState] = useState<DocumentVisibilityState>(document.visibilityState);
  const [lastVisibleTime, setLastVisibleTime] = useState<Date | null>(null);
  const [hiddenDuration, setHiddenDuration] = useState(0);

  const handleVisibilityChange = useCallback(() => {
    const visible = !document.hidden;
    setIsVisible(visible);
    setVisibilityState(document.visibilityState);

    if (visible) {
      // Calculate how long page was hidden
      if (lastVisibleTime) {
        const duration = Date.now() - lastVisibleTime.getTime();
        setHiddenDuration(duration);
      }
      onVisible?.();
    } else {
      setLastVisibleTime(new Date());
      onHidden?.();
    }
    
    onChange?.(visible);
  }, [lastVisibleTime, onVisible, onHidden, onChange]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return {
    isVisible,
    visibilityState,
    lastVisibleTime,
    hiddenDuration
  };
}
