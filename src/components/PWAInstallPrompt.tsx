import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

export const PWAInstallPrompt = () => {
  const { isInstallable, installPWA } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  const handleInstall = () => {
    installPWA();
    setIsDismissed(true);
  };

  if (!isInstallable || isDismissed) return null;

  return (
    <Card className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 shadow-lg z-50 border-primary">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold">App installieren</h3>
            <p className="text-sm text-muted-foreground">
              Installieren Sie Umzugscheck.ch für schnellen Zugriff und Offline-Funktionen
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm" className="flex-1">
                Installieren
              </Button>
              <Button onClick={handleDismiss} size="sm" variant="ghost">
                Später
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
