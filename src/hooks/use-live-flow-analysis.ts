/**
 * Live Flow Analyzer Hook
 * 
 * Analyzes flows in real-time using the Feature Registry.
 * No DOM inspection needed - scores based on registered features.
 */

import { useState, useCallback, useEffect } from 'react';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { getFlowFeatures, calculateScoreFromFeatures, type FlowFeatures } from '@/data/flowFeatureRegistry';

export interface LiveFlowScore {
  flowId: string;
  flowName: string;
  path: string;
  overallScore: number;
  categoryScores: {
    trust: number;
    cta: number;
    mobile: number;
    ux: number;
    conversion: number;
  };
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    category: string;
    description: string;
    recommendation: string;
  }>;
  features: FlowFeatures;
  lastAnalyzed: Date;
  isLive: boolean;
}

// Feature to issue mapping
const FEATURE_ISSUES: Record<keyof FlowFeatures, { category: string; severity: 'critical' | 'warning' | 'info'; recommendation: string }> = {
  hasASTAG: { category: 'Trust', severity: 'critical', recommendation: 'Add ASTAG certification badge' },
  hasSwissQuality: { category: 'Trust', severity: 'critical', recommendation: 'Add Swiss Quality badge' },
  hasRatingBadge: { category: 'Trust', severity: 'warning', recommendation: 'Show customer rating badge' },
  hasFreeLabel: { category: 'Trust', severity: 'info', recommendation: 'Add "Kostenlos & unverbindlich" label' },
  hasTrustPills: { category: 'Trust', severity: 'warning', recommendation: 'Add trust pills below header' },
  hasStickyCTA: { category: 'CTA', severity: 'critical', recommendation: 'Implement sticky CTA on mobile' },
  hasClearCTALabel: { category: 'CTA', severity: 'warning', recommendation: 'Use clear CTA text like "Offerten erhalten"' },
  hasProgressIndicator: { category: 'CTA', severity: 'warning', recommendation: 'Show step progress indicator' },
  hasMicroFeedback: { category: 'CTA', severity: 'info', recommendation: 'Add micro-feedback on interactions' },
  hasSafeArea: { category: 'Mobile', severity: 'warning', recommendation: 'Add safe area padding for notch devices' },
  hasTouchTargets: { category: 'Mobile', severity: 'warning', recommendation: 'Ensure 44px minimum touch targets' },
  hasResponsiveLayout: { category: 'Mobile', severity: 'critical', recommendation: 'Make layout fully responsive' },
  hasBottomSheet: { category: 'Mobile', severity: 'info', recommendation: 'Use bottom sheet for modals on mobile' },
  hasProgressBar: { category: 'UX', severity: 'warning', recommendation: 'Add visual progress bar' },
  hasValidation: { category: 'UX', severity: 'warning', recommendation: 'Add inline form validation' },
  hasAnimations: { category: 'UX', severity: 'info', recommendation: 'Add subtle animations for feedback' },
  hasAutoAdvance: { category: 'UX', severity: 'info', recommendation: 'Auto-advance after selection' },
  hasPricePreview: { category: 'UX', severity: 'warning', recommendation: 'Show live price preview' },
};

function calculateFlowScore(flowId: string, path: string): LiveFlowScore {
  const features = getFlowFeatures(flowId);
  const scores = calculateScoreFromFeatures(features);
  
  // Generate issues from missing features
  const issues: LiveFlowScore['issues'] = [];
  
  (Object.entries(features) as [keyof FlowFeatures, boolean][]).forEach(([key, hasFeature]) => {
    if (!hasFeature && FEATURE_ISSUES[key]) {
      const issue = FEATURE_ISSUES[key];
      issues.push({
        severity: issue.severity,
        category: issue.category,
        description: `Missing: ${key.replace(/^has/, '').replace(/([A-Z])/g, ' $1').trim()}`,
        recommendation: issue.recommendation,
      });
    }
  });

  // Sort by severity and take top 5
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  const sortedIssues = issues
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .slice(0, 5);

  const config = FLOW_CONFIGS[flowId] || SUB_VARIANT_CONFIGS[flowId.replace('umzugsofferten-', '')];
  
  return {
    flowId,
    flowName: config?.label || flowId,
    path,
    overallScore: scores.overall,
    categoryScores: {
      trust: scores.trust,
      cta: scores.cta,
      mobile: scores.mobile,
      ux: scores.ux,
      conversion: scores.conversion,
    },
    issues: sortedIssues,
    features,
    lastAnalyzed: new Date(),
    isLive: true,
  };
}

export function useLiveFlowAnalysis() {
  const [scores, setScores] = useState<Record<string, LiveFlowScore>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const analyzeAllFlows = useCallback(() => {
    setIsAnalyzing(true);
    
    const newScores: Record<string, LiveFlowScore> = {};
    
    // Analyze main flows
    Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
      newScores[id] = calculateFlowScore(id, config.path);
    });
    
    // Analyze sub-variants
    Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
      const fullId = `umzugsofferten-${id}`;
      newScores[fullId] = calculateFlowScore(fullId, config.path);
    });
    
    setScores(newScores);
    setLastUpdate(new Date());
    setIsAnalyzing(false);
  }, []);

  const analyzeFlow = useCallback((flowId: string, path: string) => {
    const score = calculateFlowScore(flowId, path);
    setScores(prev => ({ ...prev, [flowId]: score }));
    return score;
  }, []);

  // Auto-analyze on mount
  useEffect(() => {
    analyzeAllFlows();
  }, [analyzeAllFlows]);

  return {
    scores,
    isAnalyzing,
    lastUpdate,
    analyzeAllFlows,
    analyzeFlow,
  };
}
