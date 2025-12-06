import { useState, useEffect, ReactNode } from 'react';

interface DeferredContentProps {
  children: ReactNode;
  delay?: number;
  fallback?: ReactNode;
}

// Defer non-critical content rendering
export const DeferredContent = ({
  children,
  delay = 0,
  fallback = null
}: DeferredContentProps) => {
  const [shouldRender, setShouldRender] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;

    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Idle callback for low-priority rendering
export const IdleContent = ({
  children,
  fallback = null
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => {
        setShouldRender(true);
      });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for Safari
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
