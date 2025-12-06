import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading?: boolean;
  threshold?: number;
  className?: string;
  itemClassName?: string;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  isLoading = false,
  threshold = 200,
  className,
  itemClassName,
  loadingComponent,
  emptyComponent
}: InfiniteScrollProps<T>) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      await loadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [loadMore, hasMore, isLoading, isLoadingMore]);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [handleLoadMore, threshold]);

  if (items.length === 0 && !isLoading) {
    return <>{emptyComponent}</>;
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
      
      <div ref={loaderRef}>
        {(isLoading || isLoadingMore) && (
          loadingComponent || (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
