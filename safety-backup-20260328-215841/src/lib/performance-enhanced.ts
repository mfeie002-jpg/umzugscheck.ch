// Enhanced performance utilities for site-wide optimization

// Critical resource hints for faster loading
export const criticalResources = {
  fonts: [
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2'
  ],
  images: [
    '/assets/hero-family-moving-kOahVO_A.jpg'
  ],
  scripts: [],
  styles: []
};

// Generate preconnect hints
export function generatePreconnectHints(): string[] {
  return [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.unsplash.com',
    'https://twpyrbhqsfwtoyudkfss.supabase.co'
  ];
}

// Lazy load images with intersection observer
export function createImageObserver(callback?: (entry: IntersectionObserverEntry) => void) {
  if (typeof window === 'undefined') return null;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          callback?.(entry);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01
    }
  );
}

// Defer non-critical JavaScript
export function deferScript(src: string, async = true): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Preload critical assets
export function preloadCriticalAssets(assets: { href: string; as: string; type?: string }[]) {
  assets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset.href;
    link.as = asset.as;
    if (asset.type) {
      link.type = asset.type;
    }
    document.head.appendChild(link);
  });
}

// Optimize images for different screen sizes
export function getOptimizedImageSrc(
  src: string,
  width: number,
  quality = 80
): string {
  // If using a CDN that supports image optimization
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('fm', 'webp');
    url.searchParams.set('auto', 'format');
    return url.toString();
  }
  return src;
}

// Generate srcset for responsive images
export function generateSrcSet(
  src: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
  return widths
    .map(w => `${getOptimizedImageSrc(src, w)} ${w}w`)
    .join(', ');
}

// Measure and report Core Web Vitals
export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

export function reportWebVitals(metric: WebVitalsMetric) {
  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.rating,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true
    });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`);
  }
}

// Debounce function for scroll/resize handlers
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for frequent updates
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Request idle callback polyfill
export function requestIdleCallbackPolyfill(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return (window as Window & { requestIdleCallback: typeof requestIdleCallback }).requestIdleCallback(callback, options);
  }
  
  if (typeof window === 'undefined') return 0;
  
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    });
  }, 1) as unknown as number;
}

// Cancel idle callback polyfill
export function cancelIdleCallbackPolyfill(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

// Measure component render time
export function measureRenderTime(componentName: string): {
  start: () => void;
  end: () => void;
} {
  let startTime: number;
  
  return {
    start: () => {
      startTime = performance.now();
    },
    end: () => {
      const duration = performance.now() - startTime;
      if (process.env.NODE_ENV === 'development' && duration > 16) {
        console.warn(`[Performance] ${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    }
  };
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Check connection quality
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
  
  if (!connection) return 'unknown';
  
  const effectiveType = connection.effectiveType;
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
  if (effectiveType === '3g') return 'medium';
  if (effectiveType === '4g') return 'fast';
  
  return 'unknown';
}

// Adaptive loading based on device capability
export function shouldLoadHeavyAssets(): boolean {
  const connection = getConnectionQuality();
  const reducedMotion = prefersReducedMotion();
  const lowMemory = typeof navigator !== 'undefined' && (navigator as any).deviceMemory < 4;
  
  if (connection === 'slow' || reducedMotion || lowMemory) {
    return false;
  }
  
  return true;
}
