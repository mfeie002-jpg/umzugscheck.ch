/**
 * Press Kit & PR System
 * Media assets, press releases, and downloadable materials
 */

export interface PressRelease {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: 'launch' | 'milestone' | 'partnership' | 'product' | 'funding';
  content: string;
  boilerplate: string;
  contactInfo: ContactInfo;
  status: 'draft' | 'ready' | 'published';
}

export interface ContactInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'logo' | 'screenshot' | 'infographic' | 'photo' | 'video';
  format: string;
  dimensions?: string;
  url: string;
  thumbnail?: string;
  usage: string;
}

export interface CompanyFact {
  label: string;
  value: string;
  icon: string;
}

// Company boilerplate (About Us)
export const COMPANY_BOILERPLATE = {
  short: `Umzugscheck.ch ist die führende Schweizer Vergleichsplattform für Umzugsdienstleistungen. Mit KI-gestützter Technologie verbindet die Plattform Privatpersonen und Unternehmen mit geprüften Umzugsfirmen – transparent, kostenlos und in wenigen Minuten.`,
  
  medium: `Umzugscheck.ch revolutioniert den Schweizer Umzugsmarkt mit einer intelligenten Vergleichsplattform. Durch den Einsatz von Künstlicher Intelligenz – darunter Video-Inventarisierung und automatisierte Behördenkommunikation – reduziert die Plattform den Aufwand für Umziehende um bis zu 80%. Über 200 geprüfte Partner-Unternehmen und mehr als 15'000 erfolgreiche Vermittlungen machen Umzugscheck.ch zur ersten Wahl für stressfreies Umziehen in der Schweiz.`,
  
  long: `Umzugscheck.ch ist die modernste Umzugs-Vergleichsplattform der Schweiz, gegründet mit dem Ziel, den fragmentierten Umzugsmarkt zu digitalisieren und für Konsumenten transparent zu machen. 

Die Plattform nutzt fortschrittliche KI-Technologie, um den gesamten Umzugsprozess zu vereinfachen: Von der automatischen Volumenberechnung per Smartphone-Video über den Vergleich von bis zu 5 Offerten geprüfter Umzugsfirmen bis hin zur digitalen Abwicklung von Ummeldungen und Versorgerwechseln.

Mit einem einzigartigen Treuhand-Zahlungssystem bietet Umzugscheck.ch maximale Sicherheit für beide Seiten. Das Geschäftsmodell basiert auf Provisionen und Mehrwertdiensten – für Endkunden ist die Nutzung der Plattform vollständig kostenlos.

Die Vision: Jeder Umzug in der Schweiz – stressfrei, fair und digital.`,
};

// Key company facts
export const COMPANY_FACTS: CompanyFact[] = [
  { label: 'Gegründet', value: '2024', icon: '📅' },
  { label: 'Hauptsitz', value: 'Schweiz', icon: '🇨🇭' },
  { label: 'Partner-Firmen', value: '200+', icon: '🤝' },
  { label: 'Vermittelte Umzüge', value: '15\'000+', icon: '🚚' },
  { label: 'Kundenbewertung', value: '4.8/5 ⭐', icon: '⭐' },
  { label: 'Städte abgedeckt', value: '26+', icon: '🏙️' },
  { label: 'Durchschnittl. Ersparnis', value: 'bis 40%', icon: '💰' },
  { label: 'Antwortzeit', value: '< 24 Stunden', icon: '⚡' },
];

// Key differentiators for press
export const KEY_DIFFERENTIATORS = [
  {
    title: 'KI-Video-Inventarisierung',
    description: 'Weltweit erste Plattform mit automatischer Möbelerkennung per Smartphone-Video',
    newsworthy: 'Technologie-Innovation',
  },
  {
    title: 'Treuhand-Zahlungssystem',
    description: 'Fintech-Integration für maximale Sicherheit bei Umzugszahlungen',
    newsworthy: 'Consumer Protection',
  },
  {
    title: 'Digitale Behördenanbindung',
    description: 'Automatisierte Ummeldung bei Gemeinden und Versorgern per API',
    newsworthy: 'GovTech / E-Government',
  },
  {
    title: '95% KI-Automatisierung',
    description: 'Hochskalierbare Plattform mit minimalem Personaleinsatz',
    newsworthy: 'AI-First Business Model',
  },
];

// Press release templates
export const PRESS_RELEASES: PressRelease[] = [
  {
    id: 'launch-2024',
    title: 'Umzugscheck.ch startet: Schweizer Startup revolutioniert Umzugsmarkt mit KI',
    subtitle: 'Neue Vergleichsplattform ermöglicht erstmals Video-basierte Umzugsofferten',
    date: '2024',
    category: 'launch',
    status: 'ready',
    content: `**Zürich, [Datum]** – Mit Umzugscheck.ch geht heute die modernste Umzugs-Vergleichsplattform der Schweiz an den Start. Das Startup setzt auf Künstliche Intelligenz, um den oft stressigen Umzugsprozess grundlegend zu vereinfachen.

**Das Problem: Intransparenter Markt**
Jährlich ziehen über 450'000 Haushalte in der Schweiz um. Viele kämpfen mit unübersichtlichen Angeboten, schwankenden Preisen und mangelnder Transparenz. "Wer umzieht, muss heute noch Telefonate führen, Termine für Besichtigungen vereinbaren und hoffen, dass das Angebot fair ist", erklärt der Gründer.

**Die Lösung: KI-gestützte Offerten in Minuten**
Umzugscheck.ch dreht den Prozess um: Nutzer filmen ihre Wohnung mit dem Smartphone. Die KI erkennt automatisch alle Möbel und berechnet das exakte Umzugsvolumen. Innerhalb von 24 Stunden erhalten sie bis zu 5 verbindliche Offerten von geprüften Umzugsfirmen – vollständig kostenlos.

**Sicherheit durch Treuhand-System**
Ein integriertes Fintech-Modul sorgt für Zahlungssicherheit: Das Geld wird erst nach erfolgreichem Umzug an die Firma freigegeben. "Das eliminiert Betrugsrisiken und schafft Vertrauen auf beiden Seiten", so das Unternehmen.

**Ehrgeizige Ziele**
Zum Start sind bereits über 200 Partner-Unternehmen auf der Plattform aktiv. Bis Ende des Jahres will Umzugscheck.ch 5% Marktanteil erreichen und expandiert in alle Deutschschweizer Kantone.`,
    boilerplate: COMPANY_BOILERPLATE.medium,
    contactInfo: {
      name: 'Medienstelle',
      role: 'Presse & PR',
      email: 'presse@umzugscheck.ch',
      phone: '+41 44 XXX XX XX',
    },
  },
  {
    id: 'milestone-10k',
    title: 'Umzugscheck.ch vermittelt 10\'000. Umzug',
    subtitle: 'Wachstum übertrifft Erwartungen – Expansion in Romandie geplant',
    date: '2024',
    category: 'milestone',
    status: 'draft',
    content: `**Zürich, [Datum]** – Umzugscheck.ch hat einen wichtigen Meilenstein erreicht: Die Plattform hat den 10'000. Umzug erfolgreich vermittelt – und das schneller als geplant.

**Starkes Wachstum**
Seit dem Launch hat sich die Nutzerzahl monatlich verdoppelt. Besonders die Video-Inventarisierung per Smartphone kommt bei Kunden gut an: "90% unserer Nutzer schätzen, dass kein Besichtigungstermin mehr nötig ist", berichtet das Unternehmen.

**Nächste Schritte**
Für das kommende Quartal plant Umzugscheck.ch die Expansion in die Romandie sowie den Launch eines B2B-Angebots für Firmenumzüge und HR-Abteilungen.`,
    boilerplate: COMPANY_BOILERPLATE.short,
    contactInfo: {
      name: 'Medienstelle',
      role: 'Presse & PR',
      email: 'presse@umzugscheck.ch',
      phone: '+41 44 XXX XX XX',
    },
  },
];

// Media assets catalog
export const MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'logo-primary',
    name: 'Logo (Primär)',
    type: 'logo',
    format: 'SVG, PNG',
    url: '/press/logo-primary.svg',
    usage: 'Standard-Logo für helle Hintergründe',
  },
  {
    id: 'logo-white',
    name: 'Logo (Weiss)',
    type: 'logo',
    format: 'SVG, PNG',
    url: '/press/logo-white.svg',
    usage: 'Für dunkle Hintergründe',
  },
  {
    id: 'logo-icon',
    name: 'Icon / Favicon',
    type: 'logo',
    format: 'SVG, PNG, ICO',
    url: '/press/icon.svg',
    usage: 'App-Icons, Favicons',
  },
  {
    id: 'screenshot-homepage',
    name: 'Homepage Screenshot',
    type: 'screenshot',
    format: 'PNG',
    dimensions: '1920x1080',
    url: '/press/screenshot-homepage.png',
    usage: 'Produktdarstellung',
  },
  {
    id: 'screenshot-calculator',
    name: 'Preisrechner Screenshot',
    type: 'screenshot',
    format: 'PNG',
    dimensions: '1920x1080',
    url: '/press/screenshot-calculator.png',
    usage: 'Feature-Highlight',
  },
  {
    id: 'screenshot-mobile',
    name: 'Mobile App Screenshots',
    type: 'screenshot',
    format: 'PNG',
    dimensions: '390x844',
    url: '/press/screenshot-mobile.png',
    usage: 'Mobile-Darstellung',
  },
  {
    id: 'infographic-process',
    name: 'So funktioniert\'s Infografik',
    type: 'infographic',
    format: 'PNG, PDF',
    dimensions: '1200x800',
    url: '/press/infographic-process.png',
    usage: 'Prozess-Erklärung',
  },
  {
    id: 'infographic-stats',
    name: 'Marktstatistiken Infografik',
    type: 'infographic',
    format: 'PNG, PDF',
    dimensions: '1200x800',
    url: '/press/infographic-stats.png',
    usage: 'Marktdaten & Fakten',
  },
];

// Press contact channels
export const PRESS_CONTACTS = {
  general: {
    email: 'presse@umzugscheck.ch',
    phone: '+41 44 XXX XX XX',
    response: '< 4 Stunden',
  },
  founder: {
    name: 'Gründer',
    available: 'Für Interviews verfügbar',
    topics: ['Vision', 'Technologie', 'Markt', 'Startup-Story'],
  },
  social: {
    linkedin: 'linkedin.com/company/umzugscheck',
    twitter: '@umzugscheck_ch',
  },
};

// Media coverage targets
export const MEDIA_TARGETS = [
  { name: '20 Minuten', type: 'News', priority: 'high', status: 'pitched' },
  { name: 'NZZ', type: 'Business', priority: 'high', status: 'pending' },
  { name: 'Blick', type: 'News', priority: 'high', status: 'pending' },
  { name: 'Handelszeitung', type: 'Business', priority: 'medium', status: 'pending' },
  { name: 'Startupticker', type: 'Startup', priority: 'high', status: 'confirmed' },
  { name: 'Finews', type: 'Fintech', priority: 'medium', status: 'pending' },
  { name: 'Inside IT', type: 'Tech', priority: 'medium', status: 'pending' },
  { name: 'Persönlich', type: 'Marketing', priority: 'low', status: 'pending' },
];

// Key messages for interviews
export const KEY_MESSAGES = [
  {
    topic: 'Problem',
    message: 'Der Schweizer Umzugsmarkt ist fragmentiert und intransparent. Konsumenten haben keine Möglichkeit, Preise fair zu vergleichen.',
  },
  {
    topic: 'Lösung',
    message: 'Umzugscheck.ch macht Umzugsofferten so einfach wie Hotel-Buchungen: Video aufnehmen, 5 Angebote erhalten, vergleichen, buchen.',
  },
  {
    topic: 'Technologie',
    message: 'Wir nutzen Computer Vision, um Möbel automatisch zu erkennen – weltweit einzigartig im Umzugsmarkt.',
  },
  {
    topic: 'Sicherheit',
    message: 'Unser Treuhand-System schützt Kunden vor Betrug: Zahlung erst nach erfolgreichem Umzug.',
  },
  {
    topic: 'Vision',
    message: 'Jeder Umzug in der Schweiz – stressfrei, fair und vollständig digital. Das ist unser Ziel.',
  },
];
