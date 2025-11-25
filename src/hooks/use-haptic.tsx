import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const useHaptic = () => {
  const trigger = useCallback((pattern: HapticPattern = 'light') => {
    // Check if Vibration API is supported
    if (!('vibrate' in navigator)) return;

    const patterns: Record<HapticPattern, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 50,
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [50, 100, 50, 100, 50]
    };

    navigator.vibrate(patterns[pattern]);
  }, []);

  return { trigger };
};
