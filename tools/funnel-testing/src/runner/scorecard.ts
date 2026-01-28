import { RunConfig, RunResult, CTA, Step } from '../shared/schemas';
import { AIScoreResult } from './aiScorer';

export function createScorecard(
  config: RunConfig,
  steps: Step[],
  ctAs: CTA[],
  trustSignals: string[],
  verdict: 'success' | 'dropout' | 'blocker' | 'unknown',
  dropoffReason?: string,
  aiScore?: AIScoreResult
): RunResult {
  const stepsCompleted = steps.length;
  const totalTimeMs = steps.reduce((sum, s) => sum + s.timestamp, 0);

  // Use AI score if available, otherwise fallback to heuristics
  let confidence = 50; // baseline
  
  if (aiScore) {
    confidence = aiScore.conversion_confidence;
  } else {
    // Heuristic confidence
    confidence += trustSignals.length * 5;
    confidence += ctAs.filter((c) => c.type === 'main').length * 10;
    confidence -= steps.filter((s) => !s.success).length * 15;
  }

  if (verdict === 'success') confidence = Math.max(85, confidence);
  if (verdict === 'blocker') confidence = Math.max(0, confidence - 40);
  if (verdict === 'dropout') confidence = Math.min(30, confidence);

  confidence = Math.max(0, Math.min(100, confidence));

  const result: RunResult = {
    run_id: config.run_id,
    config,
    steps,
    detectedCtAs: ctAs,
    trustSignals,
    conversionConfidence: Math.round(confidence),
    verdict,
    dropoffReason,
    totalTimeMs,
    stepsCompleted,
  };

  // Add AI insights if available
  if (aiScore) {
    (result as any).aiScores = {
      intent_match: aiScore.intent_match,
      trust: aiScore.trust,
      friction: aiScore.friction,
      clarity: aiScore.clarity,
      mobile_usability: aiScore.mobile_usability,
    };
    (result as any).aiReasoning = aiScore.reasoning;
    (result as any).aiRecommendations = aiScore.recommendations;
  }

  return result;
}
