import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface OptimizedSectionProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ReactNode;
  animateOnView?: boolean;
}

/**
 * Optimized section wrapper that:
 * - Lazy loads content when near viewport
 * - Applies scroll-triggered animations
 * - Reduces initial page load
 */
export function OptimizedSection({
  children,
  className,
  threshold = 0.1,
  rootMargin = '200px',
  fallback,
  animateOnView = true,
}: OptimizedSectionProps) {
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const defaultFallback = (
    <div className="h-64 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <section
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        animateOnView && !isIntersecting && 'opacity-0 translate-y-8',
        animateOnView && isIntersecting && 'opacity-100 translate-y-0',
        className
      )}
    >
      {isIntersecting ? children : (fallback || defaultFallback)}
    </section>
  );
}

/**
 * Simple lazy load wrapper component (without HOC complexity)
 */
interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

export function LazyLoadWrapper({ 
  children, 
  fallback,
  rootMargin = '100px' 
}: LazyLoadWrapperProps) {
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    triggerOnce: true,
  });

  const defaultFallback = (
    <div className="h-48 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div ref={ref}>
      {isIntersecting ? children : (fallback || defaultFallback)}
    </div>
  );
}

/**
 * Skeleton loader component
 */
export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4 p-6', className)}>
      <div className="h-8 w-1/3 skeleton rounded-lg" />
      <div className="h-4 w-2/3 skeleton rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 skeleton rounded-xl" />
        ))}
      </div>
    </div>
  );
}
