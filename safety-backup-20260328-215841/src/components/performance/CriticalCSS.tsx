import { useEffect } from 'react';

// Critical CSS that should be inlined for fastest LCP
const criticalStyles = `
  /* Critical above-the-fold styles */
  :root {
    --hero-min-height: 100vh;
    --content-max-width: 1400px;
  }
  
  /* Prevent layout shift */
  .hero-container {
    min-height: var(--hero-min-height);
    contain: layout style paint;
  }
  
  /* Optimize font loading */
  @font-face {
    font-family: 'Inter';
    font-display: swap;
  }
  
  /* Reduce CLS for images */
  img {
    height: auto;
    max-width: 100%;
  }
  
  /* Critical button styles */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  /* Loading state placeholder */
  .loading-placeholder {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const CriticalCSS = () => {
  useEffect(() => {
    // Add critical CSS to head if not already present
    const existingStyle = document.getElementById('critical-css');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = criticalStyles;
      document.head.insertBefore(style, document.head.firstChild);
    }
  }, []);

  return null;
};
