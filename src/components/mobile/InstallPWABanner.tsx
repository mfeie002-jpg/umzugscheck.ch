import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useHaptic } from '@/hooks/use-haptic';
import { Button } from '@/components/ui/button';

export const InstallPWABanner = () => {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const { trigger } = useHaptic();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show after user has been on site for a bit
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('pwa-banner-dismissed');
      if (!dismissed && isInstallable && !isInstalled) {
        setShowBanner(true);
      }
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    trigger('medium');
    const installed = await promptInstall();
    if (installed) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    trigger('light');
    setIsDismissed(true);
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-50 lg:hidden"
      >
        <div className="bg-background rounded-2xl shadow-2xl border border-border p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">App installieren</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Umzugscheck.ch direkt auf Ihrem Startbildschirm
              </p>
            </div>
          </div>

          <Button
            onClick={handleInstall}
            className="w-full mt-3 h-10"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Jetzt installieren
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
