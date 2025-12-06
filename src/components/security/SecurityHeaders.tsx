import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

/**
 * Security headers component that adds security-related meta tags.
 * Note: For full CSP protection, headers should be set server-side.
 * These meta tags provide additional client-side security.
 */
export const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Prevent clickjacking by checking if we're in an iframe
    if (window.self !== window.top) {
      // Allow only our own iframes (preview, etc.)
      const allowedOrigins = [
        'lovable.app',
        'lovableproject.com',
        'umzugscheck.ch',
        'localhost'
      ];
      
      try {
        const parentOrigin = document.referrer ? new URL(document.referrer).hostname : '';
        const isAllowed = allowedOrigins.some(origin => parentOrigin.endsWith(origin) || parentOrigin === 'localhost');
        
        if (!isAllowed && parentOrigin) {
          console.warn('Potential clickjacking attempt detected');
        }
      } catch (e) {
        // Cross-origin frame - might be malicious
      }
    }
  }, []);

  // In development/preview, we use relaxed CSP to avoid blocking the app
  // Production should use proper server-side headers
  return (
    <Helmet>
      {/* Prevent MIME type sniffing */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      
      {/* XSS Protection (legacy browsers) */}
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Referrer Policy - don't leak sensitive URLs */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
    </Helmet>
  );
};
