/**
 * Micro-copy Optimization Library
 * Persuasive, conversion-focused text patterns
 * A/B testable copy variants
 */

// Types
type CopyContext = 'form' | 'cta' | 'trust' | 'error' | 'success' | 'loading' | 'empty';
type UserSegment = 'new' | 'returning' | 'high-intent' | 'price-sensitive';
type TimeContext = 'morning' | 'afternoon' | 'evening' | 'weekend';

interface MicrocopyOptions {
  context: CopyContext;
  variant?: 'A' | 'B' | 'C';
  userSegment?: UserSegment;
  timeContext?: TimeContext;
  data?: Record<string, any>;
}

// Copy variants for A/B testing
const copyVariants = {
  cta: {
    primary: {
      A: 'Kostenlose Offerten erhalten',
      B: 'Jetzt vergleichen & sparen',
      C: 'Offerten anfordern – gratis'
    },
    secondary: {
      A: 'Mehr erfahren',
      B: 'So funktioniert\'s',
      C: 'Details ansehen'
    },
    submit: {
      A: 'Offerten anfordern',
      B: 'Kostenlos anfragen',
      C: 'Jetzt absenden'
    }
  },
  trust: {
    guarantee: {
      A: '100% kostenlos & unverbindlich',
      B: 'Gratis & ohne Verpflichtungen',
      C: 'Komplett kostenfrei'
    },
    companies: {
      A: 'Geprüfte Umzugsfirmen',
      B: 'Nur verifizierte Partner',
      C: 'Qualitätsgeprüfte Anbieter'
    },
    speed: {
      A: 'Offerten in 24h',
      B: 'Schnelle Antworten garantiert',
      C: 'Innerhalb eines Tages'
    }
  },
  form: {
    email: {
      A: 'E-Mail für Ihre Offerten',
      B: 'Wohin sollen wir die Offerten senden?',
      C: 'Ihre E-Mail-Adresse'
    },
    phone: {
      A: 'Telefon (optional)',
      B: 'Für Rückfragen erreichbar?',
      C: 'Handynummer (optional)'
    },
    date: {
      A: 'Wann möchten Sie umziehen?',
      B: 'Ihr Wunschtermin',
      C: 'Umzugsdatum'
    }
  },
  error: {
    required: {
      A: 'Bitte ausfüllen',
      B: 'Dieses Feld ist erforderlich',
      C: 'Wird benötigt'
    },
    email: {
      A: 'Bitte gültige E-Mail eingeben',
      B: 'E-Mail-Format prüfen',
      C: 'Hmm, das sieht nicht richtig aus'
    },
    generic: {
      A: 'Etwas ist schiefgelaufen',
      B: 'Ein Fehler ist aufgetreten',
      C: 'Ups, das hat nicht geklappt'
    }
  },
  success: {
    submitted: {
      A: 'Anfrage erfolgreich gesendet! 🎉',
      B: 'Geschafft! Ihre Anfrage ist unterwegs',
      C: 'Super! Wir haben Ihre Anfrage erhalten'
    },
    nextSteps: {
      A: 'Sie erhalten in Kürze Offerten per E-Mail',
      B: 'Unsere Partner melden sich innerhalb von 24h',
      C: 'Prüfen Sie Ihren Posteingang für Offerten'
    }
  },
  loading: {
    search: {
      A: 'Suche passende Firmen...',
      B: 'Finde die besten Anbieter für Sie...',
      C: 'Gleich haben wir Ihre Matches...'
    },
    submit: {
      A: 'Wird gesendet...',
      B: 'Anfrage wird übermittelt...',
      C: 'Einen Moment bitte...'
    },
    calculate: {
      A: 'Berechne Preis...',
      B: 'Ermittle Ihre Kostenschätzung...',
      C: 'Preis wird kalkuliert...'
    }
  },
  empty: {
    noResults: {
      A: 'Keine Ergebnisse gefunden',
      B: 'Leider keine Treffer',
      C: 'Hmm, nichts gefunden'
    },
    tryAgain: {
      A: 'Andere Kriterien probieren',
      B: 'Suche anpassen',
      C: 'Neu suchen'
    }
  }
};

// Dynamic copy with personalization
const dynamicCopy = {
  greeting: (timeContext: TimeContext): string => {
    const greetings = {
      morning: 'Guten Morgen',
      afternoon: 'Guten Tag',
      evening: 'Guten Abend',
      weekend: 'Schönes Wochenende'
    };
    return greetings[timeContext];
  },

  urgency: (daysUntilMove: number): string => {
    if (daysUntilMove <= 7) return '⚡ Eilauftrag - Schnelle Verfügbarkeit gefragt';
    if (daysUntilMove <= 14) return '🔔 Bald ist es soweit - Jetzt Offerten sichern';
    if (daysUntilMove <= 30) return '📅 Gute Planung - Sie sind früh dran!';
    return '✨ Optimal - Beste Auswahl verfügbar';
  },

  savings: (estimatedSavings: number): string => {
    if (estimatedSavings >= 1000) return `Bis zu CHF ${estimatedSavings} sparen möglich`;
    if (estimatedSavings >= 500) return `Durchschnittlich CHF ${estimatedSavings} Ersparnis`;
    return 'Beste Preise vergleichen';
  },

  social: (recentUsers: number): string => {
    if (recentUsers >= 50) return `${recentUsers}+ Anfragen heute`;
    if (recentUsers >= 20) return `Beliebt: ${recentUsers} Anfragen in der letzten Stunde`;
    return 'Vertraut von Schweizer Familien';
  },

  personalized: (name: string | undefined): string => {
    if (name) return `Hallo ${name}, bereit für Ihren Umzug?`;
    return 'Bereit für Ihren Umzug?';
  }
};

// Helper function to get current time context
function getTimeContext(): TimeContext {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  if (day === 0 || day === 6) return 'weekend';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

// Main microcopy getter
export function getMicrocopy(
  category: keyof typeof copyVariants,
  key: string,
  options: Partial<MicrocopyOptions> = {}
): string {
  const { variant = 'A' } = options;

  const categoryVariants = copyVariants[category] as Record<string, Record<string, string>>;
  const keyVariants = categoryVariants?.[key];

  if (!keyVariants) {
    console.warn(`Microcopy not found: ${category}.${key}`);
    return key;
  }

  return keyVariants[variant] || keyVariants['A'] || key;
}

// Dynamic copy getter
export function getDynamicCopy(
  type: keyof typeof dynamicCopy,
  data?: Record<string, any>
): string {
  switch (type) {
    case 'greeting':
      return dynamicCopy.greeting(getTimeContext());
    case 'urgency':
      return dynamicCopy.urgency(data?.daysUntilMove || 30);
    case 'savings':
      return dynamicCopy.savings(data?.estimatedSavings || 500);
    case 'social':
      return dynamicCopy.social(data?.recentUsers || 25);
    case 'personalized':
      return dynamicCopy.personalized(data?.name);
    default:
      return '';
  }
}

// CTA copy with context awareness
export function getCtaCopy(type: 'primary' | 'secondary' | 'submit', options?: {
  userSegment?: UserSegment;
  isUrgent?: boolean;
  hasDiscount?: boolean;
}): string {
  const { userSegment, isUrgent, hasDiscount } = options || {};

  // Context-aware adjustments
  if (isUrgent && type === 'primary') {
    return '⚡ Jetzt schnell Offerten sichern';
  }

  if (hasDiscount && type === 'primary') {
    return '🎁 Sonderangebot sichern';
  }

  if (userSegment === 'returning' && type === 'primary') {
    return 'Neue Offerten anfordern';
  }

  if (userSegment === 'price-sensitive' && type === 'primary') {
    return 'Günstigste Angebote finden';
  }

  return getMicrocopy('cta', type);
}

// Form microcopy helper
export function getFormCopy(field: string, options?: { variant?: 'A' | 'B' | 'C' }): {
  label: string;
  placeholder: string;
  error: string;
} {
  const fieldLabels: Record<string, { label: string; placeholder: string; error: string }> = {
    email: {
      label: getMicrocopy('form', 'email', options),
      placeholder: 'ihre.email@beispiel.ch',
      error: getMicrocopy('error', 'email', options)
    },
    phone: {
      label: getMicrocopy('form', 'phone', options),
      placeholder: '079 123 45 67',
      error: 'Bitte gültige Telefonnummer eingeben'
    },
    name: {
      label: 'Ihr Name',
      placeholder: 'Max Mustermann',
      error: 'Bitte Namen eingeben'
    },
    plz: {
      label: 'PLZ',
      placeholder: '8000',
      error: 'Bitte gültige PLZ eingeben'
    },
    date: {
      label: getMicrocopy('form', 'date', options),
      placeholder: 'Datum wählen',
      error: 'Bitte Datum wählen'
    }
  };

  return fieldLabels[field] || {
    label: field,
    placeholder: '',
    error: getMicrocopy('error', 'required', options)
  };
}

// Export everything
export const microcopy = {
  get: getMicrocopy,
  dynamic: getDynamicCopy,
  cta: getCtaCopy,
  form: getFormCopy,
  variants: copyVariants
};

export default microcopy;
