import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

/**
 * Security headers component that adds security-related meta tags.
 * Note: For full CSP protection, headers should be set server-side.
 * These meta tags provide additional client-side security.
 */
export const SecurityHeaders: React.FC = () => {
  // Skip security checks in development/preview mode
  const isDevelopment = window.location.hostname.includes('lovableproject.com') || 
                        window.location.hostname.includes('lovable.app') ||
                        window.location.hostname === 'localhost';

  useEffect(() => {
    // Only run clickjacking protection in production
    if (isDevelopment) return;
    
    // Prevent clickjacking by checking if we're in an iframe
    if (window.self !== window.top) {
      const allowedOrigins = [
        'lovable.app',
        'lovableproject.com',
        'umzugscheck.ch'
      ];
      
      try {
        const parentOrigin = document.referrer ? new URL(document.referrer).hostname : '';
        const isAllowed = allowedOrigins.some(origin => parentOrigin.endsWith(origin));
        
        if (!isAllowed && parentOrigin) {
          console.warn('Potential clickjacking attempt detected');
        }
      } catch (e) {
        // Cross-origin frame - might be malicious
      }
    }
  }, [isDevelopment]);

  // Don't inject CSP in development/preview - it breaks hot reload and iframes
  if (isDevelopment) {
    return null;
  }

  return (
    <Helmet>
      {/* Content Security Policy - only in production */}
      <meta
        httpEquiv="Content-Security-Policy"
        content={[
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https: blob:",
          "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://www.google-analytics.com https://ai.gateway.lovable.dev",
          "frame-ancestors 'self' https://*.lovable.app https://*.lovableproject.com",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'"
        ].join('; ')}
      />
      
      {/* Prevent MIME type sniffing */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      
      {/* XSS Protection (legacy browsers) */}
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Referrer Policy - don't leak sensitive URLs */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* Permissions Policy - disable unnecessary features */}
      <meta
        httpEquiv="Permissions-Policy"
        content="camera=(), microphone=(), geolocation=(self), payment=()"
      />
    </Helmet>
  );
};
