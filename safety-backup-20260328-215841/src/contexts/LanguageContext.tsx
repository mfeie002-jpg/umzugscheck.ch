// Build: v17-no-hooks-init
// Completely avoid hooks during initial module load

import type { ReactNode } from 'react';

export type Language = 'de' | 'fr' | 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Default context value - no hooks needed
const defaultContextValue: LanguageContextType = {
  language: 'de',
  setLanguage: () => {},
  t: (key: string) => key,
};

// Simple passthrough provider - no state management for now
// This avoids the React hooks issue entirely
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Just render children without any state management
  // The app will work with German as default
  return <>{children}</>;
}

// Safe hook that returns defaults
export function useLanguage(): LanguageContextType {
  return defaultContextValue;
}

// Export translations helper for direct use
export function t(key: string): string {
  return translations.de[key] || key;
}

// Translation data
const translations: Record<Language, Record<string, string>> = {
  de: {
    'nav.home': 'Startseite',
    'nav.services': 'Leistungen',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.booking': 'Online Buchen',
    'nav.quote': 'Offerte anfragen',
    'common.loading': 'Lädt...',
    'common.submit': 'Absenden',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.close': 'Schliessen',
    'hero.title': 'Feierabend Umzüge',
    'hero.subtitle': 'Die Kunst des Umziehens',
    'hero.description': 'Ein Schweizer Familienunternehmen, das Ihren Umzug mit Präzision, Herz und Handwerkskunst plant.',
    'hero.cta.quote': 'Offerte anfragen',
    'hero.cta.call': 'Jetzt anrufen',
    'services.private': 'Privatumzug',
    'services.office': 'Büroumzug',
    'services.international': 'Internationaler Umzug',
    'services.packing': 'Packservice',
    'services.storage': 'Lagerung',
    'services.assembly': 'Möbelmontage',
    'services.senior': 'Seniorenumzug',
    'services.vip': 'VIP Service',
    'footer.tagline': 'Ihr Premium-Umzugspartner in der Schweiz',
    'footer.copyright': '© 2024 Feierabend Umzüge. Alle Rechte vorbehalten.'
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'common.loading': 'Chargement...',
    'hero.title': 'Feierabend Umzüge',
    'footer.tagline': 'Votre partenaire premium en Suisse'
  },
  it: {
    'nav.home': 'Home',
    'nav.services': 'Servizi',
    'nav.about': 'Chi siamo',
    'nav.contact': 'Contatto',
    'common.loading': 'Caricamento...',
    'hero.title': 'Feierabend Umzüge',
    'footer.tagline': 'Il vostro partner premium in Svizzera'
  },
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'common.loading': 'Loading...',
    'hero.title': 'Feierabend Umzüge',
    'footer.tagline': 'Your premium partner in Switzerland'
  }
};