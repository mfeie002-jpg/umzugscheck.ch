import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X, Download, Share, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const MobileAppBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
      return;
    }

    // Check if banner was dismissed
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) return;

    // Detect device
    const userAgent = navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(userAgent);
    const android = /android/.test(userAgent);
    
    setIsIOS(iOS);
    setIsAndroid(android);

    // Show banner after 3 seconds on mobile
    if (iOS || android) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleInstall = () => {
    // PWA install will be handled by PWAInstallPrompt component
    setIsVisible(false);
  };

  if (isPWAInstalled || (!isIOS && !isAndroid)) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <Card className="shadow-2xl border-2 border-primary/30 bg-card backdrop-blur-lg">
            <CardContent className="p-4">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground mb-1">
                    Umzugscheck.ch App
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Installieren Sie unsere App für schnelleren Zugriff
                  </p>

                  {/* Install Instructions */}
                  {isIOS && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Share className="w-4 h-4" />
                      <span>Tippen Sie auf</span>
                      <span className="font-semibold">"Teilen"</span>
                      <span>→</span>
                      <span className="font-semibold">"Zum Home-Bildschirm"</span>
                    </div>
                  )}

                  {isAndroid && (
                    <Button
                      onClick={handleInstall}
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Installieren
                    </Button>
                  )}
                </div>

                {/* App Store Badge (if iOS) */}
                {isIOS && (
                  <div className="hidden sm:block flex-shrink-0">
                    <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg">
                      <Apple className="w-6 h-6" />
                      <div className="text-xs">
                        <div className="text-[10px] opacity-70">Verfügbar im</div>
                        <div className="font-semibold">App Store</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
