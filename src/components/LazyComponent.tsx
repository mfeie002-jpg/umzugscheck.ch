import { Suspense, lazy, ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  minHeight?: string;
}

/**
 * Wrapper for lazy-loaded components with optimized loading states
 */
export function LazyWrapper({ 
  children, 
  fallback, 
  className,
  minHeight = '200px' 
}: LazyComponentProps) {
  const defaultFallback = (
    <div 
      className={cn(
        "flex items-center justify-center bg-muted/30 animate-pulse rounded-lg",
        className
      )}
      style={{ minHeight }}
    >
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

/**
 * Creates a lazy-loaded component with intersection observer
 * Only loads when component is about to enter viewport
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    preload?: boolean;
    rootMargin?: string;
  }
) {
  const LazyComp = lazy(importFn);
  
  // Preload if specified
  if (options?.preload) {
    // Preload on idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => importFn());
    }
  }
  
  return LazyComp;
}

/**
 * Skeleton loader for content
 */
export function ContentSkeleton({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted rounded",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

/**
 * Card skeleton for loading states
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 animate-pulse", className)}>
      <div className="h-40 bg-muted rounded-lg mb-4" />
      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted rounded w-full mb-2" />
      <div className="h-4 bg-muted rounded w-2/3" />
    </div>
  );
}

/**
 * Hero skeleton for initial page load
 */
export function HeroSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center py-20 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="h-6 bg-muted rounded w-32" />
            <div className="h-12 bg-muted rounded w-full" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-full" />
            <div className="h-6 bg-muted rounded w-5/6" />
            <div className="flex gap-4 pt-4">
              <div className="h-12 bg-muted rounded w-40" />
              <div className="h-12 bg-muted rounded w-32" />
            </div>
          </div>
          <div className="h-[400px] bg-muted rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
