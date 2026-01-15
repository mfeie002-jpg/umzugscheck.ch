import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  errorId?: string;
}

export const ErrorState = ({ 
  title = "Ein Fehler ist aufgetreten", 
  message,
  onRetry,
  errorId
}: ErrorStateProps) => {
  const handleReload = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("__reload", Date.now().toString());
    window.location.replace(url.toString());
  };
  
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-2">{message}</p>
          {errorId && (
            <p className="text-xs text-muted-foreground mb-3">
              Fehler-ID: {errorId}
            </p>
          )}
          <div className="flex gap-3 mt-4">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-destructive/30 hover:bg-destructive/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Erneut versuchen
              </Button>
            )}
            <Button
              onClick={handleReload}
              variant="outline"
              size="sm"
              className="border-destructive/30 hover:bg-destructive/10"
            >
              Seite neu laden
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
