/**
 * Focus Management & Accessibility
 * 
 * Features:
 * - Focus trap for modals
 * - Skip to content link
 * - Focus visible styles
 * - Screen reader announcements
 */

import { useEffect, useRef, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Hook for focus trap within a container
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
}

/**
 * Hook for restoring focus when component unmounts
 */
export function useRestoreFocus() {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    
    return () => {
      previousFocus.current?.focus();
    };
  }, []);
}

/**
 * Screen reader only text
 */
export const ScreenReaderOnly = memo(function ScreenReaderOnly({
  children,
  as: Component = 'span',
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
});

/**
 * Live region for announcements
 */
export const LiveRegion = memo(function LiveRegion({
  message,
  politeness = 'polite',
}: {
  message: string;
  politeness?: 'polite' | 'assertive';
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
});

/**
 * Hook for announcing messages to screen readers
 */
export function useAnnounce() {
  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', politeness);
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    el.textContent = message;
    
    document.body.appendChild(el);
    
    setTimeout(() => {
      document.body.removeChild(el);
    }, 1000);
  }, []);

  return announce;
}

/**
 * Enhanced skip to content link
 */
export const SkipToMain = memo(function SkipToMain({
  targetId = 'main-content',
  className,
}: {
  targetId?: string;
  className?: string;
}) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetId]);

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed top-4 left-4 z-[9999]",
        "bg-primary text-primary-foreground",
        "px-4 py-2 rounded-lg font-medium",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      Zum Hauptinhalt springen
    </a>
  );
});

/**
 * Focus indicator wrapper - enhances focus visibility
 */
export const FocusRing = memo(function FocusRing({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-lg",
        className
      )}
    >
      {children}
    </div>
  );
});

/**
 * Keyboard navigation helper
 */
export function useKeyboardNavigation(
  items: HTMLElement[],
  options?: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
  }
) {
  const { loop = true, orientation = 'vertical' } = options || {};

  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentIndex: number) => {
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

    let newIndex = currentIndex;

    if (e.key === nextKey) {
      e.preventDefault();
      newIndex = currentIndex + 1;
      if (newIndex >= items.length) {
        newIndex = loop ? 0 : items.length - 1;
      }
    } else if (e.key === prevKey) {
      e.preventDefault();
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = loop ? items.length - 1 : 0;
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = items.length - 1;
    }

    items[newIndex]?.focus();
    return newIndex;
  }, [items, loop, orientation]);

  return handleKeyDown;
}
