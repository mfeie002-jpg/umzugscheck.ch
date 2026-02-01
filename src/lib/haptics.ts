/**
 * Haptic Feedback Utilities
 * Provides subtle vibration feedback for mobile interactions
 */

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 40,
  success: [10, 50, 30],
  error: [50, 30, 50],
  selection: 5,
};

/**
 * Check if haptic feedback is supported
 */
export function supportsHaptics(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 * @param pattern - The type of haptic feedback
 */
export function triggerHaptic(pattern: HapticPattern = 'light'): void {
  if (!supportsHaptics()) return;
  
  try {
    const vibrationPattern = HAPTIC_PATTERNS[pattern];
    navigator.vibrate(vibrationPattern);
  } catch {
    // Silently fail - haptics are optional enhancement
  }
}

/**
 * React hook for haptic feedback on click
 * Usage: onClick={withHaptic(() => doSomething(), 'light')}
 */
export function withHaptic<T extends (...args: unknown[]) => unknown>(
  callback: T,
  pattern: HapticPattern = 'light'
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>) => {
    triggerHaptic(pattern);
    return callback(...args) as ReturnType<T>;
  };
}

/**
 * HOC to add haptic feedback to button clicks
 */
export function createHapticHandler(
  pattern: HapticPattern = 'light'
): () => void {
  return () => triggerHaptic(pattern);
}
