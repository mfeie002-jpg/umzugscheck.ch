import { logger } from './logger';

export const handleError = (error: Error, errorInfo?: any) => {
  // Log error for debugging
  logger.error('Application error:', { error: error.message, stack: error.stack, errorInfo });
  
  // Send to error tracking service in production
  if (import.meta.env.PROD) {
    try {
      const payload = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorInfo,
      };

      // Forward to Sentry if globally available.
      const sentry = (window as any).Sentry;
      if (sentry?.captureException) {
        sentry.captureException(error, { extra: { errorInfo } });
      }

      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/errors', blob);
      } else {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {
          // Silent fail
        });
      }
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
