import { useCallback, useRef } from 'react';

// Map of route to component import with correct page names
const routeComponents: Record<string, () => Promise<unknown>> = {
  '/umzugsrechner': () => import('@/pages/Calculator'),
  '/rechner': () => import('@/pages/Calculator'),
  '/umzugsofferten': () => import('@/pages/Umzugsofferten'),
  '/umzugsfirmen': () => import('@/pages/UmzugsfirmenPage'),
  '/firmen': () => import('@/pages/Companies'),
  '/ratgeber': () => import('@/pages/Blog'),
  '/fuer-firmen': () => import('@/pages/FuerFirmen'),
  '/kontakt': () => import('@/pages/Contact'),
  '/preise': () => import('@/pages/Pricing'),
  '/anbieter-werden': () => import('@/pages/BecomeProvider'),
};

export const usePreloadRoute = () => {
  const preloadedRoutes = useRef<Set<string>>(new Set());

  const preloadRoute = useCallback((path: string) => {
    // Normalize path
    const normalizedPath = path.split('?')[0].split('#')[0];
    
    // Skip if already preloaded
    if (preloadedRoutes.current.has(normalizedPath)) {
      return;
    }

    const componentLoader = routeComponents[normalizedPath];
    if (componentLoader) {
      preloadedRoutes.current.add(normalizedPath);
      componentLoader().catch(() => {
        // Remove from preloaded if failed
        preloadedRoutes.current.delete(normalizedPath);
      });
    }
  }, []);

  const preloadOnHover = useCallback((path: string) => {
    // Use requestIdleCallback for non-blocking preload
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => preloadRoute(path), { timeout: 2000 });
    } else {
      setTimeout(() => preloadRoute(path), 100);
    }
  }, [preloadRoute]);

  return { preloadRoute, preloadOnHover };
};

// HOC to add preload on hover to links
export const withPreload = <P extends { to?: string; href?: string }>(
  Component: React.ComponentType<P>
) => {
  return function PreloadableLink(props: P) {
    const { preloadOnHover } = usePreloadRoute();
    const path = props.to || props.href || '';

    return (
      <Component
        {...props}
        onMouseEnter={() => preloadOnHover(path)}
        onFocus={() => preloadOnHover(path)}
      />
    );
  };
};
