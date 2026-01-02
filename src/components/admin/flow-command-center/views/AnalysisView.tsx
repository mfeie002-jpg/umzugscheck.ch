/**
 * Analysis View - Deep analysis of a specific flow
 * Priority 2: 1-Click Deep Analysis
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  Copy,
  Monitor,
  Image as ImageIcon,
  Settings,
  FileCode
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { ScoreRing, ScoreBadgeCompact, IssuesPanel, ScoreDelta } from '../components';
import { 
  ArchetypeRadar, 
  QuickWinsPanel, 
  MovuComparisonCard 
} from '@/components/admin/analysis';
import type { FlowAnalysis, AnalysisRun, UxIssue } from '../types';
import { getScoreColor, normalizeFlowAnalysis } from '../utils';

// Archetype score interface for radar chart
interface ArchetypeScore {
  archetype: string;
  score: number;
  reasoning: string;
  missingElements: string[];
  improvements: string[];
}

interface FlowVersionData {
  id: string;
  flowId: string;
  versionName: string;
  screenshots: Record<string, string>;
  stepConfigs: any[];
  createdAt: string;
}

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
  const [previousRun, setPreviousRun] = useState<AnalysisRun | null>(null);
  const [issues, setIssues] = useState<UxIssue[]>([]);
  const [archetypeScores, setArchetypeScores] = useState<ArchetypeScore[]>([]);
  const [flowVersion, setFlowVersion] = useState<FlowVersionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (flowId) {
      fetchAnalysis(flowId);
      fetchFlowVersion(flowId);
    }
  }, [flowId]);
  
  const fetchFlowVersion = async (id: string) => {
    try {
      const normalizedId = id.startsWith('umzugsofferten-')
        ? id.replace('umzugsofferten-', '')
        : id;
      const flowIds = Array.from(
        new Set([id, normalizedId, `umzugsofferten-${normalizedId}`])
      );
      
      const { data, error } = await supabase
        .from('flow_versions')
        .select('id, flow_id, version_name, screenshots, step_configs, created_at')
        .in('flow_id', flowIds)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data && !error) {
        setFlowVersion({
          id: data.id,
          flowId: data.flow_id,
          versionName: data.version_name || id,
          screenshots: (data.screenshots as Record<string, string>) || {},
          stepConfigs: Array.isArray(data.step_configs) ? data.step_configs : [],
          createdAt: data.created_at,
        });
      }
    } catch (err) {
      console.error('Failed to fetch flow version:', err);
    }
  };

  const fetchAnalysis = async (id: string) => {
    setLoading(true);
    try {
      // Support both current IDs (v9) and legacy IDs (umzugsofferten-v9)
      const normalizedId = id.startsWith('umzugsofferten-')
        ? id.replace('umzugsofferten-', '')
        : id;
      const flowIds = Array.from(
        new Set([id, normalizedId, `umzugsofferten-${normalizedId}`])
      );

      // Fetch latest 2 COMPLETED runs for delta comparison (ignore processing/failed)
      const { data: runData, error: runError } = await supabase
        .from('flow_analysis_runs')
        .select('*')
        .in('flow_id', flowIds)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(2);

      if (runError && runError.code !== 'PGRST116') throw runError;
      
      const latestRun = runData?.[0];
      const prevRun = runData?.[1];
      
      if (latestRun) {
        setRun({
          id: latestRun.id,
          flowId: latestRun.flow_id,
          flowName: latestRun.flow_name,
          runType: latestRun.run_type,
          status: latestRun.status as any,
          overallScore: latestRun.overall_score,
          conversionScore: latestRun.conversion_score,
          performanceScore: latestRun.performance_score,
          uxScore: latestRun.ux_score,
          mobileScore: latestRun.mobile_score,
          trustScore: latestRun.trust_score,
          accessibilityScore: latestRun.accessibility_score,
          aiSummary: latestRun.ai_summary,
          aiRecommendations: Array.isArray(latestRun.ai_recommendations) 
            ? latestRun.ai_recommendations as string[] 
            : [],
          quickWins: Array.isArray(latestRun.quick_wins) ? latestRun.quick_wins as string[] : [],
          strengths: Array.isArray(latestRun.strengths) ? latestRun.strengths as string[] : [],
          createdAt: latestRun.created_at,
          completedAt: latestRun.completed_at,
          stepsCaptured: latestRun.steps_captured || 0,
          totalSteps: latestRun.total_steps || 0,
        });
      }
      
      if (prevRun) {
        setPreviousRun({
          id: prevRun.id,
          flowId: prevRun.flow_id,
          flowName: prevRun.flow_name,
          runType: prevRun.run_type,
          status: prevRun.status as any,
          overallScore: prevRun.overall_score,
          conversionScore: prevRun.conversion_score,
          performanceScore: prevRun.performance_score,
          uxScore: prevRun.ux_score,
          mobileScore: prevRun.mobile_score,
          trustScore: prevRun.trust_score,
          accessibilityScore: prevRun.accessibility_score,
          aiSummary: prevRun.ai_summary,
          aiRecommendations: [],
          quickWins: [],
          strengths: [],
          createdAt: prevRun.created_at,
          completedAt: prevRun.completed_at,
          stepsCaptured: prevRun.steps_captured || 0,
          totalSteps: prevRun.total_steps || 0,
        });
      } else {
        setPreviousRun(null);
      }
      
      // Fetch issues
      const { data: issuesData, error: issuesError } = await supabase
        .from('flow_ux_issues')
        .select('*')
        .in('flow_id', flowIds)
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
      
      // Fetch archetype scores
      const { data: archetypeData, error: archetypeError } = await supabase
        .from('flow_archetype_scores')
        .select('*')
        .in('flow_id', flowIds)
        .order('created_at', { ascending: false });

      if (!archetypeError && archetypeData && archetypeData.length > 0) {
        // Get latest scores per archetype
        const latestScores = new Map<string, ArchetypeScore>();
        for (const row of archetypeData) {
          if (!latestScores.has(row.archetype)) {
            latestScores.set(row.archetype, {
              archetype: row.archetype_name || row.archetype,
              score: row.score || 0,
              reasoning: row.reasoning || '',
              missingElements: Array.isArray(row.missing_elements) ? row.missing_elements as string[] : [],
              improvements: Array.isArray(row.improvements) ? row.improvements as string[] : [],
            });
          }
        }
        setArchetypeScores(Array.from(latestScores.values()));
      } else {
        // Default archetype scores if none exist
        setArchetypeScores([
          { archetype: 'Sicherheits-Sucher', score: 65, reasoning: 'Basierend auf Trust-Signalen', missingElements: [], improvements: [] },
          { archetype: 'Effizienz-Maximierer', score: 70, reasoning: 'Gute UX-Struktur', missingElements: [], improvements: [] },
          { archetype: 'Preis-Jäger', score: 60, reasoning: 'Preistransparenz vorhanden', missingElements: [], improvements: [] },
          { archetype: 'Chaos-Manager', score: 55, reasoning: 'Hilfreiche Struktur', missingElements: [], improvements: [] },
        ]);
      }
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
              <CardContent className="pt-4 flex flex-col items-center justify-center">
                <ScoreRing score={run.overallScore || 0} size="lg" label="Gesamt" />
                {/* Show delta if previous run exists */}
                {previousRun && previousRun.overallScore !== null && run.overallScore !== null && (
                  <div className="mt-2">
                    <ScoreDelta 
                      delta={(run.overallScore || 0) - (previousRun.overallScore || 0)}
                      previousScore={previousRun.overallScore}
                      currentScore={run.overallScore}
                      categories={[
                        { label: 'Conv', delta: (run.conversionScore || 0) - (previousRun.conversionScore || 0) },
                        { label: 'UX', delta: (run.uxScore || 0) - (previousRun.uxScore || 0) },
                        { label: 'Mobile', delta: (run.mobileScore || 0) - (previousRun.mobileScore || 0) },
                      ]}
                      size="sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <ScoreCard 
              label="Conversion" 
              score={run.conversionScore} 
              icon={<TrendingUp className="h-4 w-4" />}
              delta={previousRun ? (run.conversionScore || 0) - (previousRun.conversionScore || 0) : null}
            />
            <ScoreCard 
              label="UX" 
              score={run.uxScore} 
              icon={<Zap className="h-4 w-4" />}
              delta={previousRun ? (run.uxScore || 0) - (previousRun.uxScore || 0) : null}
            />
            <ScoreCard 
              label="Mobile" 
              score={run.mobileScore} 
              icon={<Smartphone className="h-4 w-4" />}
              delta={previousRun ? (run.mobileScore || 0) - (previousRun.mobileScore || 0) : null}
            />
            <ScoreCard 
              label="Trust" 
              score={run.trustScore} 
              icon={<Shield className="h-4 w-4" />}
              delta={previousRun ? (run.trustScore || 0) - (previousRun.trustScore || 0) : null}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="overview">Übersicht</TabsTrigger>
              <TabsTrigger value="screenshots" className="gap-2">
                <ImageIcon className="h-3 w-3" />
                Screenshots
              </TabsTrigger>
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
              <TabsTrigger value="config" className="gap-2">
                <Settings className="h-3 w-3" />
                Konfiguration
              </TabsTrigger>
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
              <ArchetypeRadar 
                scores={archetypeScores} 
                flowName={run?.flowName}
              />
            </TabsContent>

            {/* Screenshots Tab */}
            <TabsContent value="screenshots" className="mt-6">
              <ScreenshotsPanel flowVersion={flowVersion} flowId={flowId} />
            </TabsContent>

            {/* Configuration Tab */}
            <TabsContent value="config" className="mt-6">
              <ConfigPanel flowVersion={flowVersion} flowId={flowId} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

// Helper component with delta support
const ScoreCard: React.FC<{
  label: string;
  score: number | null;
  icon: React.ReactNode;
  delta?: number | null;
}> = ({ label, score, icon, delta }) => (
  <Card>
    <CardContent className="pt-4 text-center">
      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center justify-center gap-1">
        <span className={cn('text-2xl font-bold', getScoreColor(score))}>
          {score ?? '-'}
        </span>
        {delta !== undefined && delta !== null && delta !== 0 && (
          <span className={cn(
            'text-xs font-medium',
            delta > 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>
      <Progress value={score || 0} className="h-1.5 mt-2" />
    </CardContent>
  </Card>
);

// Screenshots Panel Component
const ScreenshotsPanel: React.FC<{ flowVersion: FlowVersionData | null; flowId: string | null }> = ({ flowVersion, flowId }) => {
  const screenshots = flowVersion?.screenshots || {};
  const screenshotEntries = Object.entries(screenshots);
  
  if (screenshotEntries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Keine Screenshots vorhanden</p>
          <p className="text-sm text-muted-foreground mt-1">
            Starte eine neue Analyse um Screenshots zu erfassen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Flow Screenshots</h3>
        <Badge variant="secondary">{screenshotEntries.length} Schritte</Badge>
      </div>
      
      <div className="grid gap-6">
        {screenshotEntries.map(([stepKey, url]) => (
          <Card key={stepKey}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {stepKey.includes('mobile') ? (
                  <Smartphone className="h-4 w-4" />
                ) : (
                  <Monitor className="h-4 w-4" />
                )}
                {stepKey.replace(/_/g, ' ').replace(/step/i, 'Schritt ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-muted/30">
                <img 
                  src={url as string} 
                  alt={stepKey}
                  className="w-full h-auto max-h-[500px] object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(url as string, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Vollbild
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Configuration Panel Component  
const ConfigPanel: React.FC<{ flowVersion: FlowVersionData | null; flowId: string | null }> = ({ flowVersion, flowId }) => {
  const stepConfigs = flowVersion?.stepConfigs || [];

  if (stepConfigs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Keine Konfiguration vorhanden</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Flow Konfiguration</h3>
        <Badge variant="secondary">{stepConfigs.length} Schritte</Badge>
      </div>

      <div className="grid gap-4">
        {stepConfigs.map((step: any, index: number) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="outline">{step.number || index + 1}</Badge>
                {step.name || `Schritt ${index + 1}`}
              </CardTitle>
              {step.description && (
                <CardDescription>{step.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {step.features && step.features.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {step.features.map((feature: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {step.archetypeValue && Object.keys(step.archetypeValue).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Archetypen-Werte:</p>
                  <div className="space-y-1 text-xs">
                    {Object.entries(step.archetypeValue).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-muted-foreground">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalysisView;
