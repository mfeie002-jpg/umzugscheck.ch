import { Suspense, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyLoadProps {
  fallback?: ReactNode;
  children: ReactNode;
}

export const LazyLoad = ({ fallback, children }: LazyLoadProps) => {
  const defaultFallback = (
    <div className="w-full h-32 flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default LazyLoad;
