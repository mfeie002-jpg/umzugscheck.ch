import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';

interface SmartLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  preloadOnHover?: boolean;
  preloadOnVisible?: boolean;
  rootMargin?: string;
  threshold?: number;
}

// Smart component loader with preloading strategies
export const SmartBundleLoader: React.FC<SmartLoaderProps> = ({
  children,
  fallback = <LoadingSkeleton />,
  preloadOnHover = true,
  preloadOnVisible = true,
  rootMargin = '200px',
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for visibility-based loading
  useEffect(() => {
    if (!preloadOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [preloadOnVisible, rootMargin, threshold]);

  // Hover-based preloading
  const handleMouseEnter = useCallback(() => {
    if (preloadOnHover && !isPreloaded) {
      setIsPreloaded(true);
      setIsVisible(true);
    }
  }, [preloadOnHover, isPreloaded]);

  if (!isVisible && preloadOnVisible) {
    return (
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        className="min-h-[100px]"
      >
        {fallback}
      </div>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <div onMouseEnter={handleMouseEnter}>{children}</div>
    </Suspense>
  );
};

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-4 bg-muted rounded w-3/4" />
    <div className="h-4 bg-muted rounded w-1/2" />
    <div className="h-4 bg-muted rounded w-5/6" />
  </div>
);

// Route preloader for navigation
export const useRoutePreloader = () => {
  const preloadedRoutes = useRef(new Set<string>());

  const preloadRoute = useCallback((route: string) => {
    if (preloadedRoutes.current.has(route)) return;

    // Dynamic import based on route
    const routeImports: Record<string, () => Promise<unknown>> = {
      '/umzugsrechner': () => import('@/pages/Calculator'),
      '/umzugsofferten': () => import('@/pages/Umzugsofferten'),
      '/umzugsfirmen': () => import('@/pages/UmzugsfirmenPage'),
      '/ratgeber': () => import('@/pages/Blog'),
      '/contact': () => import('@/pages/Contact'),
    };

    const importFn = routeImports[route];
    if (importFn) {
      preloadedRoutes.current.add(route);
      importFn().catch(() => {
        // Failed to preload, remove from set to allow retry
        preloadedRoutes.current.delete(route);
      });
    }
  }, []);

  const preloadOnHover = useCallback(
    (route: string) => ({
      onMouseEnter: () => preloadRoute(route),
      onFocus: () => preloadRoute(route),
    }),
    [preloadRoute]
  );

  return { preloadRoute, preloadOnHover };
};

// Network-aware bundle loading
export const useNetworkAwareLoading = () => {
  const [connectionType, setConnectionType] = useState<'fast' | 'slow' | 'offline'>('fast');

  useEffect(() => {
    const updateConnection = () => {
      const connection = (navigator as Navigator & {
        connection?: {
          effectiveType?: string;
          saveData?: boolean;
          downlink?: number;
        };
      }).connection;

      if (!navigator.onLine) {
        setConnectionType('offline');
        return;
      }

      if (connection?.saveData) {
        setConnectionType('slow');
        return;
      }

      const effectiveType = connection?.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
        setConnectionType('slow');
        return;
      }

      // Check downlink speed
      const downlink = connection?.downlink;
      if (downlink && downlink < 1.5) {
        setConnectionType('slow');
        return;
      }

      setConnectionType('fast');
    };

    updateConnection();

    const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
    connection?.addEventListener('change', updateConnection);
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);

    return () => {
      connection?.removeEventListener('change', updateConnection);
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
    };
  }, []);

  return {
    connectionType,
    shouldPreload: connectionType === 'fast',
    shouldLazyLoad: connectionType !== 'fast',
    isOffline: connectionType === 'offline',
  };
};

// Critical path component - loads immediately
export const CriticalComponent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);

// Deferred component - loads after critical path
export const DeferredComponent: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fallback?: React.ReactNode;
}> = ({ children, delay = 0, fallback = <LoadingSkeleton /> }) => {
  const [shouldRender, setShouldRender] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldRender(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
};

// Idle-time component loader
export const IdleLoadComponent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  timeout?: number;
}> = ({ children, fallback = null, timeout = 2000 }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(
        () => setShouldRender(true),
        { timeout }
      );
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setShouldRender(true), 50);
      return () => clearTimeout(timer);
    }
  }, [timeout]);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default SmartBundleLoader;
