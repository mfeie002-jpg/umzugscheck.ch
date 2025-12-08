import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "./button";
import { Link } from "react-router-dom";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
  className?: string;
  variant?: 'default' | 'inline' | 'card';
}

/**
 * Unified error display component
 */
export const ErrorDisplay = ({
  title = "Ein Fehler ist aufgetreten",
  message = "Bitte versuchen Sie es später erneut.",
  onRetry,
  showHomeLink = true,
  className,
  variant = 'default'
}: ErrorDisplayProps) => {
  if (variant === 'inline') {
    return (
      <div className={cn(
        "flex items-center gap-2 text-destructive text-sm",
        className
      )}>
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-primary hover:underline font-medium"
          >
            Erneut versuchen
          </button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        "rounded-xl border border-destructive/20 bg-destructive/5 p-6",
        className
      )}>
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-3"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Erneut versuchen
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-[50vh] flex items-center justify-center px-4",
      className
    )}>
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Erneut versuchen
            </Button>
          )}
          
          {showHomeLink && (
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Zur Startseite
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 404 Not Found component
 */
export const NotFoundDisplay = () => (
  <ErrorDisplay
    title="Seite nicht gefunden"
    message="Die angeforderte Seite existiert nicht oder wurde verschoben."
    showHomeLink={true}
  />
);
