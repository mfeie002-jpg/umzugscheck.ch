import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50"
        >
          <div className="bg-card rounded-2xl border border-border shadow-premium p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Cookie-Einstellungen</h3>
                <p className="text-sm text-muted-foreground">
                  Wir nutzen Cookies, um Ihre Erfahrung zu verbessern und unseren Service zu optimieren.
                </p>
              </div>
              <button
                onClick={handleDecline}
                className="text-muted-foreground hover:text-foreground -mt-1 -mr-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="flex-1"
              >
                Nur notwendige
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="flex-1 bg-secondary hover:bg-secondary/90"
              >
                Alle akzeptieren
              </Button>
            </div>
            
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-3 mx-auto">
              <Settings className="w-3 h-3" />
              Einstellungen anpassen
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
