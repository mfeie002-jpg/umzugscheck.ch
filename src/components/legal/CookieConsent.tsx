/**
 * Cookie Consent Banner (Swiss GDPR Compliant)
 * 
 * Features:
 * - Granular consent options
 * - Remembers preferences
 * - Non-intrusive design
 * - Accessible
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X, Cookie, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
};

const CONSENT_KEY = 'cookie_consent';
const PREFERENCES_KEY = 'cookie_preferences';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, 'true');
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);

    // Trigger analytics initialization if accepted
    if (prefs.analytics) {
      window.dispatchEvent(new CustomEvent('analytics-consent-granted'));
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const acceptNecessary = () => {
    saveConsent(DEFAULT_PREFERENCES);
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <div className="max-w-4xl mx-auto bg-background border border-border rounded-xl shadow-lg">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="cookie-title" className="text-lg font-semibold text-foreground">
                Wir respektieren Ihre Privatsphäre
              </h2>
              <p id="cookie-description" className="text-sm text-muted-foreground mt-1">
                Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unsere Website zu optimieren.
                Sie können wählen, welche Cookies Sie akzeptieren möchten.
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground p-1"
              aria-label="Schliessen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-primary hover:underline mt-4"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Weniger anzeigen
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Details anpassen
              </>
            )}
          </button>

          {/* Cookie Categories */}
          {showDetails && (
            <div className="mt-4 space-y-4 border-t border-border pt-4">
              {/* Necessary */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Notwendige Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Erforderlich für die grundlegende Funktionalität der Website.
                  </p>
                </div>
                <Switch checked={true} disabled aria-label="Notwendige Cookies (immer aktiviert)" />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Analyse-Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Helfen uns zu verstehen, wie Besucher unsere Website nutzen.
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
                  aria-label="Analyse-Cookies"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Marketing-Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Ermöglichen personalisierte Werbung und Inhalte.
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
                  aria-label="Marketing-Cookies"
                />
              </div>

              {/* Preferences */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Präferenz-Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Speichern Ihre Einstellungen für zukünftige Besuche.
                  </p>
                </div>
                <Switch
                  checked={preferences.preferences}
                  onCheckedChange={(checked) => setPreferences(p => ({ ...p, preferences: checked }))}
                  aria-label="Präferenz-Cookies"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button onClick={acceptAll} className="flex-1">
              Alle akzeptieren
            </Button>
            {showDetails ? (
              <Button onClick={saveCustom} variant="outline" className="flex-1">
                Auswahl speichern
              </Button>
            ) : (
              <Button onClick={acceptNecessary} variant="outline" className="flex-1">
                Nur notwendige
              </Button>
            )}
          </div>

          {/* Legal Links */}
          <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <a href="/datenschutz" className="hover:underline">Datenschutz</a>
            <a href="/impressum" className="hover:underline">Impressum</a>
            <a href="/cookies" className="hover:underline">Cookie-Richtlinie</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to check cookie consent
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(PREFERENCES_KEY);
    if (saved) {
      setConsent(JSON.parse(saved));
    }
  }, []);

  return {
    hasConsent: !!consent,
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
    preferences: consent?.preferences ?? false,
    updateConsent: () => {
      localStorage.removeItem(CONSENT_KEY);
      window.location.reload();
    },
  };
}
