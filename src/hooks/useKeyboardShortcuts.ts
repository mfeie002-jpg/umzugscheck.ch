/**
 * Keyboard Shortcuts System
 * 
 * Features:
 * - Global keyboard shortcuts
 * - Context-aware shortcuts
 * - Shortcut hints display
 * - Accessibility compliant
 */

import { useEffect, useCallback, useState } from 'react';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
  context?: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  context?: string;
}

const registeredShortcuts: Shortcut[] = [];

export function useKeyboardShortcuts(
  shortcuts: Shortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, context } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !shortcut.ctrl || (event.ctrlKey || event.metaKey);
      const altMatch = !shortcut.alt || event.altKey;
      const shiftMatch = !shortcut.shift || event.shiftKey;
      const contextMatch = !shortcut.context || shortcut.context === context;

      if (keyMatch && ctrlMatch && altMatch && shiftMatch && contextMatch) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts, enabled, context]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts,
    enabled,
  };
}

/**
 * Hook for showing keyboard shortcut hints
 */
export function useShortcutHints() {
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        setShowHints(prev => !prev);
      }
      if (e.key === 'Escape' && showHints) {
        setShowHints(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHints]);

  return { showHints, setShowHints };
}

/**
 * Format shortcut key for display
 */
export function formatShortcutKey(shortcut: Shortcut): string {
  const parts: string[] = [];
  
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  
  if (shortcut.ctrl) parts.push(isMac ? '⌘' : 'Ctrl');
  if (shortcut.alt) parts.push(isMac ? '⌥' : 'Alt');
  if (shortcut.shift) parts.push('⇧');
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(isMac ? '' : '+');
}

/**
 * Common navigation shortcuts
 */
export const NAVIGATION_SHORTCUTS: Shortcut[] = [
  {
    key: 'h',
    action: () => window.location.href = '/',
    description: 'Zur Startseite',
  },
  {
    key: 'r',
    action: () => window.location.href = '/preisrechner',
    description: 'Zum Preisrechner',
  },
  {
    key: 'f',
    action: () => window.location.href = '/firmen',
    description: 'Zu Umzugsfirmen',
  },
  {
    key: '/',
    action: () => {
      const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
      searchInput?.focus();
    },
    description: 'Suche fokussieren',
  },
];
