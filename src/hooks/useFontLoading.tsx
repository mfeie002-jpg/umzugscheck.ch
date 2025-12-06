import { useState, useEffect } from 'react';

interface FontConfig {
  family: string;
  weights?: number[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

export const useFontLoading = (fonts: FontConfig[]) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontsError, setFontsError] = useState<string | null>(null);

  useEffect(() => {
    if (!('fonts' in document)) {
      setFontsLoaded(true);
      return;
    }

    const fontPromises = fonts.flatMap(font => {
      const weights = font.weights || [400];
      return weights.map(weight => 
        document.fonts.load(`${weight} 1em "${font.family}"`)
      );
    });

    Promise.all(fontPromises)
      .then(() => {
        setFontsLoaded(true);
      })
      .catch((error) => {
        setFontsError(error.message);
        setFontsLoaded(true); // Still mark as loaded to prevent blocking
      });

    // Fallback timeout
    const timeout = setTimeout(() => {
      setFontsLoaded(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [fonts]);

  return { fontsLoaded, fontsError };
};

// Preload critical fonts
export const preloadFonts = (fontUrls: string[]) => {
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Font loading optimization component
export const FontOptimizer = () => {
  useEffect(() => {
    // Add font-display: swap to all @font-face rules
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap !important;
      }
    `;
    document.head.appendChild(style);

    // Preconnect to font providers
    const preconnects = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    preconnects.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};
