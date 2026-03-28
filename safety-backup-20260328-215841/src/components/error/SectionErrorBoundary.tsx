/**
 * Section Error Boundary
 * 
 * Graceful error handling for individual page sections.
 * Prevents one broken section from crashing the entire page.
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionErrorBoundaryProps {
  children: ReactNode;
  /** Fallback content when error occurs */
  fallback?: ReactNode;
  /** Section name for error reporting */
  sectionName?: string;
  /** Show retry button */
  showRetry?: boolean;
  /** Minimum height to maintain layout */
  minHeight?: string;
  /** Custom error handler */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, State> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in dev
    if (import.meta.env.DEV) {
      console.error(`[SectionError] ${this.props.sectionName || 'Unknown'}:`, error, errorInfo);
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Sentry, LogRocket, etc.
      // captureException(error, { extra: { sectionName: this.props.sectionName, componentStack: errorInfo.componentStack } });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div 
          className="flex flex-col items-center justify-center gap-4 p-8 bg-muted/30 rounded-lg border border-border/50"
          style={{ minHeight: this.props.minHeight || '200px' }}
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            {this.props.sectionName 
              ? `${this.props.sectionName} konnte nicht geladen werden.`
              : 'Dieser Bereich konnte nicht geladen werden.'
            }
          </p>
          {this.props.showRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.handleRetry}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Erneut versuchen
            </Button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components
export function withSectionErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  sectionName: string
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const WithErrorBoundary = (props: P) => (
    <SectionErrorBoundary sectionName={sectionName} showRetry>
      <WrappedComponent {...props} />
    </SectionErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithSectionErrorBoundary(${displayName})`;

  return WithErrorBoundary;
}

export default SectionErrorBoundary;
