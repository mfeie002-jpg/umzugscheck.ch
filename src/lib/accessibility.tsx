/**
 * Accessibility Utilities
 * 
 * Helper hooks and components for WCAG 2.1 AA compliance.
 */

import React, { useEffect, useCallback, useRef, useState } from "react";

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

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

    // Focus first element on mount
    firstElement?.focus();

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, isActive]);
}

/**
 * Return focus to trigger element when component unmounts
 */
export function useReturnFocus(triggerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const triggerElement = triggerRef.current;
    return () => {
      triggerElement?.focus();
    };
  }, [triggerRef]);
}

// ============================================================================
// ANNOUNCE TO SCREEN READERS
// ============================================================================

let announcer: HTMLDivElement | null = null;

function getAnnouncer(): HTMLDivElement {
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  return announcer;
}

/**
 * Announce a message to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const el = getAnnouncer();
  el.setAttribute('aria-live', priority);
  el.textContent = '';
  
  // Force announcement by changing content in next frame
  requestAnimationFrame(() => {
    el.textContent = message;
  });
}

/**
 * Hook for announcing messages
 */
export function useAnnounce() {
  return useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announce(message, priority);
  }, []);
}

// ============================================================================
// REDUCED MOTION
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

/**
 * Handle arrow key navigation in a list
 */
export function useArrowNavigation<T extends HTMLElement>(
  itemsRef: React.RefObject<T[]>,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
    onSelect?: (index: number) => void;
  } = {}
) {
  const { orientation = 'vertical', loop = true, onSelect } = options;
  const currentIndex = useRef(0);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = itemsRef.current;
    if (!items || items.length === 0) return;

    let newIndex = currentIndex.current;
    const isVertical = orientation === 'vertical' || orientation === 'both';
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';

    switch (e.key) {
      case 'ArrowDown':
        if (isVertical) {
          e.preventDefault();
          newIndex = loop 
            ? (currentIndex.current + 1) % items.length
            : Math.min(currentIndex.current + 1, items.length - 1);
        }
        break;
      case 'ArrowUp':
        if (isVertical) {
          e.preventDefault();
          newIndex = loop
            ? (currentIndex.current - 1 + items.length) % items.length
            : Math.max(currentIndex.current - 1, 0);
        }
        break;
      case 'ArrowRight':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = loop
            ? (currentIndex.current + 1) % items.length
            : Math.min(currentIndex.current + 1, items.length - 1);
        }
        break;
      case 'ArrowLeft':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = loop
            ? (currentIndex.current - 1 + items.length) % items.length
            : Math.max(currentIndex.current - 1, 0);
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect?.(currentIndex.current);
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex.current) {
      currentIndex.current = newIndex;
      items[newIndex]?.focus();
    }
  }, [itemsRef, orientation, loop, onSelect]);

  return { handleKeyDown, currentIndex };
}

// ============================================================================
// SKIP LINK
// ============================================================================

/**
 * Skip to main content link (for keyboard users)
 */
export function SkipLink({ href = '#main-content' }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Zum Hauptinhalt springen
    </a>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Generate unique IDs for form labels
 */
let idCounter = 0;
export function useId(prefix: string = 'id'): string {
  const [id] = useState(() => `${prefix}-${++idCounter}`);
  return id;
}

/**
 * Check if element is visible
 */
export function isElementVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         element.offsetWidth > 0 &&
         element.offsetHeight > 0;
}
