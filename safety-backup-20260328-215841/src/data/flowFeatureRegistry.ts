/**
 * Flow Feature Registry - Extended Edition
 * 
 * Central mapping of which features each flow has implemented.
 * Used for live scoring without DOM inspection.
 * 
 * NOW WITH 28 FEATURES across 7 categories:
 * - Trust (5 features)
 * - CTA (4 features)  
 * - Mobile (4 features)
 * - UX (5 features)
 * - SEO (4 features) - NEW
 * - Performance (3 features) - NEW
 * - Accessibility (3 features) - NEW
 */

export interface FlowFeatures {
  // Trust Features (5)
  hasASTAG: boolean;
  hasSwissQuality: boolean;
  hasRatingBadge: boolean;
  hasFreeLabel: boolean;
  hasTrustPills: boolean;
  
  // CTA Features (4)
  hasStickyCTA: boolean;
  hasClearCTALabel: boolean;
  hasProgressIndicator: boolean;
  hasMicroFeedback: boolean;
  
  // Mobile Features (4)
  hasSafeArea: boolean;
  hasTouchTargets: boolean;
  hasResponsiveLayout: boolean;
  hasBottomSheet: boolean;
  
  // UX Features (5)
  hasProgressBar: boolean;
  hasValidation: boolean;
  hasAnimations: boolean;
  hasAutoAdvance: boolean;
  hasPricePreview: boolean;
  
  // SEO Features (4) - NEW
  hasMetaTags: boolean;
  hasStructuredData: boolean;
  hasCanonicalUrl: boolean;
  hasSemanticHTML: boolean;
  
  // Performance Features (3) - NEW
  hasLazyLoading: boolean;
  hasImageOptimization: boolean;
  hasCodeSplitting: boolean;
  
  // Accessibility Features (3) - NEW
  hasAriaLabels: boolean;
  hasKeyboardNavigation: boolean;
  hasContrastCompliance: boolean;
}

// Default features (baseline)
const BASELINE_FEATURES: FlowFeatures = {
  // Trust
  hasASTAG: false,
  hasSwissQuality: false,
  hasRatingBadge: false,
  hasFreeLabel: true,
  hasTrustPills: false,
  // CTA
  hasStickyCTA: false,
  hasClearCTALabel: true,
  hasProgressIndicator: false,
  hasMicroFeedback: false,
  // Mobile
  hasSafeArea: false,
  hasTouchTargets: true,
  hasResponsiveLayout: true,
  hasBottomSheet: false,
  // UX
  hasProgressBar: false,
  hasValidation: true,
  hasAnimations: false,
  hasAutoAdvance: false,
  hasPricePreview: false,
  // SEO
  hasMetaTags: true,
  hasStructuredData: false,
  hasCanonicalUrl: true,
  hasSemanticHTML: true,
  // Performance
  hasLazyLoading: true,
  hasImageOptimization: false,
  hasCodeSplitting: true,
  // Accessibility
  hasAriaLabels: false,
  hasKeyboardNavigation: true,
  hasContrastCompliance: true,
};

// V1 base features
const V1_FEATURES: FlowFeatures = {
  ...BASELINE_FEATURES,
  hasProgressBar: true,
  hasProgressIndicator: true,
  hasAriaLabels: true,
};

// Ultimate features (all enabled)
const ULTIMATE_FEATURES: FlowFeatures = {
  // Trust
  hasASTAG: true,
  hasSwissQuality: true,
  hasRatingBadge: true,
  hasFreeLabel: true,
  hasTrustPills: true,
  // CTA
  hasStickyCTA: true,
  hasClearCTALabel: true,
  hasProgressIndicator: true,
  hasMicroFeedback: true,
  // Mobile
  hasSafeArea: true,
  hasTouchTargets: true,
  hasResponsiveLayout: true,
  hasBottomSheet: true,
  // UX
  hasProgressBar: true,
  hasValidation: true,
  hasAnimations: true,
  hasAutoAdvance: true,
  hasPricePreview: true,
  // SEO
  hasMetaTags: true,
  hasStructuredData: true,
  hasCanonicalUrl: true,
  hasSemanticHTML: true,
  // Performance
  hasLazyLoading: true,
  hasImageOptimization: true,
  hasCodeSplitting: true,
  // Accessibility
  hasAriaLabels: true,
  hasKeyboardNavigation: true,
  hasContrastCompliance: true,
};

// Premium features (V2, V6)
const PREMIUM_FEATURES: FlowFeatures = {
  ...V1_FEATURES,
  hasASTAG: true,
  hasSwissQuality: true,
  hasAnimations: true,
  hasPricePreview: true,
  hasStructuredData: true,
  hasImageOptimization: true,
};

// Speed-optimized features (V7, V8)
const SPEED_FEATURES: FlowFeatures = {
  ...V1_FEATURES,
  hasAutoAdvance: true,
  hasMicroFeedback: true,
  hasTouchTargets: true,
  hasLazyLoading: true,
  hasCodeSplitting: true,
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
 * Calculate score from features - Extended with new categories
 */
export function calculateScoreFromFeatures(features: FlowFeatures): {
  overall: number;
  trust: number;
  cta: number;
  mobile: number;
  ux: number;
  conversion: number;
  seo: number;
  performance: number;
  accessibility: number;
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
  
  // SEO Score (max 100) - NEW
  const seoPoints = [
    features.hasMetaTags ? 30 : 0,
    features.hasStructuredData ? 30 : 0,
    features.hasCanonicalUrl ? 20 : 0,
    features.hasSemanticHTML ? 20 : 0,
  ];
  const seo = seoPoints.reduce((a, b) => a + b, 0);
  
  // Performance Score (max 100) - NEW
  const performancePoints = [
    features.hasLazyLoading ? 35 : 0,
    features.hasImageOptimization ? 35 : 0,
    features.hasCodeSplitting ? 30 : 0,
  ];
  const performance = performancePoints.reduce((a, b) => a + b, 0);
  
  // Accessibility Score (max 100) - NEW
  const accessibilityPoints = [
    features.hasAriaLabels ? 40 : 0,
    features.hasKeyboardNavigation ? 35 : 0,
    features.hasContrastCompliance ? 25 : 0,
  ];
  const accessibility = accessibilityPoints.reduce((a, b) => a + b, 0);
  
  // Conversion is weighted average
  const conversion = Math.round((trust * 0.3 + cta * 0.4 + mobile * 0.3));
  
  // Overall weighted (now includes new categories)
  const overall = Math.round(
    trust * 0.15 +
    cta * 0.20 +
    mobile * 0.15 +
    ux * 0.10 +
    conversion * 0.10 +
    seo * 0.10 +
    performance * 0.10 +
    accessibility * 0.10
  );
  
  return { overall, trust, cta, mobile, ux, conversion, seo, performance, accessibility };
}

/**
 * Feature descriptions for UI display
 */
export const FEATURE_DESCRIPTIONS: Record<keyof FlowFeatures, { label: string; category: string; description: string }> = {
  // Trust
  hasASTAG: { label: 'ASTAG Badge', category: 'Trust', description: 'Swiss moving association certification' },
  hasSwissQuality: { label: 'Swiss Quality', category: 'Trust', description: 'Swiss quality guarantee badge' },
  hasRatingBadge: { label: 'Rating Badge', category: 'Trust', description: 'Customer rating display' },
  hasFreeLabel: { label: 'Free Label', category: 'Trust', description: '"Kostenlos & unverbindlich" label' },
  hasTrustPills: { label: 'Trust Pills', category: 'Trust', description: 'Trust indicators below header' },
  // CTA
  hasStickyCTA: { label: 'Sticky CTA', category: 'CTA', description: 'Fixed CTA button on mobile' },
  hasClearCTALabel: { label: 'Clear CTA Label', category: 'CTA', description: 'Clear action text' },
  hasProgressIndicator: { label: 'Progress Indicator', category: 'CTA', description: 'Step progress display' },
  hasMicroFeedback: { label: 'Micro Feedback', category: 'CTA', description: 'Interaction feedback' },
  // Mobile
  hasSafeArea: { label: 'Safe Area', category: 'Mobile', description: 'Notch-safe padding' },
  hasTouchTargets: { label: 'Touch Targets', category: 'Mobile', description: '44px minimum touch areas' },
  hasResponsiveLayout: { label: 'Responsive Layout', category: 'Mobile', description: 'Adapts to screen size' },
  hasBottomSheet: { label: 'Bottom Sheet', category: 'Mobile', description: 'Mobile-friendly modals' },
  // UX
  hasProgressBar: { label: 'Progress Bar', category: 'UX', description: 'Visual progress indicator' },
  hasValidation: { label: 'Validation', category: 'UX', description: 'Inline form validation' },
  hasAnimations: { label: 'Animations', category: 'UX', description: 'Smooth transitions' },
  hasAutoAdvance: { label: 'Auto Advance', category: 'UX', description: 'Auto-progress on selection' },
  hasPricePreview: { label: 'Price Preview', category: 'UX', description: 'Live price estimation' },
  // SEO
  hasMetaTags: { label: 'Meta Tags', category: 'SEO', description: 'Optimized meta tags' },
  hasStructuredData: { label: 'Structured Data', category: 'SEO', description: 'JSON-LD schema markup' },
  hasCanonicalUrl: { label: 'Canonical URL', category: 'SEO', description: 'Canonical link element' },
  hasSemanticHTML: { label: 'Semantic HTML', category: 'SEO', description: 'Proper HTML5 structure' },
  // Performance
  hasLazyLoading: { label: 'Lazy Loading', category: 'Performance', description: 'Deferred asset loading' },
  hasImageOptimization: { label: 'Image Optimization', category: 'Performance', description: 'Optimized images' },
  hasCodeSplitting: { label: 'Code Splitting', category: 'Performance', description: 'Route-based splitting' },
  // Accessibility
  hasAriaLabels: { label: 'ARIA Labels', category: 'Accessibility', description: 'Screen reader support' },
  hasKeyboardNavigation: { label: 'Keyboard Navigation', category: 'Accessibility', description: 'Full keyboard support' },
  hasContrastCompliance: { label: 'Contrast Compliance', category: 'Accessibility', description: 'WCAG contrast ratios' },
};

/**
 * Get missing features with recommendations
 */
export function getMissingFeatures(flowId: string): Array<{
  feature: keyof FlowFeatures;
  label: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  recommendation: string;
}> {
  const features = getFlowFeatures(flowId);
  const missing: Array<{
    feature: keyof FlowFeatures;
    label: string;
    category: string;
    severity: 'critical' | 'warning' | 'info';
    recommendation: string;
  }> = [];
  
  const severityMap: Partial<Record<keyof FlowFeatures, 'critical' | 'warning' | 'info'>> = {
    hasASTAG: 'critical',
    hasSwissQuality: 'critical',
    hasStickyCTA: 'critical',
    hasResponsiveLayout: 'critical',
    hasRatingBadge: 'warning',
    hasTrustPills: 'warning',
    hasProgressIndicator: 'warning',
    hasSafeArea: 'warning',
    hasTouchTargets: 'warning',
    hasProgressBar: 'warning',
    hasValidation: 'warning',
    hasStructuredData: 'warning',
    hasAriaLabels: 'warning',
    hasFreeLabel: 'info',
    hasMicroFeedback: 'info',
    hasBottomSheet: 'info',
    hasAnimations: 'info',
    hasAutoAdvance: 'info',
    hasPricePreview: 'info',
    hasMetaTags: 'info',
    hasCanonicalUrl: 'info',
    hasSemanticHTML: 'info',
    hasLazyLoading: 'info',
    hasImageOptimization: 'info',
    hasCodeSplitting: 'info',
    hasKeyboardNavigation: 'info',
    hasContrastCompliance: 'info',
  };
  
  (Object.entries(features) as [keyof FlowFeatures, boolean][]).forEach(([key, hasFeature]) => {
    if (!hasFeature && FEATURE_DESCRIPTIONS[key]) {
      const desc = FEATURE_DESCRIPTIONS[key];
      missing.push({
        feature: key,
        label: desc.label,
        category: desc.category,
        severity: severityMap[key] || 'info',
        recommendation: `Add ${desc.label}: ${desc.description}`,
      });
    }
  });
  
  // Sort by severity
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  return missing.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
