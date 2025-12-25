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

// Variant A: Simplified 3-step flow (no company selection)
export const VARIANT_A: FlowVariantConfig = {
  id: 'variant-a',
  name: 'Simplified 3-Step',
  description: 'Faster flow without company selection: MoveType → Location+Services → Contact',
  
  steps: ['moveType', 'location', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'bar',
  layout: 'card',
  
  headline: 'Schnell & einfach Offerten erhalten',
  subheadline: 'In nur 60 Sekunden – keine Registrierung nötig',
  ctaText: 'Jetzt kostenlos Offerten erhalten',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: false,
  showVideoAIOption: false,
  showServiceDetails: false,
  showSavingsCalculator: false,
  
  companySelectionMode: 'none',
  maxCompanySelections: 0,
  
  submitOptions: ['publish'],
  defaultSubmitOption: 'publish',
  
  cardStyle: 'elevated',
};

// Variant B: Price-first approach
export const VARIANT_B: FlowVariantConfig = {
  id: 'variant-b',
  name: 'Price-First',
  description: 'Show price estimate upfront: Location → Pricing → Services → Contact',
  
  steps: ['location', 'pricing', 'services', 'contact'],
  
  showProgressBar: true,
  progressStyle: 'steps',
  layout: 'wizard',
  
  headline: 'Was kostet Ihr Umzug?',
  subheadline: 'Sofortige Preisschätzung + kostenlose Offerten',
  ctaText: 'Verbindliche Offerten anfordern',
  trustBadges: true,
  
  showPriceEstimate: true,
  showCompanyPreview: true,
  showVideoAIOption: true,
  showServiceDetails: true,
  showSavingsCalculator: true,
  
  companySelectionMode: 'multi',
  maxCompanySelections: 3,
  
  submitOptions: ['direct', 'both'],
  defaultSubmitOption: 'direct',
  
  cardStyle: 'bordered',
};

// Variant C: Conversational/guided flow
export const VARIANT_C: FlowVariantConfig = {
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
export const FLOW_VARIANTS: Record<string, FlowVariantConfig> = {
  'control': VARIANT_CONTROL,
  'variant-a': VARIANT_A,
  'variant-b': VARIANT_B,
  'variant-c': VARIANT_C,
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
};

// Get variant from URL path
export const getVariantFromPath = (path: string): FlowVariantConfig => {
  const variantId = URL_TO_VARIANT[path] || 'control';
  return getFlowVariant(variantId);
};
