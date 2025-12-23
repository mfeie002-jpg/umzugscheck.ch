import { useEffect, useState, useCallback } from "react";
import { WifiOff, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Only show offline after confirmed by actual network check
  const checkOnlineStatus = useCallback(async () => {
    // navigator.onLine can give false negatives in some environments
    if (!navigator.onLine) {
      // Double-check with a small fetch to confirm
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        await fetch('/favicon.ico', { 
          method: 'HEAD', 
          cache: 'no-store',
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        setIsOffline(false);
      } catch {
        setIsOffline(true);
      }
    } else {
      setIsOffline(false);
    }
  }, []);

  useEffect(() => {
    // Initial check after a delay to avoid flash
    const initialCheck = setTimeout(checkOnlineStatus, 1000);

    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };
    
    const handleOffline = () => {
      checkOnlineStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(initialCheck);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkOnlineStatus]);

  if (!isOffline || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <Alert variant="destructive" className="shadow-lg">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between gap-2">
          <span>Sie sind offline. Einige Funktionen sind möglicherweise nicht verfügbar.</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 hover:bg-destructive/20"
            onClick={() => setDismissed(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
