/**
 * Standard Institutions for Address Change
 * 
 * Common Swiss institutions that need to be notified during a move
 */

import { Institution } from './types';

export const SWISS_INSTITUTIONS: Institution[] = [
  // Government - Critical
  {
    id: 'einwohnerkontrolle',
    name: 'Einwohnerkontrolle (neue Gemeinde)',
    category: 'government',
    priority: 'critical',
    icon: 'Building2',
    notes: 'Innerhalb von 14 Tagen nach Umzug anmelden',
    website: 'https://www.eumzug.swiss',
  },
  {
    id: 'einwohnerkontrolle_alt',
    name: 'Einwohnerkontrolle (alte Gemeinde)',
    category: 'government',
    priority: 'critical',
    icon: 'Building2',
    notes: 'Abmeldung bei Wegzug aus der Gemeinde',
  },
  {
    id: 'strassenverkehrsamt',
    name: 'Strassenverkehrsamt',
    category: 'government',
    priority: 'critical',
    icon: 'Car',
    notes: 'Fahrzeugausweis und Führerausweis aktualisieren',
  },
  
  // Postal - Critical
  {
    id: 'swiss_post',
    name: 'Schweizerische Post (Nachsendung)',
    category: 'postal',
    priority: 'critical',
    icon: 'Mail',
    website: 'https://www.post.ch/de/briefe-versenden/adressaenderung',
    notes: 'Nachsendeauftrag 5-7 Tage vor Umzug aufgeben',
  },
  
  // Finance - Important
  {
    id: 'bank',
    name: 'Bank(en)',
    category: 'finance',
    priority: 'important',
    icon: 'Wallet',
    notes: 'Adresse für alle Konten aktualisieren',
  },
  {
    id: 'steueramt',
    name: 'Steueramt',
    category: 'finance',
    priority: 'important',
    icon: 'FileText',
    notes: 'Wird oft automatisch via Einwohnerkontrolle informiert',
  },
  {
    id: 'pensionskasse',
    name: 'Pensionskasse',
    category: 'finance',
    priority: 'important',
    icon: 'PiggyBank',
    notes: 'Arbeitgeber informiert oft automatisch',
  },
  
  // Insurance - Important
  {
    id: 'krankenkasse',
    name: 'Krankenkasse',
    category: 'insurance',
    priority: 'important',
    icon: 'Heart',
    notes: 'Prämie kann je nach Wohnort variieren',
  },
  {
    id: 'hausrat_versicherung',
    name: 'Hausratversicherung',
    category: 'insurance',
    priority: 'important',
    icon: 'Shield',
    notes: 'Versicherungssumme bei grösserer Wohnung anpassen',
  },
  {
    id: 'auto_versicherung',
    name: 'Autoversicherung',
    category: 'insurance',
    priority: 'important',
    icon: 'Car',
    notes: 'Prämie kann je nach Wohnort variieren',
  },
  {
    id: 'haftpflicht',
    name: 'Privathaftpflichtversicherung',
    category: 'insurance',
    priority: 'important',
    icon: 'ShieldCheck',
  },
  
  // Utilities - Important
  {
    id: 'strom',
    name: 'Stromversorger',
    category: 'utilities',
    priority: 'important',
    icon: 'Zap',
    notes: 'Zählerstand bei Ein-/Auszug ablesen',
  },
  {
    id: 'internet',
    name: 'Internet & Telefon',
    category: 'utilities',
    priority: 'important',
    icon: 'Wifi',
    notes: 'Umzug rechtzeitig anmelden (2-4 Wochen)',
  },
  {
    id: 'serafe',
    name: 'Serafe (Radio/TV)',
    category: 'utilities',
    priority: 'important',
    icon: 'Tv',
    website: 'https://www.serafe.ch/de/adressaenderung/',
    notes: 'Gebühr pro Haushalt, nicht pro Person',
  },
  
  // Subscriptions - Optional
  {
    id: 'sbb',
    name: 'SBB / GA / Halbtax',
    category: 'subscriptions',
    priority: 'optional',
    icon: 'Train',
    website: 'https://www.sbb.ch',
  },
  {
    id: 'swisscom',
    name: 'Swisscom Mobile',
    category: 'subscriptions',
    priority: 'optional',
    icon: 'Smartphone',
  },
  {
    id: 'zeitungen',
    name: 'Zeitungsabos',
    category: 'subscriptions',
    priority: 'optional',
    icon: 'Newspaper',
  },
  {
    id: 'streaming',
    name: 'Streaming-Dienste',
    category: 'subscriptions',
    priority: 'optional',
    icon: 'Play',
    notes: 'Netflix, Spotify, etc.',
  },
  {
    id: 'online_shops',
    name: 'Online-Shops',
    category: 'subscriptions',
    priority: 'optional',
    icon: 'ShoppingBag',
    notes: 'Galaxus, Zalando, Amazon, etc.',
  },
  
  // Personal - Optional
  {
    id: 'arbeitgeber',
    name: 'Arbeitgeber',
    category: 'personal',
    priority: 'important',
    icon: 'Briefcase',
  },
  {
    id: 'schule',
    name: 'Schule / Kita',
    category: 'personal',
    priority: 'important',
    icon: 'GraduationCap',
    notes: 'Bei Kindern im Haushalt',
  },
  {
    id: 'arzt',
    name: 'Arzt / Zahnarzt',
    category: 'personal',
    priority: 'optional',
    icon: 'Stethoscope',
  },
  {
    id: 'vereine',
    name: 'Vereine & Mitgliedschaften',
    category: 'personal',
    priority: 'optional',
    icon: 'Users',
  },
];

/**
 * Get institutions grouped by category
 */
export const getInstitutionsByCategory = (): Record<string, Institution[]> => {
  return SWISS_INSTITUTIONS.reduce((acc, inst) => {
    if (!acc[inst.category]) {
      acc[inst.category] = [];
    }
    acc[inst.category].push(inst);
    return acc;
  }, {} as Record<string, Institution[]>);
};

/**
 * Get critical institutions that must be notified
 */
export const getCriticalInstitutions = (): Institution[] => {
  return SWISS_INSTITUTIONS.filter(inst => inst.priority === 'critical');
};

/**
 * Get institution by ID
 */
export const getInstitutionById = (id: string): Institution | undefined => {
  return SWISS_INSTITUTIONS.find(inst => inst.id === id);
};

/**
 * Category display names
 */
export const CATEGORY_NAMES: Record<string, string> = {
  'government': 'Behörden',
  'finance': 'Finanzen',
  'insurance': 'Versicherungen',
  'utilities': 'Versorger',
  'subscriptions': 'Abonnemente',
  'personal': 'Persönliches',
  'postal': 'Post & Pakete',
};
