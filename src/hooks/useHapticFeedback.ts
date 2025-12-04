import { useCallback } from "react";

type HapticType = "light" | "medium" | "heavy" | "selection" | "success" | "warning" | "error";

export const useHapticFeedback = () => {
  const vibrate = useCallback((type: HapticType = "light") => {
    // Check if vibration API is supported
    if (!("vibrate" in navigator)) return;

    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      selection: 5,
      success: [10, 50, 10],
      warning: [20, 50, 20],
      error: [30, 50, 30, 50, 30],
    };

    try {
      navigator.vibrate(patterns[type]);
    } catch (e) {
      // Silently fail if vibration not supported
    }
  }, []);

  const lightTap = useCallback(() => vibrate("light"), [vibrate]);
  const mediumTap = useCallback(() => vibrate("medium"), [vibrate]);
  const heavyTap = useCallback(() => vibrate("heavy"), [vibrate]);
  const selection = useCallback(() => vibrate("selection"), [vibrate]);
  const success = useCallback(() => vibrate("success"), [vibrate]);
  const warning = useCallback(() => vibrate("warning"), [vibrate]);
  const error = useCallback(() => vibrate("error"), [vibrate]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    selection,
    success,
    warning,
    error,
  };
};
