/**
 * Lighthouse CI Configuration
 * Core Web Vitals thresholds for Feierabend Umzüge
 */

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/contact',
        'http://localhost:4173/calculator',
        'http://localhost:4173/booking',
        'http://localhost:4173/plan',
        'http://localhost:4173/area/zurich',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        // Core Web Vitals
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],
        
        // Performance score
        'categories:performance': ['warn', { minScore: 0.8 }],
        
        // Accessibility score
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        
        // Best practices score
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        
        // SEO score
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Critical accessibility checks
        'color-contrast': 'warn',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-description': 'error',
        'image-alt': 'warn',
        'link-name': 'warn',
        
        // Performance optimizations
        'uses-responsive-images': 'warn',
        'uses-optimized-images': 'warn',
        'render-blocking-resources': 'warn',
        'uses-text-compression': 'warn',
        'uses-rel-preconnect': 'warn',
        
        // SEO checks
        'is-crawlable': 'error',
        'robots-txt': 'warn',
        'canonical': 'warn',
        'hreflang': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
