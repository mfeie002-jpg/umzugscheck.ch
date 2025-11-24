// Performance monitoring utilities

export const measurePerformance = (name: string, fn: () => void) => {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  console.log(`[Performance] ${name}: ${(endTime - startTime).toFixed(2)}ms`);
};

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry); // Replaces FID in web-vitals v4
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export const prefetchRoute = (route: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const batchUpdates = <T>(
  items: T[],
  batchSize: number,
  processFn: (batch: T[]) => void
) => {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    requestIdleCallback(() => processFn(batch));
  }
};

// Memory optimization
export const clearCache = () => {
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        if (name.includes('old') || name.includes('expired')) {
          caches.delete(name);
        }
      });
    });
  }
};

// Lazy load components
export const lazyWithPreload = (factory: () => Promise<any>) => {
  const Component = React.lazy(factory);
  (Component as any).preload = factory;
  return Component;
};

import React from 'react';
