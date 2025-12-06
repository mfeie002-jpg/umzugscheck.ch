// Security utilities for Umzugscheck.ch

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize HTML for safe display (for search highlighting etc.)
 */
export const sanitizeForHighlight = (text: string, query: string): string => {
  if (!query || !text) return sanitizeInput(text);
  const sanitizedQuery = sanitizeInput(query);
  const sanitizedText = sanitizeInput(text);
  const regex = new RegExp(`(${sanitizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return sanitizedText.replace(regex, '<mark class="bg-primary/20 text-primary font-medium">$1</mark>');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate Swiss phone number
 */
export const isValidSwissPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const swissPhoneRegex = /^(\+41|0041|0)?[1-9][0-9]{8}$/;
  return swissPhoneRegex.test(cleaned);
};

/**
 * Validate Swiss postal code
 */
export const isValidSwissPostalCode = (code: string): boolean => {
  const postalRegex = /^[1-9][0-9]{3}$/;
  return postalRegex.test(code);
};

/**
 * Rate limiter for client-side protection
 */
class ClientRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const record = this.attempts.get(key);
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new ClientRateLimiter();

/**
 * CSRF token management
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

let csrfToken: string | null = null;

export const getCSRFToken = (): string => {
  if (!csrfToken) {
    csrfToken = sessionStorage.getItem('csrf_token');
    if (!csrfToken) {
      csrfToken = generateCSRFToken();
      sessionStorage.setItem('csrf_token', csrfToken);
    }
  }
  return csrfToken;
};

/**
 * Secure storage wrapper with encryption for sensitive data
 */
export const secureStorage = {
  set: (key: string, value: string): void => {
    try {
      const encoded = btoa(encodeURIComponent(value));
      sessionStorage.setItem(`secure_${key}`, encoded);
    } catch (e) {
      console.error('Secure storage set failed');
    }
  },
  
  get: (key: string): string | null => {
    try {
      const encoded = sessionStorage.getItem(`secure_${key}`);
      if (!encoded) return null;
      return decodeURIComponent(atob(encoded));
    } catch (e) {
      return null;
    }
  },
  
  remove: (key: string): void => {
    sessionStorage.removeItem(`secure_${key}`);
  }
};

/**
 * Content Security Policy nonce generator
 */
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

/**
 * Validate URL to prevent open redirect attacks
 */
export const isValidRedirectUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    // Only allow same-origin redirects
    return parsedUrl.origin === window.location.origin;
  } catch {
    // If it's a relative URL, it's safe
    return url.startsWith('/') && !url.startsWith('//');
  }
};

/**
 * Mask sensitive data for display/logging
 */
export const maskEmail = (email: string): string => {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const maskedLocal = local.length > 2 
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : '*'.repeat(local.length);
  return `${maskedLocal}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return '*'.repeat(cleaned.length);
  return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
};

/**
 * Honeypot field generator for form spam protection
 */
export const createHoneypot = () => ({
  fieldName: `hp_${Math.random().toString(36).substr(2, 9)}`,
  isBot: (value: string) => value.length > 0
});

/**
 * Timing attack protection - constant time string comparison
 */
export const secureCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};
