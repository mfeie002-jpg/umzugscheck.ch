/**
 * Secure logging utility that only logs in development mode
 * and sanitizes sensitive data in production
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

interface LogContext {
  [key: string]: any;
}

/**
 * Sanitize sensitive data from log context
 */
const sanitizeContext = (context: LogContext): LogContext => {
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'email', 'phone', 'authorization', 'api_key'];
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
  
  warn: (message: string, errorOrContext?: Error | unknown | LogContext, context?: LogContext) => {
    if (isDevelopment) {
      if (errorOrContext instanceof Error) {
        console.warn(`[WARN] ${message}`, errorOrContext.message, context ? sanitizeContext(context) : '');
      } else {
        console.warn(`[WARN] ${message}`, errorOrContext ? sanitizeContext(errorOrContext as LogContext) : '');
      }
    }
  },
  
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    // Always log errors with sanitized data
    const sanitizedContext = context ? sanitizeContext(context) : {};
    
    if (isProduction) {
      // In production, log minimal error info
      console.error(`[ERROR] ${message}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        ...sanitizedContext,
      });
    } else {
      console.error(`[ERROR] ${message}`, error, sanitizedContext);
    }
  },
  
  debug: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context ? sanitizeContext(context) : '');
    }
  },
};
