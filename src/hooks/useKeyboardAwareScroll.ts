import { useEffect, useCallback } from 'react';

export const useKeyboardAwareScroll = () => {
  const scrollInputIntoView = useCallback((input: HTMLElement) => {
    setTimeout(() => {
      const rect = input.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      
      if (rect.bottom > viewportHeight - 50) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }, []);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        scrollInputIntoView(target);
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, [scrollInputIntoView]);

  return { scrollInputIntoView };
};
