import { useCallback } from 'react';

/**
 * Hook that provides a scroll-to-top function for use in multi-step flows.
 * Call scrollToTop() after step changes to ensure the user sees the top of the new step.
 */
export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { scrollToTop };
}

/**
 * Simple utility function for scroll-to-top without hook
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
