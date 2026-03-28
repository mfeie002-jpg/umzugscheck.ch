/**
 * Security-related utilities for the frontend
 */

/**
 * Generate a random nonce for CSP
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if the current origin matches expected domains
 */
export function isValidOrigin(): boolean {
  const validDomains = [
    'localhost',
    'lovable.app',
    'lovableproject.com',
    'feierabend-umzuege.ch',
  ];
  
  const currentHost = window.location.hostname;
  return validDomains.some(domain => 
    currentHost === domain || currentHost.endsWith(`.${domain}`)
  );
}

/**
 * Safely open external links
 */
export function safeExternalLink(url: string): void {
  // Validate URL protocol
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      console.warn('Blocked non-http(s) URL:', url);
      return;
    }
    
    // Open with security attributes
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  } catch {
    console.warn('Invalid URL:', url);
  }
}

/**
 * Check for potential clickjacking
 */
export function checkFrameAncestors(): boolean {
  try {
    // If we're in an iframe
    if (window.self !== window.top) {
      // Check if parent is same origin
      try {
        // This will throw if cross-origin
        const parentHost = window.parent.location.hostname;
        return parentHost === window.location.hostname;
      } catch {
        // Cross-origin frame - potentially unsafe
        console.warn('Page loaded in cross-origin frame');
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'credit_card', 'cvv', 'ssn'];
  const masked = { ...data };
  
  for (const key of Object.keys(masked)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      masked[key] = '***MASKED***';
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key] as Record<string, unknown>);
    }
  }
  
  return masked;
}

/**
 * Validate that a string doesn't contain potential XSS patterns
 */
export function containsXSSPatterns(input: string): boolean {
  const xssPatterns = [
    /<script\b/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /expression\s*\(/i,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}
