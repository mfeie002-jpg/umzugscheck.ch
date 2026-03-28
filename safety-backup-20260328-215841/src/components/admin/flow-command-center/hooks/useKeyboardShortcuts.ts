/**
 * Keyboard Shortcuts Hook - Archetyp Reference
 * Professional keyboard navigation for power users
 */

import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsProps {
  onNavigateDashboard?: () => void;
  onNavigateRanking?: () => void;
  onNavigateAnalysis?: () => void;
  onNavigateHistory?: () => void;
  onNavigateComparison?: () => void;
  onRefresh?: () => void;
  onAnalyzeAll?: () => void;
  onExport?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onNavigateDashboard,
  onNavigateRanking,
  onNavigateAnalysis,
  onNavigateHistory,
  onNavigateComparison,
  onRefresh,
  onAnalyzeAll,
  onExport,
  onSearch,
  onHelp,
  enabled = true,
}: UseKeyboardShortcutsProps) {
  const shortcuts: ShortcutHandler[] = [
    // Navigation
    { key: '1', alt: true, action: onNavigateDashboard || (() => {}), description: 'Dashboard' },
    { key: '2', alt: true, action: onNavigateRanking || (() => {}), description: 'Ranking' },
    { key: '3', alt: true, action: onNavigateAnalysis || (() => {}), description: 'Analyse' },
    { key: '4', alt: true, action: onNavigateHistory || (() => {}), description: 'Historie' },
    { key: '5', alt: true, action: onNavigateComparison || (() => {}), description: 'Vergleich' },
    
    // Actions
    { key: 'r', ctrl: true, action: onRefresh || (() => {}), description: 'Aktualisieren' },
    { key: 'a', ctrl: true, shift: true, action: onAnalyzeAll || (() => {}), description: 'Alle analysieren' },
    { key: 'e', ctrl: true, action: onExport || (() => {}), description: 'Exportieren' },
    { key: 'k', ctrl: true, action: onSearch || (() => {}), description: 'Suchen' },
    { key: '?', action: onHelp || (() => showHelp(shortcuts)), description: 'Hilfe anzeigen' },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;
    
    // Ignore if user is typing in an input
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true;
      const altMatch = shortcut.alt ? e.altKey : !e.altKey;
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
      
      if (
        e.key.toLowerCase() === shortcut.key.toLowerCase() &&
        ctrlMatch &&
        altMatch &&
        shiftMatch
      ) {
        e.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [enabled, shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
}

function showHelp(shortcuts: ShortcutHandler[]) {
  const helpText = shortcuts
    .filter(s => s.action.toString() !== '() => {}')
    .map(s => {
      const keys = [];
      if (s.ctrl) keys.push('Ctrl');
      if (s.alt) keys.push('Alt');
      if (s.shift) keys.push('Shift');
      keys.push(s.key.toUpperCase());
      return `${keys.join('+')} → ${s.description}`;
    })
    .join('\n');
  
  toast.info('Keyboard Shortcuts', {
    description: helpText,
    duration: 10000,
  });
}

// Shortcut badge component helper
export function formatShortcut(shortcut: ShortcutHandler): string {
  const keys = [];
  if (shortcut.ctrl) keys.push('⌘');
  if (shortcut.alt) keys.push('⌥');
  if (shortcut.shift) keys.push('⇧');
  keys.push(shortcut.key.toUpperCase());
  return keys.join('');
}

export const SHORTCUT_MAP = {
  dashboard: { key: '1', alt: true },
  ranking: { key: '2', alt: true },
  analysis: { key: '3', alt: true },
  history: { key: '4', alt: true },
  comparison: { key: '5', alt: true },
  refresh: { key: 'R', ctrl: true },
  analyzeAll: { key: 'A', ctrl: true, shift: true },
  export: { key: 'E', ctrl: true },
  search: { key: 'K', ctrl: true },
  help: { key: '?' },
};
