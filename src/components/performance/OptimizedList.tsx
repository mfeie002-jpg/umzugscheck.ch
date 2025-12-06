import React, { useMemo, useCallback, memo, useState, useRef } from 'react';

interface VirtualItem {
  index: number;
  offsetTop: number;
}

interface UseVirtualScrollResult {
  virtualItems: VirtualItem[];
  totalHeight: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const useVirtualScrollInternal = (options: {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}): UseVirtualScrollResult => {
  const { itemCount, itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(itemCount, startIndex + visibleCount + overscan * 2);

  const virtualItems: VirtualItem[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    virtualItems.push({
      index: i,
      offsetTop: i * itemHeight,
    });
  }

  const totalHeight = itemCount * itemHeight;

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    virtualItems,
    totalHeight,
    containerRef,
  };
};

interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  className?: string;
  emptyMessage?: string;
}

function OptimizedListInner<T>({
  items,
  renderItem,
  keyExtractor,
  itemHeight,
  containerHeight,
  overscan = 3,
  className,
  emptyMessage = 'Keine Einträge',
}: OptimizedListProps<T>) {
  const {
    virtualItems,
    totalHeight,
    containerRef,
  } = useVirtualScrollInternal({
    itemCount: items.length,
    itemHeight,
    containerHeight,
    overscan,
  });

  const renderedItems = useMemo(() => 
    virtualItems.map(({ index, offsetTop }) => {
      const item = items[index];
      const key = keyExtractor(item, index);
      
      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: itemHeight,
            transform: `translateY(${offsetTop}px)`,
          }}
        >
          {renderItem(item, index)}
        </div>
      );
    }),
    [virtualItems, items, keyExtractor, renderItem, itemHeight]
  );

  if (items.length === 0) {
    return (
      <div className={className}>
        <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ 
        height: containerHeight, 
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {renderedItems}
      </div>
    </div>
  );
}

export const OptimizedList = memo(OptimizedListInner) as typeof OptimizedListInner;

interface WindowedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  windowSize?: number;
  className?: string;
}

export function WindowedList<T>({
  items,
  renderItem,
  keyExtractor,
  windowSize = 20,
  className,
}: WindowedListProps<T>) {
  const [visibleCount, setVisibleCount] = React.useState(windowSize);

  const showMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + windowSize, items.length));
  }, [windowSize, items.length]);

  const visibleItems = useMemo(() => 
    items.slice(0, visibleCount),
    [items, visibleCount]
  );

  return (
    <div className={className}>
      {visibleItems.map((item, index) => (
        <div key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </div>
      ))}
      
      {visibleCount < items.length && (
        <button
          onClick={showMore}
          className="w-full py-3 text-center text-primary hover:underline"
        >
          Mehr anzeigen ({items.length - visibleCount} weitere)
        </button>
      )}
    </div>
  );
}
