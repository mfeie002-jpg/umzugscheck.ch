import React, { memo, useRef, useEffect, useState } from 'react';

// Prevents re-renders when props haven't meaningfully changed
export function shallowEqual(objA: unknown, objB: unknown): boolean {
  if (Object.is(objA, objB)) return true;
  
  if (
    typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA as object);
  const keysB = Object.keys(objB as object);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !Object.is((objA as Record<string, unknown>)[key], (objB as Record<string, unknown>)[key])
    ) {
      return false;
    }
  }

  return true;
}

// HOC for optimized rendering with deep comparison
export function withOptimizedRender<P extends object>(
  Component: React.ComponentType<P>,
  compareProps?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, compareProps || shallowEqual);
}

// Render only when visible in viewport
interface RenderWhenVisibleProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  once?: boolean;
}

export const RenderWhenVisible: React.FC<RenderWhenVisibleProps> = ({
  children,
  placeholder = <div className="min-h-[100px] animate-pulse bg-muted rounded" />,
  rootMargin = '100px',
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [rootMargin, once]);

  return (
    <div ref={ref}>
      {isVisible ? children : placeholder}
    </div>
  );
};

// Batch state updates for better performance
export function useBatchedState<T extends object>(initialState: T) {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const rafRef = useRef<number | null>(null);

  const batchUpdate = (updates: Partial<T>) => {
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setState(prev => ({ ...prev, ...pendingUpdates.current }));
        pendingUpdates.current = {};
        rafRef.current = null;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return [state, batchUpdate] as const;
}

// Measure render performance in dev mode
export const RenderProfiler: React.FC<{
  id: string;
  children: React.ReactNode;
  onRender?: (duration: number) => void;
}> = ({ id, children, onRender }) => {
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  return (
    <React.Profiler
      id={id}
      onRender={(_, phase, actualDuration) => {
        if (actualDuration > 16) {
          console.warn(`[RenderProfiler] ${id} took ${actualDuration.toFixed(2)}ms (${phase})`);
        }
        onRender?.(actualDuration);
      }}
    >
      {children}
    </React.Profiler>
  );
};
