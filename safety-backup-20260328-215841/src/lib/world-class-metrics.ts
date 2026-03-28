/**
 * WORLD-CLASS PLATFORM METRICS
 * 
 * Comprehensive measurement system for becoming the #1 moving comparison platform.
 * Based on industry benchmarks and conversion optimization best practices.
 */

// ============================================================================
// KPI DEFINITIONS & TARGETS
// ============================================================================

export interface PlatformKPIs {
  // CONVERSION METRICS
  conversion: {
    overallConversionRate: number;      // Target: 9%+ (Industry: 2-4%)
    heroToFormStart: number;            // Target: 35%+
    formStartToComplete: number;        // Target: 45%+
    funnelDropoffRate: number;          // Target: <15% per step
    mobilConversionRate: number;        // Target: 8%+ (usually lower than desktop)
    returningUserConversion: number;    // Target: 15%+
  };
  
  // PERFORMANCE METRICS (Core Web Vitals)
  performance: {
    lcp: number;                        // Target: <2.5s (Good: <2.0s)
    fid: number;                        // Target: <100ms
    cls: number;                        // Target: <0.1
    inp: number;                        // Target: <200ms
    ttfb: number;                       // Target: <800ms
    fcp: number;                        // Target: <1.8s
    lighthouseScore: number;            // Target: 90+
  };
  
  // USER EXPERIENCE METRICS
  userExperience: {
    avgSessionDuration: number;         // Target: >3min (180s)
    pagesPerSession: number;            // Target: >3.5
    bounceRate: number;                 // Target: <35%
    scrollDepth: number;                // Target: >70%
    formTimeToComplete: number;         // Target: <90s
    rageClickRate: number;              // Target: <2%
    exitIntentTriggerRate: number;      // Target: <5%
  };
  
  // TRUST METRICS
  trust: {
    avgRating: number;                  // Target: 4.8+
    reviewCount: number;                // Target: 3000+
    nps: number;                        // Target: 50+ (World-class: 70+)
    repeatCustomerRate: number;         // Target: 15%+
    referralRate: number;               // Target: 20%+
  };
  
  // SEO METRICS
  seo: {
    organicTrafficGrowth: number;       // Target: +15% MoM
    keywordRankings: number;            // Target: 50+ keywords in Top 10
    domainAuthority: number;            // Target: 40+
    backlinks: number;                  // Target: 500+
    indexedPages: number;               // Target: 200+
  };
  
  // BUSINESS METRICS
  business: {
    leadsPerDay: number;                // Target: 50+
    costPerLead: number;                // Target: <CHF 15
    leadQualityScore: number;           // Target: 75+
    providerSatisfaction: number;       // Target: 85%+
    revenuePerLead: number;             // Target: CHF 45+
  };
}

// ============================================================================
// CURRENT BENCHMARKS VS TARGETS
// ============================================================================

export const WORLD_CLASS_TARGETS: PlatformKPIs = {
  conversion: {
    overallConversionRate: 0.09,
    heroToFormStart: 0.35,
    formStartToComplete: 0.45,
    funnelDropoffRate: 0.15,
    mobilConversionRate: 0.08,
    returningUserConversion: 0.15,
  },
  performance: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    inp: 200,
    ttfb: 800,
    fcp: 1800,
    lighthouseScore: 90,
  },
  userExperience: {
    avgSessionDuration: 180,
    pagesPerSession: 3.5,
    bounceRate: 35,
    scrollDepth: 70,
    formTimeToComplete: 90,
    rageClickRate: 2,
    exitIntentTriggerRate: 5,
  },
  trust: {
    avgRating: 4.8,
    reviewCount: 3000,
    nps: 50,
    repeatCustomerRate: 15,
    referralRate: 20,
  },
  seo: {
    organicTrafficGrowth: 15,
    keywordRankings: 50,
    domainAuthority: 40,
    backlinks: 500,
    indexedPages: 200,
  },
  business: {
    leadsPerDay: 50,
    costPerLead: 15,
    leadQualityScore: 75,
    providerSatisfaction: 85,
    revenuePerLead: 45,
  },
};

// ============================================================================
// COMPETITOR BENCHMARKS
// ============================================================================

export const COMPETITOR_BENCHMARKS = {
  movu: {
    name: 'Movu.ch',
    conversionRate: 0.04,
    lcp: 3200,
    bounceRate: 45,
    avgRating: 4.5,
    strengths: ['Brand awareness', 'Market share', 'Partner network'],
    weaknesses: ['Slow load times', 'Complex funnel', 'Generic UX'],
  },
  umzug24: {
    name: 'Umzug24.ch',
    conversionRate: 0.025,
    lcp: 4100,
    bounceRate: 55,
    avgRating: 4.2,
    strengths: ['SEO presence', 'Content'],
    weaknesses: ['Outdated design', 'Poor mobile UX', 'No price calculator'],
  },
  lemonade: {
    name: 'Lemonade (Insurance benchmark)',
    conversionRate: 0.12,
    lcp: 1800,
    bounceRate: 28,
    avgRating: 4.9,
    strengths: ['World-class UX', 'Instant quotes', 'AI-powered'],
    weaknesses: ['Different industry'],
  },
};

// ============================================================================
// FEATURE CHECKLIST - WHAT WE NEED
// ============================================================================

export interface FeatureStatus {
  id: string;
  name: string;
  category: 'conversion' | 'performance' | 'trust' | 'ux' | 'seo' | 'analytics';
  status: 'done' | 'in_progress' | 'todo' | 'blocked';
  priority: 1 | 2 | 3;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}

export const FEATURE_CHECKLIST: FeatureStatus[] = [
  // CONVERSION (Priority 1)
  { id: 'hero-form', name: 'Multi-Step Hero Form', category: 'conversion', status: 'done', priority: 1, impact: 'high', effort: 'high' },
  { id: 'sticky-cta', name: 'Mobile Sticky CTA', category: 'conversion', status: 'done', priority: 1, impact: 'high', effort: 'low' },
  { id: 'trust-ribbon', name: 'Trust Ribbon Above Fold', category: 'trust', status: 'done', priority: 1, impact: 'high', effort: 'medium' },
  { id: 'price-preview', name: 'Price Preview Before Form', category: 'conversion', status: 'done', priority: 1, impact: 'high', effort: 'medium' },
  { id: 'exit-intent', name: 'Exit Intent Popup', category: 'conversion', status: 'todo', priority: 1, impact: 'high', effort: 'medium' },
  { id: 'social-proof-realtime', name: 'Real-time Social Proof', category: 'trust', status: 'todo', priority: 1, impact: 'high', effort: 'medium' },
  
  // PERFORMANCE (Priority 1)
  { id: 'cls-fix', name: 'CLS Prevention (Fixed Heights)', category: 'performance', status: 'done', priority: 1, impact: 'high', effort: 'medium' },
  { id: 'lazy-loading', name: 'Image Lazy Loading', category: 'performance', status: 'done', priority: 1, impact: 'medium', effort: 'low' },
  { id: 'font-preload', name: 'Font Preloading', category: 'performance', status: 'done', priority: 1, impact: 'medium', effort: 'low' },
  { id: 'code-splitting', name: 'Route-based Code Splitting', category: 'performance', status: 'done', priority: 1, impact: 'high', effort: 'medium' },
  { id: 'critical-css', name: 'Critical CSS Extraction', category: 'performance', status: 'todo', priority: 2, impact: 'medium', effort: 'high' },
  
  // TRUST (Priority 1)
  { id: 'verified-badges', name: 'Verified Company Badges', category: 'trust', status: 'done', priority: 1, impact: 'high', effort: 'low' },
  { id: 'real-reviews', name: 'Real Customer Reviews', category: 'trust', status: 'done', priority: 1, impact: 'high', effort: 'medium' },
  { id: 'media-logos', name: 'Media Logos (Bekannt aus)', category: 'trust', status: 'done', priority: 1, impact: 'medium', effort: 'low' },
  { id: 'guarantee-badge', name: 'Price Guarantee Badge', category: 'trust', status: 'todo', priority: 2, impact: 'medium', effort: 'low' },
  
  // UX (Priority 1-2)
  { id: 'progress-indicator', name: 'Form Progress Indicator', category: 'ux', status: 'done', priority: 1, impact: 'high', effort: 'low' },
  { id: 'validation-inline', name: 'Inline Form Validation', category: 'ux', status: 'done', priority: 1, impact: 'medium', effort: 'medium' },
  { id: 'auto-complete', name: 'Address Auto-Complete', category: 'ux', status: 'todo', priority: 1, impact: 'high', effort: 'high' },
  { id: 'keyboard-nav', name: 'Full Keyboard Navigation', category: 'ux', status: 'done', priority: 2, impact: 'medium', effort: 'medium' },
  { id: 'micro-animations', name: 'Micro-interactions/Feedback', category: 'ux', status: 'done', priority: 2, impact: 'medium', effort: 'medium' },
  
  // SEO (Priority 1)
  { id: 'structured-data', name: 'JSON-LD Structured Data', category: 'seo', status: 'done', priority: 1, impact: 'high', effort: 'medium' },
  { id: 'meta-optimization', name: 'Meta Tags Optimization', category: 'seo', status: 'done', priority: 1, impact: 'high', effort: 'low' },
  { id: 'canonical-urls', name: 'Canonical URLs', category: 'seo', status: 'done', priority: 1, impact: 'medium', effort: 'low' },
  { id: 'internal-linking', name: 'Strategic Internal Linking', category: 'seo', status: 'done', priority: 1, impact: 'high', effort: 'medium' },
  { id: 'sitemap', name: 'Dynamic Sitemap', category: 'seo', status: 'todo', priority: 2, impact: 'medium', effort: 'medium' },
  
  // ANALYTICS (Priority 1)
  { id: 'funnel-tracking', name: 'Full Funnel Tracking', category: 'analytics', status: 'done', priority: 1, impact: 'high', effort: 'medium' },
  { id: 'web-vitals', name: 'Core Web Vitals Monitoring', category: 'analytics', status: 'done', priority: 1, impact: 'medium', effort: 'low' },
  { id: 'heatmaps', name: 'Hotjar Heatmaps', category: 'analytics', status: 'done', priority: 1, impact: 'high', effort: 'low' },
  { id: 'ab-testing', name: 'A/B Testing Infrastructure', category: 'analytics', status: 'done', priority: 1, impact: 'high', effort: 'high' },
  { id: 'session-recording', name: 'Session Recording', category: 'analytics', status: 'done', priority: 1, impact: 'high', effort: 'low' },
];

// ============================================================================
// CALCULATE OVERALL SCORE
// ============================================================================

export const calculateWorldClassScore = (): number => {
  const totalFeatures = FEATURE_CHECKLIST.length;
  const doneFeatures = FEATURE_CHECKLIST.filter(f => f.status === 'done').length;
  const inProgressFeatures = FEATURE_CHECKLIST.filter(f => f.status === 'in_progress').length;
  
  // Weight: done = 1, in_progress = 0.5, todo = 0
  const score = (doneFeatures + (inProgressFeatures * 0.5)) / totalFeatures * 100;
  
  return Math.round(score);
};

export const getFeaturesByCategory = (category: FeatureStatus['category']) => {
  return FEATURE_CHECKLIST.filter(f => f.category === category);
};

export const getTodoFeatures = () => {
  return FEATURE_CHECKLIST
    .filter(f => f.status === 'todo')
    .sort((a, b) => a.priority - b.priority);
};

export const getHighImpactTodos = () => {
  return FEATURE_CHECKLIST
    .filter(f => f.status === 'todo' && f.impact === 'high')
    .sort((a, b) => a.priority - b.priority);
};
