import { useCallback } from 'react';

type VibrationPattern = number | number[];

export const useVibration = () => {
  const isSupported = 'vibrate' in navigator;

  const vibrate = useCallback((pattern: VibrationPattern = 50) => {
    if (isSupported) {
      navigator.vibrate(pattern);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      navigator.vibrate(0);
    }
  }, [isSupported]);

  // Preset patterns
  const patterns = {
    tap: () => vibrate(10),
    success: () => vibrate([50, 50, 50]),
    error: () => vibrate([100, 50, 100, 50, 100]),
    warning: () => vibrate([50, 100, 50]),
    notification: () => vibrate([200, 100, 200]),
    heartbeat: () => vibrate([100, 200, 100, 200, 100, 200]),
  };

  return { isSupported, vibrate, stop, patterns };
};
