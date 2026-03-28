import React, { useEffect, useCallback, useRef } from 'react';
import { AdvancedResourceHints } from './AdvancedResourceHints';
import { AdvancedWebVitalsMonitor } from '@/hooks/useAdvancedWebVitals';

interface PerformanceEnhancerProps {
  children: React.ReactNode;
  enableResourceHints?: boolean;
  enableWebVitals?: boolean;
  enableImageOptimization?: boolean;
  enableInteractionOptimization?: boolean;
  debug?: boolean;
}

export const PerformanceEnhancer: React.FC<PerformanceEnhancerProps> = ({
  children,
  enableResourceHints = true,
  enableWebVitals = true,
  enableImageOptimization = true,
  enableInteractionOptimization = true,
  debug = false,
}) => {
  const isOptimized = useRef(false);

  // Image optimization
  const optimizeImages = useCallback(() => {
    if (!enableImageOptimization || isOptimized.current) return;

    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img, index) => {
      if (img instanceof HTMLImageElement) {
        // First 3 images load eagerly (above fold)
        if (index < 3) {
          img.loading = 'eager';
          img.setAttribute('fetchpriority', 'high');
        } else {
          img.loading = 'lazy';
        }
        
        // Add decoding async for all
        img.decoding = 'async';
      }
    });

    // Add native lazy loading to iframes
    const iframes = document.querySelectorAll('iframe:not([loading])');
    iframes.forEach((iframe) => {
      if (iframe instanceof HTMLIFrameElement) {
        iframe.loading = 'lazy';
      }
    });

    isOptimized.current = true;
  }, [enableImageOptimization]);

  // Interaction optimization
  const optimizeInteractions = useCallback(() => {
    if (!enableInteractionOptimization) return;

    // Add passive listeners to scroll events
    const scrollElements = document.querySelectorAll('[data-scroll-container]');
    scrollElements.forEach((el) => {
      el.addEventListener('scroll', () => {}, { passive: true });
      el.addEventListener('touchstart', () => {}, { passive: true });
      el.addEventListener('touchmove', () => {}, { passive: true });
    });

    // Optimize click handlers with event delegation
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Add visual feedback for touch devices
      if (target.matches('button, a, [role="button"]')) {
        target.classList.add('touch-feedback');
        setTimeout(() => target.classList.remove('touch-feedback'), 150);
      }
    }, { passive: true });
  }, [enableInteractionOptimization]);

  // Memory optimization
  const optimizeMemory = useCallback(() => {
    // Clean up old observers
    const cleanupObservers = () => {
      if ('PerformanceObserver' in window) {
        // Performance observers are cleaned up automatically
      }
    };

    // Disconnect IntersectionObservers when elements are removed
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Clean up any attached observers or listeners
            node.querySelectorAll('img').forEach((img) => {
              if (img instanceof HTMLImageElement) {
                img.src = '';
              }
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      cleanupObservers();
    };
  }, []);

  // Apply optimizations
  useEffect(() => {
    // Run image optimization after DOM is ready
    if (document.readyState === 'complete') {
      optimizeImages();
    } else {
      window.addEventListener('load', optimizeImages);
    }

    optimizeInteractions();
    const cleanupMemory = optimizeMemory();

    // Add performance marks for debugging
    if (debug && 'performance' in window) {
      performance.mark('performance-enhancer-initialized');
    }

    return () => {
      window.removeEventListener('load', optimizeImages);
      cleanupMemory();
    };
  }, [optimizeImages, optimizeInteractions, optimizeMemory, debug]);

  // Preload fonts on first interaction
  useEffect(() => {
    const preloadFontsOnInteraction = () => {
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.crossOrigin = 'anonymous';
      fontLink.href = 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2';
      document.head.appendChild(fontLink);
    };

    const events = ['mousedown', 'touchstart', 'keydown'];
    const handleFirstInteraction = () => {
      preloadFontsOnInteraction();
      events.forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };

    events.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, []);

  return (
    <>
      {enableResourceHints && <AdvancedResourceHints />}
      {enableWebVitals && (
        <AdvancedWebVitalsMonitor
          autoOptimize={true}
          debug={debug}
        />
      )}
      {children}
    </>
  );
};

// CSS for touch feedback
const TouchFeedbackStyles = () => (
  <style>{`
    .touch-feedback {
      opacity: 0.7;
      transform: scale(0.98);
      transition: all 0.1s ease-out;
    }
    
    @media (hover: hover) {
      .touch-feedback {
        opacity: 1;
        transform: none;
      }
    }
  `}</style>
);

// Wrapper with all performance enhancements
export const FullPerformanceWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <PerformanceEnhancer
    enableResourceHints
    enableWebVitals
    enableImageOptimization
    enableInteractionOptimization
    debug={process.env.NODE_ENV === 'development'}
  >
    <TouchFeedbackStyles />
    {children}
  </PerformanceEnhancer>
);

export default PerformanceEnhancer;
