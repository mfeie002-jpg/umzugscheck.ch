import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FLOW_CONFIGS as CENTRAL_FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  X,
  Trash2,
  StopCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Smartphone,
  Monitor,
  Bell,
  Calendar,
  BarChart3,
  Eye,
  ChevronRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  Info,
  Wand2,
  Wrench,
  Copy,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Use central flow configurations - map to dashboard format (main flows + sub-variants)
const FLOW_CONFIGS: Record<string, { name: string; steps: number; color: string; parentFlow?: string }> = {};

// Add main flows
Object.entries(CENTRAL_FLOW_CONFIGS).forEach(([id, config]) => {
  FLOW_CONFIGS[id] = {
    name: config.label,
    steps: config.steps.length,
    color: config.color,
  };
});

// Add all sub-variants
Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
  FLOW_CONFIGS[id] = {
    name: config.label,
    steps: config.steps.length,
    color: config.color,
    parentFlow: config.parentFlow,
  };
});

interface AnalysisRun {
  id: string;
  flow_id: string;
  flow_name: string;
  run_type: string;
  status: string;
  overall_score: number | null;
  conversion_score: number | null;
  performance_score: number | null;
  ux_score: number | null;
  ai_summary: string | null;
  ai_recommendations: string[];
  created_at: string;
  completed_at: string | null;
  steps_captured: number;
  total_steps: number;
}

interface UxIssue {
  id: string;
  flow_id: string;
  step_number: number | null;
  severity: string;
  category: string;
  title: string;
  description: string | null;
  recommendation: string | null;
  is_resolved: boolean;
  created_at: string;
}

interface Alert {
  id: string;
  flow_id: string | null;
  alert_type: string;
  title: string;
  message: string | null;
  severity: string;
  is_acknowledged: boolean;
  created_at: string;
}

interface AlertSetting {
  id: string;
  flow_id: string | null;
  alert_type: string;
  threshold_value: number | null;
  email: string;
  is_active: boolean;
}

// Issue Card Component with Auto-Fix button
interface IssueCardProps {
  issue: UxIssue;
  flowConfig?: { name: string; steps: number; color: string };
  getSeverityBadge: (severity: string) => React.ReactNode;
  onResolve: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, flowConfig, getSeverityBadge, onResolve }) => {
  const [fixing, setFixing] = useState(false);

  const handleAutoFix = async () => {
    setFixing(true);
    try {
      // Generate a prompt based on the issue and send it to AI for auto-fix
      const fixPrompt = generateFixPrompt(issue);
      
      // Call edge function to auto-fix the issue
      const response = await supabase.functions.invoke('auto-fix-issue', {
        body: {
          issueId: issue.id,
          issueTitle: issue.title,
          issueDescription: issue.description,
          recommendation: issue.recommendation,
          flowId: issue.flow_id,
          stepNumber: issue.step_number,
          category: issue.category,
          severity: issue.severity,
          prompt: fixPrompt,
        }
      });

      if (response.error) {
        console.error('Auto-fix edge function error:', response.error);
        // Fallback: copy prompt to clipboard
        await navigator.clipboard.writeText(fixPrompt);
        toast.info('Fix-Prompt in Zwischenablage kopiert! Füge ihn in Lovable Chat ein.', { duration: 5000 });
        onResolve();
      } else if (response.data?.fixSuggestion) {
        // Show the AI-generated fix suggestion
        await navigator.clipboard.writeText(response.data.fixSuggestion);
        toast.success('AI Fix-Vorschlag generiert und kopiert!', { duration: 5000 });
        onResolve();
      } else {
        toast.success('Issue als gelöst markiert');
        onResolve();
      }
    } catch (err) {
      console.error('Auto-fix failed:', err);
      // Fallback: copy prompt to clipboard
      const fixPrompt = generateFixPrompt(issue);
      await navigator.clipboard.writeText(fixPrompt);
      toast.info('Fix-Prompt kopiert (manueller Fix erforderlich)', { duration: 5000 });
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {getSeverityBadge(issue.severity)}
            <Badge variant="secondary">{issue.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {flowConfig?.name || issue.flow_id}
              {issue.step_number && ` • Step ${issue.step_number}`}
            </span>
          </div>
          <h4 className="font-medium">{issue.title}</h4>
          {issue.description && (
            <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
          )}
          {issue.recommendation && (
            <p className="text-sm text-primary mt-2">
              <strong>Empfehlung:</strong> {issue.recommendation}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleAutoFix}
            disabled={fixing}
            className="whitespace-nowrap"
          >
            {fixing ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-1" />
            )}
            Auto-Fix
          </Button>
          <Button variant="ghost" size="sm" onClick={onResolve}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Erledigt
          </Button>
        </div>
      </div>
    </div>
  );
};

// Generate fix prompt based on issue type
const generateFixPrompt = (issue: UxIssue): string => {
  const baseContext = `
Flow: ${issue.flow_id}
Step: ${issue.step_number || 'Gesamter Flow'}
Kategorie: ${issue.category}
Severity: ${issue.severity}

Issue: ${issue.title}
Beschreibung: ${issue.description || 'Keine weitere Beschreibung'}
Empfehlung: ${issue.recommendation || 'Keine spezifische Empfehlung'}
`;

  // Generate specific fix prompts based on issue category
  switch (issue.category) {
    case 'mobile':
      return `Bitte fixe folgendes Mobile-UX Problem in meinem React/Tailwind Projekt:

${baseContext}

Konkreter Fix benötigt:
- Stell sicher dass alle Touch-Targets mindestens 44x44 Pixel sind
- Verwende min-h-[48px] und min-w-[48px] für Buttons und interaktive Elemente
- Prüfe ob touch-manipulation CSS-Klasse gesetzt ist

Zeige mir den Code-Diff für die notwendigen Änderungen.`;

    case 'ux':
      return `Bitte verbessere folgendes UX-Problem in meinem React/Tailwind Projekt:

${baseContext}

Konkreter Fix benötigt:
- Verbessere das visuelle Feedback für User-Interaktionen
- Stelle sicher dass Formularfelder inline-Validierung haben
- Füge hilfreiche Fehlermeldungen hinzu

Zeige mir den Code-Diff für die notwendigen Änderungen.`;

    case 'conversion':
      return `Bitte optimiere folgendes Conversion-Problem in meinem React/Tailwind Projekt:

${baseContext}

Konkreter Fix benötigt:
- Füge einen visuellen Progress-Indikator hinzu
- Zeige dem User klar wo er sich im Flow befindet
- Verstärke die Call-to-Action Elemente

Zeige mir den Code-Diff für die notwendigen Änderungen.`;

    default:
      return `Bitte behebe folgendes Problem in meinem React/Tailwind Projekt:

${baseContext}

Analysiere das Problem und zeige mir den Code-Diff für die notwendigen Änderungen.`;
  }
};

// Flow Result Card Component - Expandable with Issues and Fix Button
interface FlowResultCardProps {
  flowId: string;
  config: { name: string; steps: number; color: string };
  run: AnalysisRun | undefined;
  flowIssues: UxIssue[];
  criticalCount: number;
  warningCount: number;
  analyzing: string | null;
  baseUrl: string;
  onAnalyze: () => void;
  onResolveIssue: (issueId: string) => Promise<void>;
  onDeleteRun: (runId: string) => Promise<void>;
  getScoreColor: (score: number | null) => string;
  getSeverityBadge: (severity: string) => React.ReactNode;
}

const FlowResultCard: React.FC<FlowResultCardProps> = ({
  flowId,
  config,
  run,
  flowIssues,
  criticalCount,
  warningCount,
  analyzing,
  baseUrl,
  onAnalyze,
  onResolveIssue,
  onDeleteRun,
  getScoreColor,
  getSeverityBadge,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fixingAll, setFixingAll] = useState(false);

  const totalIssues = flowIssues.length;

  const handleFixAllIssues = async () => {
    if (flowIssues.length === 0) return;
    
    setFixingAll(true);
    
    // Generate a combined prompt for all issues
    const combinedPrompt = generateCombinedFixPrompt(flowId, flowIssues);
    
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(combinedPrompt);
      toast.success('Fix-Prompt in Zwischenablage kopiert! Füge ihn in ChatGPT ein.', { duration: 5000 });
    } catch (err) {
      // Fallback for clipboard API
      toast.info('Fix-Prompt generiert - siehe Konsole', { duration: 5000 });
      console.log('Fix Prompt:', combinedPrompt);
    }
    
    setFixingAll(false);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className={`transition-shadow hover:shadow-lg ${isExpanded ? 'ring-2 ring-primary' : ''}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className={`h-5 w-5 ${run?.overall_score && run.overall_score >= 60 ? 'text-green-500' : run?.overall_score ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <CardTitle className="text-lg">{config.name}</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                {/* Analyze Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnalyze();
                  }}
                  disabled={!!analyzing}
                  className="h-8"
                >
                  {analyzing === flowId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                {run?.overall_score !== null && run?.overall_score !== undefined && (
                  <Badge variant={run.overall_score < 50 ? "destructive" : "secondary"} className="text-sm px-3 py-1">
                    Score: {run.overall_score}/100
                  </Badge>
                )}
                {totalIssues > 0 && (
                  <Badge variant="outline" className="text-sm">
                    {totalIssues} Issues ({criticalCount} kritisch)
                  </Badge>
                )}
                <div className="flex items-center gap-2">
                  {/* Copy Analyse-Prompt Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    title="Analyse-Prompt kopieren"
                    onClick={async (e) => { 
                      e.stopPropagation(); 
                      const prompt = `Analysiere den Flow "${config.name}" (${flowId}) auf UX/Conversion-Probleme.
                      
Aktueller Score: ${run?.overall_score ?? 'Nicht analysiert'}/100
- Mobile: ${run?.performance_score ?? '-'}/100
- Conversion: ${run?.conversion_score ?? '-'}/100  
- UX: ${run?.ux_score ?? '-'}/100

${run?.ai_summary ? `Zusammenfassung: ${run.ai_summary}` : ''}

Gefundene Issues: ${flowIssues.length} (${criticalCount} kritisch)
${flowIssues.slice(0, 5).map(i => `- [${i.severity}] ${i.title}`).join('\n')}

Bitte gib mir konkrete Code-Fixes für die kritischsten Probleme.`;
                      await navigator.clipboard.writeText(prompt);
                      toast.success('Analyse-Prompt kopiert!');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Detail Scores - Always Visible */}
            {run && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Mobile:</span>
                  <span className={`font-bold ${getScoreColor(run.performance_score)}`}>
                    {run.performance_score || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Conversion:</span>
                  <span className={`font-bold ${getScoreColor(run.conversion_score)}`}>
                    {run.conversion_score || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">UX:</span>
                  <span className={`font-bold ${getScoreColor(run.ux_score)}`}>
                    {run.ux_score || 0}
                  </span>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {new Date(run.created_at).toLocaleString('de-CH', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
            
            {run?.ai_summary && (
              <CardDescription className="mt-2 line-clamp-2">
                {run.ai_summary}
              </CardDescription>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Score Bars */}
            {run && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <Smartphone className="h-4 w-4" /> Mobile
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(run.performance_score)}`}>
                    {run.performance_score || 0}/100
                  </div>
                  <div className="w-full mt-2">
                    <Progress value={run.performance_score || 0} className="h-2 w-full" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="h-4 w-4" /> Conversion
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(run.conversion_score)}`}>
                    {run.conversion_score || 0}/100
                  </div>
                  <div className="w-full mt-2">
                    <Progress value={run.conversion_score || 0} className="h-2 w-full" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                    <Zap className="h-4 w-4" /> UX
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(run.ux_score)}`}>
                    {run.ux_score || 0}/100
                  </div>
                  <div className="w-full mt-2">
                    <Progress value={run.ux_score || 0} className="h-2 w-full" />
                  </div>
                </div>
              </div>
            )}

            {/* Issues List */}
            {flowIssues.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Gefundene Issues ({flowIssues.length})
                  </h4>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleFixAllIssues}
                    disabled={fixingAll}
                  >
                    {fixingAll ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wrench className="h-4 w-4 mr-2" />
                    )}
                    Alle fixen (Prompt kopieren)
                  </Button>
                </div>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2 pb-4">
                    {flowIssues.map(issue => (
                      <IssueCard 
                        key={issue.id} 
                        issue={issue} 
                        flowConfig={config}
                        getSeverityBadge={getSeverityBadge}
                        onResolve={() => onResolveIssue(issue.id)}
                      />
                    ))}
                  </div>
                </ScrollArea>

                {/* Verbesserungs-Prompt Button - nur sichtbar wenn Score < 95 */}
                {run && (run.overall_score || 0) < 95 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={async () => {
                      const prompt = `# UX/Conversion Optimierung für Flow: ${config.name}

Aktueller Score: ${run.overall_score}/100
- Mobile: ${run.performance_score || 0}/100  
- Conversion: ${run.conversion_score || 0}/100
- UX: ${run.ux_score || 0}/100

${run.ai_summary ? `## AI-Zusammenfassung:\n${run.ai_summary}\n` : ''}

## Gefundene Issues (${flowIssues.length}):
${flowIssues.map(i => `- [${i.severity.toUpperCase()}] ${i.title}: ${i.description || ''}`).join('\n')}

## Aufgabe:
Gib mir konkrete Code-Fixes für die oben genannten Issues. Fokussiere auf:
1. Kritische Issues zuerst
2. Mobile Touch-Targets (min 44x44px)
3. CTA-Klarheit und Conversion-Optimierung
4. Trust-Elemente und Social Proof
5. Form-UX und Fehlerbehandlung`;
                      await navigator.clipboard.writeText(prompt);
                      toast.success('Verbesserungs-Prompt kopiert!');
                    }}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Verbesserungs-Prompt kopieren
                  </Button>
                )}
              </div>
            )}

            {flowIssues.length === 0 && run && (
              <div className="text-center py-6 text-green-600 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">
                  {(run.overall_score || 0) >= 95 ? 'GOLD Level erreicht! 🏆' : 'Keine offenen Issues!'}
                </p>
                {(run.overall_score || 0) < 95 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Score: {run.overall_score}/100 - Noch {95 - (run.overall_score || 0)} Punkte bis GOLD
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant={run ? "outline" : "default"}
                size="sm"
                onClick={onAnalyze}
                disabled={!!analyzing}
                className="flex-1"
              >
                {analyzing === flowId ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {run ? 'Erneut analysieren' : 'Jetzt analysieren'}
              </Button>
              {run && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`${baseUrl}/umzugsofferten?v=${flowId.replace('umzugsofferten-', '')}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-2" />
                      Live ansehen
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDeleteRun(run.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Löschen
                  </Button>
                </>
              )}
            </div>

            {/* Last Analysis Timestamp */}
            {run && (
              <div className="text-xs text-muted-foreground text-right">
                Letzte Analyse: {new Date(run.created_at).toLocaleString('de-CH')}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

// Generate combined fix prompt for all issues of a flow
const generateCombinedFixPrompt = (flowId: string, issues: UxIssue[]): string => {
  const issueList = issues.map((issue, index) => `
${index + 1}. **${issue.title}** (${issue.severity})
   - Kategorie: ${issue.category}
   - Step: ${issue.step_number || 'Gesamter Flow'}
   - Beschreibung: ${issue.description || 'Keine'}
   - Empfehlung: ${issue.recommendation || 'Keine'}`).join('\n');

  return `# UX/Conversion Fix für Flow: ${flowId}

Bitte behebe die folgenden ${issues.length} Issues in meinem React/Tailwind Projekt:

## Gefundene Issues:
${issueList}

## Anforderungen:
1. Zeige mir für jeden Issue den konkreten Code-Fix
2. Nutze Tailwind CSS für Styling-Änderungen
3. Stelle sicher, dass alle Touch-Targets mindestens 44x44 Pixel sind
4. Füge hilfreiche Fehlermeldungen und Feedback hinzu
5. Optimiere die Conversion durch bessere CTAs und Progress-Indikatoren

Bitte gib mir die Änderungen als Code-Diffs aus.`;
};

type FlowFilterType = 'all' | 'main' | 'variants';
type SortOption = 'name' | 'score' | 'issues' | 'date';
type SortDirection = 'asc' | 'desc';

// Base URL options for analysis
const BASE_URL_OPTIONS = [
  { value: 'https://www.umzugscheck.ch', label: 'Production (umzugscheck.ch)' },
  { value: window.location.origin, label: `Preview (${window.location.host})` },
];

// Running analysis tracking
interface RunningAnalysis {
  flowId: string;
  flowName: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: Date;
  stepsCompleted?: number;
  totalSteps?: number;
}

const AutoFlowDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [runs, setRuns] = useState<AnalysisRun[]>([]);
  const [issues, setIssues] = useState<UxIssue[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertSettings, setAlertSettings] = useState<AlertSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [flowFilter, setFlowFilter] = useState<FlowFilterType>('all');
  const [selectedFlowNumber, setSelectedFlowNumber] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [runningAnalyses, setRunningAnalyses] = useState<RunningAnalysis[]>([]);
  
  // URL configuration - Preview vs Production
  const PREVIEW_URL = 'https://preview--umzugscheckv2.lovable.app';
  const PRODUCTION_URL = 'https://umzugscheck.ch';
  const [usePreview, setUsePreview] = useState<boolean>(true); // Default to Preview for instant testing
  const baseUrl = usePreview ? PREVIEW_URL : PRODUCTION_URL;

  // Subscribe to realtime updates for running analyses
  useEffect(() => {
    const channel = supabase
      .channel('analysis-progress')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'flow_analysis_runs'
        },
        (payload) => {
          const record = payload.new as any;
          if (!record) return;
          
          if (payload.eventType === 'INSERT' && record.status === 'running') {
            // New analysis started
            setRunningAnalyses(prev => {
              const exists = prev.some(a => a.flowId === record.flow_id);
              if (exists) return prev;
              return [...prev, {
                flowId: record.flow_id,
                flowName: record.flow_name || FLOW_CONFIGS[record.flow_id]?.name || record.flow_id,
                status: 'running',
                startedAt: new Date(record.created_at),
                stepsCompleted: record.steps_captured || 0,
                totalSteps: record.total_steps || FLOW_CONFIGS[record.flow_id]?.steps || 4,
              }];
            });
          } else if (payload.eventType === 'UPDATE') {
            if (record.status === 'completed' || record.status === 'failed') {
              // Analysis finished - remove from running after a short delay
              setTimeout(() => {
                setRunningAnalyses(prev => prev.filter(a => a.flowId !== record.flow_id));
              }, 3000);
              // Refresh data
              fetchData(false); // Silent refresh - no loading state
            } else {
              // Update progress
              setRunningAnalyses(prev => prev.map(a => 
                a.flowId === record.flow_id 
                  ? { ...a, stepsCompleted: record.steps_captured || 0, status: record.status }
                  : a
              ));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Get filtered and sorted flows based on filter and sort settings
  const getFilteredFlows = () => {
    const filtered = Object.entries(FLOW_CONFIGS).filter(([flowId, config]) => {
      // Filter by main vs variants
      const isMainFlow = flowId.startsWith('umzugsofferten-');
      const isVariant = !isMainFlow;
      
      if (flowFilter === 'main' && !isMainFlow) return false;
      if (flowFilter === 'variants' && isMainFlow) return false;
      
      // Filter by flow number if selected
      if (selectedFlowNumber !== null) {
        const flowNumberMatch = flowId.match(/v(\d+)/i);
        if (flowNumberMatch) {
          const flowNum = parseInt(flowNumberMatch[1], 10);
          if (flowNum !== selectedFlowNumber) return false;
        } else {
          return false;
        }
      }
      
      return true;
    });

    // Sort flows
    filtered.sort((a, b) => {
      const [flowIdA, configA] = a;
      const [flowIdB, configB] = b;
      const runA = latestRuns[flowIdA];
      const runB = latestRuns[flowIdB];
      const issuesA = issues.filter(i => i.flow_id === flowIdA);
      const issuesB = issues.filter(i => i.flow_id === flowIdB);

      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = configA.name.localeCompare(configB.name, 'de');
          break;
        case 'score':
          const scoreA = runA?.overall_score ?? -1;
          const scoreB = runB?.overall_score ?? -1;
          comparison = scoreB - scoreA; // Higher score first by default
          break;
        case 'issues':
          const criticalA = issuesA.filter(i => i.severity === 'critical').length;
          const criticalB = issuesB.filter(i => i.severity === 'critical').length;
          comparison = criticalB - criticalA; // More issues first by default
          break;
        case 'date':
          const dateA = runA?.created_at ? new Date(runA.created_at).getTime() : 0;
          const dateB = runB?.created_at ? new Date(runB.created_at).getTime() : 0;
          comparison = dateB - dateA; // Newest first by default
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  // Get available flow numbers for filtering
  const getFlowNumbers = (): number[] => {
    const numbers = new Set<number>();
    Object.keys(FLOW_CONFIGS).forEach(flowId => {
      const match = flowId.match(/v(\d+)/i);
      if (match) numbers.add(parseInt(match[1], 10));
    });
    return Array.from(numbers).sort((a, b) => a - b);
  };

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (showLoading = true) => {
    // Only show loading on initial load, not on background refreshes
    if (showLoading) setLoading(true);
    try {
      const [runsRes, issuesRes, alertsRes, settingsRes] = await Promise.all([
        supabase.from('flow_analysis_runs').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('flow_ux_issues').select('*').eq('is_resolved', false).order('created_at', { ascending: false }).limit(100),
        supabase.from('flow_alerts').select('*').eq('is_acknowledged', false).order('created_at', { ascending: false }).limit(20),
        supabase.from('flow_alert_settings').select('*'),
      ]);

      if (runsRes.data) setRuns(runsRes.data as AnalysisRun[]);
      if (issuesRes.data) setIssues(issuesRes.data as UxIssue[]);
      if (alertsRes.data) setAlerts(alertsRes.data as Alert[]);
      if (settingsRes.data) setAlertSettings(settingsRes.data as AlertSetting[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Only show error on initial load
      if (showLoading) toast.error('Fehler beim Laden der Daten');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Fire-and-forget analysis - runs in background, you can leave the page
  const runAnalysis = async (flowId: string) => {
    setAnalyzing(flowId);
    const flowConfig = FLOW_CONFIGS[flowId];
    
    // Add to running analyses immediately for UI feedback
    setRunningAnalyses(prev => {
      const exists = prev.some(a => a.flowId === flowId);
      if (exists) return prev;
      return [...prev, {
        flowId,
        flowName: flowConfig?.name || flowId,
        status: 'running',
        startedAt: new Date(),
        stepsCompleted: 0,
        totalSteps: flowConfig?.steps || 4,
      }];
    });

    try {
      console.log(`Starting analysis for ${flowId} with baseUrl: ${baseUrl}`);
      
      // Fire-and-forget: Don't await the result - it runs in background on the server
      supabase.functions.invoke('auto-analyze-flow', {
        body: { flowId, runType: 'manual', baseUrl }
      }).then(({ data, error }) => {
        if (error) {
          console.error('Analysis error:', error);
          toast.error('Analyse fehlgeschlagen');
          setRunningAnalyses(prev => prev.filter(a => a.flowId !== flowId));
        } else {
          toast.success(`Analyse abgeschlossen: Score ${data?.overallScore || '-'}/100`);
          // Remove from running after delay (realtime will also handle this)
          setTimeout(() => {
            setRunningAnalyses(prev => prev.filter(a => a.flowId !== flowId));
          }, 2000);
          fetchData(false); // Silent refresh
        }
      }).catch(error => {
        console.error('Analysis error:', error);
        setRunningAnalyses(prev => prev.filter(a => a.flowId !== flowId));
      });

      // Clear the analyzing button state after a short delay to allow starting multiple
      setTimeout(() => {
        setAnalyzing(null);
      }, 500);
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analyse fehlgeschlagen');
      setAnalyzing(null);
      setRunningAnalyses(prev => prev.filter(a => a.flowId !== flowId));
    }
  };

  // Fire-and-forget all analyses - runs in background, you can leave the page
  const runAllAnalyses = async () => {
    setAnalyzing('all');
    const flowIds = Object.keys(FLOW_CONFIGS);
    
    // Add all to running analyses immediately for UI feedback
    const newRunning: RunningAnalysis[] = flowIds.map(flowId => ({
      flowId,
      flowName: FLOW_CONFIGS[flowId]?.name || flowId,
      status: 'running' as const,
      startedAt: new Date(),
      stepsCompleted: 0,
      totalSteps: FLOW_CONFIGS[flowId]?.steps || 4,
    }));
    setRunningAnalyses(prev => [...prev.filter(a => !flowIds.includes(a.flowId)), ...newRunning]);

    // Fire all analyses in parallel - they run in background on the server
    flowIds.forEach(flowId => {
      supabase.functions.invoke('auto-analyze-flow', {
        body: { flowId, runType: 'scheduled', baseUrl }
      }).then(({ error }) => {
        if (error) {
          console.error(`Error analyzing ${flowId}:`, error);
          setRunningAnalyses(prev => prev.filter(a => a.flowId !== flowId));
        }
      }).catch(error => {
        console.error(`Error analyzing ${flowId}:`, error);
        setRunningAnalyses(prev => prev.filter(a => a.flowId !== flowId));
      });
    });

    // Clear analyzing button state after a short delay
    setTimeout(() => {
      setAnalyzing(null);
    }, 1000);
  };

  const acknowledgeAlert = async (alertId: string) => {
    await supabase.from('flow_alerts').update({ is_acknowledged: true, acknowledged_at: new Date().toISOString() }).eq('id', alertId);
    setAlerts(alerts.filter(a => a.id !== alertId));
  };

  const resolveIssue = async (issueId: string) => {
    await supabase.from('flow_ux_issues').update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq('id', issueId);
    setIssues(issues.filter(i => i.id !== issueId));
    toast.success('Issue als gelöst markiert');
  };

  // Cancel a running analysis
  const cancelAnalysis = async (flowId: string) => {
    try {
      // Update status to 'cancelled' in DB
      await supabase
        .from('flow_analysis_runs')
        .update({ status: 'cancelled', completed_at: new Date().toISOString() })
        .eq('flow_id', flowId)
        .eq('status', 'running');
      
      // Remove from running analyses
      setRunningAnalyses(prev => prev.filter(a => a.flowId !== flowId));
      toast.success('Analyse abgebrochen');
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Abbrechen fehlgeschlagen');
    }
  };

  // Cancel all running analyses
  const cancelAllAnalyses = async () => {
    try {
      await supabase
        .from('flow_analysis_runs')
        .update({ status: 'cancelled', completed_at: new Date().toISOString() })
        .eq('status', 'running');
      
      setRunningAnalyses([]);
      toast.success('Alle Analysen abgebrochen');
    } catch (error) {
      console.error('Cancel all error:', error);
      toast.error('Abbrechen fehlgeschlagen');
    }
  };

  // Delete an analysis run
  const deleteRun = async (runId: string) => {
    try {
      // Delete related issues first
      await supabase.from('flow_ux_issues').delete().eq('run_id', runId);
      // Delete the run
      await supabase.from('flow_analysis_runs').delete().eq('id', runId);
      
      setRuns(prev => prev.filter(r => r.id !== runId));
      toast.success('Analyse gelöscht');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Löschen fehlgeschlagen');
    }
  };

  // Get latest run per flow
  const getLatestRuns = () => {
    const latest: Record<string, AnalysisRun> = {};
    for (const run of runs) {
      if (!latest[run.flow_id] || new Date(run.created_at) > new Date(latest[run.flow_id].created_at)) {
        latest[run.flow_id] = run;
      }
    }
    return latest;
  };

  const latestRuns = getLatestRuns();

  // Calculate overall stats
  const overallStats = {
    totalFlows: Object.keys(FLOW_CONFIGS).length,
    analyzedFlows: Object.keys(latestRuns).length,
    avgScore: Object.values(latestRuns).filter(r => r.overall_score).reduce((acc, r) => acc + (r.overall_score || 0), 0) / Math.max(1, Object.values(latestRuns).filter(r => r.overall_score).length),
    criticalIssues: issues.filter(i => i.severity === 'critical').length,
    warningIssues: issues.filter(i => i.severity === 'warning').length,
    unacknowledgedAlerts: alerts.length,
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Kritisch</Badge>;
      case 'warning':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><AlertTriangle className="h-3 w-3 mr-1" />Warnung</Badge>;
      default:
        return <Badge variant="secondary"><Info className="h-3 w-3 mr-1" />Info</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">AutoFlow Analyse Dashboard</h2>
          <p className="text-muted-foreground">Automatische UX/Conversion-Analyse aller Flows</p>
          <div className="mt-2 flex items-center gap-3">
            {/* Quick Preview/Production Toggle */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={usePreview ? "default" : "ghost"}
                size="sm"
                onClick={() => setUsePreview(true)}
                className="h-7 px-3 text-xs"
              >
                🔵 Preview
              </Button>
              <Button
                variant={!usePreview ? "default" : "ghost"}
                size="sm"
                onClick={() => setUsePreview(false)}
                className="h-7 px-3 text-xs"
              >
                🟢 Production
              </Button>
            </div>
            <code className={`px-2 py-0.5 rounded text-xs ${usePreview ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}`}>
              {baseUrl}
            </code>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchData(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
          <Button onClick={runAllAnalyses} disabled={!!analyzing}>
            {analyzing === 'all' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Alle analysieren
          </Button>
        </div>
      </div>

      {/* Running Analyses Progress Banner */}
      {runningAnalyses.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <span className="font-medium">{runningAnalyses.length} Analyse{runningAnalyses.length > 1 ? 'n' : ''} laufen im Hintergrund</span>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline">Du kannst die Seite verlassen</Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={cancelAllAnalyses}
                  className="h-7"
                >
                  <StopCircle className="h-4 w-4 mr-1" />
                  Alle stoppen
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {runningAnalyses.map(analysis => {
                const progress = analysis.totalSteps 
                  ? Math.round((analysis.stepsCompleted || 0) / analysis.totalSteps * 100)
                  : 0;
                const elapsed = Math.round((Date.now() - analysis.startedAt.getTime()) / 1000);
                
                return (
                  <div key={analysis.flowId} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{analysis.flowName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Step {analysis.stepsCompleted || 0}/{analysis.totalSteps || '?'} • {elapsed}s
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelAnalysis(analysis.flowId)}
                          className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full">
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-red-500" />
              <span className="font-medium">{alerts.length} ungelesene Alerts</span>
              <Button variant="link" className="text-red-600" onClick={() => setActiveTab('alerts')}>
                Anzeigen <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{overallStats.analyzedFlows}/{overallStats.totalFlows}</div>
            <div className="text-sm text-muted-foreground">Flows analysiert</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className={`text-2xl font-bold ${getScoreColor(overallStats.avgScore)}`}>
              {overallStats.avgScore ? Math.round(overallStats.avgScore) : '-'}/100
            </div>
            <div className="text-sm text-muted-foreground">Ø Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-500">{overallStats.criticalIssues}</div>
            <div className="text-sm text-muted-foreground">Kritische Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-500">{overallStats.warningIssues}</div>
            <div className="text-sm text-muted-foreground">Warnungen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{runs.length}</div>
            <div className="text-sm text-muted-foreground">Analyse-Runs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-500">{overallStats.unacknowledgedAlerts}</div>
            <div className="text-sm text-muted-foreground">Offene Alerts</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Übersicht
          </TabsTrigger>
          <TabsTrigger value="issues">
            <AlertCircle className="h-4 w-4 mr-2" />
            Issues ({issues.length})
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4 mr-2" />
            Alerts ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            Verlauf
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Calendar className="h-4 w-4 mr-2" />
            Einstellungen
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Filter & Sort Controls */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                
                {/* Flow Type Filter */}
                <div className="flex gap-1">
                  <Button 
                    variant={flowFilter === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFlowFilter('all')}
                  >
                    Alle ({Object.keys(FLOW_CONFIGS).length})
                  </Button>
                  <Button 
                    variant={flowFilter === 'main' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFlowFilter('main')}
                  >
                    Hauptflows ({Object.keys(CENTRAL_FLOW_CONFIGS).length})
                  </Button>
                  <Button 
                    variant={flowFilter === 'variants' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFlowFilter('variants')}
                  >
                    Sub-Varianten ({Object.keys(SUB_VARIANT_CONFIGS).length})
                  </Button>
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-border" />
                
                {/* Flow Number Filter */}
                <div className="flex gap-1 flex-wrap">
                  <Button 
                    variant={selectedFlowNumber === null ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => setSelectedFlowNumber(null)}
                  >
                    Alle
                  </Button>
                  {getFlowNumbers().map(num => (
                    <Button 
                      key={num}
                      variant={selectedFlowNumber === num ? 'secondary' : 'ghost'} 
                      size="sm"
                      onClick={() => setSelectedFlowNumber(num)}
                    >
                      V{num}
                    </Button>
                  ))}
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-border" />

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Sortieren:</span>
                </div>
                <div className="flex gap-1">
                  {[
                    { id: 'name', label: 'Name' },
                    { id: 'score', label: 'Score' },
                    { id: 'issues', label: 'Issues' },
                    { id: 'date', label: 'Datum' },
                  ].map(option => (
                    <Button 
                      key={option.id}
                      variant={sortBy === option.id ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => {
                        if (sortBy === option.id) {
                          setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy(option.id as SortOption);
                          setSortDirection('asc');
                        }
                      }}
                      className="flex items-center gap-1"
                    >
                      {option.label}
                      {sortBy === option.id && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flow Cards */}
          <div className="space-y-4">
            {getFilteredFlows().length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>Keine Flows für diesen Filter gefunden.</p>
                </CardContent>
              </Card>
            ) : (
              getFilteredFlows().map(([flowId, config]) => {
                const run = latestRuns[flowId];
                const flowIssues = issues.filter(i => i.flow_id === flowId);
                const criticalCount = flowIssues.filter(i => i.severity === 'critical').length;
                const warningCount = flowIssues.filter(i => i.severity === 'warning').length;
                
                return (
                  <FlowResultCard
                    key={flowId}
                    flowId={flowId}
                    config={config}
                    run={run}
                    flowIssues={flowIssues}
                    criticalCount={criticalCount}
                    warningCount={warningCount}
                    analyzing={analyzing}
                    baseUrl={baseUrl}
                    onAnalyze={() => runAnalysis(flowId)}
                    onResolveIssue={resolveIssue}
                    onDeleteRun={deleteRun}
                    getScoreColor={getScoreColor}
                    getSeverityBadge={getSeverityBadge}
                  />
                );
              })
            )}
          </div>

          {/* Stats Summary for current filter */}
          <div className="text-sm text-muted-foreground text-center">
            Zeige {getFilteredFlows().length} von {Object.keys(FLOW_CONFIGS).length} Flows
          </div>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>Offene UX-Issues</CardTitle>
              <CardDescription>Von der AI erkannte Probleme nach Priorität sortiert</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {issues.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                      <p>Keine offenen Issues!</p>
                    </div>
                  ) : (
                    issues.map(issue => (
                      <IssueCard 
                        key={issue.id} 
                        issue={issue} 
                        flowConfig={FLOW_CONFIGS[issue.flow_id as keyof typeof FLOW_CONFIGS]}
                        getSeverityBadge={getSeverityBadge}
                        onResolve={() => resolveIssue(issue.id)}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Aktive Alerts</CardTitle>
              <CardDescription>Automatische Benachrichtigungen bei Problemen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Keine aktiven Alerts</p>
                  </div>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className={`border rounded-lg p-4 ${alert.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {alert.severity === 'critical' ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            )}
                            <span className="font-medium">{alert.title}</span>
                          </div>
                          {alert.message && (
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(alert.created_at).toLocaleString('de-CH')}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                          Erledigt
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Analyse-Verlauf</CardTitle>
              <CardDescription>Alle durchgeführten Analysen</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {runs.map(run => (
                    <div key={run.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${FLOW_CONFIGS[run.flow_id as keyof typeof FLOW_CONFIGS]?.color || 'bg-gray-500'}`} />
                        <div>
                          <div className="font-medium">{run.flow_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(run.created_at).toLocaleString('de-CH')} • {run.run_type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {run.status === 'completed' ? (
                          <>
                            <span className={`text-lg font-bold ${getScoreColor(run.overall_score)}`}>
                              {run.overall_score}/100
                            </span>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </>
                        ) : run.status === 'running' ? (
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Base URL Settings - NEW */}
            <Card className="md:col-span-2 border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Analyse-Ziel URL
                </CardTitle>
                <CardDescription>
                  Wähle welche Umgebung analysiert werden soll. 
                  <span className="text-destructive font-medium"> WICHTIG: Die Seiten müssen auf der gewählten URL existieren!</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Umgebung wählen</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={usePreview ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUsePreview(true)}
                      className="flex-1 min-w-[200px]"
                    >
                      🔵 Preview (Lovable)
                    </Button>
                    <Button
                      variant={!usePreview ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUsePreview(false)}
                      className="flex-1 min-w-[200px]"
                    >
                      🟢 Production (Live)
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aktuelle URL: <code className="bg-muted px-2 py-1 rounded text-xs">{baseUrl}</code>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Preview:</strong> Änderungen sind sofort sichtbar ohne Publish<br/>
                    <strong>Production:</strong> Nur publizierte Änderungen werden analysiert
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert-Einstellungen</CardTitle>
                <CardDescription>Automatische Benachrichtigungen konfigurieren</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Kritische Issues</Label>
                      <p className="text-sm text-muted-foreground">Bei neuen kritischen Issues benachrichtigen</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Score-Abfall</Label>
                      <p className="text-sm text-muted-foreground">Bei Score-Rückgang &gt;10% warnen</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Performance-Probleme</Label>
                      <p className="text-sm text-muted-foreground">Bei Ladezeit-Problemen warnen</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Label>E-Mail für Alerts</Label>
                  <Input placeholder="email@example.com" className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automatische Analyse</CardTitle>
                <CardDescription>Geplante Analysen einrichten</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tägliche Analyse</Label>
                      <p className="text-sm text-muted-foreground">Alle Flows täglich um 06:00 analysieren</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Wöchentlicher Report</Label>
                      <p className="text-sm text-muted-foreground">Wöchentliche Zusammenfassung per E-Mail</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Nach Deployment</Label>
                      <p className="text-sm text-muted-foreground">Automatisch nach jedem Deploy analysieren</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutoFlowDashboard;
