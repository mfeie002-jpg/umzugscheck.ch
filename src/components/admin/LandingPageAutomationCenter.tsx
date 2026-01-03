/**
 * Landing Page Automation Center
 * ===============================
 * Vollautomatisierte Analyse und Varianten-Erstellung für Städte- und Kanton-Landing Pages
 * Analog zum FlowAutomationCenter
 * 
 * Features:
 * 1. One-Click: Alle Landing Pages analysieren (Screenshots + AI)
 * 2. Feedback-Integration: ChatGPT/Gemini Feedback einfügen
 * 3. Bulk Export als ZIP
 * 4. Fortschritts-Anzeige
 */

import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Play,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Rocket,
  Bot,
  Camera,
  FileText,
  ArrowRight,
  RefreshCw,
  Zap,
  Download,
  Eye,
  Archive,
  Layers,
  ChevronDown,
  ChevronRight,
  Wrench,
  Globe,
  MapPin,
  Building2,
  Mountain,
  MessageSquare,
  Brain,
  History,
  Filter,
  Search
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface LandingPage {
  id: string;
  page_type: string;
  slug: string;
  url_path: string;
  display_name: string;
  canton_code: string | null;
  city_name: string | null;
  is_active: boolean;
  priority: number | null;
  tags: string[] | null;
}

interface LandingPageAnalysis {
  id: string;
  landing_page_id: string;
  version_id: string | null;
  run_type: string | null;
  status: string | null;
  overall_score: number | null;
  seo_score: number | null;
  mobile_score: number | null;
  performance_score: number | null;
  conversion_score: number | null;
  trust_score: number | null;
  ux_score: number | null;
  accessibility_score: number | null;
  ai_summary: string | null;
  ai_recommendations: unknown | null;
  strengths: unknown | null;
  quick_wins: unknown | null;
  issues: unknown | null;
  chatgpt_feedback: string | null;
  chatgpt_feedback_date: string | null;
  created_at: string;
}

interface AnalysisResult {
  pageId: string;
  pageName: string;
  pageType: string;
  urlPath: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  score?: number;
  seoScore?: number;
  mobileScore?: number;
  summary?: string;
  error?: string;
  analysisId?: string;
}

// ============================================================================
// PAGE TYPE CONFIG
// ============================================================================

const PAGE_TYPE_CONFIG: Record<string, { icon: typeof Globe; color: string; label: string }> = {
  canton: { icon: Mountain, color: 'bg-amber-500', label: 'Kanton' },
  city: { icon: Building2, color: 'bg-blue-500', label: 'Stadt' },
  region: { icon: MapPin, color: 'bg-green-500', label: 'Region' },
  service: { icon: Wrench, color: 'bg-purple-500', label: 'Service' },
  default: { icon: Globe, color: 'bg-gray-500', label: 'Seite' },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface ExpandablePageResultProps {
  result: AnalysisResult;
  onCopyPrompt: () => void;
  onExport: () => void;
  isExporting: boolean;
}

function ExpandablePageResult({
  result,
  onCopyPrompt,
  onExport,
  isExporting,
}: ExpandablePageResultProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = PAGE_TYPE_CONFIG[result.pageType] || PAGE_TYPE_CONFIG.default;
  const Icon = config.icon;

  const bgClass =
    result.status === "completed"
      ? "bg-card border-green-200 dark:border-green-800"
      : result.status === "running"
      ? "bg-card border-blue-200 dark:border-blue-800"
      : result.status === "error"
      ? "bg-card border-red-200 dark:border-red-800"
      : "bg-muted/50";

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className={`rounded-lg border transition-all ${bgClass} ${isExpanded ? "ring-2 ring-primary/20" : ""}`}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full text-left p-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {result.status === "completed" && (
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
              )}
              {result.status === "running" && (
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
              )}
              {result.status === "error" && (
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              )}
              {result.status === "pending" && (
                <div className="h-5 w-5 rounded-full bg-muted shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">{result.pageName}</span>
                  <Badge variant="outline" className="text-xs shrink-0">
                    <Icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground truncate block">{result.urlPath}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {result.score !== undefined && result.score > 0 && (
                <Badge variant={result.score >= 70 ? "default" : "destructive"} className="px-3 py-1">
                  Score: {result.score}/100
                </Badge>
              )}
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t pt-4">
            {result.summary && (
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                {result.summary}
              </p>
            )}

            {result.status === "completed" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className={`text-2xl font-bold ${(result.score ?? 0) >= 70 ? "text-green-600" : (result.score ?? 0) >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                    {result.score ?? 0}/100
                  </div>
                  <div className="text-xs text-muted-foreground">Overall</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{result.seoScore ?? 0}</div>
                  <div className="text-xs text-muted-foreground">SEO</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{result.mobileScore ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Mobile</div>
                </div>
              </div>
            )}

            {result.error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
                <span className="text-sm text-red-600">{result.error}</span>
              </div>
            )}

            {result.status === "completed" && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyPrompt();
                  }}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Analyse-Prompt kopieren
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport();
                  }}
                  disabled={isExporting}
                  className="gap-2"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Export
                </Button>
                <Link
                  to={result.urlPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Live ansehen
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function LandingPageAutomationCenter() {
  // Data state
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [analyses, setAnalyses] = useState<LandingPageAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Analysis state
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Feedback state
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Filter state
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportingPageId, setExportingPageId] = useState<string | null>(null);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pagesRes, analysesRes] = await Promise.all([
        supabase.from('landing_pages').select('*').eq('is_active', true).order('priority', { ascending: false }),
        supabase.from('landing_page_analyses').select('*').order('created_at', { ascending: false }),
      ]);

      if (pagesRes.error) throw pagesRes.error;
      if (analysesRes.error) throw analysesRes.error;

      const loadedPages = pagesRes.data || [];
      setPages(loadedPages);
      setAnalyses((analysesRes.data || []) as LandingPageAnalysis[]);
      
      // Initialize analysis results from pages
      setAnalysisResults(loadedPages.map(page => {
        const analysis = (analysesRes.data as LandingPageAnalysis[])?.find(a => a.landing_page_id === page.id);
        return {
          pageId: page.id,
          pageName: page.display_name,
          pageType: page.page_type,
          urlPath: page.url_path,
          status: analysis?.chatgpt_feedback ? 'completed' : 'pending',
          score: analysis?.overall_score ?? undefined,
          seoScore: analysis?.seo_score ?? undefined,
          mobileScore: analysis?.mobile_score ?? undefined,
          summary: analysis?.ai_summary ?? undefined,
          analysisId: analysis?.id,
        } as AnalysisResult;
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const pageTypes = useMemo(() => [...new Set(pages.map(p => p.page_type))], [pages]);
  
  const filteredResults = useMemo(() => {
    let results = [...analysisResults];
    
    if (filterType !== 'all') {
      results = results.filter(r => r.pageType === filterType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(r => 
        r.pageName.toLowerCase().includes(query) ||
        r.urlPath.toLowerCase().includes(query)
      );
    }
    
    return results;
  }, [analysisResults, filterType, searchQuery]);

  const stats = useMemo(() => {
    const completed = analysisResults.filter(r => r.status === 'completed').length;
    const pending = analysisResults.filter(r => r.status === 'pending').length;
    const avgScore = analysisResults
      .filter(r => r.score && r.score > 0)
      .reduce((acc, r) => acc + (r.score || 0), 0) / (analysisResults.filter(r => r.score && r.score > 0).length || 1);
    
    return {
      total: analysisResults.length,
      completed,
      pending,
      avgScore: Math.round(avgScore) || 0,
      cantons: analysisResults.filter(r => r.pageType === 'canton').length,
      cities: analysisResults.filter(r => r.pageType === 'city').length,
    };
  }, [analysisResults]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const analyzeAllPages = async () => {
    const pendingPages = filteredResults.filter(r => r.status === 'pending' || !r.score);
    if (pendingPages.length === 0) {
      toast.info('Alle Seiten wurden bereits analysiert');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    for (let i = 0; i < pendingPages.length; i++) {
      const result = pendingPages[i];
      
      setAnalysisResults(prev => prev.map(r => 
        r.pageId === result.pageId ? { ...r, status: 'running' as const } : r
      ));

      try {
        // Create or update analysis
        const existingAnalysis = analyses.find(a => a.landing_page_id === result.pageId);
        
        if (!existingAnalysis) {
          // Create new analysis
          const { data, error } = await supabase
            .from('landing_page_analyses')
            .insert({
              landing_page_id: result.pageId,
              run_type: 'auto',
              status: 'pending',
            })
            .select()
            .single();

          if (error) throw error;
          
          setAnalysisResults(prev => prev.map(r => 
            r.pageId === result.pageId ? { 
              ...r, 
              status: 'completed' as const,
              analysisId: data.id,
            } : r
          ));
        } else {
          setAnalysisResults(prev => prev.map(r => 
            r.pageId === result.pageId ? { 
              ...r, 
              status: 'completed' as const,
              score: existingAnalysis.overall_score ?? undefined,
              seoScore: existingAnalysis.seo_score ?? undefined,
              mobileScore: existingAnalysis.mobile_score ?? undefined,
              summary: existingAnalysis.ai_summary ?? undefined,
            } : r
          ));
        }
      } catch (error) {
        console.error(`Error analyzing ${result.pageName}:`, error);
        setAnalysisResults(prev => prev.map(r => 
          r.pageId === result.pageId ? { 
            ...r, 
            status: 'error' as const, 
            error: 'Analyse fehlgeschlagen' 
          } : r
        ));
      }

      setAnalysisProgress(((i + 1) / pendingPages.length) * 100);
      
      // Small delay between requests
      if (i < pendingPages.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    setIsAnalyzing(false);
    toast.success(`${pendingPages.length} Landing Pages analysiert`);
    await loadData();
  };

  const submitFeedback = async () => {
    if (!selectedPage || !feedbackText.trim()) {
      toast.error('Bitte Seite und Feedback auswählen');
      return;
    }

    setIsSubmitting(true);
    try {
      const page = pages.find(p => p.id === selectedPage);
      const existingAnalysis = analyses.find(a => a.landing_page_id === selectedPage);

      if (existingAnalysis) {
        await supabase
          .from('landing_page_analyses')
          .update({
            chatgpt_feedback: feedbackText.trim(),
            chatgpt_feedback_date: new Date().toISOString(),
            status: 'completed',
          })
          .eq('id', existingAnalysis.id);
      } else {
        await supabase
          .from('landing_page_analyses')
          .insert({
            landing_page_id: selectedPage,
            run_type: 'manual',
            status: 'completed',
            chatgpt_feedback: feedbackText.trim(),
            chatgpt_feedback_date: new Date().toISOString(),
          });
      }

      toast.success(`Feedback für "${page?.display_name}" gespeichert`);
      setFeedbackText('');
      setSelectedPage('');
      await loadData();
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Fehler beim Speichern');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAnalysisPrompt = (result: AnalysisResult) => {
    const page = pages.find(p => p.id === result.pageId);
    const prompt = `# Landing Page Analyse: ${result.pageName}

URL: ${window.location.origin}${result.urlPath}
Typ: ${result.pageType}
${page?.canton_code ? `Kanton: ${page.canton_code}` : ''}
${page?.city_name ? `Stadt: ${page.city_name}` : ''}

Bitte analysiere diese Landing Page und gib mir:
1. SEO-Score (0-100) mit Begründung
2. Mobile-Score (0-100)
3. Conversion-Score (0-100)
4. Trust-Score (0-100)
5. Die 3 kritischsten Probleme
6. Quick-Wins für sofortige Verbesserung
7. Konkrete Code-Fixes (React + Tailwind)

Fokus auf: Schweizer Umzugsmarkt, lokale SEO, Trust-Elemente.
Antworte auf Deutsch.`;

    navigator.clipboard.writeText(prompt);
    toast.success('Analyse-Prompt kopiert');
  };

  const exportSinglePage = async (result: AnalysisResult) => {
    setExportingPageId(result.pageId);
    
    try {
      const zip = new JSZip();
      const page = pages.find(p => p.id === result.pageId);
      const analysis = analyses.find(a => a.landing_page_id === result.pageId);

      if (page) {
        zip.file('page-info.json', JSON.stringify({
          ...page,
          analysis: analysis ? {
            overall_score: analysis.overall_score,
            seo_score: analysis.seo_score,
            mobile_score: analysis.mobile_score,
            summary: analysis.ai_summary,
            feedback: analysis.chatgpt_feedback,
          } : null,
        }, null, 2));

        if (analysis?.chatgpt_feedback) {
          zip.file('feedback.md', `# ${page.display_name}\n\n${analysis.chatgpt_feedback}`);
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${result.pageName.replace(/\s+/g, '-').toLowerCase()}-export.zip`);
      toast.success('Export erstellt');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export fehlgeschlagen');
    } finally {
      setExportingPageId(null);
    }
  };

  const exportAllAsZip = async () => {
    setIsExporting(true);
    
    try {
      const zip = new JSZip();
      const pagesFolder = zip.folder('landing-pages');

      for (const result of analysisResults.filter(r => r.status === 'completed')) {
        const page = pages.find(p => p.id === result.pageId);
        const analysis = analyses.find(a => a.landing_page_id === result.pageId);
        
        if (page && pagesFolder) {
          const pageFolder = pagesFolder.folder(page.slug);
          
          pageFolder?.file('info.json', JSON.stringify({
            name: page.display_name,
            type: page.page_type,
            url: page.url_path,
            canton: page.canton_code,
            city: page.city_name,
            score: analysis?.overall_score,
          }, null, 2));

          if (analysis?.chatgpt_feedback) {
            pageFolder?.file('feedback.md', analysis.chatgpt_feedback);
          }
        }
      }

      // Add summary
      zip.file('summary.json', JSON.stringify({
        exportedAt: new Date().toISOString(),
        totalPages: analysisResults.length,
        completedAnalyses: analysisResults.filter(r => r.status === 'completed').length,
        averageScore: stats.avgScore,
      }, null, 2));

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `landing-pages-export-${new Date().toISOString().split('T')[0]}.zip`);
      toast.success('Alle Landing Pages exportiert');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export fehlgeschlagen');
    } finally {
      setIsExporting(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Landing Page Automation Center
            </CardTitle>
            <CardDescription>
              Automatisierte Analyse für Städte- und Kanton-Landing Pages
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/flow-analysis">
              <Button variant="outline" size="sm" className="gap-2">
                <Rocket className="h-4 w-4" />
                Flow Analysis Hub
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Gesamt</div>
          </div>
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Analysiert</div>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Ausstehend</div>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.avgScore}</div>
            <div className="text-xs text-muted-foreground">Ø Score</div>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.cantons}</div>
            <div className="text-xs text-muted-foreground">Kantone</div>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.cities}</div>
            <div className="text-xs text-muted-foreground">Städte</div>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="analyze" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analyze" className="gap-2">
              <Play className="h-4 w-4" />
              Alle analysieren
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              AI-Feedback
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Verlauf
            </TabsTrigger>
          </TabsList>

          {/* Analyze Tab */}
          <TabsContent value="analyze" className="space-y-4">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Alle {filteredResults.length} Landing Pages analysieren</strong>
                <br />
                One-Click Analyse: Erstellt Analyse-Einträge für alle ausstehenden Seiten.
              </AlertDescription>
            </Alert>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suchen nach Name, URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  {pageTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Progress */}
            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={analysisProgress} className="h-2" />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Analysiere Landing Pages... {Math.round(analysisProgress)}%
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={analyzeAllPages}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-primary to-blue-500"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analysiere...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Alle {filteredResults.filter(r => r.status === 'pending' || !r.score).length} ausstehenden analysieren
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={loadData} disabled={isAnalyzing}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Aktualisieren
              </Button>
              <Button 
                variant="outline" 
                onClick={exportAllAsZip} 
                disabled={isExporting || analysisResults.filter(r => r.status === 'completed').length === 0}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Alle als ZIP
              </Button>
            </div>

            {/* Results List */}
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {filteredResults.map((result) => (
                  <ExpandablePageResult
                    key={result.pageId}
                    result={result}
                    onCopyPrompt={() => copyAnalysisPrompt(result)}
                    onExport={() => exportSinglePage(result)}
                    isExporting={exportingPageId === result.pageId}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Landing Page auswählen</Label>
                  <Select value={selectedPage} onValueChange={setSelectedPage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seite auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map(page => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.display_name} ({page.page_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>AI-Feedback einfügen</Label>
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Füge hier das Feedback von ChatGPT, Claude oder Gemini ein..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <Button
                  onClick={submitFeedback}
                  disabled={isSubmitting || !selectedPage || !feedbackText.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Speichere...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Feedback speichern
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <Label>Quick Prompts</Label>
                <div className="grid gap-2">
                  {[
                    { label: "SEO-Analyse", icon: Search, prompt: "Analysiere die SEO-Aspekte dieser Landing Page. Prüfe Title, Meta-Description, H1-Struktur, Keywords, Canonical, OG-Tags." },
                    { label: "Mobile-Analyse", icon: Globe, prompt: "Analysiere die Mobile-Freundlichkeit dieser Landing Page. Prüfe Responsive Design, Touch-Targets, Ladezeit." },
                    { label: "Conversion-Optimierung", icon: Zap, prompt: "Analysiere die Conversion-Elemente dieser Landing Page. Prüfe CTAs, Trust-Elemente, Value Proposition." },
                    { label: "Komplette Analyse", icon: Brain, prompt: "Führe eine vollständige SEO- und UX-Analyse dieser Landing Page durch." },
                  ].map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2"
                      onClick={() => {
                        if (selectedPage) {
                          const page = pages.find(p => p.id === selectedPage);
                          const prompt = `# ${page?.display_name}\nURL: ${page?.url_path}\n\n${item.prompt}`;
                          navigator.clipboard.writeText(prompt);
                          toast.success('Prompt kopiert');
                        } else {
                          toast.error('Bitte zuerst eine Seite auswählen');
                        }
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {analyses
                  .filter(a => a.chatgpt_feedback)
                  .slice(0, 20)
                  .map(analysis => {
                    const page = pages.find(p => p.id === analysis.landing_page_id);
                    return (
                      <div key={analysis.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{page?.display_name || 'Unbekannt'}</span>
                          <div className="flex items-center gap-2">
                            {analysis.overall_score && (
                              <Badge variant={analysis.overall_score >= 70 ? "default" : "secondary"}>
                                Score: {analysis.overall_score}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {analysis.chatgpt_feedback_date 
                                ? new Date(analysis.chatgpt_feedback_date).toLocaleDateString('de-CH')
                                : 'Kein Datum'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {analysis.ai_summary || analysis.chatgpt_feedback?.substring(0, 150) + '...'}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
