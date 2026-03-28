/**
 * Hook for persistent flow scores with real improvement tracking
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getLatestFlowScores, 
  initializeFlowScores, 
  optimizeFlow,
  getGlobalStats,
  getImprovementHistory,
  type FlowFeatureScore,
  type ImprovementResult
} from '@/lib/persistent-flow-scores';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';

export interface PersistentFlowScore {
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
  issuesCount: number;
  fixedCount: number;
  runNumber: number;
  isFullyOptimized: boolean;
  lastUpdated: Date;
}

export function usePersistentFlowScores() {
  const [scores, setScores] = useState<Record<string, PersistentFlowScore>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [improvementReports, setImprovementReports] = useState<ImprovementResult[]>([]);
  const [globalStats, setGlobalStats] = useState<{
    totalFlows: number;
    avgScore: number;
    maxScore: number;
    minScore: number;
    totalIssues: number;
    totalFixed: number;
    fullyOptimized: number;
  } | null>(null);

  const loadScores = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Initialize if needed
      await initializeFlowScores();
      
      // Load latest scores
      const dbScores = await getLatestFlowScores();
      const stats = await getGlobalStats();
      
      const mappedScores: Record<string, PersistentFlowScore> = {};
      
      dbScores.forEach(score => {
        const config = FLOW_CONFIGS[score.flowId] || 
          SUB_VARIANT_CONFIGS[score.flowId.replace('umzugsofferten-', '')];
        
        mappedScores[score.flowId] = {
          flowId: score.flowId,
          flowName: config?.label || score.flowId,
          path: config?.path || '/',
          overallScore: score.scores.overall,
          categoryScores: {
            trust: score.scores.trust,
            cta: score.scores.cta,
            mobile: score.scores.mobile,
            ux: score.scores.ux,
            conversion: score.scores.conversion,
            seo: score.scores.seo,
            performance: score.scores.performance,
            accessibility: score.scores.accessibility,
          },
          issuesCount: score.issuesCount,
          fixedCount: score.fixedIssuesCount,
          runNumber: score.runNumber,
          isFullyOptimized: score.issuesCount === 0,
          lastUpdated: score.updatedAt,
        };
      });
      
      setScores(mappedScores);
      setGlobalStats(stats);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading scores:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const optimizeAllFlows = useCallback(async (): Promise<ImprovementResult[]> => {
    setIsOptimizing(true);
    const reports: ImprovementResult[] = [];
    
    try {
      const flowIds = Object.keys(scores);
      
      for (const flowId of flowIds) {
        const score = scores[flowId];
        if (score.issuesCount > 0) {
          const result = await optimizeFlow(flowId, 2); // Fix 2 features per run
          if (result && result.scoreDelta > 0) {
            reports.push(result);
          }
        }
      }
      
      setImprovementReports(reports);
      
      // Reload scores after optimization
      await loadScores();
      
      return reports;
    } catch (error) {
      console.error('Error optimizing flows:', error);
      return [];
    } finally {
      setIsOptimizing(false);
    }
  }, [scores, loadScores]);

  const getWinner = useCallback(() => {
    const scoreList = Object.values(scores);
    if (scoreList.length === 0) return null;
    
    return scoreList.reduce((winner, current) => 
      current.overallScore > winner.overallScore ? current : winner
    );
  }, [scores]);

  const getRanking = useCallback(() => {
    return Object.values(scores)
      .sort((a, b) => b.overallScore - a.overallScore)
      .map((score, index) => ({
        ...score,
        rank: index + 1,
      }));
  }, [scores]);

  const getImprovementPotential = useCallback(() => {
    const totalPossible = Object.keys(scores).length * 100;
    const totalCurrent = Object.values(scores).reduce((sum, s) => sum + s.overallScore, 0);
    const potential = totalPossible - totalCurrent;
    const remainingRuns = Math.ceil(potential / 10); // Estimate ~10 points per run
    
    return {
      currentTotal: totalCurrent,
      maxTotal: totalPossible,
      potential,
      remainingRuns: Math.max(0, remainingRuns),
      percentComplete: Math.round((totalCurrent / totalPossible) * 100),
    };
  }, [scores]);

  // Load on mount
  useEffect(() => {
    loadScores();
  }, [loadScores]);

  return {
    scores,
    isLoading,
    isOptimizing,
    lastUpdate,
    globalStats,
    improvementReports,
    loadScores,
    optimizeAllFlows,
    getWinner,
    getRanking,
    getImprovementPotential,
  };
}
