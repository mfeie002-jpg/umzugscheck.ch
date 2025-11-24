import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const AdvancedServiceWorker = () => {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);

          // Check for updates every 30 minutes
          setInterval(() => {
            registration.update();
          }, 30 * 60 * 1000);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available
                  toast({
                    title: "Neue Version verfügbar",
                    description: "Aktualisieren Sie die Seite, um die neueste Version zu laden.",
                    action: (
                      <button
                        onClick={() => window.location.reload()}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                      >
                        Aktualisieren
                      </button>
                    ),
                    duration: 10000,
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Handle offline/online events
      const handleOnline = () => {
        toast({
          title: "Wieder online",
          description: "Ihre Internetverbindung wurde wiederhergestellt.",
          variant: "default",
        });
      };

      const handleOffline = () => {
        toast({
          title: "Offline-Modus",
          description: "Sie können die Seite weiterhin durchsuchen.",
          variant: "default",
        });
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [toast]);

  return null;
};
