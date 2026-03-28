import { useEffect } from 'react';

// Preload critical resources
export const preloadResource = (href: string, as: 'script' | 'style' | 'image' | 'font') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
};

// Prefetch resources for next navigation
export const prefetchResource = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

// DNS prefetch for external domains
export const dnsPrefetch = (domain: string) => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
};

// Preconnect to external domains
export const preconnect = (domain: string, crossOrigin: boolean = false) => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  if (crossOrigin) {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
};

// Add critical CSS inline
const injectCriticalCSS = () => {
  const criticalStyles = `
    /* Critical above-the-fold styles */
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    .container { width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 1rem; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
    /* Prevent layout shift for header */
    header { min-height: 64px; }
    /* Hero section skeleton */
    .hero-skeleton { min-height: 60vh; background: linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--background))); }
  `;
  
  const existingStyle = document.getElementById('critical-css');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = criticalStyles;
    document.head.insertBefore(style, document.head.firstChild);
  }
};

// Optimize images with native lazy loading support detection
export const supportsNativeLazyLoading = () => {
  return 'loading' in HTMLImageElement.prototype;
};

// Add fetchpriority for LCP images
export const prioritizeImage = (img: HTMLImageElement) => {
  img.setAttribute('fetchpriority', 'high');
  img.setAttribute('decoding', 'async');
};

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Inject critical CSS immediately
    injectCriticalCSS();
    
    // Preconnect to common resources
    preconnect('https://fonts.googleapis.com');
    preconnect('https://fonts.gstatic.com', true);
    
    // DNS prefetch for analytics and external services
    dnsPrefetch('https://www.google-analytics.com');
    dnsPrefetch('https://www.googletagmanager.com');
    dnsPrefetch('https://wa.me');
    
// Prefetch likely navigation targets on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        prefetchResource('/plan');
        prefetchResource('/contact');
        prefetchResource('/calculator');
        prefetchResource('/area/zurich');
        prefetchResource('/plan/moebellift');
      }, { timeout: 3000 });
    }
    
    // Add WebP support detection
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };
    
    // Add class to html element for CSS-based image format selection
    if (supportsWebP()) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
    
    // Optimize LCP by preloading hero images
    const heroImages = document.querySelectorAll('img[data-hero="true"]');
    heroImages.forEach(img => {
      if (img instanceof HTMLImageElement) {
        prioritizeImage(img);
      }
    });
    
    // Add resource hints for fonts
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Preload key fonts
        const fontUrls = [
          'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ];
        fontUrls.forEach(url => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = url;
          link.as = 'style';
          document.head.appendChild(link);
        });
      }, { timeout: 2000 });
    }
  }, []);

  return null;
};

export default PerformanceOptimizer;
