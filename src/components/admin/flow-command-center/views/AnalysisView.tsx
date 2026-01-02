/**
 * Analysis View - Deep analysis of a specific flow
 * Priority 2: 1-Click Deep Analysis
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Loader2, 
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Smartphone,
  Shield,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { ScoreRing, ScoreBadgeCompact, IssuesPanel } from '../components';
import { 
  ArchetypeRadar, 
  QuickWinsPanel, 
  MovuComparisonCard 
} from '@/components/admin/analysis';
import type { FlowAnalysis, AnalysisRun, UxIssue } from '../types';
import { getScoreColor, normalizeFlowAnalysis } from '../utils';

interface AnalysisViewProps {
  flowId: string | null;
  onBack: () => void;
  onAnalyze: (flowId: string) => void;
  isAnalyzing: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  flowId,
  onBack,
  onAnalyze,
  isAnalyzing,
}) => {
  const [run, setRun] = useState<AnalysisRun | null>(null);
  const [issues, setIssues] = useState<UxIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (flowId) {
      fetchAnalysis(flowId);
    }
  }, [flowId]);

  const fetchAnalysis = async (id: string) => {
    setLoading(true);
    try {
      // Fetch latest run
      const { data: runData, error: runError } = await supabase
        .from('flow_analysis_runs')
        .select('*')
        .eq('flow_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (runError && runError.code !== 'PGRST116') throw runError;
      
      if (runData) {
        setRun({
          id: runData.id,
          flowId: runData.flow_id,
          flowName: runData.flow_name,
          runType: runData.run_type,
          status: runData.status as any,
          overallScore: runData.overall_score,
          conversionScore: runData.conversion_score,
          performanceScore: runData.performance_score,
          uxScore: runData.ux_score,
          mobileScore: runData.mobile_score,
          trustScore: runData.trust_score,
          accessibilityScore: runData.accessibility_score,
          aiSummary: runData.ai_summary,
          aiRecommendations: Array.isArray(runData.ai_recommendations) 
            ? runData.ai_recommendations as string[] 
            : [],
          quickWins: Array.isArray(runData.quick_wins) ? runData.quick_wins as string[] : [],
          strengths: Array.isArray(runData.strengths) ? runData.strengths as string[] : [],
          createdAt: runData.created_at,
          completedAt: runData.completed_at,
          stepsCaptured: runData.steps_captured || 0,
          totalSteps: runData.total_steps || 0,
        });
      }
      
      // Fetch issues
      const { data: issuesData, error: issuesError } = await supabase
        .from('flow_ux_issues')
        .select('*')
        .eq('flow_id', id)
        .eq('is_resolved', false)
        .order('severity', { ascending: true });
      
      if (issuesError) throw issuesError;
      
      setIssues((issuesData || []).map(i => ({
        id: i.id,
        flowId: i.flow_id,
        stepNumber: i.step_number,
        severity: i.severity as any,
        category: i.category,
        title: i.title,
        description: i.description,
        recommendation: i.recommendation,
        isResolved: i.is_resolved || false,
        createdAt: i.created_at,
      })));
    } catch (err) {
      console.error('Failed to fetch analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveIssue = async (issueId: string) => {
    try {
      await supabase
        .from('flow_ux_issues')
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', issueId);
      
      setIssues(prev => prev.filter(i => i.id !== issueId));
      toast.success('Issue als gelöst markiert');
    } catch (err) {
      toast.error('Fehler beim Markieren');
    }
  };

  const copyAnalysisPrompt = async () => {
    if (!run) return;
    
    const prompt = `Analysiere den Flow "${run.flowName}" (${run.flowId}):

Aktueller Score: ${run.overallScore ?? 'N/A'}/100
- Conversion: ${run.conversionScore ?? '-'}/100
- UX: ${run.uxScore ?? '-'}/100
- Mobile: ${run.mobileScore ?? '-'}/100
- Trust: ${run.trustScore ?? '-'}/100

${run.aiSummary ? `Zusammenfassung: ${run.aiSummary}` : ''}

Offene Issues: ${issues.length}
${issues.slice(0, 5).map(i => `- [${i.severity}] ${i.title}`).join('\n')}

Bitte gib mir konkrete Code-Fixes für die kritischsten Probleme.`;

    await navigator.clipboard.writeText(prompt);
    toast.success('Analyse-Prompt kopiert!');
  };

  if (!flowId) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Kein Flow ausgewählt</h3>
          <p className="text-muted-foreground mb-4">
            Wähle einen Flow aus dem Dashboard oder Ranking um die Analyse zu sehen.
          </p>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const criticalCount = issues.filter(i => i.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{run?.flowName || flowId}</h2>
            <p className="text-muted-foreground">
              {run ? `Analysiert am ${new Date(run.createdAt).toLocaleString('de-CH')}` : 'Noch nicht analysiert'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyAnalysisPrompt}>
            <Copy className="h-4 w-4 mr-1" />
            Prompt
          </Button>
          <Button
            variant="default"
            onClick={() => onAnalyze(flowId)}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {run ? 'Neu analysieren' : 'Analysieren'}
          </Button>
        </div>
      </div>

      {!run ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Keine Analyse vorhanden</h3>
            <p className="text-muted-foreground mb-4">
              Starte eine Analyse um detaillierte Insights zu erhalten.
            </p>
            <Button onClick={() => onAnalyze(flowId)} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Jetzt analysieren
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Score Overview */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card className="md:col-span-2">
              <CardContent className="pt-4 flex items-center justify-center">
                <ScoreRing score={run.overallScore || 0} size="lg" label="Gesamt" />
              </CardContent>
            </Card>
            
            <ScoreCard label="Conversion" score={run.conversionScore} icon={<TrendingUp className="h-4 w-4" />} />
            <ScoreCard label="UX" score={run.uxScore} icon={<Zap className="h-4 w-4" />} />
            <ScoreCard label="Mobile" score={run.mobileScore} icon={<Smartphone className="h-4 w-4" />} />
            <ScoreCard label="Trust" score={run.trustScore} icon={<Shield className="h-4 w-4" />} />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Übersicht</TabsTrigger>
              <TabsTrigger value="issues" className="gap-2">
                Issues
                {issues.length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {issues.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="recommendations">Empfehlungen</TabsTrigger>
              <TabsTrigger value="archetypes">Archetypen</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* AI Summary */}
              {run.aiSummary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      AI Zusammenfassung
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{run.aiSummary}</p>
                  </CardContent>
                </Card>
              )}

              {/* Strengths & Quick Wins */}
              <div className="grid md:grid-cols-2 gap-6">
                {run.strengths.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Stärken
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {run.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {run.quickWins.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Quick Wins
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {run.quickWins.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="issues" className="mt-6">
              <IssuesPanel
                issues={issues}
                flowId={flowId}
                onResolve={handleResolveIssue}
                maxHeight="600px"
              />
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6">
              {run.aiRecommendations.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Empfehlungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {run.aiRecommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <Badge variant="secondary" className="mt-0.5">
                            {i + 1}
                          </Badge>
                          <p className="text-sm">{rec}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Keine Empfehlungen verfügbar
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="archetypes" className="mt-6">
              <ArchetypeRadar />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

// Helper component
const ScoreCard: React.FC<{
  label: string;
  score: number | null;
  icon: React.ReactNode;
}> = ({ label, score, icon }) => (
  <Card>
    <CardContent className="pt-4 text-center">
      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className={cn('text-2xl font-bold', getScoreColor(score))}>
        {score ?? '-'}
      </div>
      <Progress value={score || 0} className="h-1.5 mt-2" />
    </CardContent>
  </Card>
);

export default AnalysisView;
