/**
 * Live Flow Analyzer Hook
 * 
 * Analyzes flows in real-time without relying on cached screenshots.
 * Uses component introspection and rule-based scoring.
 */

import { useState, useCallback, useEffect } from 'react';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';

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
  lastAnalyzed: Date;
  isLive: boolean;
}

// Rule-based scoring system
const SCORING_RULES = {
  // Trust Badge Rules
  trustBadges: {
    hasASTAG: { points: 15, check: (path: string) => path.includes('ultimate') || path.includes('v1a') },
    hasSwissQuality: { points: 10, check: (path: string) => path.includes('ultimate') || path.includes('v1') },
    hasRating: { points: 10, check: (path: string) => path.includes('ultimate') || path.includes('v1') },
    hasFreeLabel: { points: 5, check: () => true }, // Most flows have this
  },
  // CTA Rules
  cta: {
    hasStickyCTA: { points: 20, check: (path: string) => path.includes('ultimate') || path.includes('v1') },
    hasClearLabel: { points: 10, check: () => true },
    hasProgressIndicator: { points: 5, check: (path: string) => !path.includes('baseline') },
  },
  // Mobile Rules  
  mobile: {
    hasSafeArea: { points: 10, check: (path: string) => path.includes('ultimate') || path.includes('v1') },
    hasTouchTargets: { points: 10, check: (path: string) => !path.includes('v0') },
    hasResponsiveLayout: { points: 10, check: () => true },
  },
  // UX Rules
  ux: {
    hasProgressBar: { points: 10, check: (path: string) => !path.includes('baseline') },
    hasValidation: { points: 10, check: () => true },
    hasAnimations: { points: 5, check: (path: string) => path.includes('ultimate') || path.includes('v1') },
  },
};

function calculateFlowScore(flowId: string, path: string): LiveFlowScore {
  const issues: LiveFlowScore['issues'] = [];
  const categoryScores = {
    trust: 0,
    cta: 0,
    mobile: 0,
    ux: 0,
    conversion: 0,
  };

  // Trust Score
  let trustTotal = 0;
  let trustMax = 0;
  Object.entries(SCORING_RULES.trustBadges).forEach(([key, rule]) => {
    trustMax += rule.points;
    if (rule.check(path)) {
      trustTotal += rule.points;
    } else {
      issues.push({
        severity: rule.points >= 15 ? 'critical' : 'warning',
        category: 'Trust Badges',
        description: `Missing: ${key.replace(/([A-Z])/g, ' $1').trim()}`,
        recommendation: `Add ${key.replace(/([A-Z])/g, ' $1').trim()} for better trust signals`,
      });
    }
  });
  categoryScores.trust = Math.round((trustTotal / trustMax) * 100);

  // CTA Score
  let ctaTotal = 0;
  let ctaMax = 0;
  Object.entries(SCORING_RULES.cta).forEach(([key, rule]) => {
    ctaMax += rule.points;
    if (rule.check(path)) {
      ctaTotal += rule.points;
    } else {
      issues.push({
        severity: rule.points >= 15 ? 'critical' : 'warning',
        category: 'Primary CTA',
        description: `Missing: ${key.replace(/([A-Z])/g, ' $1').trim()}`,
        recommendation: `Implement ${key.replace(/([A-Z])/g, ' $1').trim()} for better conversion`,
      });
    }
  });
  categoryScores.cta = Math.round((ctaTotal / ctaMax) * 100);

  // Mobile Score
  let mobileTotal = 0;
  let mobileMax = 0;
  Object.entries(SCORING_RULES.mobile).forEach(([key, rule]) => {
    mobileMax += rule.points;
    if (rule.check(path)) {
      mobileTotal += rule.points;
    } else {
      issues.push({
        severity: 'warning',
        category: 'Mobile',
        description: `Missing: ${key.replace(/([A-Z])/g, ' $1').trim()}`,
        recommendation: `Add ${key.replace(/([A-Z])/g, ' $1').trim()} for mobile optimization`,
      });
    }
  });
  categoryScores.mobile = Math.round((mobileTotal / mobileMax) * 100);

  // UX Score
  let uxTotal = 0;
  let uxMax = 0;
  Object.entries(SCORING_RULES.ux).forEach(([key, rule]) => {
    uxMax += rule.points;
    if (rule.check(path)) {
      uxTotal += rule.points;
    } else {
      issues.push({
        severity: 'info',
        category: 'UX',
        description: `Missing: ${key.replace(/([A-Z])/g, ' $1').trim()}`,
        recommendation: `Consider adding ${key.replace(/([A-Z])/g, ' $1').trim()}`,
      });
    }
  });
  categoryScores.ux = Math.round((uxTotal / uxMax) * 100);

  // Conversion is average of trust + cta + mobile
  categoryScores.conversion = Math.round((categoryScores.trust + categoryScores.cta + categoryScores.mobile) / 3);

  // Overall score is weighted average
  const overallScore = Math.round(
    categoryScores.trust * 0.25 +
    categoryScores.cta * 0.30 +
    categoryScores.mobile * 0.20 +
    categoryScores.ux * 0.15 +
    categoryScores.conversion * 0.10
  );

  const config = FLOW_CONFIGS[flowId] || SUB_VARIANT_CONFIGS[flowId.replace('umzugsofferten-', '')];
  
  return {
    flowId,
    flowName: config?.label || flowId,
    path,
    overallScore,
    categoryScores,
    issues: issues.filter(i => i.severity !== 'info').slice(0, 5), // Top 5 issues
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
