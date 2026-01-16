/**
 * Accessibility Enhancements
 * WCAG 2.1 AA compliance components and utilities
 */

import { memo, useEffect, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Type, Moon, Sun, Volume2, VolumeX, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Skip to main content link
export const SkipToMain = memo(function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
    >
      Zum Hauptinhalt springen
    </a>
  );
});

// Live region for announcements
export const LiveAnnouncer = memo(function LiveAnnouncer({ 
  message,
  priority = 'polite'
}: { 
  message: string;
  priority?: 'polite' | 'assertive';
}) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
});

// Hook for live announcements
export function useLiveAnnouncer() {
  const [message, setMessage] = useState('');

  const announce = useCallback((text: string, delay = 100) => {
    // Clear first to ensure re-announcement of same message
    setMessage('');
    setTimeout(() => setMessage(text), delay);
  }, []);

  return { message, announce, Announcer: () => <LiveAnnouncer message={message} /> };
}

// Focus trap for modals
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
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

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    // Focus first element
    firstElement?.focus();

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, isActive]);
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: HTMLElement[],
  options: { loop?: boolean; orientation?: 'horizontal' | 'vertical' } = {}
) {
  const { loop = true, orientation = 'vertical' } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentIndex = items.findIndex(item => item === document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    if (e.key === prevKey) {
      e.preventDefault();
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = loop ? items.length - 1 : 0;
    } else if (e.key === nextKey) {
      e.preventDefault();
      nextIndex = currentIndex + 1;
      if (nextIndex >= items.length) nextIndex = loop ? 0 : items.length - 1;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }

    items[nextIndex]?.focus();
  }, [items, loop, orientation]);

  useEffect(() => {
    items.forEach(item => item.addEventListener('keydown', handleKeyDown));
    return () => items.forEach(item => item.removeEventListener('keydown', handleKeyDown));
  }, [items, handleKeyDown]);
}

// Accessible loading state
interface LoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  children: ReactNode;
}

export const AccessibleLoading = memo(function AccessibleLoading({
  isLoading,
  loadingText = 'Wird geladen...',
  children
}: LoadingStateProps) {
  return (
    <div aria-busy={isLoading} aria-live="polite">
      {isLoading ? (
        <div role="status" className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="sr-only">{loadingText}</span>
          <span aria-hidden="true">{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
});

// Accessible error message
export const AccessibleError = memo(function AccessibleError({
  id,
  error,
  className
}: {
  id: string;
  error?: string;
  className?: string;
}) {
  if (!error) return null;

  return (
    <p
      id={id}
      role="alert"
      aria-live="assertive"
      className={cn('text-sm text-destructive mt-1', className)}
    >
      {error}
    </p>
  );
});

// Reduced motion preference hook
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// High contrast mode hook
export function useHighContrast(): boolean {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isHighContrast;
}

// Accessibility settings panel
interface AccessibilitySettingsProps {
  className?: string;
}

export const AccessibilitySettings = memo(function AccessibilitySettings({
  className
}: AccessibilitySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderMode: false
  });

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('umzugscheck_a11y_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        // Ignore
      }
    }
  }, []);

  // Apply settings
  useEffect(() => {
    const root = document.documentElement;

    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    localStorage.setItem('umzugscheck_a11y_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={className}
        aria-label="Barrierefreiheit-Einstellungen öffnen"
      >
        <Eye className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l shadow-xl z-50 p-6"
              role="dialog"
              aria-label="Barrierefreiheit-Einstellungen"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Barrierefreiheit</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Schliessen"
                >
                  <EyeOff className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <SettingToggle
                  icon={<Moon className="w-5 h-5" />}
                  label="Reduzierte Bewegung"
                  description="Animationen minimieren"
                  checked={settings.reducedMotion}
                  onChange={() => toggleSetting('reducedMotion')}
                />

                <SettingToggle
                  icon={<Sun className="w-5 h-5" />}
                  label="Hoher Kontrast"
                  description="Kontrast erhöhen"
                  checked={settings.highContrast}
                  onChange={() => toggleSetting('highContrast')}
                />

                <SettingToggle
                  icon={<Type className="w-5 h-5" />}
                  label="Grosse Schrift"
                  description="Schriftgrösse erhöhen"
                  checked={settings.largeText}
                  onChange={() => toggleSetting('largeText')}
                />

                <SettingToggle
                  icon={<Volume2 className="w-5 h-5" />}
                  label="Screenreader-Modus"
                  description="Optimiert für Screenreader"
                  checked={settings.screenReaderMode}
                  onChange={() => toggleSetting('screenReaderMode')}
                />
              </div>

              <div className="mt-8 pt-4 border-t">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Tastaturkürzel
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><kbd className="px-1 bg-muted rounded">Tab</kbd> Navigation</li>
                  <li><kbd className="px-1 bg-muted rounded">Enter</kbd> Auswählen</li>
                  <li><kbd className="px-1 bg-muted rounded">Esc</kbd> Schliessen</li>
                  <li><kbd className="px-1 bg-muted rounded">↑↓</kbd> Liste navigieren</li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

// Setting toggle component
const SettingToggle = memo(function SettingToggle({
  icon,
  label,
  description,
  checked,
  onChange
}: {
  icon: ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left',
        checked 
          ? 'bg-primary/10 border-primary' 
          : 'hover:bg-muted border-transparent'
      )}
      role="switch"
      aria-checked={checked}
    >
      <div className={cn(
        'p-2 rounded-lg',
        checked ? 'bg-primary text-primary-foreground' : 'bg-muted'
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className={cn(
        'w-10 h-6 rounded-full transition-colors flex items-center px-1',
        checked ? 'bg-primary justify-end' : 'bg-muted justify-start'
      )}>
        <div className="w-4 h-4 rounded-full bg-white shadow" />
      </div>
    </button>
  );
});

// CSS for accessibility modes (add to index.css)
export const accessibilityCSS = `
  .reduce-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .high-contrast {
    --foreground: 0 0% 0%;
    --background: 0 0% 100%;
    --primary: 220 100% 30%;
    --muted-foreground: 0 0% 20%;
  }

  .large-text {
    font-size: 1.125rem;
  }

  .large-text h1 { font-size: 2.5rem; }
  .large-text h2 { font-size: 2rem; }
  .large-text h3 { font-size: 1.5rem; }
`;

export default AccessibilitySettings;
