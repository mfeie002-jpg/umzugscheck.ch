/**
 * Flow Command Center - Shared Types
 * Unified type definitions for the consolidated analysis system
 */

// ─────────────────────────────────────────────────────────────
// Core Flow Types
// ─────────────────────────────────────────────────────────────

export interface FlowVariant {
  id: string;
  label: string;
  description: string;
  color: string;
  path: string;
  stepCount: number;
  isMain: boolean;
  flowNumber: number;
}

export interface FlowScore {
  flowId: string;
  overallScore: number | null;
  conversionScore: number | null;
  uxScore: number | null;
  mobileScore: number | null;
  trustScore: number | null;
  accessibilityScore: number | null;
  performanceScore: number | null;
  lastAnalyzed: string | null;
  // Delta tracking (vs previous analysis)
  previousOverallScore?: number | null;
  delta?: number | null;
  deltaConversion?: number | null;
  deltaUx?: number | null;
  deltaMobile?: number | null;
}

// ─────────────────────────────────────────────────────────────
// Analysis Types
// ─────────────────────────────────────────────────────────────

export interface ElementAnalysis {
  elementType: string;
  elementName: string;
  scores: {
    visibility: number;
    usability: number;
    conversion: number;
    mobile: number;
    accessibility: number;
  };
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    description: string;
    recommendation: string;
    effort: 'low' | 'medium' | 'high';
  }>;
  bestPractices: string[];
  improvements: string[];
}

export interface CategoryScores {
  ux: number;
  conversion: number;
  mobile: number;
  accessibility: number;
  performance: number;
  trust: number;
  clarity: number;
}

export interface FlowAnalysis {
  flowId: string;
  flowName: string;
  overallScore: number;
  categoryScores: CategoryScores;
  elements: ElementAnalysis[];
  strengths: string[];
  weaknesses: string[];
  keyInsights: string[];
  conversionKillers: string[];
  quickWins: string[];
  stepByStepAnalysis: Array<{
    step: number;
    name: string;
    score: number;
    dropOffRisk: string;
    friction: string[];
    positives: string[];
  }>;
}

// ─────────────────────────────────────────────────────────────
// Synthesis Types (Winner Determination)
// ─────────────────────────────────────────────────────────────

export interface Winner {
  flowId: string;
  flowName: string;
  totalScore: number;
  reasoning: string;
}

export interface RankingEntry {
  position: number;
  flowId: string;
  score: number;
  keyStrength: string;
  keyWeakness: string;
}

export interface BestElement {
  element: string;
  sourceFlow: string;
  reason: string;
  implementation: string;
}

export interface UltimateFlowStep {
  number: number;
  name: string;
  sourceFlow: string;
  elements: string[];
  improvements: string[];
}

export interface ImplementationPriority {
  priority: number;
  change: string;
  effort: string;
  impact: string;
  sourceFlow: string;
}

export interface CodeChange {
  file: string;
  component: string;
  currentState: string;
  proposedChange: string;
  implementation: string;
}

export interface Synthesis {
  winner: Winner;
  ranking: RankingEntry[];
  bestElements: BestElement[];
  ultimateFlow: {
    name: string;
    description: string;
    steps: UltimateFlowStep[];
    expectedConversionLift: string;
    implementationPriority: ImplementationPriority[];
  };
  codeChanges: CodeChange[];
}

// ─────────────────────────────────────────────────────────────
// UX Issues Types
// ─────────────────────────────────────────────────────────────

export interface UxIssue {
  id: string;
  flowId: string;
  stepNumber: number | null;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description: string | null;
  recommendation: string | null;
  isResolved: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// Analysis Run Types
// ─────────────────────────────────────────────────────────────

export interface AnalysisRun {
  id: string;
  flowId: string;
  flowName: string;
  runType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  overallScore: number | null;
  conversionScore: number | null;
  performanceScore: number | null;
  uxScore: number | null;
  mobileScore: number | null;
  trustScore: number | null;
  accessibilityScore: number | null;
  aiSummary: string | null;
  aiRecommendations: string[];
  quickWins: string[];
  strengths: string[];
  createdAt: string;
  completedAt: string | null;
  stepsCaptured: number;
  totalSteps: number;
}

// ─────────────────────────────────────────────────────────────
// Alert Types
// ─────────────────────────────────────────────────────────────

export interface FlowAlert {
  id: string;
  flowId: string | null;
  alertType: string;
  title: string;
  message: string | null;
  severity: 'info' | 'warning' | 'critical';
  isAcknowledged: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// Command Center View Modes
// ─────────────────────────────────────────────────────────────

export type ViewMode = 'dashboard' | 'ranking' | 'analysis' | 'comparison' | 'history' | 'settings' | 'landing-pages' | 'tester-results' | 'flows' | 'studio';

export type InterfaceMode = 'tabs' | 'modular' | 'ai-first';

export interface CommandCenterState {
  activeView: ViewMode;
  interfaceMode: InterfaceMode;
  selectedFlowId: string | null;
  isAnalyzing: boolean;
  showIssuesPanel: boolean;
}

// ─────────────────────────────────────────────────────────────
// Default Values
// ─────────────────────────────────────────────────────────────

export const DEFAULT_ELEMENT_SCORES: ElementAnalysis['scores'] = {
  visibility: 0,
  usability: 0,
  conversion: 0,
  mobile: 0,
  accessibility: 0,
};

export const DEFAULT_CATEGORY_SCORES: CategoryScores = {
  ux: 0,
  conversion: 0,
  mobile: 0,
  accessibility: 0,
  performance: 0,
  trust: 0,
  clarity: 0,
};
