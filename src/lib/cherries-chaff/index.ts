/**
 * Cherries & Chaff Engine
 * Lead Routing & Unit Economics for Swiss Moving Market
 */

// Types
export * from './types';

// Calculations
export {
  SWISS_CONSTANTS,
  calculateCOGSForecast,
  calculateTotalCAC,
  calculateCM2,
  calculateMaxAllowableCPL,
  analyzeFeierabendJob,
  calculateRPL,
  calculateMarginPerLead,
  calculateBreakEvenResaleRate,
  analyzeMarketplaceLead,
  calculateBlendedCPL,
  calculateROAS,
  estimateJobValue,
} from './calculations';

// Scenarios
export {
  SCENARIOS,
  getScenarioForMonth,
  getCurrentScenario,
  projectScenario,
  runSensitivityAnalysis,
} from './scenarios';
export type { ScenarioProjection, SensitivityResult } from './scenarios';

// Guardrails
export {
  ALERT_CONFIGS,
  evaluateAlerts,
  evaluateKillSwitches,
  formatAlertForSlack,
  formatAlertForEmail,
} from './guardrails';
export type { AlertEvaluation, DailyMetrics, KillSwitchStatus, KillSwitchMetrics } from './guardrails';

// Routing Brain
export {
  SCORING_WEIGHTS,
  calculateLeadScore,
  routeLead,
  routeLeadBatch,
} from './routing-brain';
export type { LeadInput, ScoringResult, RoutingDecision, FeierabendCapacity, BatchRoutingResult } from './routing-brain';
