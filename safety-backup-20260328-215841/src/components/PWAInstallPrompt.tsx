import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Share, Plus } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

export const PWAInstallPrompt = () => {
  const { isInstallable, installPWA } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        setIsDismissed(true);
        return;
      }
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Show after 10 seconds
    const timer = setTimeout(() => {
      if (!dismissed) {
        setShowPrompt(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", new Date().toISOString());
  };

  const handleInstall = () => {
    installPWA();
    setShowPrompt(false);
  };

  if (!showPrompt || isDismissed || !isInstallable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up md:hidden">
      <Card className="p-4 shadow-2xl border-2 border-primary/20">
        <CardContent className="p-0">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">App installieren</h3>
              <p className="text-xs text-muted-foreground mb-3">
                {isIOS 
                  ? "Installieren Sie Umzugscheck als App für schnellen Zugriff"
                  : "Installieren Sie die App für ein besseres Erlebnis"
                }
              </p>

              {isIOS ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Share className="w-4 h-4 flex-shrink-0" />
                    <span>1. Tippen Sie auf <strong>Teilen</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Plus className="w-4 h-4 flex-shrink-0" />
                    <span>2. Wählen Sie <strong>"Zum Home-Bildschirm"</strong></span>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={handleInstall}
                  size="sm"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Jetzt installieren
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-8 w-8"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
