import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
    }));
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
    }));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-primary/30 bg-card backdrop-blur-lg">
            <CardContent className="p-6">
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!showSettings ? (
                <>
                  {/* Simple View */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Cookie className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-2">
                        Cookies & Datenschutz
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unsere Website zu optimieren. 
                        Sie können Ihre Einstellungen anpassen oder alle akzeptieren.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleAcceptAll}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Alle akzeptieren
                    </Button>
                    <Button
                      onClick={handleRejectAll}
                      variant="outline"
                    >
                      Nur notwendige
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Einstellungen
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Settings View */}
                  <h4 className="font-bold text-foreground mb-4">
                    Cookie-Einstellungen
                  </h4>

                  <div className="space-y-4 mb-6">
                    {/* Necessary */}
                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h5 className="font-semibold text-foreground text-sm mb-1">
                          Notwendige Cookies
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          Erforderlich für grundlegende Funktionen
                        </p>
                      </div>
                      <Switch checked={true} disabled />
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 pr-4">
                        <h5 className="font-semibold text-foreground text-sm mb-1">
                          Analytische Cookies
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          Helfen uns, die Website zu verbessern
                        </p>
                      </div>
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, analytics: checked })
                        }
                      />
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 pr-4">
                        <h5 className="font-semibold text-foreground text-sm mb-1">
                          Marketing Cookies
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          Für personalisierte Werbung
                        </p>
                      </div>
                      <Switch
                        checked={preferences.marketing}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, marketing: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAcceptSelected}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Auswahl speichern
                    </Button>
                    <Button
                      onClick={() => setShowSettings(false)}
                      variant="ghost"
                    >
                      Zurück
                    </Button>
                  </div>
                </>
              )}

              <p className="text-xs text-muted-foreground mt-4">
                Mehr erfahren Sie in unserer{" "}
                <a href="/datenschutz" className="text-primary hover:underline">
                  Datenschutzerklärung
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
