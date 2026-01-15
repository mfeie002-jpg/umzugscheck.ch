/**
 * Navigation A/B Test System
 * 
 * 5 Varianten für Vergleich auf Mobile und Desktop
 */

export type NavVariant = 'ultimate' | 'variant-b' | 'variant-c' | 'variant-d' | 'variant-e';

export interface NavConfig {
  id: NavVariant;
  name: string;
  description: string;
  labels: {
    preisrechner: string;
    firmen: string;
    services: string;
    ratgeber: string;
    fuerFirmen: string;
    cta: string;
  };
  microcopy: {
    preisrechner: string;
    firmen: string;
    services: string;
    ratgeber: string;
    fuerFirmen: string;
  };
}

// VARIANTE A: ULTIMATE (Meine Empfehlung)
// Begründung: Action-First mit Verben, Swiss-optimiert, conversion-fokussiert
export const VARIANT_ULTIMATE: NavConfig = {
  id: 'ultimate',
  name: 'Ultimate (Empfohlen)',
  description: 'Action-First mit Verben, Swiss-optimiert, höchste Conversion',
  labels: {
    preisrechner: 'Kosten berechnen',
    firmen: 'Firmen vergleichen',
    services: 'Alle Services',
    ratgeber: 'Tipps & Hilfe',
    fuerFirmen: 'Für Anbieter',
    cta: 'Gratis Offerten',
  },
  microcopy: {
    preisrechner: 'Was kostet dein Umzug? In 60 Sekunden Klarheit.',
    firmen: 'Geprüfte Firmen in deiner Region vergleichen',
    services: 'Reinigung, Lagerung, Entsorgung & mehr',
    ratgeber: 'Checklisten, Spartipps & Anleitungen',
    fuerFirmen: 'Für Umzugsfirmen: Partner werden & Leads erhalten',
  },
};

// VARIANTE B: ChatGPT Option B (Premium/Concierge)
export const VARIANT_B: NavConfig = {
  id: 'variant-b',
  name: 'Premium Concierge',
  description: 'Weniger bloggy, mehr Service-Gefühl',
  labels: {
    preisrechner: 'Kosten & Planung',
    firmen: 'Top-Firmen & Preise',
    services: 'Umzugsservices',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'Für Firmen',
    cta: 'Offerten erhalten',
  },
  microcopy: {
    preisrechner: 'Checkliste, Zeitplan, Kosten – in 2 Minuten Klarheit.',
    firmen: 'Region wählen, Firmen vergleichen, bis zu 40% sparen.',
    services: 'Alles rund um Ihren Umzug aus einer Hand',
    ratgeber: 'Hilfreiche Tipps für Ihren stressfreien Umzug',
    fuerFirmen: 'Registrieren Sie sich und gewinnen Sie Kunden',
  },
};

// VARIANTE C: Movu-Inspired (Competitor Analysis)
export const VARIANT_C: NavConfig = {
  id: 'variant-c',
  name: 'Movu-Style',
  description: 'Inspiriert von Movu.ch - clean und direkt',
  labels: {
    preisrechner: 'Umzugsrechner',
    firmen: 'Umzugsfirmen',
    services: 'Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'Für Firmen',
    cta: 'Kostenlose Offerten',
  },
  microcopy: {
    preisrechner: 'Berechne jetzt die Kosten für deinen Umzug',
    firmen: 'Finde die beste Umzugsfirma in deiner Region',
    services: 'Reinigung, Lagerung, Möbelmontage & mehr',
    ratgeber: 'Nützliche Tipps & Checklisten',
    fuerFirmen: 'Werden Sie Partner und erhalten Sie Leads',
  },
};

// VARIANTE D: SEO-Heavy (Keyword-optimiert)
export const VARIANT_D: NavConfig = {
  id: 'variant-d',
  name: 'SEO-Heavy',
  description: 'Maximale Keyword-Dichte für organisches Ranking',
  labels: {
    preisrechner: 'Umzugskosten',
    firmen: 'Umzugsfirma finden',
    services: 'Umzugsservices',
    ratgeber: 'Umzugstipps',
    fuerFirmen: 'Für Umzugsfirmen',
    cta: 'Umzugsofferten',
  },
  microcopy: {
    preisrechner: 'Umzugskosten berechnen – Preise vergleichen',
    firmen: 'Günstige Umzugsfirma in Zürich, Bern, Basel finden',
    services: 'Umzugsreinigung, Möbellagerung, Entsorgung',
    ratgeber: 'Umzugscheckliste, Tipps & Kostenrechner',
    fuerFirmen: 'Umzugsfirma registrieren – Kunden gewinnen',
  },
};

// VARIANTE E: Minimal (Ultra-Clean)
export const VARIANT_E: NavConfig = {
  id: 'variant-e',
  name: 'Minimal Clean',
  description: 'Ultra-sauber, nur das Wesentliche',
  labels: {
    preisrechner: 'Preise',
    firmen: 'Firmen',
    services: 'Services',
    ratgeber: 'Hilfe',
    fuerFirmen: 'Partner',
    cta: 'Anfragen',
  },
  microcopy: {
    preisrechner: 'Kosten kalkulieren',
    firmen: 'Anbieter vergleichen',
    services: 'Alle Leistungen',
    ratgeber: 'Tipps & Tools',
    fuerFirmen: 'Partner werden',
  },
};

// Alle Varianten
export const NAV_VARIANTS: NavConfig[] = [
  VARIANT_ULTIMATE,
  VARIANT_B,
  VARIANT_C,
  VARIANT_D,
  VARIANT_E,
];

// Aktive Variante aus localStorage oder URL
export const getActiveVariant = (): NavConfig => {
  if (typeof window === 'undefined') return VARIANT_ULTIMATE;
  
  // Check URL param first
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('nav');
  if (urlVariant) {
    const found = NAV_VARIANTS.find(v => v.id === urlVariant);
    if (found) {
      localStorage.setItem('nav-variant', urlVariant);
      return found;
    }
  }
  
  // Then check localStorage
  const stored = localStorage.getItem('nav-variant');
  if (stored) {
    const found = NAV_VARIANTS.find(v => v.id === stored);
    if (found) return found;
  }
  
  return VARIANT_ULTIMATE;
};

export const setActiveVariant = (variant: NavVariant): void => {
  localStorage.setItem('nav-variant', variant);
  // Trigger page reload to apply changes
  window.location.reload();
};
