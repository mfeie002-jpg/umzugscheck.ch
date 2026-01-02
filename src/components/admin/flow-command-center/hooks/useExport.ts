/**
 * Export Hook - Archetyp Reference
 * Professional data export functionality
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { FlowScore } from '../types';

type ExportFormat = 'json' | 'csv' | 'markdown' | 'prompt';

interface ExportOptions {
  format: ExportFormat;
  includeScores?: boolean;
  includeIssues?: boolean;
  includeRecommendations?: boolean;
  flowIds?: string[];
}

interface ExportResult {
  content: string;
  filename: string;
  mimeType: string;
}

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = useCallback(async (options: ExportOptions): Promise<ExportResult | null> => {
    setIsExporting(true);
    try {
      // Fetch data based on options
      const query = supabase
        .from('flow_feature_scores')
        .select('*')
        .order('overall_score', { ascending: false });

      if (options.flowIds && options.flowIds.length > 0) {
        query.in('flow_id', options.flowIds);
      }

      const { data: scores, error: scoresError } = await query;
      if (scoresError) throw scoresError;

      let issues: any[] = [];
      if (options.includeIssues) {
        const { data: issuesData } = await supabase
          .from('flow_ux_issues')
          .select('*')
          .eq('is_resolved', false)
          .order('severity', { ascending: true });
        issues = issuesData || [];
      }

      let recommendations: any[] = [];
      if (options.includeRecommendations) {
        const { data: runsData } = await supabase
          .from('flow_analysis_runs')
          .select('flow_id, ai_recommendations, quick_wins, strengths')
          .order('created_at', { ascending: false });
        recommendations = runsData || [];
      }

      // Format based on type
      let result: ExportResult;

      switch (options.format) {
        case 'json':
          result = formatAsJSON(scores, issues, recommendations, options);
          break;
        case 'csv':
          result = formatAsCSV(scores, issues, options);
          break;
        case 'markdown':
          result = formatAsMarkdown(scores, issues, recommendations, options);
          break;
        case 'prompt':
          result = formatAsPrompt(scores, issues, recommendations, options);
          break;
        default:
          throw new Error('Unknown format');
      }

      toast.success(`Export als ${options.format.toUpperCase()} erstellt`);
      return result;
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Export fehlgeschlagen');
      return null;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const downloadExport = useCallback((result: ExportResult) => {
    const blob = new Blob([result.content], { type: result.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const copyToClipboard = useCallback(async (result: ExportResult) => {
    try {
      await navigator.clipboard.writeText(result.content);
      toast.success('In Zwischenablage kopiert');
    } catch (err) {
      toast.error('Kopieren fehlgeschlagen');
    }
  }, []);

  return {
    exportData,
    downloadExport,
    copyToClipboard,
    isExporting,
  };
}

// Format helpers

function formatAsJSON(
  scores: any[], 
  issues: any[], 
  recommendations: any[],
  options: ExportOptions
): ExportResult {
  const data: any = {
    exportedAt: new Date().toISOString(),
    summary: {
      totalFlows: scores.length,
      avgScore: scores.length > 0 
        ? Math.round(scores.reduce((s, f) => s + (f.overall_score || 0), 0) / scores.length)
        : 0,
      totalIssues: issues.length,
    },
  };

  if (options.includeScores !== false) {
    data.scores = scores.map(s => ({
      flowId: s.flow_id,
      overallScore: s.overall_score,
      conversionScore: s.conversion_score,
      uxScore: s.ux_score,
      mobileScore: s.mobile_score,
      trustScore: s.trust_score,
      lastUpdated: s.updated_at,
    }));
  }

  if (options.includeIssues) {
    data.issues = issues.map(i => ({
      flowId: i.flow_id,
      severity: i.severity,
      category: i.category,
      title: i.title,
      description: i.description,
      recommendation: i.recommendation,
    }));
  }

  if (options.includeRecommendations) {
    data.recommendations = recommendations;
  }

  return {
    content: JSON.stringify(data, null, 2),
    filename: `flow-analysis-${new Date().toISOString().split('T')[0]}.json`,
    mimeType: 'application/json',
  };
}

function formatAsCSV(
  scores: any[], 
  issues: any[],
  options: ExportOptions
): ExportResult {
  const headers = [
    'Flow ID',
    'Overall Score',
    'Conversion',
    'UX',
    'Mobile',
    'Trust',
    'Performance',
    'Issues',
    'Last Updated'
  ];

  const issueCountMap = new Map<string, number>();
  issues.forEach(i => {
    issueCountMap.set(i.flow_id, (issueCountMap.get(i.flow_id) || 0) + 1);
  });

  const rows = scores.map(s => [
    s.flow_id,
    s.overall_score || '',
    s.conversion_score || '',
    s.ux_score || '',
    s.mobile_score || '',
    s.trust_score || '',
    s.performance_score || '',
    issueCountMap.get(s.flow_id) || 0,
    s.updated_at?.split('T')[0] || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  return {
    content: csv,
    filename: `flow-analysis-${new Date().toISOString().split('T')[0]}.csv`,
    mimeType: 'text/csv',
  };
}

function formatAsMarkdown(
  scores: any[], 
  issues: any[], 
  recommendations: any[],
  options: ExportOptions
): ExportResult {
  const lines: string[] = [
    '# Flow Analysis Report',
    '',
    `Generated: ${new Date().toLocaleString('de-CH')}`,
    '',
    '## Summary',
    '',
    `- **Total Flows**: ${scores.length}`,
    `- **Average Score**: ${scores.length > 0 
      ? Math.round(scores.reduce((s, f) => s + (f.overall_score || 0), 0) / scores.length)
      : 0}/100`,
    `- **Open Issues**: ${issues.length}`,
    '',
    '## Flow Scores',
    '',
    '| Flow | Score | Conversion | UX | Mobile | Trust |',
    '|------|-------|------------|-----|--------|-------|',
  ];

  scores.slice(0, 20).forEach(s => {
    lines.push(`| ${s.flow_id} | ${s.overall_score || '-'} | ${s.conversion_score || '-'} | ${s.ux_score || '-'} | ${s.mobile_score || '-'} | ${s.trust_score || '-'} |`);
  });

  if (issues.length > 0) {
    lines.push('', '## Top Issues', '');
    issues.slice(0, 10).forEach(i => {
      lines.push(`- **[${i.severity}]** ${i.title}`);
      if (i.description) lines.push(`  ${i.description}`);
    });
  }

  return {
    content: lines.join('\n'),
    filename: `flow-analysis-${new Date().toISOString().split('T')[0]}.md`,
    mimeType: 'text/markdown',
  };
}

function formatAsPrompt(
  scores: any[], 
  issues: any[], 
  recommendations: any[],
  options: ExportOptions
): ExportResult {
  const winner = scores[0];
  const criticalIssues = issues.filter(i => i.severity === 'critical');

  const prompt = `Analysiere die folgenden Flow-Daten und gib mir konkrete Optimierungsvorschläge:

## Aktuelle Situation

Top-Performender Flow: ${winner?.flow_id || 'N/A'} (Score: ${winner?.overall_score || 0}/100)

### Alle Flows (nach Score sortiert):
${scores.slice(0, 10).map((s, i) => `${i + 1}. ${s.flow_id}: ${s.overall_score || 0}/100`).join('\n')}

### Kritische Issues (${criticalIssues.length}):
${criticalIssues.slice(0, 5).map(i => `- ${i.title}: ${i.description || 'Keine Beschreibung'}`).join('\n') || 'Keine kritischen Issues'}

### Offene Probleme gesamt: ${issues.length}

## Aufgabe

1. Identifiziere die 3 wichtigsten Quick Wins mit maximalem Impact
2. Erkläre warum ${winner?.flow_id || 'der Top-Flow'} am besten performt
3. Gib mir konkreten Code für die Top-Priority Fixes
4. Schlage eine Roadmap für die nächsten 2 Wochen vor

Antworte strukturiert mit:
- Priorisierte Maßnahmen
- Geschätzter Impact (Conversion-Lift %)
- Aufwand (Stunden)
- Code-Snippets wo relevant`;

  return {
    content: prompt,
    filename: `chatgpt-prompt-${new Date().toISOString().split('T')[0]}.txt`,
    mimeType: 'text/plain',
  };
}
