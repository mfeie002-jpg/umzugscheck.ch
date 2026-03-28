import { logger } from './logger';

export const handleError = (error: Error, errorInfo?: any) => {
  // Log error for debugging
  logger.error('Application error:', { error: error.message, stack: error.stack, errorInfo });
  
  // Send to error tracking service in production
  if (import.meta.env.PROD) {
    // TODO: Integrate with error tracking service (Sentry, etc.)
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(() => {
        // Silent fail
      });
    } catch (e) {
      // Silent fail
    }
  }
};

export const withErrorBoundary = <T extends (...args: any[]) => any>(
  fn: T,
  fallback?: any
): T => {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch(error => {
          handleError(error);
          return fallback;
        });
      }
      return result;
    } catch (error) {
      handleError(error as Error);
      return fallback;
    }
  }) as T;
};
