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

// Sub-Variant Configurations (V2a-e, V3a-e, V4a-e, V5a-e)
// These are coded components with their own step counts
export const SUB_VARIANT_CONFIGS: Record<string, FlowConfig> = {
  // V2 Sub-variants (UX-Optimized)
  'v2a': {
    id: 'v2a',
    label: 'V2a - Progress Enhanced',
    path: '/flow-tester?variant=v2a',
    color: 'bg-purple-400',
    description: 'Animated step indicators with icons',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Typ', description: 'Umzugstyp wählen' },
      { step: 2, name: 'Ort', description: 'Start- und Zieladresse' },
      { step: 3, name: 'Services', description: 'Zusatzleistungen' },
      { step: 4, name: 'Kontakt', description: 'Persönliche Angaben' },
    ],
  },
  'v2b': {
    id: 'v2b',
    label: 'V2b - Simplified Labels',
    path: '/flow-tester?variant=v2b',
    color: 'bg-purple-300',
    description: 'Cleaner, simpler labels',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Was', description: 'Umzugstyp' },
      { step: 2, name: 'Wohin', description: 'Adressen' },
      { step: 3, name: 'Extras', description: 'Services' },
      { step: 4, name: 'Kontakt', description: 'Daten' },
    ],
  },
  'v2c': {
    id: 'v2c',
    label: 'V2c - Trust Focused',
    path: '/flow-tester?variant=v2c',
    color: 'bg-purple-500',
    description: 'Enhanced trust signals',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Mit Trust-Signalen' },
      { step: 2, name: 'Details', description: 'Adressen & Grösse' },
      { step: 3, name: 'Services', description: 'Zusatzoptionen' },
      { step: 4, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'v2d': {
    id: 'v2d',
    label: 'V2d - Speed Optimized',
    path: '/flow-tester?variant=v2d',
    color: 'bg-purple-600',
    description: 'Fastest completion time',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Quick', description: 'Schnellauswahl' },
      { step: 2, name: 'Details', description: 'Alles in einem' },
      { step: 3, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'v2e': {
    id: 'v2e',
    label: 'V2e - Experimental',
    path: '/flow-tester?variant=v2e',
    color: 'bg-purple-700',
    description: 'Experimental features',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Start', description: 'Experimentell' },
      { step: 2, name: 'Mitte', description: 'Neue Features' },
      { step: 3, name: 'Ende', description: 'Absenden' },
    ],
  },

  // V3 Sub-variants (Mobile-First)
  'v3a': {
    id: 'v3a',
    label: 'V3a - Mobile First',
    path: '/flow-tester?variant=v3a',
    color: 'bg-green-400',
    description: 'Touch-optimized, large targets',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Touch-optimiert' },
      { step: 2, name: 'Details', description: 'Adressen' },
      { step: 3, name: 'Services', description: 'Extras' },
      { step: 4, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'v3g': {
    id: 'v3g',
    label: 'V3g - Feedback Based',
    path: '/flow-tester?variant=v3g',
    color: 'bg-green-600',
    description: 'ChatGPT UX-Analyse optimiert',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Service wählen', description: 'Slider-Delegation & Preis' },
      { step: 2, name: 'Details', description: 'Adressen & Datum' },
      { step: 3, name: 'So geht\'s weiter', description: 'Ablauf & Trust' },
      { step: 4, name: 'Kontakt', description: 'Offerten anfordern' },
    ],
  },
  'v3b': {
    id: 'v3b',
    label: 'V3b - Swipe Navigation',
    path: '/flow-tester?variant=v3b',
    color: 'bg-green-300',
    description: 'Swipe between steps',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Swipe-Auswahl' },
      { step: 2, name: 'Adressen', description: 'Wischen' },
      { step: 3, name: 'Services', description: 'Extras' },
      { step: 4, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'v3c': {
    id: 'v3c',
    label: 'V3c - Bottom Sheet',
    path: '/flow-tester?variant=v3c',
    color: 'bg-green-500',
    description: 'Native app-like sheets',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Sheet-UI' },
      { step: 2, name: 'Adressen', description: 'Bottom Sheet' },
      { step: 3, name: 'Services', description: 'Extras' },
      { step: 4, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'v3d': {
    id: 'v3d',
    label: 'V3d - Thumb Zone',
    path: '/flow-tester?variant=v3d',
    color: 'bg-green-600',
    description: 'Optimized for thumb reach',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Start', description: 'Thumb-Zone' },
      { step: 2, name: 'Details', description: 'Erreichbar' },
      { step: 3, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'v3e': {
    id: 'v3e',
    label: 'V3e - Fullscreen',
    path: '/flow-tester?variant=v3e',
    color: 'bg-green-700',
    description: 'Immersive fullscreen',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Fullscreen' },
      { step: 2, name: 'Details', description: 'Immersiv' },
      { step: 3, name: 'Kontakt', description: 'Absenden' },
    ],
  },

  // V4 Sub-variants (Conversion-Focused)
  'v4a': {
    id: 'v4a',
    label: 'V4a - Urgency Based',
    path: '/flow-tester?variant=v4a',
    color: 'bg-pink-400',
    description: 'Scarcity and time pressure',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Urgency-Banner' },
      { step: 2, name: 'Details', description: 'Timer läuft' },
      { step: 3, name: 'Services', description: 'Rabatt' },
      { step: 4, name: 'Kontakt', description: 'Jetzt buchen' },
    ],
  },
  'v4b': {
    id: 'v4b',
    label: 'V4b - Social Proof',
    path: '/flow-tester?variant=v4b',
    color: 'bg-pink-300',
    description: 'Reviews and testimonials',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Start', description: 'Bewertungen' },
      { step: 2, name: 'Details', description: 'Testimonials' },
      { step: 3, name: 'Kontakt', description: 'Social Proof' },
    ],
  },
  'v4c': {
    id: 'v4c',
    label: 'V4c - Value First',
    path: '/flow-tester?variant=v4c',
    color: 'bg-pink-500',
    description: 'Show value before asking',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Wert zeigen', description: 'Vorteile' },
      { step: 2, name: 'Details', description: 'Eingaben' },
      { step: 3, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'v4d': {
    id: 'v4d',
    label: 'V4d - Gamified',
    path: '/flow-tester?variant=v4d',
    color: 'bg-pink-600',
    description: 'Game-like progress',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Level 1', description: 'Start' },
      { step: 2, name: 'Level 2', description: 'Details' },
      { step: 3, name: 'Level 3', description: 'Services' },
      { step: 4, name: 'Boss', description: 'Kontakt' },
    ],
  },
  'v4e': {
    id: 'v4e',
    label: 'V4e - Minimal Friction',
    path: '/flow-tester?variant=v4e',
    color: 'bg-pink-700',
    description: 'Absolute minimum fields',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Quick', description: 'Minimal' },
      { step: 2, name: 'Kontakt', description: 'Nur Email' },
    ],
  },

  // V5 Sub-variants (Accessibility-Focused)
  'v5a': {
    id: 'v5a',
    label: 'V5a - High Contrast',
    path: '/flow-tester?variant=v5a',
    color: 'bg-yellow-400',
    description: 'WCAG AAA contrast',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Hoher Kontrast' },
      { step: 2, name: 'Adressen', description: 'Lesbar' },
      { step: 3, name: 'Services', description: 'Klar' },
      { step: 4, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'v5b': {
    id: 'v5b',
    label: 'V5b - Screen Reader',
    path: '/flow-tester?variant=v5b',
    color: 'bg-yellow-300',
    description: 'Full screen reader support',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'ARIA-Labels' },
      { step: 2, name: 'Details', description: 'Vorlesbar' },
      { step: 3, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  'v5c': {
    id: 'v5c',
    label: 'V5c - Keyboard Nav',
    path: '/flow-tester?variant=v5c',
    color: 'bg-yellow-500',
    description: 'Full keyboard navigation',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Start', description: 'Tab-Navigation' },
      { step: 2, name: 'Details', description: 'Tastatur' },
      { step: 3, name: 'Kontakt', description: 'Enter' },
    ],
  },
  'v5d': {
    id: 'v5d',
    label: 'V5d - Large Text',
    path: '/flow-tester?variant=v5d',
    color: 'bg-yellow-600',
    description: 'Extra large font sizes',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Start', description: 'Grosse Schrift' },
      { step: 2, name: 'Details', description: '24px+' },
      { step: 3, name: 'Kontakt', description: 'Lesbar' },
    ],
  },
  'v5e': {
    id: 'v5e',
    label: 'V5e - Reduced Motion',
    path: '/flow-tester?variant=v5e',
    color: 'bg-yellow-700',
    description: 'No animations',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Keine Animation' },
      { step: 2, name: 'Details', description: 'Statisch' },
      { step: 3, name: 'Kontakt', description: 'Ruhig' },
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
