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
  
  warn: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, context ? sanitizeContext(context) : '');
    }
  },
  
  error: (message: string, errorOrContext?: Error | unknown | LogContext, context?: LogContext) => {
    // Handle both old signature (message, error, context) and new signature (message, context)
    let sanitizedContext: LogContext = {};
    let errorInfo: string | undefined;
    
    if (errorOrContext instanceof Error) {
      errorInfo = errorOrContext.message;
      sanitizedContext = context ? sanitizeContext(context) : {};
    } else if (typeof errorOrContext === 'object' && errorOrContext !== null) {
      sanitizedContext = sanitizeContext(errorOrContext as LogContext);
    }
    
    if (isProduction) {
      console.error(`[ERROR] ${message}`, errorInfo ? { error: errorInfo, ...sanitizedContext } : sanitizedContext);
    } else {
      console.error(`[ERROR] ${message}`, errorInfo ? { error: errorInfo, ...sanitizedContext } : sanitizedContext);
    }
  },
  
  debug: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context ? sanitizeContext(context) : '');
    }
  },
};
