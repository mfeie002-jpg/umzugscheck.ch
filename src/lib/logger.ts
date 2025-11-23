/**
 * Secure logging utility that only logs in development mode
 * and sanitizes sensitive data in production
 */

const isDevelopment = import.meta.env.DEV;

interface LogContext {
  [key: string]: any;
}

/**
 * Sanitize sensitive data from log context
 */
const sanitizeContext = (context: LogContext): LogContext => {
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'email', 'phone'];
  const sanitized: LogContext = {};
  
  for (const [key, value] of Object.entries(context)) {
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeContext(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

export const logger = {
  info: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, context ? sanitizeContext(context) : '');
    }
  },
  
  warn: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, context ? sanitizeContext(context) : '');
    }
  },
  
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    // Always log errors, but sanitize in production
    const sanitizedContext = context ? sanitizeContext(context) : {};
    
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error, sanitizedContext);
    } else {
      // In production, only log generic error info
      console.error(`[ERROR] ${message}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        ...sanitizedContext,
      });
    }
  },
  
  debug: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context ? sanitizeContext(context) : '');
    }
  },
};
