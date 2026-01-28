import { useEffect } from 'react';

/**
 * Critical CSS component - inlines critical styles for faster FCP
 * Also handles resource prioritization for mobile performance
 */
const CriticalCSS = () => {
  useEffect(() => {
    // Preload critical route chunks
    const preloadCriticalRoutes = () => {
      const criticalRoutes = ['/', '/contact', '/services'];
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        link.as = 'document';
        document.head.appendChild(link);
      });
    };

    // Defer non-critical resources
    const deferNonCritical = () => {
      // Mark performance timing
      if (window.performance && window.performance.mark) {
        window.performance.mark('critical-css-loaded');
      }
    };

    // Use requestIdleCallback for non-critical work
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadCriticalRoutes, { timeout: 2000 });
      (window as any).requestIdleCallback(deferNonCritical, { timeout: 1000 });
    } else {
      setTimeout(preloadCriticalRoutes, 1000);
      setTimeout(deferNonCritical, 500);
    }
  }, []);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for above-the-fold content - optimized for mobile */
          :root {
            --background: 0 0% 100%;
            --foreground: 220 20% 15%;
            --primary: 220 55% 22%;
            --primary-foreground: 0 0% 100%;
            --alpine: 200 80% 42%;
            --warm: 28 75% 50%;
          }
          
          /* Optimize rendering */
          html {
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
            scroll-behavior: smooth;
          }
          
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
          
          /* Prevent layout shift */
          img, video, iframe {
            max-width: 100%;
            height: auto;
          }
          
          /* Critical container */
          .container {
            width: 100%;
            max-width: 1280px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          @media (min-width: 640px) {
            .container { padding-left: 1.5rem; padding-right: 1.5rem; }
          }
          
          /* Header critical styles */
          header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background: hsl(var(--background) / 0.95);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          
          /* Mobile bottom nav placeholder to prevent layout shift */
          @media (max-width: 767px) {
            body { padding-bottom: 72px; }
          }
          
          /* Font loading optimization */
          @font-face {
            font-family: 'Inter';
            font-display: swap;
            src: local('Inter');
          }
          
          @font-face {
            font-family: 'Playfair Display';
            font-display: swap;
            src: local('Playfair Display');
          }
          
          /* Reduce CLS for common elements */
          .min-h-screen { min-height: 100vh; min-height: 100dvh; }
          
          /* Touch optimization */
          button, a, [role="button"] {
            touch-action: manipulation;
          }
          
          /* GPU acceleration for animations */
          .animate-fade-in, .animate-slide-in {
            will-change: opacity, transform;
          }
          
          /* Hide content flash during hydration */
          .loading-hidden { visibility: hidden; }
          
          /* Skeleton loading state */
          .skeleton {
            background: linear-gradient(90deg, hsl(var(--background)) 0%, hsl(220 10% 96%) 50%, hsl(var(--background)) 100%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s ease-in-out infinite;
          }
          
          @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `
      }}
    />
  );
};

export default CriticalCSS;
