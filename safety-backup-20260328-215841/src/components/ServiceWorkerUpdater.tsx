import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function ServiceWorkerUpdater() {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setShowUpdateBanner(true);
              }
            });
          }
        });
      });

      // Check for updates periodically
      const checkInterval = setInterval(() => {
        navigator.serviceWorker.ready.then(registration => {
          registration.update();
        });
      }, 60 * 60 * 1000); // Check every hour

      return () => clearInterval(checkInterval);
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdateBanner(false);
  };

  return (
    <AnimatePresence>
      {showUpdateBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">Neue Version verfügbar</p>
              <p className="text-xs opacity-90">Aktualisieren Sie für die neuesten Funktionen</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleUpdate}
              className="flex-shrink-0"
            >
              Aktualisieren
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-primary-foreground/10 rounded"
              aria-label="Schliessen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ServiceWorkerUpdater;
