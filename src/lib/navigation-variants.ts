/**
 * Navigation A/B Test System
 * 
 * 5 Varianten für Vergleich auf Mobile und Desktop
 * 
 * Switch via URL: ?nav=ultimate | ?nav=variant-b | ?nav=variant-c | ?nav=variant-d | ?nav=variant-e
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
  dropdownTitles: {
    preisrechner: string;
    firmen: string;
    services: string;
    ratgeber: string;
    fuerFirmen: string;
  };
  ctaCard: {
    preisrechner: { title: string; buttonText: string };
    firmen: { title: string; buttonText: string };
    services: { title: string; buttonText: string };
    ratgeber: { title: string; buttonText: string };
    fuerFirmen: { title: string; buttonText: string };
  };
}

// ============================================
// VARIANTE 1: ORIGINAL (Status Quo)
// ============================================
export const VARIANT_ULTIMATE: NavConfig = {
  id: 'ultimate',
  name: '1. Original (Status Quo)',
  description: 'Aktuelle Navigation wie sie jetzt ist',
  labels: {
    preisrechner: 'Preisrechner',
    firmen: 'Umzugsfirmen',
    services: 'Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'Für Firmen',
    cta: 'Offerten erhalten',
  },
  microcopy: {
    preisrechner: 'Umzugskosten berechnen in 60 Sekunden',
    firmen: 'Geprüfte Firmen in deiner Region',
    services: 'Reinigung, Lagerung, Entsorgung & mehr',
    ratgeber: 'Checklisten, Tipps & Anleitungen',
    fuerFirmen: 'Für Umzugsfirmen: Partner werden',
  },
  dropdownTitles: {
    preisrechner: 'KOSTEN BERECHNEN',
    firmen: 'UMZUGSFIRMEN FINDEN',
    services: 'ALLE SERVICES',
    ratgeber: 'RATGEBER',
    fuerFirmen: 'FÜR FIRMEN',
  },
  ctaCard: {
    preisrechner: { title: 'Kostenlose Offerten', buttonText: 'Preisrechner starten' },
    firmen: { title: 'Offerten in deiner Region', buttonText: 'Offerten anfordern' },
    services: { title: 'Service auswählen', buttonText: 'Offerten erhalten' },
    ratgeber: { title: 'Umzug jetzt starten', buttonText: 'Jetzt Offerten erhalten' },
    fuerFirmen: { title: 'Jetzt Partner werden', buttonText: 'Kostenlos registrieren' },
  },
};

// ============================================
// VARIANTE 2: ULTIMATE (Lovable Empfehlung)
// Action-First mit Verben, Swiss-optimiert
// ============================================
export const VARIANT_B: NavConfig = {
  id: 'variant-b',
  name: '2. Ultimate (Lovable)',
  description: 'Action-First mit Verben, conversion-fokussiert',
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
  dropdownTitles: {
    preisrechner: 'KOSTEN BERECHNEN',
    firmen: 'FIRMEN VERGLEICHEN',
    services: 'ALLE SERVICES',
    ratgeber: 'TIPPS & HILFE',
    fuerFirmen: 'FÜR ANBIETER',
  },
  ctaCard: {
    preisrechner: { title: 'Kosten klar. Umzug entspannt.', buttonText: 'Preisrechner starten' },
    firmen: { title: 'Offerten in deiner Region', buttonText: 'Offerten anfordern' },
    services: { title: 'Ein Paket. Alles drin.', buttonText: 'Services wählen' },
    ratgeber: { title: 'Kurz lesen. Dann Offerten.', buttonText: 'Jetzt Offerten erhalten' },
    fuerFirmen: { title: 'Wachse mit qualifizierten Leads', buttonText: 'Kostenlos registrieren' },
  },
};

// ============================================
// VARIANTE 3: ChatGPT Concierge
// Offerten zuerst, dann Planung
// ============================================
export const VARIANT_C: NavConfig = {
  id: 'variant-c',
  name: '3. ChatGPT Concierge',
  description: 'Offerten vergleichen zuerst, Planung danach',
  labels: {
    preisrechner: 'Offerten vergleichen',
    firmen: 'Kosten & Planung',
    services: 'Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'Für Firmen',
    cta: 'Offerten erhalten',
  },
  microcopy: {
    preisrechner: 'Region wählen → geprüfte Firmen → bis zu 40% sparen.',
    firmen: 'Preisrechner, Checkliste & Zeitplan in 2 Minuten.',
    services: 'Umzug, Reinigung, Montage & alles drumherum.',
    ratgeber: 'Tipps + Vorlagen + Downloads – kurz & nützlich.',
    fuerFirmen: 'Partner werden, Leads bekommen, Dashboard nutzen.',
  },
  dropdownTitles: {
    preisrechner: 'OFFERTEN VERGLEICHEN',
    firmen: 'KOSTEN & PLANUNG',
    services: 'SERVICES',
    ratgeber: 'RATGEBER',
    fuerFirmen: 'FÜR FIRMEN',
  },
  ctaCard: {
    preisrechner: { title: 'Offerten in deiner Region', buttonText: 'Offerten anfordern' },
    firmen: { title: 'Starte mit dem Preisrechner', buttonText: 'Preisrechner starten' },
    services: { title: 'Service auswählen & Offerten erhalten', buttonText: 'Offerten erhalten' },
    ratgeber: { title: 'Umzug jetzt starten', buttonText: 'Jetzt Offerten erhalten' },
    fuerFirmen: { title: 'Jetzt Partner werden', buttonText: 'Kostenlos registrieren' },
  },
};

// ============================================
// VARIANTE 4: Strategic Report (Premium-UX)
// Kosten & Planung zuerst, dann Offerten
// ============================================
export const VARIANT_D: NavConfig = {
  id: 'variant-d',
  name: '4. Strategic Report',
  description: 'Premium-UX: Kosten & Planung → Offerten vergleichen',
  labels: {
    preisrechner: 'Kosten & Planung',
    firmen: 'Offerten vergleichen',
    services: 'Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'Für Firmen',
    cta: 'Offerten erhalten',
  },
  microcopy: {
    preisrechner: 'Checkliste, Zeitplan, Kosten – in 2 Minuten Klarheit.',
    firmen: 'Region wählen, Firmen vergleichen, bis zu 40% sparen.',
    services: 'Reinigung, Lagerung & mehr für einen stressfreien Umzug.',
    ratgeber: 'Kurz, praktisch, sofort nutzbar.',
    fuerFirmen: 'Für Umzugsfirmen: Mehr qualifizierte Anfragen. Weniger Leerlauf.',
  },
  dropdownTitles: {
    preisrechner: 'KOSTEN & PLANUNG',
    firmen: 'OFFERTEN VERGLEICHEN',
    services: 'SERVICES',
    ratgeber: 'RATGEBER',
    fuerFirmen: 'FÜR FIRMEN',
  },
  ctaCard: {
    preisrechner: { title: 'Kosten klar. Umzug entspannt.', buttonText: 'Preisrechner starten' },
    firmen: { title: 'Offerten in deiner Region', buttonText: 'Offerten anfordern' },
    services: { title: 'Service auswählen & Offerten erhalten', buttonText: 'Offerten erhalten' },
    ratgeber: { title: 'Umzug jetzt starten', buttonText: 'Jetzt Offerten erhalten' },
    fuerFirmen: { title: 'Jetzt Partner werden', buttonText: 'Kostenlos registrieren' },
  },
};

// ============================================
// VARIANTE 5: Mobile-First Archetyp
// Kürzere Nomen, SEO-kompatibel
// ============================================
export const VARIANT_E: NavConfig = {
  id: 'variant-e',
  name: '5. Mobile-First Archetyp',
  description: 'Kürzere Nomen, Mobile-first, SEO-kompatibel',
  labels: {
    preisrechner: 'Kosten & Planung',
    firmen: 'Umzugsfirmen',
    services: 'Services',
    ratgeber: 'Tipps & Vorlagen',
    fuerFirmen: 'Für Firmen',
    cta: 'Offerten erhalten',
  },
  microcopy: {
    preisrechner: 'Preisvorschau in 2 Minuten, gratis & unverbindlich.',
    firmen: 'Zürich, Bern, Basel – Top Anbieter vergleichen.',
    services: 'Privatumzug, Firmenumzug, Reinigung & mehr.',
    ratgeber: 'Download, sofort nutzbar.',
    fuerFirmen: 'Kostenlos registrieren & Kunden gewinnen.',
  },
  dropdownTitles: {
    preisrechner: 'KOSTEN & PLANUNG',
    firmen: 'UMZUGSFIRMEN',
    services: 'SERVICES',
    ratgeber: 'TIPPS & VORLAGEN',
    fuerFirmen: 'FÜR FIRMEN',
  },
  ctaCard: {
    preisrechner: { title: 'Kosten klar. Umzug entspannt.', buttonText: 'Preisrechner starten' },
    firmen: { title: 'Offerten in deiner Region', buttonText: 'Offerten anfordern' },
    services: { title: 'Ein Paket. Alles drin.', buttonText: 'Services wählen' },
    ratgeber: { title: 'Kurz lesen. Dann Offerten.', buttonText: 'Jetzt Offerten erhalten' },
    fuerFirmen: { title: 'Wachse mit qualifizierten Leads', buttonText: 'Kostenlos registrieren' },
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
