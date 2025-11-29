/**
 * Performance Optimization Utilities
 * Comprehensive utilities for Core Web Vitals optimization
 */

// Image lazy loading with IntersectionObserver
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach((img) => {
      imageObserver.observe(img);
    });
  }
};

// Preload critical resources
export const preloadCriticalAssets = () => {
  // Preload critical fonts
  const fonts = [
    '/fonts/inter-var.woff2',
  ];

  fonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = font;
    document.head.appendChild(link);
  });
};

// Measure and report Core Web Vitals
export const measureCoreWebVitals = () => {
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        console.log('[LCP]', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.error('LCP measurement failed', e);
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          console.log('[FID]', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.error('FID measurement failed', e);
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('[CLS]', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.error('CLS measurement failed', e);
    }
  }
};

// Defer non-critical JavaScript
export const deferNonCriticalJS = () => {
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    newScript.src = script.getAttribute('src') || '';
    newScript.defer = true;
    document.body.appendChild(newScript);
    script.remove();
  });
};

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      lazyLoadImages();
      preloadCriticalAssets();
      if (process.env.NODE_ENV === 'development') {
        measureCoreWebVitals();
      }
    });
  } else {
    lazyLoadImages();
    preloadCriticalAssets();
    if (process.env.NODE_ENV === 'development') {
      measureCoreWebVitals();
    }
  }
};

// Export for use in components
export default {
  lazyLoadImages,
  preloadCriticalAssets,
  measureCoreWebVitals,
  deferNonCriticalJS,
  initPerformanceOptimizations,
};
