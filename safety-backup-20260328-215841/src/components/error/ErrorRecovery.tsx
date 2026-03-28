/**
 * Error Recovery Components
 * Graceful error handling with recovery options
 */

import React, { Component, ErrorInfo, ReactNode, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  WifiOff, 
  Server, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle,
  Home,
  ArrowLeft,
  Bug
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Error types
type ErrorType = 'network' | 'server' | 'validation' | 'auth' | 'notFound' | 'unknown';

interface ErrorDetails {
  type: ErrorType;
  message: string;
  code?: string;
  timestamp: Date;
  stack?: string;
  context?: Record<string, unknown>;
}

// Error categorization
export function categorizeError(error: unknown): ErrorDetails {
  const timestamp = new Date();
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: 'Keine Internetverbindung',
      timestamp
    };
  }
  
  if (error instanceof Error) {
    if (error.message.includes('401') || error.message.includes('403')) {
      return {
        type: 'auth',
        message: 'Authentifizierung fehlgeschlagen',
        code: error.message.includes('401') ? '401' : '403',
        timestamp,
        stack: error.stack
      };
    }
    
    if (error.message.includes('404')) {
      return {
        type: 'notFound',
        message: 'Seite nicht gefunden',
        code: '404',
        timestamp
      };
    }
    
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return {
        type: 'server',
        message: 'Server nicht erreichbar',
        code: error.message.match(/5\d{2}/)?.[0],
        timestamp,
        stack: error.stack
      };
    }
    
    return {
      type: 'unknown',
      message: error.message,
      timestamp,
      stack: error.stack
    };
  }
  
  return {
    type: 'unknown',
    message: String(error),
    timestamp
  };
}

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log to console for debugging
    console.error('Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// Error Display Component
interface ErrorDisplayProps {
  error: Error | null;
  errorInfo?: ErrorInfo | null;
  onRetry?: () => void;
  variant?: 'full' | 'inline' | 'minimal';
}

export const ErrorDisplay = memo(function ErrorDisplay({
  error,
  errorInfo,
  onRetry,
  variant = 'full'
}: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const details = error ? categorizeError(error) : null;

  const icons: Record<ErrorType, typeof AlertTriangle> = {
    network: WifiOff,
    server: Server,
    auth: AlertTriangle,
    validation: AlertTriangle,
    notFound: HelpCircle,
    unknown: Bug
  };

  const Icon = details ? icons[details.type] : AlertTriangle;

  const copyError = useCallback(() => {
    const errorText = `
Error: ${error?.message}
Type: ${details?.type}
Time: ${details?.timestamp.toISOString()}
Stack: ${error?.stack || 'N/A'}
    `.trim();
    
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [error, details]);

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>{details?.message || 'Ein Fehler ist aufgetreten'}</span>
        {onRetry && (
          <button onClick={onRetry} className="underline hover:no-underline">
            Erneut versuchen
          </button>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <Icon className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-destructive">
                {details?.message || 'Fehler'}
              </h4>
              {details?.code && (
                <p className="text-sm text-muted-foreground">Code: {details.code}</p>
              )}
            </div>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="text-center">
          <CardContent className="pt-8 pb-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Icon className="h-8 w-8 text-destructive" />
            </div>

            <h2 className="text-xl font-semibold mb-2">
              {details?.message || 'Etwas ist schiefgelaufen'}
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {details?.type === 'network' 
                ? 'Bitte überprüfen Sie Ihre Internetverbindung.'
                : details?.type === 'server'
                ? 'Unsere Server sind vorübergehend nicht erreichbar. Bitte versuchen Sie es später erneut.'
                : 'Ein unerwarteter Fehler ist aufgetreten. Wir arbeiten daran.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onRetry && (
                <Button onClick={onRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Erneut versuchen
                </Button>
              )}
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Home className="h-4 w-4 mr-2" />
                Zur Startseite
              </Button>
            </div>

            {/* Technical details (collapsible) */}
            {(error?.stack || errorInfo) && (
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto"
                >
                  {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  Technische Details
                </button>
                
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 text-left">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Error Stack
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyError}
                            className="h-7 text-xs"
                          >
                            {copied ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Kopiert
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Kopieren
                              </>
                            )}
                          </Button>
                        </div>
                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-40">
                          {error?.stack || 'No stack trace available'}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
});

// Network Status Hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Offline Banner
export const OfflineBanner = memo(function OfflineBanner() {
  const isOnline = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-500 text-white overflow-hidden"
        >
          <div className="container py-2 flex items-center justify-center gap-2 text-sm">
            <WifiOff className="h-4 w-4" />
            <span>Sie sind offline. Einige Funktionen sind möglicherweise nicht verfügbar.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Retry helper
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number; backoff?: number } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 2 } = options;
  
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < retries) {
        await new Promise(resolve => 
          setTimeout(resolve, delay * Math.pow(backoff, attempt))
        );
      }
    }
  }
  
  throw lastError;
}

// Error reporting hook
export function useErrorReporting() {
  const reportError = useCallback((error: Error, context?: Record<string, unknown>) => {
    const details = categorizeError(error);
    
    // Log locally
    console.error('Error reported:', {
      ...details,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    });
    
    // Could send to error tracking service here
    // Example: Sentry.captureException(error, { extra: context });
  }, []);

  return { reportError };
}
