/**
 * Translation/i18n structure for future multi-language support
 * Currently configured for German (de-CH), easily extensible to other languages
 */

export type Language = 'de' | 'en' | 'fr' | 'it';

export interface Translations {
  common: {
    loading: string;
    error: string;
    success: string;
    submit: string;
    cancel: string;
    back: string;
    next: string;
    close: string;
    search: string;
    filter: string;
    clearFilters: string;
    noResults: string;
    tryAgain: string;
  };
  calculator: {
    quick: {
      title: string;
      subtitle: string;
      cta: string;
    };
    advanced: {
      title: string;
      subtitle: string;
    };
    ai: {
      title: string;
      subtitle: string;
      uploadPrompt: string;
      processing: string;
    };
    fields: {
      fromPostal: string;
      fromCity: string;
      toPostal: string;
      toCity: string;
      rooms: string;
      moveDate: string;
      floor: string;
      elevator: string;
    };
  };
  companies: {
    title: string;
    subtitle: string;
    verified: string;
    requestQuote: string;
    viewProfile: string;
    resultsCount: string;
    filters: {
      canton: string;
      rating: string;
      allCantons: string;
      allRatings: string;
    };
  };
  lead: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    success: {
      title: string;
      message: string;
      nextSteps: string;
    };
    fields: {
      name: string;
      email: string;
      phone: string;
      comments: string;
    };
  };
  errors: {
    network: string;
    validation: string;
    notFound: string;
    serverError: string;
  };
}

const de: Translations = {
  common: {
    loading: 'Lädt...',
    error: 'Fehler',
    success: 'Erfolgreich',
    submit: 'Absenden',
    cancel: 'Abbrechen',
    back: 'Zurück',
    next: 'Weiter',
    close: 'Schliessen',
    search: 'Suchen',
    filter: 'Filter',
    clearFilters: 'Filter zurücksetzen',
    noResults: 'Keine Ergebnisse gefunden',
    tryAgain: 'Bitte versuchen Sie es erneut',
  },
  calculator: {
    quick: {
      title: 'Schnell-Rechner',
      subtitle: 'Erhalten Sie in 60 Sekunden eine präzise Kostenschätzung',
      cta: 'Offerten vergleichen',
    },
    advanced: {
      title: 'Detaillierter Rechner',
      subtitle: 'Präzise Kalkulation mit allen Details für eine genaue Offerte',
    },
    ai: {
      title: 'KI-Rechner',
      subtitle: 'Laden Sie Fotos hoch und erhalten Sie eine automatische Schätzung',
      uploadPrompt: 'Fotos oder Videos hochladen',
      processing: 'Wird analysiert...',
    },
    fields: {
      fromPostal: 'Von (PLZ)',
      fromCity: 'Von (Ort)',
      toPostal: 'Nach (PLZ)',
      toCity: 'Nach (Ort)',
      rooms: 'Wohnungsgrösse',
      moveDate: 'Umzugsdatum',
      floor: 'Stockwerk',
      elevator: 'Lift vorhanden',
    },
  },
  companies: {
    title: 'Umzugsfirmen in der Schweiz',
    subtitle: 'Finden Sie geprüfte Umzugsunternehmen in Ihrer Region',
    verified: 'Geprüft',
    requestQuote: 'Offerte anfragen',
    viewProfile: 'Profil ansehen',
    resultsCount: 'Firmen gefunden',
    filters: {
      canton: 'Kanton',
      rating: 'Mindestbewertung',
      allCantons: 'Alle Kantone',
      allRatings: 'Alle Bewertungen',
    },
  },
  lead: {
    title: 'Kostenlose Offerten erhalten',
    subtitle: 'Schritt',
    step1: 'Kontakt',
    step2: 'Umzugsdetails',
    step3: 'Zusammenfassung',
    success: {
      title: 'Perfekt! Anfrage gesendet',
      message: 'Ihre Anfrage wurde erfolgreich übermittelt. Sie erhalten in Kürze bis zu 5 unverbindliche Offerten.',
      nextSteps: 'Was passiert jetzt?',
    },
    fields: {
      name: 'Vor- und Nachname',
      email: 'E-Mail-Adresse',
      phone: 'Telefonnummer',
      comments: 'Zusätzliche Informationen',
    },
  },
  errors: {
    network: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
    validation: 'Bitte überprüfen Sie Ihre Eingaben.',
    notFound: 'Die angeforderte Ressource wurde nicht gefunden.',
    serverError: 'Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
  },
};

// Placeholder for other languages
const en: Translations = {
  ...de, // Copy German for now, replace with English translations later
  common: {
    ...de.common,
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
};

const translations: Record<Language, Translations> = {
  de,
  en,
  fr: de, // Placeholder
  it: de, // Placeholder
};

// Current language - can be made dynamic later
let currentLanguage: Language = 'de';

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
};

export const getLanguage = (): Language => currentLanguage;

export const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

export default translations;
