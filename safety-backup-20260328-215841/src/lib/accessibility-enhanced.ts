// Enhanced accessibility utilities for WCAG 2.2 AA compliance

// Focus trap for modals and dialogs
export function createFocusTrap(container: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]'
  ].join(', ');

  let previouslyFocused: HTMLElement | null = null;

  function getFocusableElements(): HTMLElement[] {
    return Array.from(container.querySelectorAll(focusableSelectors));
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return {
    activate: () => {
      previouslyFocused = document.activeElement as HTMLElement;
      container.addEventListener('keydown', handleKeyDown);
      
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    },
    deactivate: () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    }
  };
}

// Announce message to screen readers
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcer = document.getElementById('aria-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  
  // Force reflow
  void announcer.offsetWidth;
  
  announcer.textContent = message;
}

function createAnnouncer(): HTMLElement {
  const announcer = document.createElement('div');
  announcer.id = 'aria-announcer';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(announcer);
  return announcer;
}

// Check color contrast ratio
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Check if contrast meets WCAG requirements
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// Generate accessible ID
let idCounter = 0;
export function generateAccessibleId(prefix = 'accessible'): string {
  return `${prefix}-${++idCounter}`;
}

// Create accessible description
export function createAccessibleDescription(
  elementId: string,
  description: string
): { describedById: string; descriptionElement: HTMLElement } {
  const descId = `${elementId}-description`;
  
  let descElement = document.getElementById(descId);
  if (!descElement) {
    descElement = document.createElement('span');
    descElement.id = descId;
    descElement.className = 'sr-only';
    document.body.appendChild(descElement);
  }
  
  descElement.textContent = description;
  
  return {
    describedById: descId,
    descriptionElement: descElement
  };
}

// Keyboard navigation helpers
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End'
} as const;

export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  handlers: Partial<Record<keyof typeof KeyboardKeys, () => void>>
) {
  const key = event.key as keyof typeof KeyboardKeys;
  const handler = handlers[key];
  
  if (handler) {
    event.preventDefault();
    handler();
  }
}

// Skip link helper
export function scrollToMain() {
  const main = document.querySelector('main, [role="main"], #main-content');
  if (main) {
    (main as HTMLElement).focus();
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// High contrast preference
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// Create roving tabindex for list navigation
export function createRovingTabindex(
  container: HTMLElement,
  itemSelector: string
): {
  setActiveIndex: (index: number) => void;
  getActiveIndex: () => number;
  handleKeyDown: (event: KeyboardEvent) => void;
} {
  let activeIndex = 0;
  
  function getItems(): HTMLElement[] {
    return Array.from(container.querySelectorAll(itemSelector));
  }
  
  function updateTabindex() {
    const items = getItems();
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
    });
  }
  
  function setActiveIndex(index: number) {
    const items = getItems();
    if (index >= 0 && index < items.length) {
      activeIndex = index;
      updateTabindex();
      items[activeIndex].focus();
    }
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    const items = getItems();
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        setActiveIndex((activeIndex + 1) % items.length);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        setActiveIndex((activeIndex - 1 + items.length) % items.length);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        break;
    }
  }
  
  updateTabindex();
  
  return {
    setActiveIndex,
    getActiveIndex: () => activeIndex,
    handleKeyDown
  };
}
