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
  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-4 border-destructive/30 hover:bg-destructive/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Erneut versuchen
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
