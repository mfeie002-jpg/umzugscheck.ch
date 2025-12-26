// Centralized Flow Configuration with dynamic step counts
// Each flow variant has its own step configuration

export interface FlowStepConfig {
  step: number;
  name: string;
  description: string;
}

export interface FlowConfig {
  id: string;
  label: string;
  path: string;
  steps: FlowStepConfig[];
  color: string;
  description: string;
}

export const FLOW_CONFIGS: Record<string, FlowConfig> = {
  'umzugsofferten': {
    id: 'umzugsofferten',
    label: 'V1 - Control Flow',
    path: '/umzugsofferten',
    color: 'bg-blue-500',
    description: 'Original 4-Step Wizard mit klassischem Aufbau',
    steps: [
      { step: 1, name: 'Umzugstyp wählen', description: 'Wohnung, Haus, Büro auswählen' },
      { step: 2, name: 'Details & Services', description: 'Adressen, Grösse, Datum, Services' },
      { step: 3, name: 'Firmenauswahl', description: 'Passende Firmen auswählen' },
      { step: 4, name: 'Kontakt & Absenden', description: 'Name, Email, Absenden' },
    ],
  },
  'umzugsofferten-v2': {
    id: 'umzugsofferten-v2',
    label: 'V2 - Premium Full-Journey',
    path: '/umzugsofferten-v2',
    color: 'bg-purple-500',
    description: 'Premium-Erlebnis mit erweiterten Optionen',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Art des Umzugs wählen' },
      { step: 2, name: 'Von & Nach', description: 'Start- und Zieladresse' },
      { step: 3, name: 'Wohnungsgrösse', description: 'Zimmerzahl und Etage' },
      { step: 4, name: 'Umzugsdatum', description: 'Wunschtermin festlegen' },
      { step: 5, name: 'Zusatzservices', description: 'Packen, Reinigung, etc.' },
      { step: 6, name: 'Kontaktdaten', description: 'Persönliche Angaben' },
    ],
  },
  'umzugsofferten-v3': {
    id: 'umzugsofferten-v3',
    label: 'V3 - God Mode',
    path: '/umzugsofferten-v3',
    color: 'bg-green-500',
    description: 'Slider-basierte schnelle Eingabe',
    steps: [
      { step: 1, name: 'Slider-Eingabe', description: 'Volumen per Slider schätzen' },
      { step: 2, name: 'Details', description: 'Adressen und Datum' },
      { step: 3, name: 'Bestätigung', description: 'Preis und Übersicht' },
      { step: 4, name: 'Kontakt', description: 'Daten absenden' },
    ],
  },
  'umzugsofferten-v4': {
    id: 'umzugsofferten-v4',
    label: 'V4 - Video-First AI',
    path: '/umzugsofferten-v4',
    color: 'bg-pink-500',
    description: 'KI-gestützte Video-Analyse',
    steps: [
      { step: 1, name: 'Video Upload', description: 'Video der Wohnung hochladen' },
      { step: 2, name: 'KI-Analyse', description: 'Automatische Inventarerkennung' },
      { step: 3, name: 'Überprüfung', description: 'Inventar kontrollieren/anpassen' },
      { step: 4, name: 'Details', description: 'Adressen und Datum' },
      { step: 5, name: 'Kontakt', description: 'Offerte anfordern' },
    ],
  },
  'umzugsofferten-v5': {
    id: 'umzugsofferten-v5',
    label: 'V5 - Marketplace Wizard',
    path: '/umzugsofferten-v5',
    color: 'bg-yellow-500',
    description: 'Marktplatz mit Firmen-Bidding',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'Grundlegende Infos' },
      { step: 2, name: 'Anforderungen', description: 'Spezielle Wünsche' },
      { step: 3, name: 'Marktplatz', description: 'Firmen sehen und vergleichen' },
      { step: 4, name: 'Auswahl', description: 'Firmen auswählen' },
      { step: 5, name: 'Kontakt', description: 'Anfrage absenden' },
    ],
  },
  'umzugsofferten-v6': {
    id: 'umzugsofferten-v6',
    label: 'V6 - Ultimate (6-Tier)',
    path: '/umzugsofferten-v6',
    color: 'bg-orange-500',
    description: '6-stufiger Premium-Flow mit allen Features',
    steps: [
      { step: 1, name: 'Willkommen', description: 'Einführung und Vertrauen' },
      { step: 2, name: 'Umzugsart', description: 'Privat, Firma, Spezial' },
      { step: 3, name: 'Adressen', description: 'Von und Nach' },
      { step: 4, name: 'Inventar', description: 'Detaillierte Auflistung' },
      { step: 5, name: 'Services', description: 'Zusatzleistungen' },
      { step: 6, name: 'Abschluss', description: 'Kontakt und Absenden' },
    ],
  },
  'umzugsofferten-v7': {
    id: 'umzugsofferten-v7',
    label: 'V7 - SwissMove (90s)',
    path: '/umzugsofferten-v7',
    color: 'bg-indigo-500',
    description: 'Speed-optimiert für 90 Sekunden',
    steps: [
      { step: 1, name: 'Quick Start', description: 'PLZ und Grösse' },
      { step: 2, name: 'Datum & Services', description: 'Schnelle Auswahl' },
      { step: 3, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'umzugsofferten-v8': {
    id: 'umzugsofferten-v8',
    label: 'V8 - Decision-Free',
    path: '/umzugsofferten-v8',
    color: 'bg-teal-500',
    description: 'Minimale Entscheidungen, maximale Einfachheit',
    steps: [
      { step: 1, name: 'Start', description: 'Eine Frage pro Screen' },
      { step: 2, name: 'Woher', description: 'Startadresse' },
      { step: 3, name: 'Wohin', description: 'Zieladresse' },
      { step: 4, name: 'Wann', description: 'Datum' },
      { step: 5, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'umzugsofferten-v9': {
    id: 'umzugsofferten-v9',
    label: 'V9 - Zero Friction ⭐',
    path: '/umzugsofferten-v9',
    color: 'bg-cyan-500',
    description: 'Frictionless Design - unser Favorit',
    steps: [
      { step: 1, name: 'Adressen', description: 'Von-Nach in einem Screen' },
      { step: 2, name: 'Details', description: 'Grösse und Datum' },
      { step: 3, name: 'Services', description: 'Optionale Extras' },
      { step: 4, name: 'Firmen', description: 'Passende Auswahl' },
      { step: 5, name: 'Kontakt', description: 'Absenden' },
    ],
  },
};

// Get all flow variants as array
export const getFlowVariants = () => Object.values(FLOW_CONFIGS);

// Get step count for a specific flow
export const getFlowStepCount = (flowId: string): number => {
  return FLOW_CONFIGS[flowId]?.steps.length || 4;
};

// Get step configs for a specific flow
export const getFlowSteps = (flowId: string): FlowStepConfig[] => {
  return FLOW_CONFIGS[flowId]?.steps || [];
};

// Get uc_flow ID from calculator value
export const getUcFlowId = (calculatorValue: string): string | null => {
  if (!calculatorValue.startsWith('umzugsofferten')) return null;
  if (calculatorValue === 'umzugsofferten') return 'v1';
  const match = calculatorValue.match(/-v(\d+)/i);
  return match?.[1] ? `v${match[1]}` : 'v1';
};

// Additional calculators (non-flow)
export const OTHER_CALCULATORS = [
  { value: 'reinigung', label: 'Reinigungsrechner', path: '/reinigungsrechner', steps: 3 },
  { value: 'entsorgung', label: 'Entsorgungsrechner', path: '/entsorgungsrechner', steps: 3 },
  { value: 'firmenumzug', label: 'Firmenumzug-Rechner', path: '/firmenumzug-rechner', steps: 4 },
];

// Get total steps across all flows
export const getTotalStepsAllFlows = (): number => {
  return Object.values(FLOW_CONFIGS).reduce((sum, flow) => sum + flow.steps.length, 0);
};
