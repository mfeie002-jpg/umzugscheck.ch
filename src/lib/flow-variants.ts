/**
 * Flow Variants Configuration
 * 
 * This file defines different Umzugsofferten flow variants for A/B testing.
 * Each variant can customize:
 * - Step order and which steps to include
 * - UI layout and styling
 * - Copy/messaging
 * - CTA button text
 * - Additional features (video AI, company comparison, etc.)
 */

export type FlowStep = 
  | 'moveType'        // Step 1: Private/Business move selection
  | 'location'        // Location + apartment size + services
  | 'services'        // Services selection (can be separate or combined with location)
  | 'companies'       // Company ranking/selection
  | 'contact'         // Contact form
  | 'summary'         // Summary before submit
  | 'pricing';        // Show pricing upfront

export interface FlowVariantConfig {
  id: string;
  name: string;
  description: string;
  
  // Step configuration
  steps: FlowStep[];
  
  // UI/UX settings
  showProgressBar: boolean;
  progressStyle: 'dots' | 'bar' | 'steps' | 'minimal';
  layout: 'card' | 'fullWidth' | 'wizard' | 'conversational';
  
  // Copy/Messaging
  headline: string;
  subheadline: string;
  ctaText: string;
  trustBadges: boolean;
  
  // Features
  showPriceEstimate: boolean;
  showCompanyPreview: boolean;
  showVideoAIOption: boolean;
  showServiceDetails: boolean;
  showSavingsCalculator: boolean;
  
  // Company selection
  companySelectionMode: 'multi' | 'single' | 'none';
  maxCompanySelections: number;
  
  // Submit options
  submitOptions: ('direct' | 'publish' | 'both')[];
  defaultSubmitOption: 'direct' | 'publish' | 'both';
  
  // Visual styling
  accentColor?: string;
  cardStyle: 'elevated' | 'flat' | 'bordered';
}

// Default/Control variant (current implementation)
export const VARIANT_CONTROL: FlowVariantConfig = {
  id: 'control',
  name: 'Control (Current)',
  description: 'Current 4-step flow: MoveType → Location+Services → Companies → Contact',
  
  steps: ['moveType', 'location', 'companies', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'dots',
  layout: 'card',
  
  headline: 'Umzugsofferten in 2 Minuten',
  subheadline: 'Vergleichen Sie kostenlos Angebote von geprüften Schweizer Umzugsfirmen',
  ctaText: 'Offerten erhalten (kostenlos)',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: true,
  showVideoAIOption: true,
  showServiceDetails: true,
  showSavingsCalculator: true,
  
  companySelectionMode: 'multi',
  maxCompanySelections: 5,
  
  submitOptions: ['direct', 'publish', 'both'],
  defaultSubmitOption: 'both',
  
  cardStyle: 'elevated',
};

// Variant A: Premium Full-Journey Experience
export const VARIANT_A: FlowVariantConfig = {
  id: 'variant-a',
  name: 'Premium Full-Journey',
  description: 'Luxury experience with package selection: Intro → Details → Package → Extras → Schedule → Contact',
  
  steps: ['moveType', 'location', 'services', 'pricing', 'summary', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'bar',
  layout: 'wizard',
  
  headline: 'Ihr Umzug. Perfekt organisiert.',
  subheadline: 'Von der Entscheidung bis zum Einzug – wir kümmern uns um alles.',
  ctaText: 'Premium Offerten anfordern',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: true,
  showVideoAIOption: true,
  showServiceDetails: true,
  showSavingsCalculator: true,
  
  companySelectionMode: 'multi',
  maxCompanySelections: 5,
  
  submitOptions: ['direct', 'publish', 'both'],
  defaultSubmitOption: 'both',
  
  cardStyle: 'elevated',
  
  // Custom V2 flag for premium theme
  accentColor: 'gold',
};

// Variant B: God Mode - One Slider, Zero Decisions
export const VARIANT_B: FlowVariantConfig = {
  id: 'variant-b',
  name: 'God Mode',
  description: 'One slider controls everything: Slider → Details → Confirm → Contact',
  
  steps: ['pricing', 'location', 'summary', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'minimal',
  layout: 'wizard',
  
  headline: 'One Slider. Alles geregelt.',
  subheadline: 'Wie viel wollen Sie selbst machen? Schieben Sie den Regler.',
  ctaText: 'Jetzt buchen',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: false,
  showVideoAIOption: false,
  showServiceDetails: true,
  showSavingsCalculator: false,
  
  companySelectionMode: 'none',
  maxCompanySelections: 0,
  
  submitOptions: ['direct'],
  defaultSubmitOption: 'direct',
  
  cardStyle: 'elevated',
  accentColor: 'gradient',
};
// Variant C: Video-First AI V4 Experience
export const VARIANT_C: FlowVariantConfig = {
  id: 'variant-c',
  name: 'Video-First AI V4',
  description: 'KI-Video-Kalkulator als USP mit Fixpreis-Angeboten',
  
  steps: ['moveType', 'location', 'services', 'companies', 'summary', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'steps',
  layout: 'fullWidth',
  
  headline: 'Video hochladen. Fixpreis erhalten.',
  subheadline: 'KI-Analyse in 60 Sekunden • Verbindliche Festpreise',
  ctaText: 'Jetzt Fixpreis erhalten',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: true,
  showVideoAIOption: true,
  showServiceDetails: true,
  showSavingsCalculator: true,
  
  companySelectionMode: 'multi',
  maxCompanySelections: 5,
  
  submitOptions: ['direct', 'publish'],
  defaultSubmitOption: 'direct',
  
  accentColor: 'blue',
  cardStyle: 'elevated',
};

export const VARIANT_C_ORIGINAL: FlowVariantConfig = {
  id: 'variant-c',
  name: 'Conversational',
  description: 'Guided Q&A style: Each question on its own screen',
  
  steps: ['moveType', 'location', 'services', 'companies', 'summary', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'minimal',
  layout: 'conversational',
  
  headline: 'Erzählen Sie uns von Ihrem Umzug',
  subheadline: 'Wir finden die besten Angebote für Sie',
  ctaText: 'Meine Offerten erhalten',
  trustBadges: false,
  
  showPriceEstimate: true,
  showCompanyPreview: true,
  showVideoAIOption: true,
  showServiceDetails: true,
  showSavingsCalculator: true,
  
  companySelectionMode: 'single',
  maxCompanySelections: 1,
  
  submitOptions: ['direct'],
  defaultSubmitOption: 'direct',
  
  cardStyle: 'flat',
};

// All variants
// Variant D: Marketplace Wizard V5
export const VARIANT_D: FlowVariantConfig = {
  id: 'variant-d',
  name: 'Marketplace Wizard V5',
  description: 'Full End-to-End Marketplace mit Partner-Offerten und Booking',
  
  steps: ['moveType', 'location', 'services', 'companies', 'summary', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'bar',
  layout: 'wizard',
  
  headline: 'Fixpreis-Offerten in 10 Minuten',
  subheadline: 'Video/Inventar → Partner-Angebote → Online buchen',
  ctaText: 'Jetzt buchen',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: true,
  showVideoAIOption: true,
  showServiceDetails: true,
  showSavingsCalculator: true,
  
  companySelectionMode: 'single',
  maxCompanySelections: 1,
  
  submitOptions: ['direct'],
  defaultSubmitOption: 'direct',
  
  accentColor: 'green',
  cardStyle: 'elevated',
};

// Variant E: Ultimate V6 - God Mode with 6-Tier Architecture
export const VARIANT_E: FlowVariantConfig = {
  id: 'variant-e',
  name: 'Ultimate V6',
  description: 'God Mode mit 6-Tier Service Architecture, Timeline & Trust Dashboard',
  
  steps: ['moveType', 'location', 'services', 'pricing', 'summary', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'steps',
  layout: 'wizard',
  
  headline: 'Ultimatives Umzugserlebnis',
  subheadline: '6 Service-Levels • Video-KI • Timeline-Dashboard',
  ctaText: 'Jetzt buchen',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: false,
  showVideoAIOption: true,
  showServiceDetails: true,
  showSavingsCalculator: true,
  
  companySelectionMode: 'none',
  maxCompanySelections: 0,
  
  submitOptions: ['direct'],
  defaultSubmitOption: 'direct',
  
  accentColor: 'purple',
  cardStyle: 'elevated',
};

// Variant F: SwissMove V7 - 90-Sekunden Buchung
export const VARIANT_F: FlowVariantConfig = {
  id: 'variant-f',
  name: 'SwissMove V7',
  description: '90-Sekunden Buchung mit 4-Tier Service-Level Slider',
  
  steps: ['moveType', 'location', 'pricing', 'summary', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'bar',
  layout: 'wizard',
  
  headline: 'Dein Umzug in 90 Sekunden gebucht',
  subheadline: 'Ohne Stress. Ohne versteckte Kosten. Garantiert.',
  ctaText: 'Jetzt buchen',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: true,
  showVideoAIOption: false,
  showServiceDetails: true,
  showSavingsCalculator: false,
  
  companySelectionMode: 'none',
  maxCompanySelections: 0,
  
  submitOptions: ['direct'],
  defaultSubmitOption: 'direct',
  
  accentColor: 'blue',
  cardStyle: 'elevated',
};

// Variant G: Decision-Free V8 - Full Automation
export const VARIANT_G: FlowVariantConfig = {
  id: 'variant-g',
  name: 'Decision-Free V8',
  description: 'Decision-Free Plattform mit KI-Video-Scan, eUmzugCH Integration, Crew-Profile & Live-Tracking',
  
  steps: ['moveType', 'location', 'pricing', 'summary', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'steps',
  layout: 'wizard',
  
  headline: 'Decision-Free Umzug',
  subheadline: 'KI-Inventarisierung • eUmzug-Integration • Fixpreis-Garantie',
  ctaText: 'Jetzt buchen',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: true,
  showVideoAIOption: true,
  showServiceDetails: true,
  showSavingsCalculator: false,
  
  companySelectionMode: 'none',
  maxCompanySelections: 0,
  
  submitOptions: ['direct'],
  defaultSubmitOption: 'direct',
  
  accentColor: 'green',
  cardStyle: 'elevated',
};

// Variant H: Zero Friction V9 - Ultimate Optimization
export const VARIANT_H: FlowVariantConfig = {
  id: 'variant-h',
  name: 'Zero Friction V9',
  description: 'Ultimative Optimierung: Minimal Input, Maximum Output, 3-Minuten-Buchung',
  
  steps: ['location', 'pricing', 'summary', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'bar',
  layout: 'wizard',
  
  headline: 'Umzug in 3 Minuten gebucht',
  subheadline: 'Fixpreis • Keine versteckten Kosten • Schweizer Qualität',
  ctaText: 'Verbindlich buchen',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: false,
  showVideoAIOption: true,
  showServiceDetails: true,
  showSavingsCalculator: true,
  
  companySelectionMode: 'none',
  maxCompanySelections: 0,
  
  submitOptions: ['direct'],
  defaultSubmitOption: 'direct',
  
  accentColor: 'emerald',
  cardStyle: 'elevated',
};

export const FLOW_VARIANTS: Record<string, FlowVariantConfig> = {
  'control': VARIANT_CONTROL,
  'variant-a': VARIANT_A,
  'variant-b': VARIANT_B,
  'variant-c': VARIANT_C,
  'variant-d': VARIANT_D,
  'variant-e': VARIANT_E,
  'variant-f': VARIANT_F,
  'variant-g': VARIANT_G,
  'variant-h': VARIANT_H,
};

// Get variant by ID
export const getFlowVariant = (id: string): FlowVariantConfig => {
  return FLOW_VARIANTS[id] || VARIANT_CONTROL;
};

// Get all variant IDs
export const getFlowVariantIds = (): string[] => {
  return Object.keys(FLOW_VARIANTS);
};

// URL path to variant mapping
export const URL_TO_VARIANT: Record<string, string> = {
  '/umzugsofferten': 'control',
  '/umzugsofferten-v2': 'variant-a',
  '/umzugsofferten-v3': 'variant-b',
  '/umzugsofferten-v4': 'variant-c',
  '/umzugsofferten-v5': 'variant-d',
  '/umzugsofferten-v6': 'variant-e',
  '/umzugsofferten-v7': 'variant-f',
  '/umzugsofferten-v8': 'variant-g',
  '/umzugsofferten-v9': 'variant-h',
};

// Get variant from URL path
export const getVariantFromPath = (path: string): FlowVariantConfig => {
  const variantId = URL_TO_VARIANT[path] || 'control';
  return getFlowVariant(variantId);
};
