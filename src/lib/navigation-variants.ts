/**
 * Navigation A/B Test System
 * 
 * 5 Varianten für Vergleich auf Mobile und Desktop
 * 
 * Switch via URL: ?nav=ultimate | ?nav=variant-b | ?nav=variant-c | ?nav=variant-d | ?nav=variant-e
 */

export type NavVariant = 'ultimate' | 'variant-b' | 'variant-c' | 'variant-d' | 'variant-e' | 'variant-f' | 'variant-g' | 'variant-h' | 'variant-i' | 'variant-j' | 'variant-k' | 'variant-l' | 'variant-m' | 'variant-n';

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

// ============================================
// VARIANTE 6: Conversion-Killer (Archetyp Final)
// Aggressiv auf Conversion, aber mit Schweizer Sicherheit
// ============================================
export const VARIANT_F: NavConfig = {
  id: 'variant-f',
  name: '6. Conversion-Killer',
  description: 'Aggressiv auf Conversion getrimmt, Schweizer Sicherheit',
  labels: {
    preisrechner: 'Kosten & Planung',
    firmen: 'Offerten vergleichen',
    services: 'Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'Für Firmen',
    cta: 'Offerten erhalten',
  },
  microcopy: {
    preisrechner: 'Budget berechnen, Checklisten & Zeitplan.',
    firmen: 'Top-Firmen in deiner Region, bis 40% sparen.',
    services: 'Reinigung, Lagerung & Umzugskartons.',
    ratgeber: 'Tipps, Vorlagen & Behördengänge.',
    fuerFirmen: 'Partner werden & B2B Umzüge.',
  },
  dropdownTitles: {
    preisrechner: 'KOSTEN & PLANUNG',
    firmen: 'OFFERTEN VERGLEICHEN',
    services: 'SERVICES',
    ratgeber: 'RATGEBER',
    fuerFirmen: 'FÜR FIRMEN',
  },
  ctaCard: {
    preisrechner: { title: 'Budget geklärt?', buttonText: 'Jetzt Preise vergleichen' },
    firmen: { title: 'Lokale Umzugsfirmen', buttonText: 'Offerten anfordern' },
    services: { title: 'Service auswählen', buttonText: 'Offerten erhalten' },
    ratgeber: { title: 'Keine Lust zu lesen?', buttonText: 'Anfrage starten' },
    fuerFirmen: { title: 'Jetzt Partner werden', buttonText: 'Kostenlos registrieren' },
  },
};

// ============================================
// VARIANTE 7: User Journey Split
// Umzug planen vs. Umzugsfirma finden
// ============================================
export const VARIANT_G: NavConfig = {
  id: 'variant-g',
  name: '7. User Journey Split',
  description: 'Klassische Trennung: Planen vs. Finden',
  labels: {
    preisrechner: 'Umzug planen',
    firmen: 'Umzugsfirma finden',
    services: 'Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'Für Firmen',
    cta: 'Offerten erhalten',
  },
  microcopy: {
    preisrechner: 'Tools & Tipps für deinen Umzug.',
    firmen: 'Vergleiche Firmen & Preise.',
    services: 'Alle Umzugs-Services & Zusatzleistungen.',
    ratgeber: 'Guides, Checklisten & Spar-Tipps.',
    fuerFirmen: 'Partner werden & Firmenumzüge.',
  },
  dropdownTitles: {
    preisrechner: 'UMZUG PLANEN',
    firmen: 'UMZUGSFIRMA FINDEN',
    services: 'SERVICES',
    ratgeber: 'RATGEBER',
    fuerFirmen: 'FÜR FIRMEN',
  },
  ctaCard: {
    preisrechner: { title: 'Bereit für Offerten?', buttonText: 'Preisrechner starten' },
    firmen: { title: 'Offerten in deiner Region', buttonText: 'Offerten anfordern' },
    services: { title: 'Service auswählen', buttonText: 'Offerten erhalten' },
    ratgeber: { title: 'Umzug jetzt starten', buttonText: 'Jetzt Offerten erhalten' },
    fuerFirmen: { title: 'Jetzt Partner werden', buttonText: 'Kostenlos registrieren' },
  },
};

// ============================================
// VARIANTE 8: Zielgruppen-Split (Privat/Firma)
// Trennung nach Kundentyp: Privat vs. Business
// ============================================
export const VARIANT_H: NavConfig = {
  id: 'variant-h',
  name: '8. Zielgruppen-Split',
  description: 'Trennung nach Kundentyp: Privatumzug vs. Firmenumzug',
  labels: {
    preisrechner: 'Privatumzug',
    firmen: 'Firmenumzug',
    services: 'Umzugsfirmen',
    ratgeber: 'Planung & Checkliste',
    fuerFirmen: 'Zusatzservices',
    cta: 'Offerten erhalten',
  },
  microcopy: {
    preisrechner: 'Alles für Ihren stressfreien Wohnungswechsel.',
    firmen: 'Effiziente Büroumzüge für Unternehmen.',
    services: 'Vergleichen Sie geprüfte Umzugsunternehmen.',
    ratgeber: 'Checklisten, Zeitpläne und Kostenrechner.',
    fuerFirmen: 'Packservice, Reinigung, Möbellifte & mehr.',
  },
  dropdownTitles: {
    preisrechner: 'PRIVATUMZUG',
    firmen: 'FIRMENUMZUG',
    services: 'UMZUGSFIRMEN',
    ratgeber: 'PLANUNG & CHECKLISTE',
    fuerFirmen: 'ZUSATZSERVICES',
  },
  ctaCard: {
    preisrechner: { title: 'Geprüfte Umzugspartner', buttonText: 'Offerten erhalten' },
    firmen: { title: 'Firmenkunden-Spezialisten', buttonText: 'Offerten erhalten' },
    services: { title: 'Alle Kantone abgedeckt', buttonText: 'Offerten anfordern' },
    ratgeber: { title: 'Gratis Planungstool', buttonText: 'Offerten erhalten' },
    fuerFirmen: { title: 'Alle Zusatzleistungen', buttonText: 'Offerten erhalten' },
  },
};

// ============================================
// VARIANTE 9: Allgemeines Menu-Konzept
// Basierend auf Menu-Archetypen (UI, Kulinarik, Gaming)
// ============================================
export const VARIANT_I: NavConfig = {
  id: 'variant-i',
  name: '9. Allgemeines Menu-Konzept',
  description: 'Sticky Top Nav + Mega Menu: Klarheit & Übersicht',
  labels: {
    preisrechner: 'Kosten berechnen',
    firmen: 'Firmen finden',
    services: 'Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'Für Anbieter',
    cta: 'Offerten vergleichen',
  },
  microcopy: {
    preisrechner: 'Preisvorschau in 2 Min. Der Nutzer weiß immer, wo er ist.',
    firmen: 'Region wählen → Firmen vergleichen → Übersicht auf einen Blick.',
    services: 'Alle Optionen kategorisiert, kognitive Entlastung.',
    ratgeber: 'Tipps, Vorlagen & Downloads. Keine verschachtelten Menüs.',
    fuerFirmen: 'Partner werden. Tab Bar für Mobile (Daumen erreichbar).',
  },
  dropdownTitles: {
    preisrechner: 'KOSTEN BERECHNEN',
    firmen: 'FIRMEN FINDEN',
    services: 'SERVICES',
    ratgeber: 'RATGEBER',
    fuerFirmen: 'FÜR ANBIETER',
  },
  ctaCard: {
    preisrechner: { title: 'Mega Menu Übersicht', buttonText: 'Preisrechner starten' },
    firmen: { title: 'Alle Optionen auf einen Blick', buttonText: 'Offerten anfordern' },
    services: { title: 'Kategorisiert & Hierarchisch', buttonText: 'Service wählen' },
    ratgeber: { title: 'Kein Kurzzeitgedächtnis-Problem', buttonText: 'Ratgeber lesen' },
    fuerFirmen: { title: 'Mobile-first Tab Bar', buttonText: 'Partner werden' },
  },
};

// ============================================
// VARIANTE 10: Conversion-Killer Final
// ChatGPT Empfehlung: Action-first, schärfste Wortwahl
// ============================================
export const VARIANT_J: NavConfig = {
  id: 'variant-j',
  name: '10. Conversion-Killer Final',
  description: 'Action-first, schärfste Wortwahl, maximale Conversion',
  labels: {
    preisrechner: 'Kosten berechnen',
    firmen: 'Offerten vergleichen',
    services: 'Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'Für Anbieter',
    cta: 'Gratis Offerten',
  },
  microcopy: {
    preisrechner: 'Preisvorschau in 2 Min. Kostenlos & unverbindlich.',
    firmen: 'Geprüfte Umzugsfirmen in deiner Region. Bis zu 40% sparen.',
    services: 'Umzug, Reinigung, Packen, Lift, Entsorgung. Alles aus einer Hand.',
    ratgeber: 'Checklisten, Vorlagen & Tipps. Kurz, praktisch, sofort nutzbar.',
    fuerFirmen: 'Partner werden, Leads erhalten, Dashboard nutzen.',
  },
  dropdownTitles: {
    preisrechner: 'KOSTEN BERECHNEN',
    firmen: 'OFFERTEN VERGLEICHEN',
    services: 'SERVICES',
    ratgeber: 'RATGEBER',
    fuerFirmen: 'FÜR ANBIETER',
  },
  ctaCard: {
    preisrechner: { title: 'In 2 Minuten Klarheit', buttonText: 'Preisrechner starten' },
    firmen: { title: '3–5 Offerten in 24–48h', buttonText: 'Gratis Offerten' },
    services: { title: 'Komplettpaket möglich', buttonText: 'Gratis Offerten' },
    ratgeber: { title: 'Schnellstart in 5 Minuten', buttonText: 'Checkliste herunterladen' },
    fuerFirmen: { title: 'Mehr Anfragen. Weniger Leerstand.', buttonText: 'Kostenlos registrieren' },
  },
};

// ============================================
// VARIANTE 11: Simpel & Clean
// 6 Hauptpunkte, minimale Submenüs, klare Fokussierung
// ============================================
export const VARIANT_K: NavConfig = {
  id: 'variant-k',
  name: '11. Simpel & Clean',
  description: '6 Punkte: Umzug, Reinigung, Services, Ratgeber, So funktioniert\'s + CTA',
  labels: {
    preisrechner: 'Umzug',
    firmen: 'Umzugsreinigung',
    services: 'Weitere Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'So funktioniert\'s',
    cta: 'Jetzt Offerten vergleichen',
  },
  microcopy: {
    preisrechner: 'Privatumzug – alles für Ihren stressfreien Wohnungswechsel.',
    firmen: 'Endreinigung mit Abgabegarantie.',
    services: 'Entsorgung, Lagerung, Möbelmontage.',
    ratgeber: 'Checklisten, Tipps & Tricks zum Download.',
    fuerFirmen: 'Transparent: Von der Anfrage bis zur Offerte.',
  },
  dropdownTitles: {
    preisrechner: 'UMZUG',
    firmen: 'UMZUGSREINIGUNG',
    services: 'WEITERE SERVICES',
    ratgeber: 'RATGEBER',
    fuerFirmen: 'SO FUNKTIONIERT\'S',
  },
  ctaCard: {
    preisrechner: { title: 'Privatumzug starten', buttonText: 'Offerten erhalten' },
    firmen: { title: 'Reinigung mit Garantie', buttonText: 'Offerten erhalten' },
    services: { title: 'Alles aus einer Hand', buttonText: 'Offerten erhalten' },
    ratgeber: { title: 'Kurz & praktisch', buttonText: 'Checkliste herunterladen' },
    fuerFirmen: { title: 'So einfach geht\'s', buttonText: 'Mehr erfahren' },
  },
};

// ============================================
// VARIANTE 12: Optimiert (Best-of-Breed)
// ChatGPT Empfehlung: V10 Basis + Verbesserungen
// ============================================
export const VARIANT_L: NavConfig = {
  id: 'variant-l',
  name: '12. Optimiert (Best-of-Breed)',
  description: 'V10 Basis + Benefit-Sublines + visuelle Trennung',
  labels: {
    preisrechner: 'Preise berechnen',
    firmen: 'Umzugsfirma finden',
    services: 'Reinigung & Services',
    ratgeber: 'Checklisten & Ratgeber',
    fuerFirmen: 'Für Anbieter',
    cta: 'Gratis Offerten',
  },
  microcopy: {
    preisrechner: 'In 2 Minuten zum Richtpreis & Gratis-Offerten.',
    firmen: 'Geprüfte Firmen in deiner Region. Bis zu 40% sparen.',
    services: 'Mit Abnahmegarantie, Lagerung & Entsorgung.',
    ratgeber: 'Zeitpläne, Spartipps und Vorlagen zum Download.',
    fuerFirmen: 'Partner werden, Leads erhalten, Dashboard nutzen.',
  },
  dropdownTitles: {
    preisrechner: 'PREISE BERECHNEN',
    firmen: 'UMZUGSFIRMA FINDEN',
    services: 'REINIGUNG & SERVICES',
    ratgeber: 'CHECKLISTEN & RATGEBER',
    fuerFirmen: 'FÜR ANBIETER',
  },
  ctaCard: {
    preisrechner: { title: 'Kostenlos & unverbindlich', buttonText: 'Preisrechner starten' },
    firmen: { title: '3–5 Offerten in 24–48h', buttonText: 'Gratis Offerten' },
    services: { title: 'Mit Abnahmegarantie', buttonText: 'Offerten erhalten' },
    ratgeber: { title: 'Kurz lesen. Dann Offerten.', buttonText: 'Checkliste herunterladen' },
    fuerFirmen: { title: 'Mehr Anfragen. Weniger Leerstand.', buttonText: 'Kostenlos registrieren' },
  },
};

// ============================================
// VARIANTE 13: Mobile-First Optimiert
// Komplett überarbeitete Struktur nach UX-Feedback
// ============================================
export const VARIANT_M: NavConfig = {
  id: 'variant-m',
  name: '13. Mobile-First Optimiert',
  description: '4 Hauptpunkte: Planen, Offerten, Funktioniert, Hilfe – Du-Form',
  labels: {
    preisrechner: 'Plane deinen Umzug',
    firmen: 'Offerten vergleichen',
    services: 'So funktioniert\'s',
    ratgeber: 'Hilfe & Kontakt',
    fuerFirmen: 'Für Anbieter',
    cta: 'Gratis Offerten',
  },
  microcopy: {
    preisrechner: 'Tools, Checklisten & Tipps, damit du stressfrei an alles denkst.',
    firmen: 'Hol dir gratis Offerten von geprüften Umzugsfirmen & finde das beste Angebot.',
    services: 'In 3 Schritten zu deinem stressfreien Umzug – transparent, sicher und einfach.',
    ratgeber: 'Wir sind für dich da – FAQ, Tipps und persönlicher Support.',
    fuerFirmen: 'Partner werden, Leads erhalten, Dashboard nutzen.',
  },
  dropdownTitles: {
    preisrechner: 'PLANE DEINEN UMZUG',
    firmen: 'OFFERTEN VERGLEICHEN',
    services: 'SO FUNKTIONIERT\'S',
    ratgeber: 'HILFE & KONTAKT',
    fuerFirmen: 'FÜR ANBIETER',
  },
  ctaCard: {
    preisrechner: { title: 'Bereit für den nächsten Schritt?', buttonText: 'Gratis Offerten holen' },
    firmen: { title: 'Gratis & unverbindlich', buttonText: 'Jetzt Offerten holen' },
    services: { title: 'In 3 Schritten zum Umzug', buttonText: 'Jetzt starten' },
    ratgeber: { title: 'Lieber telefonieren?', buttonText: 'Anrufen' },
    fuerFirmen: { title: 'Mehr Anfragen. Weniger Leerstand.', buttonText: 'Partner werden' },
  },
};

// ============================================
// VARIANTE 14: 2026 Design
// 5 Hauptsektionen + Context-Aware CTA
// ============================================
export const VARIANT_N: NavConfig = {
  id: 'variant-n',
  name: '14. 2026 Design',
  description: '5 Sektionen: Umzug planen, Umzugsfirmen, Services, Ratgeber, So funktioniert\'s + Context-Aware CTA',
  labels: {
    preisrechner: 'Umzug planen',
    firmen: 'Umzugsfirmen',
    services: 'Services',
    ratgeber: 'Ratgeber',
    fuerFirmen: 'So funktioniert\'s',
    cta: 'Offerten erhalten',
  },
  microcopy: {
    preisrechner: 'Tools, Tipps & Rechner für deinen Zügeltag',
    firmen: '200+ geprüfte Partner – Umzugsfirma finden & sparen',
    services: 'Rundum-Service: Reinigung, Lagerung, Entsorgung & mehr',
    ratgeber: 'Tipps & Tricks für einen stressfreien Umzug',
    fuerFirmen: 'Stressfrei in 3 Schritten – so funktioniert Umzugscheck',
  },
  dropdownTitles: {
    preisrechner: 'UMZUG PLANEN',
    firmen: 'UMZUGSFIRMEN',
    services: 'SERVICES',
    ratgeber: 'RATGEBER',
    fuerFirmen: 'SO FUNKTIONIERT\'S',
  },
  ctaCard: {
    preisrechner: { title: 'Bereit für Offerten?', buttonText: 'Preisrechner starten' },
    firmen: { title: '200+ geprüfte Partner', buttonText: 'Offerten anfordern' },
    services: { title: 'Rundum sorglos', buttonText: 'Offerten erhalten' },
    ratgeber: { title: 'Umzug jetzt starten', buttonText: 'Jetzt Offerten erhalten' },
    fuerFirmen: { title: 'So einfach geht\'s', buttonText: 'Mehr erfahren' },
  },
};

// Alle Varianten
export const NAV_VARIANTS: NavConfig[] = [
  VARIANT_ULTIMATE,
  VARIANT_B,
  VARIANT_C,
  VARIANT_D,
  VARIANT_E,
  VARIANT_F,
  VARIANT_G,
  VARIANT_H,
  VARIANT_I,
  VARIANT_J,
  VARIANT_K,
  VARIANT_L,
  VARIANT_M,
  VARIANT_N,
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
