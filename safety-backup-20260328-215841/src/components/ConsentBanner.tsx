/**
 * GDPR/Privacy Consent Banner
 * 
 * Displays consent options for analytics tracking
 * Must be shown before any analytics events are fired
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Settings, X } from 'lucide-react';
import { 
  hasConsentBeenGiven, 
  acceptAll, 
  acceptNecessaryOnly, 
  getConsent,
  setConsent 
} from '@/lib/consent';

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    // Show banner if consent hasn't been given yet
    if (!hasConsentBeenGiven()) {
      // Small delay for better UX
      const timeout = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    acceptNecessaryOnly();
    setIsVisible(false);
  };

  const handleSaveSettings = () => {
    setConsent({ analytics: analyticsEnabled });
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
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-border overflow-hidden">
          {!showSettings ? (
            // Main banner
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    Datenschutz-Einstellungen
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Wir nutzen Cookies und ähnliche Technologien, um Ihnen die bestmögliche 
                    Nutzererfahrung zu bieten und unsere Website zu verbessern.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3">
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
                    <Button
                      variant="ghost"
                      onClick={() => setShowSettings(true)}
                      className="gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Einstellungen</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Settings panel
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Cookie-Einstellungen</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Necessary cookies - always on */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-foreground">Notwendige Cookies</p>
                    <p className="text-xs text-muted-foreground">
                      Erforderlich für grundlegende Funktionen
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Immer aktiv
                  </div>
                </div>
                
                {/* Analytics cookies - toggleable */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-foreground">Analyse-Cookies</p>
                    <p className="text-xs text-muted-foreground">
                      Helfen uns, die Website zu verbessern
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleSaveSettings} className="flex-1">
                  Einstellungen speichern
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ConsentBanner;
