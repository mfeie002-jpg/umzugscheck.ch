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
    // Handle both signatures: (message, error, context) and (message, context)
    let sanitizedContext: LogContext = {};
    let errorMessage: string | undefined;
    
    if (errorOrContext instanceof Error) {
      // First signature: logger.error("msg", error, context?)
      errorMessage = errorOrContext.message;
      sanitizedContext = context ? sanitizeContext(context) : {};
    } else if (errorOrContext && typeof errorOrContext === 'object') {
      // Check if it looks like an error-like object
      const maybeError = errorOrContext as any;
      if (maybeError.message && typeof maybeError.message === 'string') {
        errorMessage = maybeError.message;
        sanitizedContext = context ? sanitizeContext(context) : {};
      } else {
        // Second signature: logger.error("msg", context)
        sanitizedContext = sanitizeContext(errorOrContext as LogContext);
      }
    }
    
    const logPayload = errorMessage 
      ? { error: errorMessage, ...sanitizedContext } 
      : sanitizedContext;
    
    // Always log errors (both dev and prod)
    console.error(`[ERROR] ${message}`, Object.keys(logPayload).length > 0 ? logPayload : '');
  },
  
  debug: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context ? sanitizeContext(context) : '');
    }
  },
};
