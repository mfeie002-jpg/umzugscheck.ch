// Centralized Flow Configuration with dynamic step counts
// Each flow variant has its own step configuration
// Sub-variants (a-e) inherit from their parent flow but can override steps

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
  parentFlow?: string; // For sub-variants, reference to parent
}

// Main Flow Configurations (V1-V9)
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

// Sub-Variant Configurations for V9 feedback-based variants
export const SUB_VARIANT_CONFIGS: Record<string, FlowConfig> = {
  'v9a': {
    id: 'v9a',
    label: 'V9.a Gemini Archetyp ⭐',
    path: '/umzugsofferten?variant=v9a',
    color: 'bg-emerald-500',
    description: 'Gemini V9 - Alle 10 Optimierungen für maximale Conversion',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Start', description: 'Privat oder Geschäftlich' },
      { step: 2, name: 'Von wo?', description: 'Startadresse mit Google Places' },
      { step: 3, name: 'Nach wo?', description: 'Zieladresse mit Google Places' },
      { step: 4, name: 'Wann?', description: 'Flexibles Datum' },
      { step: 5, name: 'Wohnung', description: 'Zimmer, Etage, Lift (conditional)' },
      { step: 6, name: 'Inventar', description: 'Visuelles Icon-Grid' },
      { step: 7, name: 'Services', description: 'Zusatzservices' },
      { step: 8, name: 'Analyse', description: 'Labor Illusion + Result Teasing' },
      { step: 9, name: 'Kontakt', description: 'Daten mit Trust Badges' },
    ],
  },
  'v9b': {
    id: 'v9b',
    label: 'V9b ChatGPT Pro Ext ⭐',
    path: '/umzugsofferten?variant=v9b',
    color: 'bg-cyan-700',
    description: 'ChatGPT-optimiert: CH-Zimmer, Paket-Karten, Sticky CTA, 3 Empfehlungen',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Adressen', description: 'Von-Nach mit PLZ-Autocomplete' },
      { step: 2, name: 'Details', description: 'CH-Zimmer, Stockwerk, Video-Scan Option' },
      { step: 3, name: 'Services', description: 'Paket-Karten (Basis/Standard/Komfort)' },
      { step: 4, name: 'Extras & Datum', description: 'Datum mit Flex-Option, Extras ohne Vorauswahl' },
      { step: 5, name: 'Firmen & Kontakt', description: '3 Empfehlungen vorselektiert, Checkbox UI' },
    ],
  },
  'v9d': {
    id: 'v9d',
    label: 'V9d Main Gemini',
    path: '/umzugsofferten?variant=v9d',
    color: 'bg-emerald-600',
    description: 'V9d Gemini-Archetyp mit 9 Steps',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Start', description: 'Privat oder Firma' },
      { step: 2, name: 'Von', description: 'Startadresse' },
      { step: 3, name: 'Nach', description: 'Zieladresse' },
      { step: 4, name: 'Wann', description: 'Umzugsdatum' },
      { step: 5, name: 'Wohnung', description: 'Zimmer, Etage, Lift' },
      { step: 6, name: 'Inventar', description: 'Visuelles Inventar' },
      { step: 7, name: 'Services', description: 'Zusatzservices' },
      { step: 8, name: 'Ergebnis', description: 'Result Teasing' },
      { step: 9, name: 'Kontakt', description: 'Kontaktdaten' },
    ],
  },
};

// Combined config for all flows (main + sub-variants)
export const getAllFlowConfigs = (): Record<string, FlowConfig> => ({
  ...FLOW_CONFIGS,
  ...SUB_VARIANT_CONFIGS,
});

// Get all flow variants as array (main flows only)
export const getFlowVariants = () => Object.values(FLOW_CONFIGS);

// Get all sub-variants as array
export const getSubVariants = () => Object.values(SUB_VARIANT_CONFIGS);

// Get all flows including sub-variants
export const getAllFlows = () => [...Object.values(FLOW_CONFIGS), ...Object.values(SUB_VARIANT_CONFIGS)];

// Get step count for a specific flow (checks both main and sub-variants)
export const getFlowStepCount = (flowId: string): number => {
  // Check main flows first
  if (FLOW_CONFIGS[flowId]) {
    return FLOW_CONFIGS[flowId].steps.length;
  }
  // Check sub-variants
  const subVariantId = flowId.toLowerCase().replace('-', '');
  if (SUB_VARIANT_CONFIGS[subVariantId]) {
    return SUB_VARIANT_CONFIGS[subVariantId].steps.length;
  }
  // Default fallback
  return 4;
};

// Get step configs for a specific flow
export const getFlowSteps = (flowId: string): FlowStepConfig[] => {
  if (FLOW_CONFIGS[flowId]) {
    return FLOW_CONFIGS[flowId].steps;
  }
  const subVariantId = flowId.toLowerCase().replace('-', '');
  if (SUB_VARIANT_CONFIGS[subVariantId]) {
    return SUB_VARIANT_CONFIGS[subVariantId].steps;
  }
  return [];
};

// Get flow config by any ID format
export const getFlowConfig = (flowId: string): FlowConfig | undefined => {
  if (FLOW_CONFIGS[flowId]) {
    return FLOW_CONFIGS[flowId];
  }
  const subVariantId = flowId.toLowerCase().replace('-', '');
  if (SUB_VARIANT_CONFIGS[subVariantId]) {
    return SUB_VARIANT_CONFIGS[subVariantId];
  }
  return undefined;
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

// Get total steps across all main flows
export const getTotalStepsAllFlows = (): number => {
  return Object.values(FLOW_CONFIGS).reduce((sum, flow) => sum + flow.steps.length, 0);
};

// Get total steps including sub-variants
export const getTotalStepsAllFlowsWithSubVariants = (): number => {
  const mainSteps = Object.values(FLOW_CONFIGS).reduce((sum, flow) => sum + flow.steps.length, 0);
  const subSteps = Object.values(SUB_VARIANT_CONFIGS).reduce((sum, flow) => sum + flow.steps.length, 0);
  return mainSteps + subSteps;
};
