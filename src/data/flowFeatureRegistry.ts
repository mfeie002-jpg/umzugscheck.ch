/**
 * Flow Feature Registry
 * 
 * Central mapping of which features each flow has implemented.
 * Used for live scoring without DOM inspection.
 */

export interface FlowFeatures {
  // Trust Features
  hasASTAG: boolean;
  hasSwissQuality: boolean;
  hasRatingBadge: boolean;
  hasFreeLabel: boolean;
  hasTrustPills: boolean;
  
  // CTA Features
  hasStickyCTA: boolean;
  hasClearCTALabel: boolean;
  hasProgressIndicator: boolean;
  hasMicroFeedback: boolean;
  
  // Mobile Features
  hasSafeArea: boolean;
  hasTouchTargets: boolean;
  hasResponsiveLayout: boolean;
  hasBottomSheet: boolean;
  
  // UX Features
  hasProgressBar: boolean;
  hasValidation: boolean;
  hasAnimations: boolean;
  hasAutoAdvance: boolean;
  hasPricePreview: boolean;
}

// Default features (baseline)
const BASELINE_FEATURES: FlowFeatures = {
  hasASTAG: false,
  hasSwissQuality: false,
  hasRatingBadge: false,
  hasFreeLabel: true,
  hasTrustPills: false,
  hasStickyCTA: false,
  hasClearCTALabel: true,
  hasProgressIndicator: false,
  hasMicroFeedback: false,
  hasSafeArea: false,
  hasTouchTargets: true,
  hasResponsiveLayout: true,
  hasBottomSheet: false,
  hasProgressBar: false,
  hasValidation: true,
  hasAnimations: false,
  hasAutoAdvance: false,
  hasPricePreview: false,
};

// V1 base features
const V1_FEATURES: FlowFeatures = {
  ...BASELINE_FEATURES,
  hasProgressBar: true,
  hasProgressIndicator: true,
};

// Ultimate features (all enabled)
const ULTIMATE_FEATURES: FlowFeatures = {
  hasASTAG: true,
  hasSwissQuality: true,
  hasRatingBadge: true,
  hasFreeLabel: true,
  hasTrustPills: true,
  hasStickyCTA: true,
  hasClearCTALabel: true,
  hasProgressIndicator: true,
  hasMicroFeedback: true,
  hasSafeArea: true,
  hasTouchTargets: true,
  hasResponsiveLayout: true,
  hasBottomSheet: true,
  hasProgressBar: true,
  hasValidation: true,
  hasAnimations: true,
  hasAutoAdvance: true,
  hasPricePreview: true,
};

// Premium features (V2, V6)
const PREMIUM_FEATURES: FlowFeatures = {
  ...V1_FEATURES,
  hasASTAG: true,
  hasSwissQuality: true,
  hasAnimations: true,
  hasPricePreview: true,
};

// Speed-optimized features (V7, V8)
const SPEED_FEATURES: FlowFeatures = {
  ...V1_FEATURES,
  hasAutoAdvance: true,
  hasMicroFeedback: true,
  hasTouchTargets: true,
};

/**
 * Feature registry for all flows
 * Key: flow ID (e.g., 'umzugsofferten-v1', 'v1a', 'ultimate-all-xxx')
 */
export const FLOW_FEATURE_REGISTRY: Record<string, Partial<FlowFeatures>> = {
  // Main Flows - V1 is fully optimized now
  'umzugsofferten-v1': {
    ...ULTIMATE_FEATURES, // V1 has all features implemented
  },
  'umzugsofferten-v2': PREMIUM_FEATURES,
  'umzugsofferten-v3': { ...V1_FEATURES, hasBottomSheet: true },
  'umzugsofferten-v4': { ...PREMIUM_FEATURES, hasAnimations: true },
  'umzugsofferten-v5': { ...PREMIUM_FEATURES, hasTrustPills: true },
  'umzugsofferten-v6': PREMIUM_FEATURES,
  'umzugsofferten-v7': SPEED_FEATURES,
  'umzugsofferten-v8': SPEED_FEATURES,
  'umzugsofferten-v9': { ...PREMIUM_FEATURES, hasStickyCTA: true, hasTrustPills: true },
  'umzugsofferten-v2e': { ...PREMIUM_FEATURES, hasAnimations: true, hasMicroFeedback: true },
  'umzugsofferten-ultimate-best36': ULTIMATE_FEATURES, // All features
  
  // V1 Sub-variants
  'v1a': { ...V1_FEATURES, hasStickyCTA: true, hasTrustPills: true },
  'v1b': V1_FEATURES,
  'v1c': V1_FEATURES,
  'v1d': V1_FEATURES,
  'v1e': V1_FEATURES,
  'v1f': { ...V1_FEATURES, hasStickyCTA: true, hasTrustPills: true, hasMicroFeedback: true },
  'v1g': { ...V1_FEATURES, hasValidation: true, hasTouchTargets: true },
  
  // V2 Sub-variants
  'v2a': PREMIUM_FEATURES,
  'v2b': PREMIUM_FEATURES,
  'v2c': { ...PREMIUM_FEATURES, hasTrustPills: true },
  'v2d': PREMIUM_FEATURES,
  'v2f': { ...PREMIUM_FEATURES, hasStickyCTA: true },
  
  // Other Sub-variants
  'v4f': { ...PREMIUM_FEATURES, hasStickyCTA: true },
  'v5f': { ...PREMIUM_FEATURES, hasTrustPills: true },
  'v6a': { ...PREMIUM_FEATURES, hasStickyCTA: true },
  'v7a': { ...SPEED_FEATURES, hasStickyCTA: true },
  'v8a': { ...SPEED_FEATURES, hasTrustPills: true },
  
  // V9 Sub-variants
  'v9a': { ...ULTIMATE_FEATURES },
  'v9b': { ...PREMIUM_FEATURES, hasStickyCTA: true, hasTrustPills: true },
  'v9c': { ...PREMIUM_FEATURES, hasStickyCTA: true },
  'v9d': { ...PREMIUM_FEATURES, hasStickyCTA: true, hasTrustPills: true },
  
  // V3 Sub-variants
  'v3a': { ...V1_FEATURES, hasTouchTargets: true, hasBottomSheet: true },
};

/**
 * Get features for a flow, with fallback to baseline
 */
export function getFlowFeatures(flowId: string): FlowFeatures {
  // Check for ultimate flows (dynamic IDs)
  if (flowId.includes('ultimate')) {
    return ULTIMATE_FEATURES;
  }
  
  // Check direct match
  if (FLOW_FEATURE_REGISTRY[flowId]) {
    return { ...BASELINE_FEATURES, ...FLOW_FEATURE_REGISTRY[flowId] };
  }
  
  // Check without prefix
  const shortId = flowId.replace('umzugsofferten-', '');
  if (FLOW_FEATURE_REGISTRY[shortId]) {
    return { ...BASELINE_FEATURES, ...FLOW_FEATURE_REGISTRY[shortId] };
  }
  
  return BASELINE_FEATURES;
}

/**
 * Calculate score from features
 */
export function calculateScoreFromFeatures(features: FlowFeatures): {
  overall: number;
  trust: number;
  cta: number;
  mobile: number;
  ux: number;
  conversion: number;
} {
  // Trust Score (max 100)
  const trustPoints = [
    features.hasASTAG ? 25 : 0,
    features.hasSwissQuality ? 25 : 0,
    features.hasRatingBadge ? 20 : 0,
    features.hasFreeLabel ? 15 : 0,
    features.hasTrustPills ? 15 : 0,
  ];
  const trust = trustPoints.reduce((a, b) => a + b, 0);
  
  // CTA Score (max 100)
  const ctaPoints = [
    features.hasStickyCTA ? 35 : 0,
    features.hasClearCTALabel ? 25 : 0,
    features.hasProgressIndicator ? 20 : 0,
    features.hasMicroFeedback ? 20 : 0,
  ];
  const cta = ctaPoints.reduce((a, b) => a + b, 0);
  
  // Mobile Score (max 100)
  const mobilePoints = [
    features.hasSafeArea ? 25 : 0,
    features.hasTouchTargets ? 25 : 0,
    features.hasResponsiveLayout ? 25 : 0,
    features.hasBottomSheet ? 25 : 0,
  ];
  const mobile = mobilePoints.reduce((a, b) => a + b, 0);
  
  // UX Score (max 100)
  const uxPoints = [
    features.hasProgressBar ? 25 : 0,
    features.hasValidation ? 25 : 0,
    features.hasAnimations ? 20 : 0,
    features.hasAutoAdvance ? 15 : 0,
    features.hasPricePreview ? 15 : 0,
  ];
  const ux = uxPoints.reduce((a, b) => a + b, 0);
  
  // Conversion is weighted average
  const conversion = Math.round((trust * 0.3 + cta * 0.4 + mobile * 0.3));
  
  // Overall weighted
  const overall = Math.round(
    trust * 0.20 +
    cta * 0.30 +
    mobile * 0.20 +
    ux * 0.15 +
    conversion * 0.15
  );
  
  return { overall, trust, cta, mobile, ux, conversion };
}
