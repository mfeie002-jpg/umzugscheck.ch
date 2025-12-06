import React, { useEffect, useState } from 'react';

// Critical CSS that should be inlined
const CRITICAL_CSS = `
  /* Critical above-the-fold styles */
  *,*::before,*::after{box-sizing:border-box}
  html{line-height:1.15;-webkit-text-size-adjust:100%;scroll-behavior:smooth}
  body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:hsl(var(--background));color:hsl(var(--foreground))}
  main{display:block}
  h1,h2,h3,h4,h5,h6{margin-top:0}
  p{margin-top:0}
  a{color:inherit;text-decoration:none}
  button{font-family:inherit}
  img{max-width:100%;height:auto;display:block}
  
  /* Layout critical */
  .container{width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
  @media(min-width:640px){.container{max-width:640px}}
  @media(min-width:768px){.container{max-width:768px}}
  @media(min-width:1024px){.container{max-width:1024px}}
  @media(min-width:1280px){.container{max-width:1280px}}
  
  /* Hero section critical */
  .hero-section{min-height:60vh;display:flex;align-items:center}
  
  /* Button critical */
  .btn-primary{display:inline-flex;align-items:center;justify-content:center;padding:0.75rem 1.5rem;font-weight:500;border-radius:0.5rem;transition:all 0.2s}
  
  /* Loading state */
  .skeleton{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;background:hsl(var(--muted))}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
`;

interface CriticalCSSLoaderProps {
  nonCriticalStyles?: string[];
}

export const CriticalCSSLoader: React.FC<CriticalCSSLoaderProps> = ({
  nonCriticalStyles = [],
}) => {
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    // Inject critical CSS immediately
    const criticalStyle = document.createElement('style');
    criticalStyle.id = 'critical-css';
    criticalStyle.textContent = CRITICAL_CSS;
    
    if (!document.getElementById('critical-css')) {
      document.head.insertBefore(criticalStyle, document.head.firstChild);
    }

    // Load non-critical CSS after page is interactive
    const loadNonCriticalCSS = () => {
      nonCriticalStyles.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print'; // Load async
        link.onload = () => {
          link.media = 'all'; // Apply after load
        };
        document.head.appendChild(link);
      });
      setStylesLoaded(true);
    };

    // Use requestIdleCallback for non-critical CSS
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadNonCriticalCSS, { timeout: 2000 });
    } else {
      setTimeout(loadNonCriticalCSS, 100);
    }

    return () => {
      const criticalEl = document.getElementById('critical-css');
      if (criticalEl) {
        criticalEl.remove();
      }
    };
  }, [nonCriticalStyles]);

  return null;
};

// Utility to defer non-critical styles
export const deferStylesheet = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  link.onload = () => {
    link.rel = 'stylesheet';
  };
  document.head.appendChild(link);
};

// Remove unused CSS (simplified version)
export const removeUnusedCSS = () => {
  if (process.env.NODE_ENV !== 'production') return;

  const allStyles = document.querySelectorAll('style');
  allStyles.forEach((style) => {
    const css = style.textContent || '';
    // Remove obviously unused selectors (simplified)
    const cleanedCSS = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    if (cleanedCSS.length < css.length * 0.5) {
      style.textContent = cleanedCSS;
    }
  });
};
