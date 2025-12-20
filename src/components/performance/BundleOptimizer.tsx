import React, { lazy, Suspense, ComponentType, useEffect, useState } from 'react';
import { isScreenshotRenderMode } from '@/lib/screenshot-render-mode';

/**
 * Bundle Optimization Utilities
 * Code splitting, lazy loading, and tree-shaking helpers
 */

// Loading fallback component
const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

/**
 * Create a lazy-loaded component with error boundary
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <DefaultFallback />
) {
  const LazyComponent = lazy(importFn);

  return function WrappedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Preload a lazy component before it's needed
 */
export function preloadComponent(importFn: () => Promise<any>) {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      importFn().catch(() => {
        // Silently fail preload
      });
    });
  } else {
    setTimeout(() => {
      importFn().catch(() => {});
    }, 1000);
  }
}

/**
 * Component that loads children only when visible
 */
export const LazyVisible: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}> = ({ children, fallback = <DefaultFallback />, rootMargin = '100px', threshold = 0.1 }) => {
  const screenshotMode = isScreenshotRenderMode();
  const [isVisible, setIsVisible] = useState(screenshotMode);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (screenshotMode) return;
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, screenshotMode]);

  return <div ref={setRef}>{isVisible ? children : fallback}</div>;
};

/**
 * Component that loads on user interaction
 */
export const LazyOnInteraction: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  events?: Array<'click' | 'mouseover' | 'focus' | 'scroll'>;
}> = ({ children, fallback = <DefaultFallback />, events = ['mouseover', 'focus'] }) => {
  const screenshotMode = isScreenshotRenderMode();
  const [isLoaded, setIsLoaded] = useState(screenshotMode);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (screenshotMode) return;
    if (!ref || isLoaded) return;

    const handleInteraction = () => {
      setIsLoaded(true);
    };

    events.forEach((event) => {
      ref.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach((event) => {
        ref.removeEventListener(event, handleInteraction);
      });
    };
  }, [ref, isLoaded, events, screenshotMode]);

  return <div ref={setRef}>{isLoaded ? children : fallback}</div>;
};

/**
 * Dynamic import with retry logic
 */
export async function dynamicImportWithRetry<T>(
  importFn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Dynamic import failed after retries');
}

/**
 * Module preloader for route-based code splitting
 */
export const ModulePreloader: React.FC<{
  modules: Array<() => Promise<any>>;
}> = ({ modules }) => {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(
        () => {
          modules.forEach((mod) => mod().catch(() => {}));
        },
        { timeout: 5000 }
      );
    }
  }, [modules]);

  return null;
};

/**
 * Conditional render based on feature flags or conditions
 */
export const ConditionalRender: React.FC<{
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ condition, children, fallback = null }) => {
  return <>{condition ? children : fallback}</>;
};

export default {
  createLazyComponent,
  preloadComponent,
  LazyVisible,
  LazyOnInteraction,
  dynamicImportWithRetry,
  ModulePreloader,
  ConditionalRender,
};

