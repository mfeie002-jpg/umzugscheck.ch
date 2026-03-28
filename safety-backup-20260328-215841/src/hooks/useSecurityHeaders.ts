import { useEffect, useCallback } from 'react';

interface SecurityHeadersConfig {
  /** Enable Content Security Policy meta tag */
  enableCSP?: boolean;
  /** Enable X-Content-Type-Options simulation */
  enableNoSniff?: boolean;
  /** Enable Referrer-Policy */
  enableReferrerPolicy?: boolean;
  /** Custom CSP directives */
  cspDirectives?: Record<string, string[]>;
}

const DEFAULT_CSP_DIRECTIVES: Record<string, string[]> = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.gpt.lovable.dev'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'blob:', 'https:'],
  'connect-src': ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co'],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
};

/**
 * Build CSP string from directives
 */
function buildCSPString(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Add or update a meta tag
 */
function setMetaTag(name: string, content: string, httpEquiv = false): void {
  const attribute = httpEquiv ? 'http-equiv' : 'name';
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

/**
 * Remove a meta tag
 */
function removeMetaTag(name: string, httpEquiv = false): void {
  const attribute = httpEquiv ? 'http-equiv' : 'name';
  const meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (meta) {
    meta.remove();
  }
}

/**
 * Hook to manage client-side security headers via meta tags
 * Note: Real security headers should be set server-side, this is for additional client-side hardening
 */
export function useSecurityHeaders(config: SecurityHeadersConfig = {}) {
  const {
    enableCSP = true,
    enableNoSniff = true,
    enableReferrerPolicy = true,
    cspDirectives = DEFAULT_CSP_DIRECTIVES,
  } = config;

  // Apply security headers on mount
  useEffect(() => {
    if (enableCSP) {
      const cspString = buildCSPString(cspDirectives);
      setMetaTag('Content-Security-Policy', cspString, true);
    }

    if (enableReferrerPolicy) {
      setMetaTag('referrer', 'strict-origin-when-cross-origin');
    }

    // Add other meta-based security measures
    setMetaTag('X-Content-Type-Options', 'nosniff', true);
    setMetaTag('X-Frame-Options', 'DENY', true);
    setMetaTag('X-XSS-Protection', '1; mode=block', true);

    return () => {
      // Cleanup on unmount (optional)
    };
  }, [enableCSP, enableReferrerPolicy, enableNoSniff, cspDirectives]);

  /**
   * Add a trusted source to CSP dynamically
   */
  const addTrustedSource = useCallback((directive: string, source: string) => {
    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingMeta) return;

    const currentContent = existingMeta.getAttribute('content') || '';
    const parts = currentContent.split(';').map(s => s.trim());
    
    let found = false;
    const updated = parts.map(part => {
      if (part.startsWith(directive)) {
        found = true;
        return `${part} ${source}`;
      }
      return part;
    });

    if (!found) {
      updated.push(`${directive} ${source}`);
    }

    existingMeta.setAttribute('content', updated.join('; '));
  }, []);

  /**
   * Check if a source is allowed by current CSP
   */
  const isSourceAllowed = useCallback((directive: string, source: string): boolean => {
    const sources = cspDirectives[directive];
    if (!sources) return false;
    
    // Check exact match
    if (sources.includes(source)) return true;
    
    // Check 'self'
    if (sources.includes("'self'") && source.startsWith(window.location.origin)) return true;
    
    // Check wildcard patterns
    for (const allowed of sources) {
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\*/g, '.*');
        if (new RegExp(`^${pattern}$`).test(source)) return true;
      }
    }
    
    return false;
  }, [cspDirectives]);

  /**
   * Get current CSP string
   */
  const getCurrentCSP = useCallback((): string => {
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return meta?.getAttribute('content') || '';
  }, []);

  return {
    addTrustedSource,
    isSourceAllowed,
    getCurrentCSP,
    buildCSPString,
  };
}

/**
 * Security utility to check for common vulnerabilities
 */
export const SecurityChecks = {
  /**
   * Check if running in secure context
   */
  isSecureContext: (): boolean => {
    return window.isSecureContext;
  },

  /**
   * Check if cookies are enabled
   */
  areCookiesEnabled: (): boolean => {
    try {
      document.cookie = 'cookietest=1';
      const enabled = document.cookie.indexOf('cookietest=') !== -1;
      document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
      return enabled;
    } catch {
      return false;
    }
  },

  /**
   * Check if localStorage is available
   */
  isLocalStorageAvailable: (): boolean => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if running in iframe
   */
  isInIframe: (): boolean => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  },

  /**
   * Check for potential XSS in URL
   */
  hasXSSInURL: (): boolean => {
    const url = window.location.href.toLowerCase();
    const xssPatterns = [
      '<script',
      'javascript:',
      'data:text/html',
      'onerror=',
      'onload=',
      'onclick=',
      'eval(',
    ];
    return xssPatterns.some(pattern => url.includes(pattern));
  },

  /**
   * Get security score
   */
  getSecurityScore: (): { score: number; issues: string[] } => {
    const issues: string[] = [];
    let score = 100;

    if (!SecurityChecks.isSecureContext()) {
      issues.push('Not running in secure context (HTTPS)');
      score -= 30;
    }

    if (!SecurityChecks.areCookiesEnabled()) {
      issues.push('Cookies are disabled');
      score -= 10;
    }

    if (SecurityChecks.isInIframe()) {
      issues.push('Running in iframe');
      score -= 20;
    }

    if (SecurityChecks.hasXSSInURL()) {
      issues.push('Potential XSS detected in URL');
      score -= 40;
    }

    return { score: Math.max(0, score), issues };
  },
};
