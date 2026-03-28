import { Suspense, lazy, ComponentType, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Create lazy component with custom loading - simplified version
export function createLazyComponent(
  loader: () => Promise<{ default: ComponentType<unknown> }>,
  fallback?: ReactNode
) {
  const LazyComp = lazy(loader);
  
  return function LazyWrapper(props: Record<string, unknown>) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComp {...props} />
      </Suspense>
    );
  };
}

const DefaultFallback = () => (
  <div className="w-full py-12 px-4">
    <div className="max-w-7xl mx-auto space-y-4">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-4 w-96 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  </div>
);

// Preload component for route prefetching
export const preloadComponent = (loader: () => Promise<{ default: ComponentType<unknown> }>) => {
  loader();
};
