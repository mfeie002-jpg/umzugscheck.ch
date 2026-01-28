import { useEffect } from 'react';

export function AccessibilityEnhancements() {
  useEffect(() => {
    // Add skip link functionality
    const handleSkipLink = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        const skipLink = document.querySelector('.skip-link') as HTMLElement;
        if (skipLink && document.activeElement === document.body) {
          skipLink.focus();
        }
      }
    };

    // Announce route changes to screen readers
    const announceRouteChange = () => {
      const pageTitle = document.title;
      const announcement = document.getElementById('route-announcement');
      if (announcement) {
        announcement.textContent = `Navigiert zu: ${pageTitle}`;
      }
    };

    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('reduce-motion', e.matches);
    };
    handleMotionPreference(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', handleMotionPreference);

    // High contrast mode detection
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    const handleContrastPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('high-contrast', e.matches);
    };
    handleContrastPreference(prefersHighContrast);
    prefersHighContrast.addEventListener('change', handleContrastPreference);

    // Focus visible polyfill behavior
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      document.documentElement.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleSkipLink);
    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('popstate', announceRouteChange);

    // Create announcement region if it doesn't exist
    if (!document.getElementById('route-announcement')) {
      const announcement = document.createElement('div');
      announcement.id = 'route-announcement';
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleSkipLink);
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('popstate', announceRouteChange);
      prefersReducedMotion.removeEventListener('change', handleMotionPreference);
      prefersHighContrast.removeEventListener('change', handleContrastPreference);
    };
  }, []);

  return null;
}

export default AccessibilityEnhancements;
