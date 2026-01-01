/**
 * Persistent Flow Score Service
 * 
 * Manages flow feature scores in the database with real improvement tracking.
 * Scores persist across sessions and actually improve when features are fixed.
 */

import { supabase } from '@/integrations/supabase/client';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';

// Feature key mapping (camelCase to snake_case)
const FEATURE_MAP = {
  hasASTAG: 'has_astag',
  hasSwissQuality: 'has_swiss_quality',
  hasRatingBadge: 'has_rating_badge',
  hasFreeLabel: 'has_free_label',
  hasTrustPills: 'has_trust_pills',
  hasStickyCTA: 'has_sticky_cta',
  hasClearCTALabel: 'has_clear_cta_label',
  hasProgressIndicator: 'has_progress_indicator',
  hasMicroFeedback: 'has_micro_feedback',
  hasSafeArea: 'has_safe_area',
  hasTouchTargets: 'has_touch_targets',
  hasResponsiveLayout: 'has_responsive_layout',
  hasBottomSheet: 'has_bottom_sheet',
  hasProgressBar: 'has_progress_bar',
  hasValidation: 'has_validation',
  hasAnimations: 'has_animations',
  hasAutoAdvance: 'has_auto_advance',
  hasPricePreview: 'has_price_preview',
  hasMetaTags: 'has_meta_tags',
  hasStructuredData: 'has_structured_data',
  hasCanonicalUrl: 'has_canonical_url',
  hasSemanticHTML: 'has_semantic_html',
  hasLazyLoading: 'has_lazy_loading',
  hasImageOptimization: 'has_image_optimization',
  hasCodeSplitting: 'has_code_splitting',
  hasAriaLabels: 'has_aria_labels',
  hasKeyboardNavigation: 'has_keyboard_navigation',
  hasContrastCompliance: 'has_contrast_compliance',
} as const;

const FEATURE_LABELS: Record<string, { label: string; category: string; severity: 'critical' | 'warning' | 'info' }> = {
  has_astag: { label: 'ASTAG Badge', category: 'Trust', severity: 'critical' },
  has_swiss_quality: { label: 'Swiss Quality', category: 'Trust', severity: 'critical' },
  has_rating_badge: { label: 'Rating Badge', category: 'Trust', severity: 'warning' },
  has_free_label: { label: 'Free Label', category: 'Trust', severity: 'info' },
  has_trust_pills: { label: 'Trust Pills', category: 'Trust', severity: 'warning' },
  has_sticky_cta: { label: 'Sticky CTA', category: 'CTA', severity: 'critical' },
  has_clear_cta_label: { label: 'Clear CTA Label', category: 'CTA', severity: 'warning' },
  has_progress_indicator: { label: 'Progress Indicator', category: 'CTA', severity: 'warning' },
  has_micro_feedback: { label: 'Micro Feedback', category: 'CTA', severity: 'info' },
  has_safe_area: { label: 'Safe Area', category: 'Mobile', severity: 'warning' },
  has_touch_targets: { label: 'Touch Targets', category: 'Mobile', severity: 'warning' },
  has_responsive_layout: { label: 'Responsive Layout', category: 'Mobile', severity: 'critical' },
  has_bottom_sheet: { label: 'Bottom Sheet', category: 'Mobile', severity: 'info' },
  has_progress_bar: { label: 'Progress Bar', category: 'UX', severity: 'warning' },
  has_validation: { label: 'Validation', category: 'UX', severity: 'warning' },
  has_animations: { label: 'Animations', category: 'UX', severity: 'info' },
  has_auto_advance: { label: 'Auto Advance', category: 'UX', severity: 'info' },
  has_price_preview: { label: 'Price Preview', category: 'UX', severity: 'info' },
  has_meta_tags: { label: 'Meta Tags', category: 'SEO', severity: 'info' },
  has_structured_data: { label: 'Structured Data', category: 'SEO', severity: 'warning' },
  has_canonical_url: { label: 'Canonical URL', category: 'SEO', severity: 'info' },
  has_semantic_html: { label: 'Semantic HTML', category: 'SEO', severity: 'info' },
  has_lazy_loading: { label: 'Lazy Loading', category: 'Performance', severity: 'info' },
  has_image_optimization: { label: 'Image Optimization', category: 'Performance', severity: 'warning' },
  has_code_splitting: { label: 'Code Splitting', category: 'Performance', severity: 'info' },
  has_aria_labels: { label: 'ARIA Labels', category: 'Accessibility', severity: 'warning' },
  has_keyboard_navigation: { label: 'Keyboard Navigation', category: 'Accessibility', severity: 'info' },
  has_contrast_compliance: { label: 'Contrast Compliance', category: 'Accessibility', severity: 'info' },
};

export interface FlowFeatureScore {
  id: string;
  flowId: string;
  runNumber: number;
  features: Record<string, boolean>;
  scores: {
    overall: number;
    trust: number;
    cta: number;
    mobile: number;
    ux: number;
    seo: number;
    performance: number;
    accessibility: number;
    conversion: number;
  };
  issuesCount: number;
  fixedIssuesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImprovementResult {
  flowId: string;
  previousScore: number;
  currentScore: number;
  scoreDelta: number;
  fixedFeatures: string[];
  remainingIssues: string[];
  categoryChanges: Record<string, { before: number; after: number; delta: number }>;
}

/**
 * Get all flow IDs from configs
 */
export function getAllFlowIds(): string[] {
  const flowIds: string[] = [];
  
  // Main flows
  Object.keys(FLOW_CONFIGS).forEach(id => {
    flowIds.push(id);
  });
  
  // Sub-variants with prefix
  Object.keys(SUB_VARIANT_CONFIGS).forEach(id => {
    flowIds.push(`umzugsofferten-${id}`);
  });
  
  return flowIds;
}

/**
 * Initialize flow scores in database from static registry
 */
export async function initializeFlowScores(): Promise<void> {
  const flowIds = getAllFlowIds();
  
  for (const flowId of flowIds) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('flow_feature_scores')
      .select('id')
      .eq('flow_id', flowId)
      .eq('run_number', 1)
      .maybeSingle();
    
    if (!existing) {
      // Get baseline features based on flow type
      const isUltimate = flowId.includes('ultimate');
      const isPremium = flowId.includes('v2') || flowId.includes('v6') || flowId.includes('v4') || flowId.includes('v5') || flowId.includes('v9');
      const isSpeed = flowId.includes('v7') || flowId.includes('v8');
      const isV1 = flowId.includes('v1');
      
      const features: Record<string, boolean> = {
        has_astag: isUltimate || isPremium,
        has_swiss_quality: isUltimate || isPremium,
        has_rating_badge: isUltimate,
        has_free_label: true,
        has_trust_pills: isUltimate || flowId.includes('v9'),
        has_sticky_cta: isUltimate || flowId.includes('v9') || flowId.includes('f'),
        has_clear_cta_label: true,
        has_progress_indicator: isUltimate || isV1 || isPremium,
        has_micro_feedback: isUltimate || isSpeed,
        has_safe_area: isUltimate,
        has_touch_targets: true,
        has_responsive_layout: true,
        has_bottom_sheet: isUltimate || flowId.includes('v3'),
        has_progress_bar: isUltimate || isV1,
        has_validation: true,
        has_animations: isUltimate || isPremium,
        has_auto_advance: isUltimate || isSpeed,
        has_price_preview: isUltimate || isPremium,
        has_meta_tags: true,
        has_structured_data: isUltimate || isPremium,
        has_canonical_url: true,
        has_semantic_html: true,
        has_lazy_loading: true,
        has_image_optimization: isUltimate || isPremium,
        has_code_splitting: true,
        has_aria_labels: isUltimate || isV1,
        has_keyboard_navigation: true,
        has_contrast_compliance: true,
      };
      
      await supabase
        .from('flow_feature_scores')
        .insert({
          flow_id: flowId,
          run_number: 1,
          ...features,
        });
    }
  }
}

/**
 * Get latest scores for all flows
 */
export async function getLatestFlowScores(): Promise<FlowFeatureScore[]> {
  const { data, error } = await supabase
    .from('flow_feature_scores')
    .select('*')
    .order('run_number', { ascending: false });
  
  if (error) {
    console.error('Error fetching flow scores:', error);
    return [];
  }
  
  // Get latest score per flow
  const latestByFlow = new Map<string, any>();
  data?.forEach(row => {
    if (!latestByFlow.has(row.flow_id)) {
      latestByFlow.set(row.flow_id, row);
    }
  });
  
  return Array.from(latestByFlow.values()).map(mapDbToFlowScore);
}

/**
 * Get score for a specific flow
 */
export async function getFlowScore(flowId: string): Promise<FlowFeatureScore | null> {
  const { data, error } = await supabase
    .from('flow_feature_scores')
    .select('*')
    .eq('flow_id', flowId)
    .order('run_number', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error || !data) return null;
  return mapDbToFlowScore(data);
}

/**
 * Simulate fixing a feature for a flow (creates new run with improvement)
 */
export async function fixFeature(flowId: string, featureKey: string): Promise<ImprovementResult | null> {
  const dbKey = FEATURE_MAP[featureKey as keyof typeof FEATURE_MAP] || featureKey;
  
  // Get current score
  const current = await getFlowScore(flowId);
  if (!current) return null;
  
  // Check if already fixed
  if (current.features[dbKey]) {
    return null; // Already has this feature
  }
  
  // Create new run with this feature enabled
  const newRunNumber = current.runNumber + 1;
  const newFeatures = { ...current.features, [dbKey]: true };
  
  const { data: newRow, error } = await supabase
    .from('flow_feature_scores')
    .insert({
      flow_id: flowId,
      run_number: newRunNumber,
      ...newFeatures,
      fixed_issues_count: current.fixedIssuesCount + 1,
    })
    .select()
    .single();
  
  if (error || !newRow) {
    console.error('Error creating improvement:', error);
    return null;
  }
  
  const newScore = mapDbToFlowScore(newRow);
  
  // Calculate changes
  const categoryChanges: Record<string, { before: number; after: number; delta: number }> = {};
  Object.keys(current.scores).forEach(cat => {
    const before = current.scores[cat as keyof typeof current.scores];
    const after = newScore.scores[cat as keyof typeof newScore.scores];
    categoryChanges[cat] = { before, after, delta: after - before };
  });
  
  const result: ImprovementResult = {
    flowId,
    previousScore: current.scores.overall,
    currentScore: newScore.scores.overall,
    scoreDelta: newScore.scores.overall - current.scores.overall,
    fixedFeatures: [FEATURE_LABELS[dbKey]?.label || dbKey],
    remainingIssues: getMissingFeatures(newScore),
    categoryChanges,
  };
  
  // Record improvement history
  await supabase.from('flow_improvement_history').insert({
    flow_id: flowId,
    run_number: newRunNumber,
    previous_score: result.previousScore,
    current_score: result.currentScore,
    score_delta: result.scoreDelta,
    fixed_issues: result.fixedFeatures,
    new_issues: [],
    category_changes: categoryChanges,
  });
  
  return result;
}

/**
 * Fix multiple random features for a flow (simulate AI optimization)
 */
export async function optimizeFlow(flowId: string, maxFixes: number = 3): Promise<ImprovementResult | null> {
  const current = await getFlowScore(flowId);
  if (!current) return null;
  
  // Find missing features (sorted by severity)
  const missingFeatures = Object.entries(current.features)
    .filter(([_, value]) => !value)
    .map(([key]) => key)
    .sort((a, b) => {
      const sevA = FEATURE_LABELS[a]?.severity || 'info';
      const sevB = FEATURE_LABELS[b]?.severity || 'info';
      const order = { critical: 0, warning: 1, info: 2 };
      return order[sevA] - order[sevB];
    });
  
  if (missingFeatures.length === 0) {
    return null; // Already fully optimized
  }
  
  // Pick features to fix (prioritize critical/warning)
  const toFix = missingFeatures.slice(0, Math.min(maxFixes, missingFeatures.length));
  
  // Create new run with fixed features
  const newRunNumber = current.runNumber + 1;
  const newFeatures = { ...current.features };
  toFix.forEach(key => {
    newFeatures[key] = true;
  });
  
  const { data: newRow, error } = await supabase
    .from('flow_feature_scores')
    .insert({
      flow_id: flowId,
      run_number: newRunNumber,
      ...newFeatures,
      fixed_issues_count: current.fixedIssuesCount + toFix.length,
    })
    .select()
    .single();
  
  if (error || !newRow) {
    console.error('Error creating optimization:', error);
    return null;
  }
  
  const newScore = mapDbToFlowScore(newRow);
  
  // Calculate changes
  const categoryChanges: Record<string, { before: number; after: number; delta: number }> = {};
  Object.keys(current.scores).forEach(cat => {
    const before = current.scores[cat as keyof typeof current.scores];
    const after = newScore.scores[cat as keyof typeof newScore.scores];
    categoryChanges[cat] = { before, after, delta: after - before };
  });
  
  const result: ImprovementResult = {
    flowId,
    previousScore: current.scores.overall,
    currentScore: newScore.scores.overall,
    scoreDelta: newScore.scores.overall - current.scores.overall,
    fixedFeatures: toFix.map(key => FEATURE_LABELS[key]?.label || key),
    remainingIssues: getMissingFeatures(newScore),
    categoryChanges,
  };
  
  // Record improvement history
  await supabase.from('flow_improvement_history').insert({
    flow_id: flowId,
    run_number: newRunNumber,
    previous_score: result.previousScore,
    current_score: result.currentScore,
    score_delta: result.scoreDelta,
    fixed_issues: result.fixedFeatures,
    new_issues: [],
    category_changes: categoryChanges,
  });
  
  return result;
}

/**
 * Get improvement history for a flow
 */
export async function getImprovementHistory(flowId?: string): Promise<any[]> {
  let query = supabase
    .from('flow_improvement_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (flowId) {
    query = query.eq('flow_id', flowId);
  }
  
  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

/**
 * Get global statistics
 */
export async function getGlobalStats(): Promise<{
  totalFlows: number;
  avgScore: number;
  maxScore: number;
  minScore: number;
  totalIssues: number;
  totalFixed: number;
  fullyOptimized: number;
}> {
  const scores = await getLatestFlowScores();
  
  if (scores.length === 0) {
    return { totalFlows: 0, avgScore: 0, maxScore: 0, minScore: 0, totalIssues: 0, totalFixed: 0, fullyOptimized: 0 };
  }
  
  const overallScores = scores.map(s => s.scores.overall);
  
  return {
    totalFlows: scores.length,
    avgScore: Math.round(overallScores.reduce((a, b) => a + b, 0) / scores.length),
    maxScore: Math.max(...overallScores),
    minScore: Math.min(...overallScores),
    totalIssues: scores.reduce((sum, s) => sum + s.issuesCount, 0),
    totalFixed: scores.reduce((sum, s) => sum + s.fixedIssuesCount, 0),
    fullyOptimized: scores.filter(s => s.issuesCount === 0).length,
  };
}

// Helper functions
function mapDbToFlowScore(row: any): FlowFeatureScore {
  const features: Record<string, boolean> = {};
  Object.values(FEATURE_MAP).forEach(dbKey => {
    features[dbKey] = row[dbKey] ?? false;
  });
  
  return {
    id: row.id,
    flowId: row.flow_id,
    runNumber: row.run_number,
    features,
    scores: {
      overall: row.overall_score,
      trust: row.trust_score,
      cta: row.cta_score,
      mobile: row.mobile_score,
      ux: row.ux_score,
      seo: row.seo_score,
      performance: row.performance_score,
      accessibility: row.accessibility_score,
      conversion: row.conversion_score,
    },
    issuesCount: row.issues_count,
    fixedIssuesCount: row.fixed_issues_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function getMissingFeatures(score: FlowFeatureScore): string[] {
  return Object.entries(score.features)
    .filter(([_, value]) => !value)
    .map(([key]) => FEATURE_LABELS[key]?.label || key);
}

export { FEATURE_LABELS };
