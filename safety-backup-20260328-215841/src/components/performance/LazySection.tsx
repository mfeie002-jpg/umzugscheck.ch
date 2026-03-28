/**
 * LazySection Component
 * 
 * Optimized lazy loading wrapper with Intersection Observer
 * Only loads content when approaching viewport
 * Prevents layout shift with fixed-height placeholders
 */

import { ReactNode, useState, useEffect, useRef, memo, Suspense, ComponentType } from "react";
import { cn } from "@/lib/utils";

interface LazySectionProps {
  children: ReactNode;
  height?: string;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  fallback?: ReactNode;
  id?: string;
}

// Default skeleton with spinner
const DefaultSkeleton = ({ height = "400px" }: { height?: string }) => (
  <div 
    className="w-full flex items-center justify-center bg-muted/5"
    style={{ minHeight: height }}
  >
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export const LazySection = memo(function LazySection({
  children,
  height = "400px",
  className,
  rootMargin = "200px",
  threshold = 0.1,
  fallback,
  id
}: LazySectionProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      setHasLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div 
      ref={ref} 
      id={id}
      className={cn("w-full", className)}
      style={{ minHeight: !hasLoaded ? height : undefined }}
    >
      {isIntersecting ? (
        <Suspense fallback={fallback || <DefaultSkeleton height={height} />}>
          {children}
        </Suspense>
      ) : (
        fallback || <DefaultSkeleton height={height} />
      )}
    </div>
  );
});

// Higher-order component for wrapping lazy components
export function withLazyLoad<P extends object>(
  Component: ComponentType<P>,
  options: Omit<LazySectionProps, 'children'> = {}
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <LazySection {...options}>
        <Component {...props} />
      </LazySection>
    );
  };
}

export default LazySection;
