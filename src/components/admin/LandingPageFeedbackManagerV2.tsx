import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageSquare, Plus, Save, Loader2, RefreshCw, FileText, Globe, Calendar, Sparkles, Eye, Trash2, Download, Copy,
  CheckCircle2, ExternalLink, TrendingUp, TrendingDown, AlertTriangle, Target, Zap, BarChart3, Brain, Lightbulb,
  ClipboardList, Filter, SortAsc, SortDesc, Search, Star, Award, Shield, Clock, ArrowUpRight, ArrowDownRight,
  Minus, ChevronDown, ChevronRight, Settings, Play, Pause, RotateCcw, FileJson, FileCode, Wand2, Layers,
  CheckSquare, Square, ListChecks, Gauge, Activity, PieChart, LineChart, Users, Mail, Bell, History, GitCompare
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// ============================================
// TYPES
// ============================================

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
  competitor_comparison: unknown | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface LandingPageVersion {
  id: string;
  landing_page_id: string;
  version_number: number;
  version_name: string | null;
  desktop_screenshot_url: string | null;
  mobile_screenshot_url: string | null;
  html_snapshot: string | null;
  markdown_content: string | null;
  created_at: string;
}

interface ScoreCategory {
  key: keyof LandingPageAnalysis;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// ============================================
// CONSTANTS
// ============================================

const FEEDBACK_SOURCES = [
  { value: 'chatgpt', label: 'ChatGPT', icon: Brain },
  { value: 'claude', label: 'Claude', icon: Sparkles },
  { value: 'gemini', label: 'Gemini', icon: Star },
  { value: 'perplexity', label: 'Perplexity', icon: Search },
  { value: 'manual', label: 'Manuell', icon: FileText },
];

const SCORE_CATEGORIES: ScoreCategory[] = [
  { key: 'overall_score', label: 'Overall', icon: Gauge, color: 'text-primary' },
  { key: 'seo_score', label: 'SEO', icon: Search, color: 'text-blue-500' },
  { key: 'mobile_score', label: 'Mobile', icon: Globe, color: 'text-purple-500' },
  { key: 'performance_score', label: 'Performance', icon: Zap, color: 'text-yellow-500' },
  { key: 'conversion_score', label: 'Conversion', icon: Target, color: 'text-green-500' },
  { key: 'trust_score', label: 'Trust', icon: Shield, color: 'text-cyan-500' },
  { key: 'ux_score', label: 'UX', icon: Users, color: 'text-pink-500' },
  { key: 'accessibility_score', label: 'A11y', icon: Eye, color: 'text-orange-500' },
];

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'score_desc', label: 'Score (hoch → tief)' },
  { value: 'score_asc', label: 'Score (tief → hoch)' },
  { value: 'date_desc', label: 'Neueste zuerst' },
  { value: 'date_asc', label: 'Älteste zuerst' },
  { value: 'priority_desc', label: 'Priorität (hoch → tief)' },
];

const QUICK_PROMPTS = [
  { label: "SEO-Analyse", prompt: "Analysiere die SEO-Aspekte dieser Landing Page. Prüfe Title, Meta-Description, H1-Struktur, Keywords, Canonical, OG-Tags und Schema.org Markup. Gib konkrete Verbesserungsvorschläge." },
  { label: "Conversion-Optimierung", prompt: "Analysiere die Conversion-Elemente dieser Landing Page. Prüfe CTAs, Formulare, Trust-Elemente, Social Proof, Urgency und Value Proposition. Wie kann die Conversion Rate verbessert werden?" },
  { label: "Mobile-Analyse", prompt: "Analysiere die Mobile-Freundlichkeit dieser Landing Page. Prüfe Responsive Design, Touch-Targets, Ladezeit, CLS, Mobile CTAs und Mobile-First Aspekte." },
  { label: "Wettbewerber-Vergleich", prompt: "Vergleiche diese Landing Page mit führenden Schweizer Umzugsportalen (movu.ch, localmove.ch). Was machen sie besser? Welche Best Practices fehlen?" },
  { label: "Trust & Credibility", prompt: "Analysiere die Trust-Elemente dieser Landing Page. Prüfe Bewertungen, Siegel, Garantien, Testimonials, Versicherungs-Hinweise und Unternehmensinfos." },
  { label: "Komplette Analyse", prompt: "Führe eine vollständige SEO- und UX-Analyse dieser Landing Page durch. Prüfe alle Aspekte: Meta-Tags, Struktur, Content, CTAs, Trust-Elemente, Mobile, Performance. Gib priorisierte Empfehlungen." },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getScoreColor = (score: number | null): string => {
  if (score === null) return 'text-muted-foreground';
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getScoreBadgeVariant = (score: number | null): "default" | "secondary" | "destructive" | "outline" => {
  if (score === null) return 'outline';
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  return 'destructive';
};

const getScoreTrend = (current: number | null, previous: number | null): { icon: React.ReactNode; color: string } => {
  if (current === null || previous === null) return { icon: <Minus className="w-3 h-3" />, color: 'text-muted-foreground' };
  if (current > previous) return { icon: <ArrowUpRight className="w-3 h-3" />, color: 'text-green-500' };
  if (current < previous) return { icon: <ArrowDownRight className="w-3 h-3" />, color: 'text-red-500' };
  return { icon: <Minus className="w-3 h-3" />, color: 'text-muted-foreground' };
};

const calculateAverageScore = (analysis: LandingPageAnalysis | null): number | null => {
  if (!analysis) return null;
  const scores = [
    analysis.seo_score,
    analysis.mobile_score,
    analysis.performance_score,
    analysis.conversion_score,
    analysis.trust_score,
    analysis.ux_score,
    analysis.accessibility_score,
  ].filter((s): s is number => s !== null);
  
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

// ============================================
// COMPONENTS
// ============================================

const ScoreRadar = ({ analysis }: { analysis: LandingPageAnalysis | null }) => {
  if (!analysis) return null;
  
  const scores = SCORE_CATEGORIES.filter(c => c.key !== 'overall_score').map(cat => ({
    ...cat,
    value: (analysis[cat.key] as number | null) ?? 0,
  }));

  return (
    <div className="grid grid-cols-4 gap-2">
      {scores.map((score) => (
        <div key={score.key} className="text-center p-2 rounded-lg bg-muted/50">
          <div className={`text-xl font-bold ${getScoreColor(score.value || null)}`}>
            {score.value || '-'}
          </div>
          <div className="text-xs text-muted-foreground">{score.label}</div>
        </div>
      ))}
    </div>
  );
};

const QuickWinsList = ({ items }: { items: unknown }) => {
  if (!items || !Array.isArray(items)) return null;
  
  return (
    <div className="space-y-2">
      {(items as string[]).slice(0, 5).map((item, index) => (
        <div key={index} className="flex items-start gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

const IssuesList = ({ items }: { items: unknown }) => {
  if (!items || !Array.isArray(items)) return null;
  
  return (
    <div className="space-y-2">
      {(items as Array<{ title?: string; description?: string; severity?: string }>).slice(0, 5).map((item, index) => (
        <div key={index} className="flex items-start gap-2 text-sm">
          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
            item.severity === 'critical' ? 'text-red-500' : 
            item.severity === 'warning' ? 'text-orange-500' : 'text-yellow-500'
          }`} />
          <span>{item.title || item.description || String(item)}</span>
        </div>
      ))}
    </div>
  );
};

const StrengthsList = ({ items }: { items: unknown }) => {
  if (!items || !Array.isArray(items)) return null;
  
  return (
    <div className="space-y-2">
      {(items as string[]).slice(0, 5).map((item, index) => (
        <div key={index} className="flex items-start gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

const BulkActionsBar = ({ 
  selectedCount, 
  onClearSelection, 
  onBulkAnalyze, 
  onBulkExport,
  onBulkDelete,
  isProcessing 
}: { 
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAnalyze: () => void;
  onBulkExport: () => void;
  onBulkDelete: () => void;
  isProcessing: boolean;
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border shadow-xl rounded-xl px-6 py-3 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-5 h-5 text-primary" />
        <span className="font-medium">{selectedCount} ausgewählt</span>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBulkAnalyze} disabled={isProcessing}>
          <Brain className="w-4 h-4 mr-1" />
          AI Analyse
        </Button>
        <Button variant="outline" size="sm" onClick={onBulkExport} disabled={isProcessing}>
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
        <Button variant="destructive" size="sm" onClick={onBulkDelete} disabled={isProcessing}>
          <Trash2 className="w-4 h-4 mr-1" />
          Löschen
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Abbrechen
        </Button>
      </div>
    </div>
  );
};

const StatsDashboard = ({ pages, analyses }: { pages: LandingPage[]; analyses: LandingPageAnalysis[] }) => {
  const stats = useMemo(() => {
    const withFeedback = analyses.filter(a => a.chatgpt_feedback);
    const withScores = analyses.filter(a => a.overall_score !== null);
    const avgScore = withScores.length > 0 
      ? Math.round(withScores.reduce((sum, a) => sum + (a.overall_score || 0), 0) / withScores.length)
      : null;
    
    const scoreDistribution = {
      excellent: withScores.filter(a => (a.overall_score || 0) >= 80).length,
      good: withScores.filter(a => (a.overall_score || 0) >= 60 && (a.overall_score || 0) < 80).length,
      needs_work: withScores.filter(a => (a.overall_score || 0) >= 40 && (a.overall_score || 0) < 60).length,
      poor: withScores.filter(a => (a.overall_score || 0) < 40).length,
    };
    
    return {
      totalPages: pages.length,
      pagesWithFeedback: withFeedback.length,
      pagesWithScores: withScores.length,
      avgScore,
      scoreDistribution,
      pendingAnalysis: pages.length - withFeedback.length,
    };
  }, [pages, analyses]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalPages}</div>
              <div className="text-xs text-muted-foreground">Seiten</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.pagesWithFeedback}</div>
              <div className="text-xs text-muted-foreground">Mit Feedback</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.pendingAnalysis}</div>
              <div className="text-xs text-muted-foreground">Ausstehend</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${getScoreColor(stats.avgScore)}`}>
                {stats.avgScore ?? '-'}
              </div>
              <div className="text-xs text-muted-foreground">Ø Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.scoreDistribution.excellent}</div>
              <div className="text-xs text-muted-foreground">Score 80+</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.scoreDistribution.poor}</div>
              <div className="text-xs text-muted-foreground">Score &lt;40</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export function LandingPageFeedbackManagerV2() {
  // State
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [analyses, setAnalyses] = useState<LandingPageAnalysis[]>([]);
  const [versions, setVersions] = useState<LandingPageVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Filters & Sorting
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterScoreRange, setFilterScoreRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority_desc');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  
  // Dialog States
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  // Selected Items
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<LandingPageAnalysis | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSource, setFeedbackSource] = useState('chatgpt');
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'list' | 'grid' | 'kanban'>('list');

  // ============================================
  // DATA LOADING
  // ============================================

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pagesRes, analysesRes, versionsRes] = await Promise.all([
        supabase.from('landing_pages').select('*').eq('is_active', true).order('priority', { ascending: false }),
        supabase.from('landing_page_analyses').select('*').order('created_at', { ascending: false }),
        supabase.from('landing_page_versions').select('*').order('version_number', { ascending: false }),
      ]);

      if (pagesRes.error) throw pagesRes.error;
      if (analysesRes.error) throw analysesRes.error;
      if (versionsRes.error) throw versionsRes.error;

      setPages(pagesRes.data || []);
      setAnalyses((analysesRes.data || []) as LandingPageAnalysis[]);
      setVersions(versionsRes.data || []);
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

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const pageTypes = useMemo(() => [...new Set(pages.map(p => p.page_type))], [pages]);
  
  const getPageAnalyses = (pageId: string) => analyses.filter(a => a.landing_page_id === pageId);
  
  // Get the best analysis: prioritize completed analyses with actual scores over pending ones with 0 scores
  const getLatestAnalysis = (pageId: string) => {
    const pageAnalyses = getPageAnalyses(pageId);
    if (pageAnalyses.length === 0) return undefined;
    
    // First try to find an analysis with actual scores (overall_score > 0 or has ai_summary/chatgpt_feedback)
    const withData = pageAnalyses.find(a => 
      (a.overall_score !== null && a.overall_score > 0) || 
      a.ai_summary || 
      a.chatgpt_feedback
    );
    if (withData) return withData;
    
    // Fallback to the most recent one
    return pageAnalyses[0];
  };
  
  const getLatestVersion = (pageId: string) => versions.filter(v => v.landing_page_id === pageId)[0];

  const filteredAndSortedPages = useMemo(() => {
    let result = [...pages];
    
    // Apply filters
    if (filterType !== 'all') {
      result = result.filter(p => p.page_type === filterType);
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(p => {
        const analysis = getLatestAnalysis(p.id);
        if (filterStatus === 'with_feedback') return !!analysis?.chatgpt_feedback;
        if (filterStatus === 'without_feedback') return !analysis?.chatgpt_feedback;
        if (filterStatus === 'with_scores') return analysis?.overall_score !== null;
        return true;
      });
    }
    
    if (filterScoreRange !== 'all') {
      result = result.filter(p => {
        const analysis = getLatestAnalysis(p.id);
        const score = analysis?.overall_score ?? -1;
        if (filterScoreRange === 'excellent') return score >= 80;
        if (filterScoreRange === 'good') return score >= 60 && score < 80;
        if (filterScoreRange === 'needs_work') return score >= 40 && score < 60;
        if (filterScoreRange === 'poor') return score >= 0 && score < 40;
        return true;
      });
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.display_name.toLowerCase().includes(query) ||
        p.url_path.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query)
      );
    }
    
    if (showOnlyPending) {
      result = result.filter(p => !getLatestAnalysis(p.id)?.chatgpt_feedback);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const analysisA = getLatestAnalysis(a.id);
      const analysisB = getLatestAnalysis(b.id);
      
      switch (sortBy) {
        case 'name_asc':
          return a.display_name.localeCompare(b.display_name);
        case 'name_desc':
          return b.display_name.localeCompare(a.display_name);
        case 'score_desc':
          return (analysisB?.overall_score ?? -1) - (analysisA?.overall_score ?? -1);
        case 'score_asc':
          return (analysisA?.overall_score ?? -1) - (analysisB?.overall_score ?? -1);
        case 'date_desc':
          return new Date(analysisB?.created_at || 0).getTime() - new Date(analysisA?.created_at || 0).getTime();
        case 'date_asc':
          return new Date(analysisA?.created_at || 0).getTime() - new Date(analysisB?.created_at || 0).getTime();
        case 'priority_desc':
          return (b.priority ?? 0) - (a.priority ?? 0);
        default:
          return 0;
      }
    });
    
    return result;
  }, [pages, analyses, filterType, filterStatus, filterScoreRange, searchQuery, sortBy, showOnlyPending]);

  // ============================================
  // ACTIONS
  // ============================================

  const createNewAnalysis = async (page: LandingPage) => {
    try {
      const latestVersion = getLatestVersion(page.id);
      
      const { data, error } = await supabase
        .from('landing_page_analyses')
        .insert({
          landing_page_id: page.id,
          version_id: latestVersion?.id || null,
          run_type: 'manual',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      setAnalyses(prev => [data as LandingPageAnalysis, ...prev]);
      toast.success(`Analyse für "${page.display_name}" erstellt`);
      
      setSelectedPage(page);
      setSelectedAnalysis(data as LandingPageAnalysis);
      setFeedbackText('');
      setFeedbackDialogOpen(true);
    } catch (error) {
      console.error('Error creating analysis:', error);
      toast.error('Fehler beim Erstellen');
    }
  };

  const saveFeedback = async () => {
    if (!selectedAnalysis || !feedbackText.trim()) {
      toast.error('Bitte Feedback eingeben');
      return;
    }

    setIsSavingFeedback(true);
    try {
      const { error } = await supabase
        .from('landing_page_analyses')
        .update({
          chatgpt_feedback: feedbackText.trim(),
          chatgpt_feedback_date: new Date().toISOString(),
          status: 'completed',
        })
        .eq('id', selectedAnalysis.id);

      if (error) throw error;

      setAnalyses(prev => prev.map(a => 
        a.id === selectedAnalysis.id 
          ? { ...a, chatgpt_feedback: feedbackText.trim(), chatgpt_feedback_date: new Date().toISOString(), status: 'completed' }
          : a
      ));

      toast.success('Feedback gespeichert!');
      setFeedbackDialogOpen(false);

      // Trigger AI analysis
      if (selectedPage) {
        analyzeFeedbackWithAI(selectedAnalysis.id, feedbackText.trim(), selectedPage.display_name, selectedPage.url_path);
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Fehler beim Speichern');
    } finally {
      setIsSavingFeedback(false);
    }
  };

  const analyzeFeedbackWithAI = async (analysisId: string, feedback: string, pageName: string, pageUrl: string) => {
    try {
      toast.info('AI analysiert...', { duration: 2000 });
      
      const { data, error } = await supabase.functions.invoke('analyze-feedback', {
        body: { feedback, pageName, pageUrl }
      });

      if (error) throw error;
      if (!data?.success || !data?.data) return;

      const extracted = data.data;

      await supabase.from('landing_page_analyses').update({
        ai_summary: extracted.summary || null,
        ai_recommendations: extracted.recommendations || null,
        issues: extracted.issues || null,
        quick_wins: extracted.quick_wins || null,
        strengths: extracted.strengths || null,
        overall_score: extracted.scores?.overall || null,
        seo_score: extracted.scores?.seo || null,
        mobile_score: extracted.scores?.mobile || null,
        performance_score: extracted.scores?.performance || null,
        conversion_score: extracted.scores?.conversion || null,
        trust_score: extracted.scores?.trust || null,
        ux_score: extracted.scores?.ux || null,
        accessibility_score: extracted.scores?.accessibility || null,
      }).eq('id', analysisId);

      setAnalyses(prev => prev.map(a => 
        a.id === analysisId ? { ...a, ...extracted.scores, ai_summary: extracted.summary } : a
      ));

      toast.success('AI-Analyse fertig!');
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('AI-Analyse fehlgeschlagen');
    }
  };

  const handleBulkAnalyze = async () => {
    if (selectedPageIds.size === 0) return;
    
    setIsProcessing(true);
    const selectedPages = pages.filter(p => selectedPageIds.has(p.id));
    
    for (const page of selectedPages) {
      const existing = getLatestAnalysis(page.id);
      if (!existing) {
        await createNewAnalysis(page);
      }
    }
    
    setIsProcessing(false);
    setSelectedPageIds(new Set());
    toast.success(`${selectedPages.length} Analysen erstellt`);
  };

  const handleBulkExport = async () => {
    if (selectedPageIds.size === 0) return;
    
    const zip = new JSZip();
    const selectedPages = pages.filter(p => selectedPageIds.has(p.id));
    
    for (const page of selectedPages) {
      const analysis = getLatestAnalysis(page.id);
      if (!analysis?.chatgpt_feedback) continue;
      
      const content = `# ${page.display_name}\n\n**URL:** ${page.url_path}\n**Datum:** ${analysis.chatgpt_feedback_date}\n**Score:** ${analysis.overall_score ?? '-'}\n\n---\n\n${analysis.chatgpt_feedback}`;
      zip.file(`${page.slug}-feedback.md`, content);
    }
    
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `lp-feedback-export-${new Date().toISOString().split('T')[0]}.zip`);
    toast.success('Export erstellt');
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selectedPageIds.size} Analysen wirklich löschen?`)) return;
    
    setIsProcessing(true);
    const idsToDelete = Array.from(selectedPageIds).map(pageId => {
      const analysis = getLatestAnalysis(pageId);
      return analysis?.id;
    }).filter(Boolean);
    
    if (idsToDelete.length > 0) {
      await supabase.from('landing_page_analyses').delete().in('id', idsToDelete as string[]);
      setAnalyses(prev => prev.filter(a => !idsToDelete.includes(a.id)));
    }
    
    setIsProcessing(false);
    setSelectedPageIds(new Set());
    toast.success('Analysen gelöscht');
  };

  const exportAllAsJSON = async () => {
    const exportData = filteredAndSortedPages.map(page => {
      const analysis = getLatestAnalysis(page.id);
      return {
        page: { ...page },
        analysis: analysis ? { ...analysis } : null,
      };
    });
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    saveAs(blob, `lp-data-${new Date().toISOString().split('T')[0]}.json`);
    toast.success('JSON exportiert');
  };

  const togglePageSelection = (pageId: string) => {
    setSelectedPageIds(prev => {
      const next = new Set(prev);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelectedPageIds(new Set(filteredAndSortedPages.map(p => p.id)));
  };

  const clearSelection = () => {
    setSelectedPageIds(new Set());
  };

  const applyQuickPrompt = (prompt: string) => {
    setFeedbackText(prompt + "\n\n---\n\nAnalyse-Ergebnis:\n\n");
  };

  // ============================================
  // RENDER
  // ============================================

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
    <TooltipProvider>
      <div className="space-y-6">
        {/* Stats Dashboard */}
        <StatsDashboard pages={pages} analyses={analyses} />

        {/* Main Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Landing Page AI Feedback v2
                </CardTitle>
                <CardDescription>
                  Erweiterte Analyse & Feedback-Verwaltung mit 25+ Features
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={loadData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Aktualisieren
                </Button>
                <Button variant="outline" size="sm" onClick={exportAllAsJSON}>
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkExport} disabled={selectedPageIds.size === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Zip Export ({selectedPageIds.size})
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Filters Row */}
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
                <SelectTrigger className="w-[140px]">
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
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="with_feedback">Mit Feedback</SelectItem>
                  <SelectItem value="without_feedback">Ohne Feedback</SelectItem>
                  <SelectItem value="with_scores">Mit Scores</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterScoreRange} onValueChange={setFilterScoreRange}>
                <SelectTrigger className="w-[140px]">
                  <Gauge className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Scores</SelectItem>
                  <SelectItem value="excellent">80+ (Excellent)</SelectItem>
                  <SelectItem value="good">60-79 (Gut)</SelectItem>
                  <SelectItem value="needs_work">40-59 (Mittel)</SelectItem>
                  <SelectItem value="poor">&lt;40 (Schlecht)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SortDesc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sortierung" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selection Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="selectAll"
                  checked={selectedPageIds.size === filteredAndSortedPages.length && filteredAndSortedPages.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) selectAllVisible();
                    else clearSelection();
                  }}
                />
                <label htmlFor="selectAll" className="text-sm text-muted-foreground cursor-pointer">
                  Alle auswählen ({filteredAndSortedPages.length})
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {filteredAndSortedPages.length} von {pages.length} Seiten
                </Badge>
                <Badge className="bg-green-600">
                  {analyses.filter(a => a.chatgpt_feedback).length} mit Feedback
                </Badge>
              </div>
            </div>

            {/* Page List */}
            <ScrollArea className="h-[600px] rounded-lg border">
              <div className="divide-y">
                {filteredAndSortedPages.map(page => {
                  const latestAnalysis = getLatestAnalysis(page.id);
                  const hasFeedback = !!latestAnalysis?.chatgpt_feedback;
                  const latestVersion = getLatestVersion(page.id);
                  const score = latestAnalysis?.overall_score;
                  const isSelected = selectedPageIds.has(page.id);

                  return (
                    <div
                      key={page.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => togglePageSelection(page.id)}
                          className="mt-1"
                        />
                        
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-medium">{page.display_name}</span>
                            <Badge variant="outline" className="text-xs">{page.page_type}</Badge>
                            {page.canton_code && (
                              <Badge variant="secondary" className="text-xs">{page.canton_code}</Badge>
                            )}
                            {hasFeedback && (
                              <Badge className="bg-green-600 text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Feedback
                              </Badge>
                            )}
                            {score !== null && (
                              <Badge variant={getScoreBadgeVariant(score)} className="text-xs">
                                <Gauge className="h-3 w-3 mr-1" />
                                {score}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-muted-foreground truncate">{page.url_path}</div>
                          
                          {latestAnalysis && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(latestAnalysis.created_at).toLocaleDateString('de-CH')}
                              </span>
                              {latestAnalysis.ai_summary && (
                                <span className="flex items-center gap-1 text-blue-500">
                                  <Brain className="h-3 w-3" />
                                  AI analysiert
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Mini Score Bars */}
                          {latestAnalysis && score !== null && (
                            <div className="grid grid-cols-4 gap-2 mt-3 max-w-md">
                              {[
                                { label: 'SEO', value: latestAnalysis.seo_score },
                                { label: 'Mobile', value: latestAnalysis.mobile_score },
                                { label: 'Conv', value: latestAnalysis.conversion_score },
                                { label: 'Trust', value: latestAnalysis.trust_score },
                              ].map(s => (
                                <div key={s.label} className="text-center">
                                  <div className={`text-xs font-medium ${getScoreColor(s.value ?? null)}`}>
                                    {s.value ?? '-'}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Screenshot */}
                        {latestVersion?.desktop_screenshot_url && (
                          <img
                            src={latestVersion.desktop_screenshot_url}
                            alt={page.display_name}
                            className="h-20 w-auto rounded border object-cover shrink-0"
                          />
                        )}
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button variant="outline" size="sm" asChild>
                            <a href={page.url_path} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Öffnen
                            </a>
                          </Button>
                          {latestAnalysis ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPage(page);
                                  setSelectedAnalysis(latestAnalysis);
                                  setViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              <Button
                                variant={hasFeedback ? 'outline' : 'default'}
                                size="sm"
                                onClick={() => {
                                  setSelectedPage(page);
                                  setSelectedAnalysis(latestAnalysis);
                                  setFeedbackText(latestAnalysis.chatgpt_feedback || '');
                                  setFeedbackDialogOpen(true);
                                }}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {hasFeedback ? 'Edit' : 'Feedback'}
                              </Button>
                            </>
                          ) : (
                            <Button variant="default" size="sm" onClick={() => createNewAnalysis(page)}>
                              <Plus className="h-4 w-4 mr-1" />
                              Analyse
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedPageIds.size}
          onClearSelection={clearSelection}
          onBulkAnalyze={handleBulkAnalyze}
          onBulkExport={handleBulkExport}
          onBulkDelete={handleBulkDelete}
          isProcessing={isProcessing}
        />

        {/* Feedback Dialog */}
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Feedback: {selectedPage?.display_name}
              </DialogTitle>
              <DialogDescription>
                Füge ChatGPT/Claude Analyse ein oder nutze Quick Prompts
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {/* Quick Prompts */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Prompts (zum Kopieren)</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <Tooltip key={prompt.label}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(prompt.prompt);
                            toast.success('Prompt kopiert!');
                          }}
                        >
                          <Lightbulb className="h-3 w-3 mr-1" />
                          {prompt.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">{prompt.prompt.slice(0, 100)}...</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={feedbackSource} onValueChange={setFeedbackSource}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FEEDBACK_SOURCES.map(source => (
                      <SelectItem key={source.value} value={source.value}>
                        <span className="flex items-center gap-2">
                          <source.icon className="h-4 w-4" />
                          {source.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline">{feedbackText.length} Zeichen</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFeedbackText('')}
                  disabled={!feedbackText}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              <Textarea
                placeholder="Füge hier die vollständige ChatGPT/Claude Analyse ein..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>Abbrechen</Button>
              <Button onClick={saveFeedback} disabled={isSavingFeedback || !feedbackText.trim()}>
                {isSavingFeedback ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Speichern & AI-Analyse
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analyse: {selectedPage?.display_name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedAnalysis && (
              <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Übersicht</TabsTrigger>
                  <TabsTrigger value="scores">Scores</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="insights">AI Insights</TabsTrigger>
                  <TabsTrigger value="raw">Raw Data</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="flex-1 overflow-auto p-4 space-y-6">
                  {/* Overall Score */}
                  <div className="text-center p-6 bg-muted/50 rounded-xl">
                    <div className={`text-6xl font-bold ${getScoreColor(selectedAnalysis.overall_score)}`}>
                      {selectedAnalysis.overall_score ?? '-'}
                    </div>
                    <div className="text-muted-foreground">Overall Score</div>
                  </div>
                  
                  {/* Score Grid */}
                  <ScoreRadar analysis={selectedAnalysis} />
                  
                  {/* AI Summary */}
                  {selectedAnalysis.ai_summary && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          AI Zusammenfassung
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{selectedAnalysis.ai_summary}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Quick Wins */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          Quick Wins
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QuickWinsList items={selectedAnalysis.quick_wins} />
                      </CardContent>
                    </Card>
                    
                    {/* Strengths */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Stärken
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <StrengthsList items={selectedAnalysis.strengths} />
                      </CardContent>
                    </Card>
                    
                    {/* Issues */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          Issues
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <IssuesList items={selectedAnalysis.issues} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="scores" className="flex-1 overflow-auto p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {SCORE_CATEGORIES.map(({ key, label, icon: Icon, color }) => (
                      <Card key={key}>
                        <CardContent className="pt-6 text-center">
                          <Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} />
                          <div className={`text-4xl font-bold ${getScoreColor(selectedAnalysis[key] as number | null)}`}>
                            {(selectedAnalysis[key] as number | null) ?? '-'}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{label}</div>
                          <Progress 
                            value={(selectedAnalysis[key] as number | null) ?? 0} 
                            className="mt-3 h-2"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="feedback" className="flex-1 overflow-auto">
                  <ScrollArea className="h-[500px] p-4 border rounded-lg">
                    {selectedAnalysis.chatgpt_feedback ? (
                      <pre className="whitespace-pre-wrap text-sm">{selectedAnalysis.chatgpt_feedback}</pre>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">Kein Feedback</div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="insights" className="flex-1 overflow-auto p-4">
                  {selectedAnalysis.ai_recommendations && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">AI Empfehlungen</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(selectedAnalysis.ai_recommendations, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="raw" className="flex-1 overflow-auto">
                  <ScrollArea className="h-[500px] p-4">
                    <pre className="text-xs">{JSON.stringify(selectedAnalysis, null, 2)}</pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}

            <DialogFooter>
              {selectedAnalysis?.chatgpt_feedback && (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(selectedAnalysis.chatgpt_feedback!)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Kopieren
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFeedbackText(selectedAnalysis.chatgpt_feedback || '');
                      setViewDialogOpen(false);
                      setFeedbackDialogOpen(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Schliessen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

export default LandingPageFeedbackManagerV2;
