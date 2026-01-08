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
  'umzugsofferten-v1': {
    id: 'umzugsofferten-v1',
    label: 'V1 - Control Flow',
    path: '/umzugsofferten-v1',
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
  // V2.e Chat-based Funnel (Experimental)
  'umzugsofferten-v2e': {
    id: 'umzugsofferten-v2e',
    label: 'V2.e - Chat Funnel ⭐',
    path: '/umzugsofferten-v2e',
    color: 'bg-violet-500',
    description: 'Chat-basierter Conversational Flow',
    steps: [
      { step: 1, name: 'Umzugstyp', description: 'Wohnung/Haus/Büro wählen' },
      { step: 2, name: 'Von wo', description: 'Startadresse eingeben' },
      { step: 3, name: 'Nach wo', description: 'Zieladresse eingeben' },
      { step: 4, name: 'Grösse', description: 'Wohnungsgrösse wählen' },
      { step: 5, name: 'Video', description: 'Optional: Video-Analyse' },
      { step: 6, name: 'Datum', description: 'Umzugstermin festlegen' },
      { step: 7, name: 'Services', description: 'Zusatzleistungen wählen' },
      { step: 8, name: 'Preis', description: 'Preis-Reveal mit Animation' },
      { step: 9, name: 'Firmen', description: 'Firmenauswahl treffen' },
      { step: 10, name: 'Kontakt', description: 'Daten absenden' },
    ],
  },
  // Ultimate Swiss Flow - Best of 36
  'umzugsofferten-ultimate-best36': {
    id: 'umzugsofferten-ultimate-best36',
    label: 'Ultimate Best36 ⭐⭐',
    path: '/umzugsofferten-ultimate-best36',
    color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    description: 'Ultimate Flow: Best of 36 Varianten kombiniert. Ziel-Score: 98/100',
    steps: [
      { step: 1, name: 'Adressen', description: 'Von-Nach PLZ eingeben' },
      { step: 2, name: 'Umfang', description: 'Zimmer, Stockwerk, Inventar' },
      { step: 3, name: 'Services', description: 'Datum und Zusatzleistungen' },
      { step: 4, name: 'Kontakt', description: 'Kontaktdaten und Absenden' },
    ],
  },
};

// Sub-Variant Configurations for V9 feedback-based variants
export const SUB_VARIANT_CONFIGS: Record<string, FlowConfig> = {
  // V1 - Control Flow Feedback
  'v1a': {
    id: 'v1a',
    label: 'V1a Control (Feedback)',
    path: '/umzugsofferten-v1a',
    color: 'bg-blue-600',
    description: 'V1 Feedback: 2-Step, Sticky CTA, Trust, Minimalfelder',
    parentFlow: 'umzugsofferten-v1',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ Von-Nach, Datum, Zimmer' },
      { step: 2, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V1b - ChatGPT Agent Optimized
  'v1b': {
    id: 'v1b',
    label: 'V1b ChatGPT Agent',
    path: '/umzugsofferten-v1b',
    color: 'bg-blue-500',
    description: 'V1b: 4-Step Flow mit ChatGPT Feedback - Typ, Services, Firmen, Kontakt',
    parentFlow: 'umzugsofferten-v1',
    steps: [
      { step: 1, name: 'Typ & Details', description: 'Umzugstyp, Grösse, Adressen' },
      { step: 2, name: 'Services', description: 'Zusatzleistungen wählen' },
      { step: 3, name: 'Firmen', description: 'Firmenauswahl vergleichen' },
      { step: 4, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V1c - Gemini Pro Optimized
  'v1c': {
    id: 'v1c',
    label: 'V1c Gemini Pro',
    path: '/umzugsofferten-v1c',
    color: 'bg-blue-400',
    description: 'V1c: Gemini Pro optimiert',
    parentFlow: 'umzugsofferten-v1',
    steps: [
      { step: 1, name: 'Details', description: 'Umzugsdetails eingeben' },
      { step: 2, name: 'Services', description: 'Zusatzleistungen wählen' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V1d - ChatGPT Pro Extended
  'v1d': {
    id: 'v1d',
    label: 'V1d ChatGPT Pro Ext',
    path: '/umzugsofferten-v1d',
    color: 'bg-blue-300',
    description: 'V1d: ChatGPT Pro Extended',
    parentFlow: 'umzugsofferten-v1',
    steps: [
      { step: 1, name: 'Details', description: 'Umzugsdetails eingeben' },
      { step: 2, name: 'Services', description: 'Zusatzleistungen wählen' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V1e - ChatGPT Research
  'v1e': {
    id: 'v1e',
    label: 'V1e ChatGPT Research',
    path: '/umzugsofferten-v1e',
    color: 'bg-blue-200',
    description: 'V1e: ChatGPT Research variant',
    parentFlow: 'umzugsofferten-v1',
    steps: [
      { step: 1, name: 'Details', description: 'Umzugsdetails eingeben' },
      { step: 2, name: 'Services', description: 'Zusatzleistungen wählen' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V1f - Sticky CTA + Trust Pills (NEW)
  'v1f': {
    id: 'v1f',
    label: 'V1f Sticky CTA + Trust ⭐',
    path: '/umzugsofferten-v1f',
    color: 'bg-emerald-500',
    description: 'V1f: Enhanced Sticky CTA mit Micro-Feedback + Step Trust Pills',
    parentFlow: 'umzugsofferten-v1',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ Von-Nach, Datum' },
      { step: 2, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V1g - Input UX + Validation (NEW)
  'v1g': {
    id: 'v1g',
    label: 'V1g Input UX + Validation ⭐',
    path: '/umzugsofferten-v1g',
    color: 'bg-emerald-400',
    description: 'V1g: Enhanced FormFields mit Inline Validation + Mobile inputMode',
    parentFlow: 'umzugsofferten-v1',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ Von-Nach, Datum' },
      { step: 2, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V3 - Mobile-First Sub-Variants
  'v3a': {
    id: 'v3a',
    label: 'V3a Mobile First',
    path: '/umzugsofferten-v3a',
    color: 'bg-green-500',
    description: 'V3a: Mobile-First Design mit Touch-optimiertem Slider',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Slider-Eingabe', description: 'Touch-optimierter Volumen-Slider' },
      { step: 2, name: 'Details', description: 'Adressen und Datum' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v3b': {
    id: 'v3b',
    label: 'V3b Swipe Navigation',
    path: '/umzugsofferten-v3b',
    color: 'bg-green-600',
    description: 'V3b: Swipe-basierte Navigation zwischen Steps',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Swipe Intro', description: 'Swipe-Anleitung + Start' },
      { step: 2, name: 'Details', description: 'Swipe durch Felder' },
      { step: 3, name: 'Services', description: 'Swipe-Auswahl' },
      { step: 4, name: 'Kontakt', description: 'Swipe zum Absenden' },
    ],
  },
  'v3c': {
    id: 'v3c',
    label: 'V3c Bottom Sheet',
    path: '/umzugsofferten-v3c',
    color: 'bg-green-700',
    description: 'V3c: Bottom-Sheet Pattern für mobile UX',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Übersicht', description: 'Haupt-Screen mit Sheet-Trigger' },
      { step: 2, name: 'Details Sheet', description: 'Bottom-Sheet für Eingaben' },
      { step: 3, name: 'Kontakt Sheet', description: 'Kontakt im Sheet' },
    ],
  },
  'v3d': {
    id: 'v3d',
    label: 'V3d Thumb Zone',
    path: '/umzugsofferten-v3d',
    color: 'bg-green-800',
    description: 'V3d: Thumb-Zone optimiert - alle CTAs im unteren Drittel',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Thumb-Optimiert', description: 'Alle Buttons unten' },
      { step: 2, name: 'Details', description: 'One-Hand-Operation' },
      { step: 3, name: 'Kontakt', description: 'Daumen-freundlich' },
    ],
  },
  'v3e': {
    id: 'v3e',
    label: 'V3e Fullscreen',
    path: '/umzugsofferten-v3e',
    color: 'bg-green-900',
    description: 'V3e: Fullscreen-Mode ohne Ablenkung',
    parentFlow: 'umzugsofferten-v3',
    steps: [
      { step: 1, name: 'Fullscreen Start', description: 'Immersiver Einstieg' },
      { step: 2, name: 'Fokus-Eingabe', description: 'Ein Feld pro Screen' },
      { step: 3, name: 'Abschluss', description: 'Fullscreen Confirmation' },
    ],
  },
  // V2 - Premium Sub-Variants
  'v2a': {
    id: 'v2a',
    label: 'V2a Progress Enhanced',
    path: '/umzugsofferten-v2?variant=v2a',
    color: 'bg-purple-500',
    description: 'V2 mit verbesserter Fortschrittsanzeige',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 2, name: 'Details', description: 'Wohnungsgrösse und Services' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v2b': {
    id: 'v2b',
    label: 'V2b Feedback Based',
    path: '/umzugsofferten-v2?variant=v2b',
    color: 'bg-purple-600',
    description: 'V2 mit Feedback-Optimierungen',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 2, name: 'Services', description: 'Zusatzleistungen wählen' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v2c': {
    id: 'v2c',
    label: 'V2c Trust Focused',
    path: '/umzugsofferten-v2?variant=v2c',
    color: 'bg-purple-700',
    description: 'V2 mit Fokus auf Vertrauen',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 2, name: 'Firmenauswahl', description: 'Geprüfte Firmen wählen' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v2d': {
    id: 'v2d',
    label: 'V2d Feedback Optimized',
    path: '/umzugsofferten-v2?variant=v2d',
    color: 'bg-purple-800',
    description: 'V2 mit Feedback-Optimierungen',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 2, name: 'Services', description: 'Zusatzleistungen wählen' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v2e': {
    id: 'v2e',
    label: 'V2e Chat Funnel ⭐',
    path: '/umzugsofferten-v2e',
    color: 'bg-violet-500',
    description: 'V2e: Chat-basierter Conversational Flow',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Chat Intro', description: 'Willkommen im Chat' },
      { step: 2, name: 'Fragen', description: 'Umzugsdetails per Chat' },
      { step: 3, name: 'Angebote', description: 'Passende Firmen' },
      { step: 4, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v2f': {
    id: 'v2f',
    label: 'V2f Premium (Feedback)',
    path: '/umzugsofferten-v2?variant=v2f',
    color: 'bg-violet-600',
    description: 'V2 Feedback: Free-First, 3 Steps, Plan-Auswahl, Sticky CTA',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 2, name: 'Plan wählen', description: 'Gratis oder Premium' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V4 - Video-First Sub-Variants
  'v4a': {
    id: 'v4a',
    label: 'V4a Urgency Based',
    path: '/umzugsofferten-v4a',
    color: 'bg-pink-500',
    description: 'V4a: Urgency-basiert mit Countdown-Timer und Scarcity-Messaging',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Flash Offer', description: 'Countdown + Rabatt-Angebot' },
      { step: 2, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v4b': {
    id: 'v4b',
    label: 'V4b Social Proof',
    path: '/umzugsofferten-v4b',
    color: 'bg-pink-600',
    description: 'V4b: Social Proof mit Bewertungen und Testimonials im Funnel',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Trust Intro', description: 'Ratings und Statistiken' },
      { step: 2, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 3, name: 'Firmenauswahl', description: 'Mit Bewertungen' },
      { step: 4, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v4c': {
    id: 'v4c',
    label: 'V4c Value First',
    path: '/umzugsofferten-v4c',
    color: 'bg-pink-700',
    description: 'V4c: Value-First mit Savings-Display vor Eingabe',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Savings Preview', description: 'Potenzielle Ersparnis zeigen' },
      { step: 2, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v4d': {
    id: 'v4d',
    label: 'V4d Gamified',
    path: '/umzugsofferten-v4d',
    color: 'bg-pink-800',
    description: 'V4d: Gamified mit Punkten, Achievements und Rewards',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Start', description: 'Punkte sammeln starten' },
      { step: 2, name: 'Umzugsdetails', description: '+50 Punkte' },
      { step: 3, name: 'Services', description: '+25 Punkte pro Service' },
      { step: 4, name: 'Kontakt', description: '+100 Punkte = Rabatt' },
    ],
  },
  'v4e': {
    id: 'v4e',
    label: 'V4e Minimal Friction',
    path: '/umzugsofferten-v4e',
    color: 'bg-pink-900',
    description: 'V4e: Minimal Friction mit nur 2 Eingabefeldern pro Step',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'PLZ Eingabe', description: 'Nur Von-Nach PLZ' },
      { step: 2, name: 'Email', description: 'Nur Email-Adresse' },
      { step: 3, name: 'Bestätigung', description: 'Zusammenfassung' },
    ],
  },
  'v4f': {
    id: 'v4f',
    label: 'V4f Video-First (Feedback)',
    path: '/umzugsofferten-v4?variant=v4f',
    color: 'bg-fuchsia-600',
    description: 'V4 Feedback: Video optional, Skip-Button, Lazy-Load, Sticky CTA',
    parentFlow: 'umzugsofferten-v4',
    steps: [
      { step: 1, name: 'Video (Optional)', description: 'Video-Hero mit Skip' },
      { step: 2, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V5 - Marketplace/Accessibility Sub-Variants
  'v5a': {
    id: 'v5a',
    label: 'V5a High Contrast',
    path: '/umzugsofferten-v5a',
    color: 'bg-yellow-500',
    description: 'V5a: High Contrast für bessere Lesbarkeit und Barrierefreiheit',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Umzugsart', description: 'Grosse Buttons, klare Kontraste' },
      { step: 2, name: 'Details', description: 'Deutliche Labels' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v5b': {
    id: 'v5b',
    label: 'V5b Screen Reader',
    path: '/umzugsofferten-v5b',
    color: 'bg-yellow-600',
    description: 'V5b: Funnel Layout mit Step Engine (Archetype 2026)',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Intro', description: 'ARIA-optimierter Start' },
      { step: 2, name: 'Details', description: 'Semantische Struktur' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v5c': {
    id: 'v5c',
    label: 'V5c Invisible Interface',
    path: '/umzugsofferten-v5c',
    color: 'bg-yellow-700',
    description: 'V5c: Archetype 2026 - Invisible Interface Design',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Focus Mode', description: 'Keyboard-first Navigation' },
      { step: 2, name: 'Details', description: 'Tab-navigierbare Felder' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v5d': {
    id: 'v5d',
    label: 'V5d Large Text',
    path: '/umzugsofferten-v5d',
    color: 'bg-yellow-800',
    description: 'V5d: Large Text für ältere Nutzer, grössere Touch-Targets',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Grosse Buttons', description: 'XL Touch-Targets' },
      { step: 2, name: 'Einfache Eingabe', description: '18px+ Schriftgrösse' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v5e': {
    id: 'v5e',
    label: 'V5e Reduced Motion',
    path: '/umzugsofferten-v5e',
    color: 'bg-yellow-900',
    description: 'V5e: Reduced Motion für kognitive Barrierefreiheit',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Static Layout', description: 'Keine Animationen' },
      { step: 2, name: 'Klare Steps', description: 'Text-basierte Fortschrittsanzeige' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v5f': {
    id: 'v5f',
    label: 'V5f Marketplace (Feedback)',
    path: '/umzugsofferten-v5?variant=v5f',
    color: 'bg-amber-600',
    description: 'V5 Feedback: Top-3-Empfehlung, Trust-Badges, Filter/Sort',
    parentFlow: 'umzugsofferten-v5',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer' },
      { step: 2, name: 'Firmenauswahl', description: 'Top-3 Empfehlungen mit Filter' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V6 - Ultimate Feedback Variants
  'v6a': {
    id: 'v6a',
    label: 'V6a Ultimate Optimized ⭐',
    path: '/umzugsofferten-v6a',
    color: 'bg-orange-600',
    description: 'V6a: 3-Step Ultimate (Details → Paket → Kontakt) mit sticky CTA & Trust',
    parentFlow: 'umzugsofferten-v6',
    steps: [
      { step: 1, name: 'Details', description: 'PLZ Von/Nach, Zimmer' },
      { step: 2, name: 'Paket', description: 'Service-Level wählen (3 Karten)' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  'v6b': {
    id: 'v6b',
    label: 'V6b Ultimate Extended',
    path: '/umzugsofferten-v6b',
    color: 'bg-orange-700',
    description: 'V6b: 5-Step Ultimate mit Video-Scan, Tooltips, Preis-Reveal und Abschluss',
    parentFlow: 'umzugsofferten-v6',
    steps: [
      { step: 1, name: 'Details', description: 'Von/Nach, Datum, Zimmer' },
      { step: 2, name: 'Video-Scan', description: 'Inventar per Video (mit Skip)' },
      { step: 3, name: 'Paket', description: 'Servicepakete vergleichen' },
      { step: 4, name: 'Preis', description: 'Preisaufschlüsselung' },
      { step: 5, name: 'Buchen', description: 'Kontakt + Absenden' },
    ],
  },
  'v6c': {
    id: 'v6c',
    label: 'V6c Gemini "God Mode"',
    path: '/umzugsofferten-v6c',
    color: 'bg-orange-800',
    description: 'V6c: Gemini God-Mode mit Permission-Priming, Labor-Illusion & Explainable AI',
    parentFlow: 'umzugsofferten-v6',
    steps: [
      { step: 1, name: 'Details', description: 'Basisdaten + Volumen-Teaser' },
      { step: 2, name: 'Inventar', description: 'Video-Scan / KI-Erkennung' },
      { step: 3, name: 'Service', description: '6-Tier Decoy Pricing' },
      { step: 4, name: 'Preis', description: 'Labor-Illusion + Fixpreis' },
      { step: 5, name: 'Buchung', description: 'Kontakt + Reservierung' },
      { step: 6, name: 'Bestätigt', description: 'Success + Garantie' },
    ],
  },
  'v6d': {
    id: 'v6d',
    label: 'V6d Deep Research',
    path: '/umzugsofferten-v6d',
    color: 'bg-orange-900',
    description: 'V6d: Deep-Research Feedback mit Mobile-First Formular & dynamischen CTAs',
    parentFlow: 'umzugsofferten-v6',
    steps: [
      { step: 1, name: 'Adressen', description: 'PLZ Von/Nach + Datum' },
      { step: 2, name: 'Umzugsart', description: 'Privat/Firma/Spezial' },
      { step: 3, name: 'Inventar', description: 'Video oder manuell' },
      { step: 4, name: 'Services', description: 'Zusatzleistungen (max 3–4)' },
      { step: 5, name: 'Abschluss', description: 'Kontakt + Privacy' },
    ],
  },
  'v6e': {
    id: 'v6e',
    label: 'V6e Thinking Mode',
    path: '/umzugsofferten-v6e',
    color: 'bg-amber-700',
    description: 'V6e: Thinking-Mode Feedback mit sauberem Funnel, Safe-Area Footer & "Fixpreis reservieren"',
    parentFlow: 'umzugsofferten-v6',
    steps: [
      { step: 1, name: 'Details', description: 'Adressen + Datum (de-CH)' },
      { step: 2, name: 'Video-Scan', description: 'Privacy + Nutzen + Skip' },
      { step: 3, name: 'Service-Level', description: 'Cards-only Auswahl' },
      { step: 4, name: 'Ihr Preis', description: '"Was ist drin?" sofort sichtbar' },
      { step: 5, name: 'Reservieren', description: 'Kontakt + Fixpreis reservieren' },
    ],
  },
  'v6f': {
    id: 'v6f',
    label: 'V6f Ultimate (Best of All)',
    path: '/umzugsofferten-v6f',
    color: 'bg-amber-800',
    description: 'V6f: Kombiniert V6a–V6e (enclosed checkout, sticky footer, labor illusion, timeline)',
    parentFlow: 'umzugsofferten-v6',
    steps: [
      { step: 1, name: 'Details', description: 'Wenige Angaben + Trust' },
      { step: 2, name: 'Service', description: 'Sweet-Spot Tier Auswahl' },
      { step: 3, name: 'Video', description: 'Video-Scan optional' },
      { step: 4, name: 'Preis', description: 'Fixpreis berechnen' },
      { step: 5, name: 'Kontakt', description: 'Offerten erhalten' },
    ],
  },
  // V7 - SwissMove Feedback
  'v7a': {
    id: 'v7a',
    label: 'V7a SwissMove (Feedback)',
    path: '/umzugsofferten-v7?variant=v7a',
    color: 'bg-indigo-600',
    description: 'V7 Feedback: 90s-Timer, Save/Resume, Auto-Advance',
    parentFlow: 'umzugsofferten-v7',
    steps: [
      { step: 1, name: 'Quick Details', description: 'PLZ, Datum, Zimmer' },
      { step: 2, name: 'Services', description: 'Schnelle Service-Auswahl' },
      { step: 3, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // V8 - Decision-Free Feedback
  'v8a': {
    id: 'v8a',
    label: 'V8a Decision-Free (Feedback)',
    path: '/umzugsofferten-v8a',
    color: 'bg-teal-600',
    description: 'V8 Feedback: 2-Step, Review-Card, Transparenz-Panel',
    parentFlow: 'umzugsofferten-v8',
    steps: [
      { step: 1, name: 'Kurze Eingabe', description: 'PLZ, Datum, Zimmer' },
      { step: 2, name: 'Review & Kontakt', description: 'Überblick + Kontaktdaten' },
    ],
  },
  // V2 Archetyp - Best-of-Best
  'v2-archetyp': {
    id: 'v2-archetyp',
    label: 'V2 Archetyp ⭐⭐',
    path: '/umzugsofferten-v2-archetyp',
    color: 'bg-gradient-to-r from-purple-600 to-pink-500',
    description: 'V2 Archetyp: 4 Kundentypen, Swiss Framework, KI-Video',
    parentFlow: 'umzugsofferten-v2',
    steps: [
      { step: 1, name: 'Typ wählen', description: 'Security/Efficiency/Value/Overwhelmed' },
      { step: 2, name: 'Adressen', description: 'Von-Nach mit Autocomplete' },
      { step: 3, name: 'Details', description: 'Zimmer, Datum, Video-Option' },
      { step: 4, name: 'Services', description: 'Paket-Auswahl' },
      { step: 5, name: 'Firmen', description: 'Firmenvergleich' },
      { step: 6, name: 'Kontakt', description: 'Kontaktdaten + Absenden' },
    ],
  },
  // Ultimate Swiss Flow
  'ultimate-ch': {
    id: 'ultimate-ch',
    label: 'Ultimate CH ⭐⭐',
    path: '/umzugsofferten-ultimate-ch',
    color: 'bg-gradient-to-r from-red-600 to-red-500',
    description: 'Ultimate Swiss: Komplett Schweiz-optimiert',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Start', description: 'Swiss Trust Intro' },
      { step: 2, name: 'Adressen', description: 'Von-Nach PLZ' },
      { step: 3, name: 'Details', description: 'CH-Zimmer, Datum' },
      { step: 4, name: 'Services', description: 'Pakete wählen' },
      { step: 5, name: 'Kontakt', description: 'Absenden' },
    ],
  },
  // V9 Variants
  'v9a': {
    id: 'v9a',
    label: 'V9.a Gemini Archetyp ⭐',
    path: '/umzugsofferten-v9a',
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
    path: '/umzugsofferten-v9b',
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
  'v9c': {
    id: 'v9c',
    label: 'V9c Zero Friction Optimized',
    path: '/umzugsofferten-v9c',
    color: 'bg-sky-600',
    description: 'Alle 10 Empfehlungen: Tooltips, Funnel-Fokus, keine Vorauswahl, Filter/Sort, Trust-Badges',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Adressen', description: 'PLZ + Zimmer mit Tooltips' },
      { step: 2, name: 'Details', description: 'Stockwerk/Lift mit Erklärungen' },
      { step: 3, name: 'Services', description: 'Service-Level Karten' },
      { step: 4, name: 'Extras & Datum', description: 'Keine Vorauswahl, Flex-Erklärung' },
      { step: 5, name: 'Firmen', description: 'Filter & Sortierung, Trust-Info' },
      { step: 6, name: 'Kontakt', description: 'Übersicht + Kontaktformular' },
    ],
  },
  'v9d': {
    id: 'v9d',
    label: 'V9d Main Gemini',
    path: '/umzugsofferten-v9d',
    color: 'bg-emerald-600',
    description: 'V9d Gemini-Archetyp mit 6 Steps',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Start', description: 'Von-Adresse' },
      { step: 2, name: 'Ziel', description: 'Nach-Adresse' },
      { step: 3, name: 'Details', description: 'Zimmer, Etage, Lift' },
      { step: 4, name: 'Firmen', description: 'Result Teasing / Matching' },
      { step: 5, name: 'Kontakt', description: 'Kontaktdaten' },
      { step: 6, name: 'Fertig', description: 'Bestätigung' },
    ],
  },
  // Ultimate - Combined Best Practices
  'ultimate-v7': {
    id: 'ultimate-v7',
    label: 'Ultimate V7 ⭐⭐',
    path: '/umzugsofferten-ultimate-v7',
    color: 'bg-gradient-to-r from-purple-600 to-pink-600',
    description: 'Ultimate V7: Kombiniert alle Best Practices aus 50+ Flow-Analysen',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Smart Start', description: 'Typ + Trust-Signale' },
      { step: 2, name: 'Adressen', description: 'Von-Nach mit Autocomplete' },
      { step: 3, name: 'Details', description: 'Zimmer, Datum, Video-Option' },
      { step: 4, name: 'Services', description: 'Paket-Auswahl mit Preisvorschau' },
      { step: 5, name: 'Firmen', description: 'Top-3 mit Filter/Sort' },
      { step: 6, name: 'Kontakt', description: 'Review + Absenden' },
    ],
  },
  // Multi - ChatGPT Pro
  'multi-a': {
    id: 'multi-a',
    label: 'Multi.a ChatGPT Pro',
    path: '/umzugsofferten-multi-a',
    color: 'bg-rose-600',
    description: 'ChatGPT Mobile Fix Pack: 3 Steps, Sticky CTA, Trust Bar, Progressive Disclosure',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Umzugsdetails', description: 'PLZ, Datum, Zimmer + optionale Details' },
      { step: 2, name: 'Services', description: 'Transport inkl. + optionale Extras' },
      { step: 3, name: 'Kontakt', description: 'Review + Kontaktdaten + Consent' },
    ],
  },
  // ========== ChatGPT Optimized Flows ==========
  'chatgpt-flow-1': {
    id: 'chatgpt-flow-1',
    label: 'ChatGPT Flow 1 ⭐⭐',
    path: '/chatgpt-flow-1',
    color: 'bg-gradient-to-r from-blue-500 to-green-500',
    description: 'Zero Friction Pro: 2 Steps, Sticky CTA, Trust Badges, Preisvorschau',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Move Info', description: 'Adressen, Datum, Zimmer, Etage kombiniert' },
      { step: 2, name: 'Review & Services', description: 'Zusammenfassung, Extras, Preisrange, Kontakt' },
    ],
  },
  'chatgpt-flow-2': {
    id: 'chatgpt-flow-2',
    label: 'ChatGPT Flow 2 ⭐⭐',
    path: '/chatgpt-flow-2',
    color: 'bg-gradient-to-r from-gray-500 to-orange-500',
    description: 'Social Proof Boosted: 3 Steps, Firmenempfehlungen, Testimonials',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Move Details', description: 'Adressen, Datum, Zimmer, Etage' },
      { step: 2, name: 'Anbieter & Extras', description: '3 empfohlene Firmen + Zusatzservices' },
      { step: 3, name: 'Kontakt & Summary', description: 'Review + Kontaktformular' },
    ],
  },
  'chatgpt-flow-3': {
    id: 'chatgpt-flow-3',
    label: 'ChatGPT Flow 3 ⭐⭐',
    path: '/chatgpt-flow-3',
    color: 'bg-gradient-to-r from-blue-400 to-teal-400',
    description: 'Personalized Guided Chat: Chat-basierter Flow mit AI-Guidance',
    parentFlow: 'umzugsofferten-v9',
    steps: [
      { step: 1, name: 'Chat Intro', description: 'Adressen per Chat-Blasen eingeben' },
      { step: 2, name: 'Services & Preis', description: 'Preisvorschau + Service-Karten im Chat' },
      { step: 3, name: 'Kontakt & Abschluss', description: 'Kontaktdaten im Chat + Konfetti-Success' },
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
