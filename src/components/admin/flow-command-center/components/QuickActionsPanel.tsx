/**
 * Quick Actions Panel - Common actions for a flow
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Download, 
  Copy, 
  ExternalLink, 
  Camera, 
  FileText,
  Loader2,
  Sparkles,
  Code,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuickActionsPanelProps {
  flowId: string;
  flowName?: string;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  className?: string;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  flowId,
  flowName,
  onAnalyze,
  isAnalyzing,
  className,
}) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const getFlowUrl = () => {
    const baseUrl = 'https://www.umzugscheck.ch';
    // Handle short variant IDs like v1, v2a
    if (flowId.startsWith('v') && flowId.length <= 3) {
      return `${baseUrl}/umzugsofferten?variant=${flowId}`;
    }
    // Handle IDs that already include the full path prefix
    if (flowId.startsWith('umzugsofferten-')) {
      return `${baseUrl}/${flowId}`;
    }
    return `${baseUrl}/umzugsofferten-${flowId}`;
  };

  const copyFlowUrl = async () => {
    await navigator.clipboard.writeText(getFlowUrl());
    toast.success('Flow-URL kopiert!');
  };

  const openFlow = () => {
    window.open(getFlowUrl(), '_blank');
  };

  const exportAnalysis = async (format: 'json' | 'md' | 'pdf') => {
    setExporting(format);
    try {
      const normalizedId = flowId.startsWith('umzugsofferten-')
        ? flowId.replace('umzugsofferten-', '')
        : flowId;
      const flowIds = [flowId, normalizedId, `umzugsofferten-${normalizedId}`];

      // Fetch latest analysis
      const { data: run } = await supabase
        .from('flow_analysis_runs')
        .select('*')
        .in('flow_id', flowIds)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Fetch issues
      const { data: issues } = await supabase
        .from('flow_ux_issues')
        .select('*')
        .in('flow_id', flowIds)
        .eq('is_resolved', false);

      if (!run) {
        toast.error('Keine Analyse vorhanden');
        return;
      }

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        content = JSON.stringify({ run, issues }, null, 2);
        filename = `${flowId}-analysis.json`;
        mimeType = 'application/json';
      } else if (format === 'md') {
        content = `# Flow Analysis: ${run.flow_name || flowId}

## Scores
- **Gesamt**: ${run.overall_score}/100
- **Conversion**: ${run.conversion_score}/100
- **UX**: ${run.ux_score}/100
- **Mobile**: ${run.mobile_score}/100
- **Trust**: ${run.trust_score}/100

## AI Summary
${run.ai_summary || 'Keine Zusammenfassung verfügbar'}

## Issues (${issues?.length || 0})
${issues?.map(i => `- **[${i.severity}]** ${i.title}: ${i.description}`).join('\n') || 'Keine Issues'}

## Recommendations
${Array.isArray(run.ai_recommendations) ? run.ai_recommendations.map((r: string) => `- ${r}`).join('\n') : 'Keine Empfehlungen'}

---
*Analysiert am: ${new Date(run.created_at).toLocaleString('de-CH')}*
`;
        filename = `${flowId}-analysis.md`;
        mimeType = 'text/markdown';
      } else {
        // For PDF, just export as text for now
        content = `Flow Analysis: ${run.flow_name || flowId}\n\nScore: ${run.overall_score}/100\n\n${run.ai_summary || ''}`;
        filename = `${flowId}-analysis.txt`;
        mimeType = 'text/plain';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Export als ${format.toUpperCase()} heruntergeladen`);
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Export fehlgeschlagen');
    } finally {
      setExporting(null);
    }
  };

  const generateAIPrompt = async () => {
    const normalizedId = flowId.startsWith('umzugsofferten-')
      ? flowId.replace('umzugsofferten-', '')
      : flowId;
    const flowIds = [flowId, normalizedId, `umzugsofferten-${normalizedId}`];

    const { data: run } = await supabase
      .from('flow_analysis_runs')
      .select('*')
      .in('flow_id', flowIds)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: issues } = await supabase
      .from('flow_ux_issues')
      .select('*')
      .in('flow_id', flowIds)
      .eq('is_resolved', false)
      .eq('severity', 'critical')
      .limit(5);

    const prompt = `Analysiere und verbessere den Flow "${flowName || flowId}":

Aktueller Score: ${run?.overall_score || 'N/A'}/100
- Conversion: ${run?.conversion_score || '-'}/100
- UX: ${run?.ux_score || '-'}/100  
- Mobile: ${run?.mobile_score || '-'}/100
- Trust: ${run?.trust_score || '-'}/100

Kritische Issues (Top 5):
${issues?.map(i => `- ${i.title}: ${i.description}`).join('\n') || 'Keine kritischen Issues'}

Bitte gib mir:
1. 3 konkrete Code-Fixes für die kritischsten Probleme
2. UX-Verbesserungsvorschläge
3. Mobile-Optimierungen`;

    await navigator.clipboard.writeText(prompt);
    toast.success('AI Prompt kopiert!');
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            Analysieren
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openFlow}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Öffnen
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyFlowUrl}
            className="w-full text-xs"
          >
            <Copy className="h-3 w-3 mr-1" />
            URL
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateAIPrompt}
            className="w-full text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Prompt
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`/admin/tools?tab=calculator-review&flow=${flowId}`, '_blank')}
            className="w-full text-xs"
          >
            <Camera className="h-3 w-3 mr-1" />
            Capture
          </Button>
        </div>

        {/* Export Actions */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-2">Export</div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportAnalysis('json')}
              disabled={!!exporting}
              className="flex-1 text-xs"
            >
              {exporting === 'json' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Code className="h-3 w-3 mr-1" />}
              JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportAnalysis('md')}
              disabled={!!exporting}
              className="flex-1 text-xs"
            >
              {exporting === 'md' ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileText className="h-3 w-3 mr-1" />}
              Markdown
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsPanel;
