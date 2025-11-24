import { useEffect } from "react";
import { prefetchRoute } from "@/lib/performance";

export const usePrefetch = (routes: string[]) => {
  useEffect(() => {
    // Prefetch routes on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        routes.forEach(route => prefetchRoute(route));
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        routes.forEach(route => prefetchRoute(route));
      }, 1000);
    }
  }, [routes]);
};

export const usePrefetchOnHover = (route: string) => {
  const handleMouseEnter = () => {
    prefetchRoute(route);
  };

  return { onMouseEnter: handleMouseEnter };
};
