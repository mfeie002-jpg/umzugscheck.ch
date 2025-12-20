import React, { useState, useEffect, useRef, memo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { isScreenshotRenderMode } from '@/lib/screenshot-render-mode';

interface DeferredContentProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
  triggerOnInteraction?: boolean;
  triggerOnScroll?: boolean;
  rootMargin?: string;
  className?: string;
}

/**
 * DeferredContent - Delays rendering of children until conditions are met
 * Useful for below-the-fold content, heavy components, or third-party widgets
 */
export const DeferredContent = memo<DeferredContentProps>(({
  children,
  fallback = null,
  delay = 0,
  triggerOnInteraction = false,
  triggerOnScroll = true,
  rootMargin = '200px',
  className,
}) => {
  const screenshotMode = isScreenshotRenderMode();

  const [shouldRender, setShouldRender] = useState(screenshotMode);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  const triggerRender = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    // In screenshot mode we must render immediately (no IO / delays)
    if (screenshotMode) {
      setShouldRender(true);
      return;
    }

    if (delay > 0) {
      setTimeout(() => setShouldRender(true), delay);
    } else {
      setShouldRender(true);
    }
  };

  // Intersection Observer for scroll-based triggering
  useEffect(() => {
    if (screenshotMode) return;
    if (!triggerOnScroll || shouldRender) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerRender();
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [triggerOnScroll, shouldRender, rootMargin, screenshotMode]);

  // User interaction triggering
  useEffect(() => {
    if (screenshotMode) return;
    if (!triggerOnInteraction || shouldRender) return;

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    const handleInteraction = () => {
      triggerRender();
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };

    events.forEach((event) => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [triggerOnInteraction, shouldRender, screenshotMode]);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
});

DeferredContent.displayName = 'DeferredContent';

/**
 * IdleContent - Renders content when browser is idle
 */
export const IdleContent: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  timeout?: number;
}> = memo(({ children, fallback = null, timeout = 2000 }) => {
  const screenshotMode = isScreenshotRenderMode();
  const [shouldRender, setShouldRender] = useState(screenshotMode);

  useEffect(() => {
    if (screenshotMode) return;

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setShouldRender(true), { timeout });
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setShouldRender(true), 100);
      return () => clearTimeout(timer);
    }
  }, [timeout, screenshotMode]);

  return <>{shouldRender ? children : fallback}</>;
});

IdleContent.displayName = 'IdleContent';

/**
 * AfterHydration - Renders content only after React hydration is complete
 */
export const AfterHydration: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = memo(({ children, fallback = null }) => {
  const screenshotMode = isScreenshotRenderMode();
  const [hydrated, setHydrated] = useState(screenshotMode);

  useEffect(() => {
    if (screenshotMode) return;
    setHydrated(true);
  }, [screenshotMode]);

  return <>{hydrated ? children : fallback}</>;
});

AfterHydration.displayName = 'AfterHydration';

/**
 * Skeleton loader component
 */
export const SkeletonLoader: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}> = memo(({ width = '100%', height = '20px', className, rounded = false }) => (
  <div
    className={cn('animate-pulse bg-muted', rounded ? 'rounded-full' : 'rounded', className)}
    style={{ width, height }}
  />
));

SkeletonLoader.displayName = 'SkeletonLoader';

/**
 * Intersection trigger hook for manual control
 */
export const useIntersectionTrigger = (options?: IntersectionObserverInit) => {
  const screenshotMode = isScreenshotRenderMode();

  const [isIntersecting, setIsIntersecting] = useState(screenshotMode);
  const [hasIntersected, setHasIntersected] = useState(screenshotMode);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (screenshotMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasIntersected, options, screenshotMode]);

  return { ref, isIntersecting, hasIntersected };
};

