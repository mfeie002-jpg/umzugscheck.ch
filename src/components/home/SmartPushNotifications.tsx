import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const SmartPushNotifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already granted or dismissed
    const dismissed = localStorage.getItem("push-notification-dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Check browser support
    if (!("Notification" in window)) {
      return;
    }

    // Check permission status
    if (Notification.permission === "granted") {
      setIsGranted(true);
      return;
    }

    if (Notification.permission === "denied") {
      setIsDismissed(true);
      return;
    }

    // Show prompt after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setIsGranted(true);
        setIsVisible(false);
        
        // Show success notification
        new Notification("Benachrichtigungen aktiviert! 🎉", {
          body: "Sie erhalten jetzt Updates zu Ihren Umzugsofferten",
          icon: "/favicon.ico",
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("push-notification-dismissed", "true");
  };

  if (isDismissed || isGranted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 z-50 max-w-md"
        >
          <Card className="shadow-2xl border-2 border-primary/30 bg-card">
            <CardContent className="p-6">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Bell className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-foreground mb-2">
                    Verpassen Sie keine Offerte!
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Aktivieren Sie Benachrichtigungen und erhalten Sie Updates zu:
                  </p>

                  <ul className="space-y-2 mb-4">
                    {[
                      "Neue Umzugsofferten",
                      "Preissenkungen",
                      "Verfügbarkeitsänderungen",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleEnable}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      Aktivieren
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      variant="ghost"
                      className="flex-1"
                    >
                      Später
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
