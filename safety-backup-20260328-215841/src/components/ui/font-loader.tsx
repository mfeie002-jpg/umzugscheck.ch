/**
 * Font Loader Component
 * Preloads fonts and prevents FOIT/FOUT (Flash of Invisible/Unstyled Text)
 * which causes CLS
 */
import { useEffect, memo } from "react";

// Critical fonts to preload
const CRITICAL_FONTS = [
  {
    family: 'Inter',
    weights: ['400', '500', '600', '700', '800'],
    display: 'swap'
  }
];

export const FontLoader = memo(function FontLoader() {
  useEffect(() => {
    // Add preconnect for fonts
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectGoogle);

    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectGstatic);

    // Check if fonts are already loaded
    if ('fonts' in document) {
      CRITICAL_FONTS.forEach(font => {
        font.weights.forEach(weight => {
          document.fonts.load(`${weight} 1rem "${font.family}"`).catch(() => {
            // Silently fail - fallback fonts will be used
          });
        });
      });

      // Add loaded class when fonts are ready
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }

    return () => {
      preconnectGoogle.remove();
      preconnectGstatic.remove();
    };
  }, []);

  return null;
});

/**
 * CSS for font loading states - add to index.css:
 * 
 * html:not(.fonts-loaded) body {
 *   font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
 * }
 * 
 * html.fonts-loaded body {
 *   font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
 * }
 */

export default FontLoader;
