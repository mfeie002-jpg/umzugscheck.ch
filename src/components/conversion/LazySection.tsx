/**
 * LazySection - Performance optimization wrapper
 * Step 5.8 - Page Speed Optimization with lazy loading
 */
import { memo, ReactNode, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  minHeight?: string;
}

export const LazySection = memo(function LazySection({
  children,
  className,
  placeholder,
  rootMargin = '200px',
  threshold = 0.01,
  minHeight = '200px',
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{ minHeight: hasLoaded ? 'auto' : minHeight }}
    >
      {isVisible ? (
        children
      ) : (
        placeholder || (
          <div 
            className="animate-pulse bg-muted/50 rounded-lg w-full"
            style={{ minHeight }}
          />
        )
      )}
    </div>
  );
});

// Skeleton components for common placeholders
export const TestimonialSkeleton = () => (
  <div className="animate-pulse space-y-4 p-6 bg-card rounded-xl border">
    <div className="h-4 bg-muted rounded w-1/4" />
    <div className="h-3 bg-muted rounded w-full" />
    <div className="h-3 bg-muted rounded w-3/4" />
    <div className="flex items-center gap-3 pt-4">
      <div className="w-10 h-10 bg-muted rounded-full" />
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-20" />
        <div className="h-2 bg-muted rounded w-16" />
      </div>
    </div>
  </div>
);

export const CompanyCardSkeleton = () => (
  <div className="animate-pulse p-4 bg-card rounded-xl border">
    <div className="flex gap-4">
      <div className="w-16 h-16 bg-muted rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-3/4" />
      </div>
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="animate-pulse grid grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="text-center space-y-2">
        <div className="h-8 bg-muted rounded w-16 mx-auto" />
        <div className="h-3 bg-muted rounded w-20 mx-auto" />
      </div>
    ))}
  </div>
);
