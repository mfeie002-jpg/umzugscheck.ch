/**
 * LazySection - Wrapper for lazy loading page sections
 * Uses Intersection Observer to defer rendering of below-fold content
 */

import { ReactNode, memo, Suspense } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  className?: string;
}

const DefaultFallback = ({ minHeight }: { minHeight: string }) => (
  <div className="w-full animate-pulse" style={{ minHeight }}>
    <div className="container mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-4 w-96 mx-auto" />
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  </div>
);

export const LazySection = memo(({
  children,
  fallback,
  rootMargin = "200px",
  minHeight = "300px",
  className,
}: LazySectionProps) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    freezeOnceVisible: true,
  });

  return (
    <div ref={ref} className={className} style={{ minHeight: isVisible ? undefined : minHeight }}>
      {isVisible ? (
        <Suspense fallback={fallback || <DefaultFallback minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        fallback || <DefaultFallback minHeight={minHeight} />
      )}
    </div>
  );
});

LazySection.displayName = "LazySection";
