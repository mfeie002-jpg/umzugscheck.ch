/**
 * Live Flow Analyzer Hook - Extended Edition
 * 
 * Analyzes flows in real-time using the Feature Registry.
 * Now with 28 features across 7 categories.
 * Includes improvement tracking between runs.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { 
  getFlowFeatures, 
  calculateScoreFromFeatures, 
  getMissingFeatures,
  type FlowFeatures 
} from '@/data/flowFeatureRegistry';

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
    seo: number;
    performance: number;
    accessibility: number;
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
  runNumber: number;
}

export interface ImprovementReport {
  flowId: string;
  previousScore: number;
  currentScore: number;
  scoreDelta: number;
  fixedIssues: string[];
  newIssues: string[];
  categoryChanges: Record<string, { before: number; after: number; delta: number }>;
  timestamp: Date;
}

// Feature to issue mapping - Complete with all 28 features
const FEATURE_ISSUES: Record<keyof FlowFeatures, { 
  category: string; 
  severity: 'critical' | 'warning' | 'info'; 
  recommendation: string 
}> = {
  // Trust Features
  hasASTAG: { category: 'Trust', severity: 'critical', recommendation: 'Add ASTAG certification badge' },
  hasSwissQuality: { category: 'Trust', severity: 'critical', recommendation: 'Add Swiss Quality badge' },
  hasRatingBadge: { category: 'Trust', severity: 'warning', recommendation: 'Show customer rating badge' },
  hasFreeLabel: { category: 'Trust', severity: 'info', recommendation: 'Add "Kostenlos & unverbindlich" label' },
  hasTrustPills: { category: 'Trust', severity: 'warning', recommendation: 'Add trust pills below header' },
  // CTA Features
  hasStickyCTA: { category: 'CTA', severity: 'critical', recommendation: 'Implement sticky CTA on mobile' },
  hasClearCTALabel: { category: 'CTA', severity: 'warning', recommendation: 'Use clear CTA text like "Offerten erhalten"' },
  hasProgressIndicator: { category: 'CTA', severity: 'warning', recommendation: 'Show step progress indicator' },
  hasMicroFeedback: { category: 'CTA', severity: 'info', recommendation: 'Add micro-feedback on interactions' },
  // Mobile Features
  hasSafeArea: { category: 'Mobile', severity: 'warning', recommendation: 'Add safe area padding for notch devices' },
  hasTouchTargets: { category: 'Mobile', severity: 'warning', recommendation: 'Ensure 44px minimum touch targets' },
  hasResponsiveLayout: { category: 'Mobile', severity: 'critical', recommendation: 'Make layout fully responsive' },
  hasBottomSheet: { category: 'Mobile', severity: 'info', recommendation: 'Use bottom sheet for modals on mobile' },
  // UX Features
  hasProgressBar: { category: 'UX', severity: 'warning', recommendation: 'Add visual progress bar' },
  hasValidation: { category: 'UX', severity: 'warning', recommendation: 'Add inline form validation' },
  hasAnimations: { category: 'UX', severity: 'info', recommendation: 'Add subtle animations for feedback' },
  hasAutoAdvance: { category: 'UX', severity: 'info', recommendation: 'Auto-advance after selection' },
  hasPricePreview: { category: 'UX', severity: 'warning', recommendation: 'Show live price preview' },
  // SEO Features - NEW
  hasMetaTags: { category: 'SEO', severity: 'info', recommendation: 'Optimize meta title and description' },
  hasStructuredData: { category: 'SEO', severity: 'warning', recommendation: 'Add JSON-LD structured data' },
  hasCanonicalUrl: { category: 'SEO', severity: 'info', recommendation: 'Set canonical URL for page' },
  hasSemanticHTML: { category: 'SEO', severity: 'info', recommendation: 'Use semantic HTML5 elements' },
  // Performance Features - NEW
  hasLazyLoading: { category: 'Performance', severity: 'info', recommendation: 'Implement lazy loading for images' },
  hasImageOptimization: { category: 'Performance', severity: 'warning', recommendation: 'Optimize images (WebP, compression)' },
  hasCodeSplitting: { category: 'Performance', severity: 'info', recommendation: 'Enable route-based code splitting' },
  // Accessibility Features - NEW
  hasAriaLabels: { category: 'Accessibility', severity: 'warning', recommendation: 'Add ARIA labels for screen readers' },
  hasKeyboardNavigation: { category: 'Accessibility', severity: 'info', recommendation: 'Enable full keyboard navigation' },
  hasContrastCompliance: { category: 'Accessibility', severity: 'info', recommendation: 'Ensure WCAG contrast compliance' },
};

function calculateFlowScore(flowId: string, path: string, runNumber: number): LiveFlowScore {
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

  // Sort by severity and take top 8 (increased from 5)
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  const sortedIssues = issues
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .slice(0, 8);

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
      seo: scores.seo,
      performance: scores.performance,
      accessibility: scores.accessibility,
    },
    issues: sortedIssues,
    features,
    lastAnalyzed: new Date(),
    isLive: true,
    runNumber,
  };
}

export function useLiveFlowAnalysis() {
  const [scores, setScores] = useState<Record<string, LiveFlowScore>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [runNumber, setRunNumber] = useState(1);
  const [improvementHistory, setImprovementHistory] = useState<ImprovementReport[]>([]);
  const previousScoresRef = useRef<Record<string, LiveFlowScore>>({});

  const generateImprovementReport = useCallback((
    flowId: string, 
    prevScore: LiveFlowScore | undefined, 
    newScore: LiveFlowScore
  ): ImprovementReport | null => {
    if (!prevScore) return null;
    
    const prevIssueSet = new Set(prevScore.issues.map(i => i.description));
    const newIssueSet = new Set(newScore.issues.map(i => i.description));
    
    const fixedIssues = [...prevIssueSet].filter(i => !newIssueSet.has(i));
    const newIssues = [...newIssueSet].filter(i => !prevIssueSet.has(i));
    
    const categoryChanges: Record<string, { before: number; after: number; delta: number }> = {};
    (Object.keys(newScore.categoryScores) as Array<keyof typeof newScore.categoryScores>).forEach(cat => {
      const before = prevScore.categoryScores[cat];
      const after = newScore.categoryScores[cat];
      categoryChanges[cat] = { before, after, delta: after - before };
    });
    
    return {
      flowId,
      previousScore: prevScore.overallScore,
      currentScore: newScore.overallScore,
      scoreDelta: newScore.overallScore - prevScore.overallScore,
      fixedIssues,
      newIssues,
      categoryChanges,
      timestamp: new Date(),
    };
  }, []);

  const analyzeAllFlows = useCallback(() => {
    setIsAnalyzing(true);
    
    const newScores: Record<string, LiveFlowScore> = {};
    const newReports: ImprovementReport[] = [];
    const newRunNumber = runNumber + 1;
    
    // Analyze main flows
    Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
      const newScore = calculateFlowScore(id, config.path, newRunNumber);
      newScores[id] = newScore;
      
      const report = generateImprovementReport(id, previousScoresRef.current[id], newScore);
      if (report && (report.scoreDelta !== 0 || report.fixedIssues.length > 0)) {
        newReports.push(report);
      }
    });
    
    // Analyze sub-variants
    Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
      const fullId = `umzugsofferten-${id}`;
      const newScore = calculateFlowScore(fullId, config.path, newRunNumber);
      newScores[fullId] = newScore;
      
      const report = generateImprovementReport(fullId, previousScoresRef.current[fullId], newScore);
      if (report && (report.scoreDelta !== 0 || report.fixedIssues.length > 0)) {
        newReports.push(report);
      }
    });
    
    // Store previous scores for next comparison
    previousScoresRef.current = { ...scores };
    
    setScores(newScores);
    setRunNumber(newRunNumber);
    setLastUpdate(new Date());
    setImprovementHistory(prev => [...prev, ...newReports].slice(-50)); // Keep last 50 reports
    setIsAnalyzing(false);
    
    return newReports;
  }, [runNumber, scores, generateImprovementReport]);

  const analyzeFlow = useCallback((flowId: string, path: string) => {
    const score = calculateFlowScore(flowId, path, runNumber);
    const report = generateImprovementReport(flowId, scores[flowId], score);
    
    setScores(prev => ({ ...prev, [flowId]: score }));
    
    if (report && (report.scoreDelta !== 0 || report.fixedIssues.length > 0)) {
      setImprovementHistory(prev => [...prev, report].slice(-50));
    }
    
    return { score, report };
  }, [runNumber, scores, generateImprovementReport]);

  // Get summary statistics
  const getAnalysisSummary = useCallback(() => {
    const flowScores = Object.values(scores);
    if (flowScores.length === 0) return null;
    
    const avgScore = Math.round(flowScores.reduce((sum, s) => sum + s.overallScore, 0) / flowScores.length);
    const maxScore = Math.max(...flowScores.map(s => s.overallScore));
    const minScore = Math.min(...flowScores.map(s => s.overallScore));
    const totalIssues = flowScores.reduce((sum, s) => sum + s.issues.length, 0);
    const criticalIssues = flowScores.reduce((sum, s) => 
      sum + s.issues.filter(i => i.severity === 'critical').length, 0
    );
    
    return {
      totalFlows: flowScores.length,
      avgScore,
      maxScore,
      minScore,
      totalIssues,
      criticalIssues,
      runNumber,
      lastUpdate,
    };
  }, [scores, runNumber, lastUpdate]);

  // Auto-analyze on mount
  useEffect(() => {
    analyzeAllFlows();
  }, []);

  return {
    scores,
    isAnalyzing,
    lastUpdate,
    runNumber,
    improvementHistory,
    analyzeAllFlows,
    analyzeFlow,
    getAnalysisSummary,
  };
}
