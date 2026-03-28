import { useEffect, useCallback } from 'react';

export const useKeyboardNavigation = () => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // ESC closes modals/dropdowns
    if (e.key === 'Escape') {
      const activeElement = document.activeElement as HTMLElement;
      activeElement?.blur();
      document.dispatchEvent(new CustomEvent('closeAllDropdowns'));
    }

    // Tab trap for modals
    if (e.key === 'Tab') {
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }

    // "/" focuses search
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
      e.preventDefault();
      const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
      searchInput?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
