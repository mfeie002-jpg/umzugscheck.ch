/**
 * Swiss Cookie Consent Banner
 * GDPR/DSG compliant consent management
 * Clean, minimal design matching Swiss aesthetic
 */

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Cookie, Settings, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const CONSENT_KEY = 'uc_cookie_consent';

const getStoredConsent = (): ConsentSettings | null => {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveConsent = (consent: ConsentSettings) => {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consent }));
  } catch {
    console.warn('Could not save cookie consent');
  }
};

interface CookieConsentBannerProps {
  className?: string;
}

export const CookieConsentBanner = memo(({ className }: CookieConsentBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: 0
  });

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Show banner after short delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    setSettings(stored);
  }, []);

  const handleAcceptAll = () => {
    const consent: ConsentSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    };
    saveConsent(consent);
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const consent: ConsentSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    };
    saveConsent(consent);
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    const consent: ConsentSettings = {
      ...settings,
      necessary: true, // Always required
      timestamp: Date.now()
    };
    saveConsent(consent);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-safe",
          className
        )}
      >
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Main Content */}
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  Cookie-Einstellungen
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. 
                  Einige sind für den Betrieb unerlässlich, andere helfen uns, die Seite zu verbessern.
                </p>

                {/* Cookie Categories (Expandable) */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="space-y-3 py-3 border-t border-b border-border/50">
                        {/* Necessary */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Notwendige Cookies</p>
                            <p className="text-xs text-muted-foreground">
                              Erforderlich für grundlegende Funktionen
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Immer aktiv</span>
                            <Switch checked disabled className="opacity-50" />
                          </div>
                        </div>

                        {/* Analytics */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Analyse-Cookies</p>
                            <p className="text-xs text-muted-foreground">
                              Helfen uns, die Website zu verbessern
                            </p>
                          </div>
                          <Switch
                            checked={settings.analytics}
                            onCheckedChange={(checked) => 
                              setSettings(s => ({ ...s, analytics: checked }))
                            }
                          />
                        </div>

                        {/* Marketing */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Marketing-Cookies</p>
                            <p className="text-xs text-muted-foreground">
                              Für personalisierte Werbung
                            </p>
                          </div>
                          <Switch
                            checked={settings.marketing}
                            onCheckedChange={(checked) => 
                              setSettings(s => ({ ...s, marketing: checked }))
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-none"
                  >
                    Alle akzeptieren
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAcceptNecessary}
                    className="flex-1 sm:flex-none"
                  >
                    Nur notwendige
                  </Button>
                  
                  {showDetails ? (
                    <Button
                      variant="ghost"
                      onClick={handleSaveSettings}
                      className="gap-2"
                    >
                      Auswahl speichern
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => setShowDetails(true)}
                      className="gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Anpassen</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Privacy Link */}
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Mehr erfahren Sie in unserer{' '}
                  <a href="/datenschutz" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

CookieConsentBanner.displayName = 'CookieConsentBanner';

export default CookieConsentBanner;
