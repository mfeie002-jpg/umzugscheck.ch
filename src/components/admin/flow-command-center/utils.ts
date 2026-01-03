/**
 * Flow Command Center - Utility Functions
 * Shared helpers for flow analysis
 */

import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import type { 
  FlowVariant, 
  FlowAnalysis, 
  ElementAnalysis, 
  Synthesis,
  CategoryScores,
  DEFAULT_ELEMENT_SCORES,
  DEFAULT_CATEGORY_SCORES 
} from './types';

// ─────────────────────────────────────────────────────────────
// Flow Configuration Helpers
// ─────────────────────────────────────────────────────────────

export const ALL_FLOW_OPTIONS = [
  { id: 'all', label: 'Alle', flowId: 'all' },
  { id: 'v1', label: 'V1', flowId: 'umzugsofferten-v1' },
  { id: 'v2', label: 'V2', flowId: 'umzugsofferten-v2' },
  { id: 'v3', label: 'V3', flowId: 'umzugsofferten-v3' },
  { id: 'v4', label: 'V4', flowId: 'umzugsofferten-v4' },
  { id: 'v5', label: 'V5', flowId: 'umzugsofferten-v5' },
  { id: 'v6', label: 'V6', flowId: 'umzugsofferten-v6' },
  { id: 'v7', label: 'V7', flowId: 'umzugsofferten-v7' },
  { id: 'v8', label: 'V8', flowId: 'umzugsofferten-v8' },
  { id: 'v9', label: 'V9', flowId: 'umzugsofferten-v9' },
  { id: 'ultimate-best36', label: 'Ultimate ⭐', flowId: 'umzugsofferten-ultimate-best36' },
];

export function getMainFlowKey(flowNumber: number): string {
  return `umzugsofferten-v${flowNumber}`;
}

export function getAllFlowNumbers(): number[] {
  const numbers = new Set<number>();
  
  // Extract from main flows
  Object.keys(FLOW_CONFIGS).forEach(key => {
    const match = key.match(/umzugsofferten-v(\d+)/i);
    if (match) numbers.add(parseInt(match[1], 10));
  });
  
  // Extract from sub-variants (v1a, v2b, etc.)
  Object.keys(SUB_VARIANT_CONFIGS).forEach(key => {
    const match = key.match(/^v(\d+)/i);
    if (match) numbers.add(parseInt(match[1], 10));
    // Also handle multi-* as V9
    if (key.startsWith('multi')) numbers.add(9);
  });
  
  return Array.from(numbers).sort((a, b) => a - b);
}

// Get total count of all configured flows
export function getTotalFlowCount(): number {
  return Object.keys(FLOW_CONFIGS).length + Object.keys(SUB_VARIANT_CONFIGS).length;
}

export function getVariantsForFlow(flowNumber: number | 'all'): FlowVariant[] {
  const variants: FlowVariant[] = [];
  
  // Helper to extract flow number from various ID formats
  const extractFlowNumber = (id: string): number | null => {
    // Match patterns: umzugsofferten-v1, v1, v1a, v1b, V1.a, etc.
    const patterns = [
      /umzugsofferten-v(\d+)/i,
      /^v(\d+)/i,
      /^multi/i, // multi-a is based on v9
    ];
    for (const pattern of patterns) {
      const match = id.match(pattern);
      if (match) {
        if (pattern.source === '^multi') return 9; // multi-* are V9 variants
        return parseInt(match[1], 10);
      }
    }
    return null;
  };

  // Get all main flows from FLOW_CONFIGS
  Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
    const flowNum = extractFlowNumber(id);
    if (flowNumber === 'all' || flowNum === flowNumber) {
      variants.push({
        id,
        label: config.label,
        description: config.description,
        color: config.color,
        path: config.path,
        stepCount: config.steps.length,
        isMain: !config.parentFlow, // Main if no parent
        flowNumber: flowNum || 0,
      });
    }
  });
  
  // Get all sub-variants from SUB_VARIANT_CONFIGS
  Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
    const flowNum = extractFlowNumber(id);
    if (flowNumber === 'all' || flowNum === flowNumber) {
      variants.push({
        id,
        label: config.label,
        description: config.description,
        color: config.color,
        path: config.path,
        stepCount: config.steps.length,
        isMain: false,
        flowNumber: flowNum || 0,
      });
    }
  });
  
  // Sort by flowNumber then by label
  return variants.sort((a, b) => {
    if (a.flowNumber !== b.flowNumber) return a.flowNumber - b.flowNumber;
    // Main flows first within same number
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return a.label.localeCompare(b.label);
  });
}

export function getTotalConfiguredFlows(): number {
  const mainFlows = Object.keys(FLOW_CONFIGS).filter(k => k.match(/umzugsofferten-v\d+/)).length;
  const subVariants = Object.keys(SUB_VARIANT_CONFIGS).length;
  return mainFlows + subVariants;
}

// ─────────────────────────────────────────────────────────────
// Score Helpers
// ─────────────────────────────────────────────────────────────

export function getScoreColor(score: number | null): string {
  if (score === null || score === undefined) return 'text-muted-foreground';
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function getScoreBgColor(score: number | null): string {
  if (score === null || score === undefined) return 'bg-muted';
  if (score >= 80) return 'bg-green-100 dark:bg-green-950';
  if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-950';
  return 'bg-red-100 dark:bg-red-950';
}

export function getScoreBadgeVariant(score: number | null): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (score === null || score === undefined) return 'outline';
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  return 'destructive';
}

export function getScoreLabel(score: number | null): string {
  if (score === null || score === undefined) return 'Nicht analysiert';
  if (score >= 90) return 'Exzellent';
  if (score >= 80) return 'Sehr gut';
  if (score >= 70) return 'Gut';
  if (score >= 60) return 'Befriedigend';
  if (score >= 50) return 'Ausreichend';
  return 'Kritisch';
}

// ─────────────────────────────────────────────────────────────
// Data Normalization
// ─────────────────────────────────────────────────────────────

const defaultElementScores = {
  visibility: 0,
  usability: 0,
  conversion: 0,
  mobile: 0,
  accessibility: 0,
};

const defaultCategoryScores: CategoryScores = {
  ux: 0,
  conversion: 0,
  mobile: 0,
  accessibility: 0,
  performance: 0,
  trust: 0,
  clarity: 0,
};

export function normalizeElementAnalysis(e: any): ElementAnalysis {
  return {
    elementType: String(e?.elementType ?? ''),
    elementName: String(e?.elementName ?? ''),
    scores: e?.scores && typeof e.scores === 'object' 
      ? { ...defaultElementScores, ...e.scores } 
      : defaultElementScores,
    issues: Array.isArray(e?.issues) ? e.issues : [],
    bestPractices: Array.isArray(e?.bestPractices) ? e.bestPractices : [],
    improvements: Array.isArray(e?.improvements) ? e.improvements : [],
  };
}

export function normalizeFlowAnalysis(a: any): FlowAnalysis {
  return {
    flowId: String(a?.flowId ?? ''),
    flowName: String(a?.flowName ?? ''),
    overallScore: Number(a?.overallScore ?? 0),
    categoryScores: a?.categoryScores && typeof a.categoryScores === 'object' 
      ? { ...defaultCategoryScores, ...a.categoryScores } 
      : defaultCategoryScores,
    elements: Array.isArray(a?.elements) ? a.elements.map(normalizeElementAnalysis) : [],
    strengths: Array.isArray(a?.strengths) ? a.strengths : [],
    weaknesses: Array.isArray(a?.weaknesses) ? a.weaknesses : [],
    keyInsights: Array.isArray(a?.keyInsights) ? a.keyInsights : [],
    conversionKillers: Array.isArray(a?.conversionKillers) ? a.conversionKillers : [],
    quickWins: Array.isArray(a?.quickWins) ? a.quickWins : [],
    stepByStepAnalysis: Array.isArray(a?.stepByStepAnalysis) ? a.stepByStepAnalysis : [],
  };
}

export function normalizeSynthesis(s: any): Synthesis | null {
  const winner = s?.winner;
  const hasWinner = typeof winner?.flowId === 'string' && winner.flowId.trim().length > 0;
  if (!hasWinner) return null;
  
  return {
    winner: {
      flowId: String(winner.flowId ?? ''),
      flowName: String(winner.flowName ?? ''),
      totalScore: Number(winner.totalScore ?? 0),
      reasoning: String(winner.reasoning ?? ''),
    },
    ranking: Array.isArray(s?.ranking)
      ? s.ranking.map((r: any) => ({
          position: Number(r?.position ?? 0),
          flowId: String(r?.flowId ?? ''),
          score: Number(r?.score ?? 0),
          keyStrength: String(r?.keyStrength ?? ''),
          keyWeakness: String(r?.keyWeakness ?? ''),
        }))
      : [],
    bestElements: Array.isArray(s?.bestElements)
      ? s.bestElements.map((b: any) => ({
          element: String(b?.element ?? ''),
          sourceFlow: String(b?.sourceFlow ?? ''),
          reason: String(b?.reason ?? ''),
          implementation: String(b?.implementation ?? ''),
        }))
      : [],
    ultimateFlow: {
      name: String(s?.ultimateFlow?.name ?? ''),
      description: String(s?.ultimateFlow?.description ?? ''),
      steps: Array.isArray(s?.ultimateFlow?.steps)
        ? s.ultimateFlow.steps.map((st: any) => ({
            number: Number(st?.number ?? 0),
            name: String(st?.name ?? ''),
            sourceFlow: String(st?.sourceFlow ?? ''),
            elements: Array.isArray(st?.elements) ? st.elements : [],
            improvements: Array.isArray(st?.improvements) ? st.improvements : [],
          }))
        : [],
      expectedConversionLift: String(s?.ultimateFlow?.expectedConversionLift ?? ''),
      implementationPriority: Array.isArray(s?.ultimateFlow?.implementationPriority)
        ? s.ultimateFlow.implementationPriority.map((p: any) => ({
            priority: Number(p?.priority ?? 0),
            change: String(p?.change ?? ''),
            effort: String(p?.effort ?? ''),
            impact: String(p?.impact ?? ''),
            sourceFlow: String(p?.sourceFlow ?? ''),
          }))
        : [],
    },
    codeChanges: Array.isArray(s?.codeChanges)
      ? s.codeChanges.map((c: any) => ({
          file: String(c?.file ?? ''),
          component: String(c?.component ?? ''),
          currentState: String(c?.currentState ?? ''),
          proposedChange: String(c?.proposedChange ?? ''),
          implementation: String(c?.implementation ?? ''),
        }))
      : [],
  };
}

// ─────────────────────────────────────────────────────────────
// Format Helpers
// ─────────────────────────────────────────────────────────────

export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Nie';
  return new Date(dateString).toLocaleString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Nie';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Gerade eben';
  if (diffMins < 60) return `Vor ${diffMins} Min.`;
  if (diffHours < 24) return `Vor ${diffHours} Std.`;
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  return formatDate(dateString);
}

// ─────────────────────────────────────────────────────────────
// Fix Prompt Generator
// ─────────────────────────────────────────────────────────────

export function generateFixPrompt(issue: {
  flowId: string;
  stepNumber?: number | null;
  category: string;
  severity: string;
  title: string;
  description?: string | null;
  recommendation?: string | null;
}): string {
  const baseContext = `
Flow: ${issue.flowId}
Step: ${issue.stepNumber || 'Gesamter Flow'}
Kategorie: ${issue.category}
Severity: ${issue.severity}

Issue: ${issue.title}
Beschreibung: ${issue.description || 'Keine weitere Beschreibung'}
Empfehlung: ${issue.recommendation || 'Keine spezifische Empfehlung'}
`;

  switch (issue.category) {
    case 'mobile':
      return `Bitte fixe folgendes Mobile-UX Problem:

${baseContext}

Konkreter Fix benötigt:
- Stell sicher dass alle Touch-Targets mindestens 44x44 Pixel sind
- Verwende min-h-[48px] und min-w-[48px] für Buttons
- Prüfe ob touch-manipulation CSS-Klasse gesetzt ist

Zeige mir den Code-Diff.`;

    case 'ux':
      return `Bitte verbessere folgendes UX-Problem:

${baseContext}

Konkreter Fix benötigt:
- Verbessere das visuelle Feedback für User-Interaktionen
- Stelle sicher dass Formularfelder inline-Validierung haben
- Füge hilfreiche Fehlermeldungen hinzu

Zeige mir den Code-Diff.`;

    case 'conversion':
      return `Bitte optimiere folgendes Conversion-Problem:

${baseContext}

Konkreter Fix benötigt:
- Füge einen visuellen Progress-Indikator hinzu
- Zeige dem User klar wo er sich im Flow befindet
- Verstärke die Call-to-Action Elemente

Zeige mir den Code-Diff.`;

    default:
      return `Bitte behebe folgendes Problem:

${baseContext}

Analysiere das Problem und zeige mir den Code-Diff für die notwendigen Änderungen.`;
  }
}

export function generateCombinedFixPrompt(flowId: string, issues: Array<{
  title: string;
  description?: string | null;
  recommendation?: string | null;
  severity: string;
  category: string;
}>): string {
  const issueList = issues
    .map((i, idx) => `${idx + 1}. [${i.severity.toUpperCase()}] ${i.title}
   Kategorie: ${i.category}
   ${i.description ? `Beschreibung: ${i.description}` : ''}
   ${i.recommendation ? `Empfehlung: ${i.recommendation}` : ''}`)
    .join('\n\n');

  return `Bitte behebe alle folgenden UX/Conversion-Issues für den Flow "${flowId}":

${issueList}

Analysiere jedes Problem und erstelle einen zusammenhängenden Fix, der alle Issues löst.
Zeige mir den kompletten Code-Diff für alle notwendigen Änderungen.`;
}
