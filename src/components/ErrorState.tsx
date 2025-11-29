import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ 
  title = "Ein Fehler ist aufgetreten", 
  message,
  onRetry 
}: ErrorStateProps) => {
  const handleReload = () => {
    window.location.reload();
  };
  
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
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
