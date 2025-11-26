/**
 * Performance Optimization Utilities for Core Web Vitals
 */

/**
 * Preload critical images for LCP optimization
 */
export const preloadImage = (src: string, as: 'image' = 'image') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
};

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImage = (element: HTMLImageElement) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;
          
          if (src) img.src = src;
          if (srcset) img.srcset = srcset;
          
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    observer.observe(element);
  } else {
    // Fallback for browsers without Intersection Observer
    const src = element.dataset.src;
    const srcset = element.dataset.srcset;
    if (src) element.src = src;
    if (srcset) element.srcset = srcset;
  }
};

/**
 * Generate responsive image srcset
 */
export const generateSrcSet = (baseUrl: string, widths: number[] = [400, 800, 1200, 1600]) => {
  return widths.map(width => {
    // Assuming image CDN that supports width parameter
    const url = baseUrl.includes('?') 
      ? `${baseUrl}&w=${width}` 
      : `${baseUrl}?w=${width}`;
    return `${url} ${width}w`;
  }).join(', ');
};

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll events
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Measure Core Web Vitals
 */
export const measureCoreWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  try {
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP measurement not supported');
  }

  // First Input Delay (FID)
  try {
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    po.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID measurement not supported');
  }

  // Cumulative Layout Shift (CLS)
  try {
    let clsScore = 0;
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          console.log('CLS:', clsScore);
        }
      });
    });
    po.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    console.warn('CLS measurement not supported');
  }
};

/**
 * Preconnect to external domains
 */
export const preconnect = (url: string) => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * Prefetch DNS for external domains
 */
export const dnsPrefetch = (url: string) => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Initialize performance optimizations
 */
export const initPerformanceOptimizations = () => {
  // Preconnect to common external domains
  preconnect('https://images.unsplash.com');
  preconnect('https://fonts.googleapis.com');
  
  // DNS prefetch
  dnsPrefetch('https://www.google-analytics.com');
  
  // Measure Core Web Vitals in development
  if (process.env.NODE_ENV === 'development') {
    measureCoreWebVitals();
  }
};
