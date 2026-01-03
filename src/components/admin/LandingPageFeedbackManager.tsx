import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  MessageSquare,
  Plus,
  Save,
  Loader2,
  RefreshCw,
  FileText,
  Globe,
  Calendar,
  Sparkles,
  Eye,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface LandingPage {
  id: string;
  page_type: string;
  slug: string;
  url_path: string;
  display_name: string;
  canton_code: string | null;
  city_name: string | null;
  is_active: boolean;
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

const FEEDBACK_SOURCES = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'manual', label: 'Manuell' },
];

export function LandingPageFeedbackManager() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [analyses, setAnalyses] = useState<LandingPageAnalysis[]>([]);
  const [versions, setVersions] = useState<LandingPageVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Feedback Dialog State
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSource, setFeedbackSource] = useState('chatgpt');
  const [selectedAnalysisForFeedback, setSelectedAnalysisForFeedback] = useState<LandingPageAnalysis | null>(null);
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  // View Dialog State
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingAnalysis, setViewingAnalysis] = useState<LandingPageAnalysis | null>(null);

  // Load data
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

  // Get unique page types
  const pageTypes = [...new Set(pages.map(p => p.page_type))];

  // Filter pages
  const filteredPages = pages.filter(p => {
    const matchesType = filterType === 'all' || p.page_type === filterType;
    const matchesSearch = !searchQuery || 
      p.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.url_path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Get analyses for a page
  const getPageAnalyses = (pageId: string) => 
    analyses.filter(a => a.landing_page_id === pageId);

  // Get latest analysis for a page
  const getLatestAnalysis = (pageId: string) => {
    const pageAnalyses = getPageAnalyses(pageId);
    return pageAnalyses[0];
  };

  // Get latest version for a page
  const getLatestVersion = (pageId: string) => {
    const pageVersions = versions.filter(v => v.landing_page_id === pageId);
    return pageVersions[0];
  };

  // Create new analysis for a page
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
      toast.success(`Neue Analyse für "${page.display_name}" erstellt`);
      
      // Open feedback dialog
      setSelectedAnalysisForFeedback(data as LandingPageAnalysis);
      setFeedbackText('');
      setFeedbackSource('chatgpt');
      setFeedbackDialogOpen(true);
    } catch (error) {
      console.error('Error creating analysis:', error);
      toast.error('Fehler beim Erstellen der Analyse');
    }
  };

  // Analyze feedback with AI
  const analyzeFeedbackWithAI = async (analysisId: string, feedback: string, pageName: string, pageUrl: string) => {
    try {
      toast.info('AI analysiert Feedback...', { duration: 2000 });
      
      const { data, error } = await supabase.functions.invoke('analyze-feedback', {
        body: { feedback, pageName, pageUrl }
      });

      if (error) throw error;
      if (!data?.success || !data?.data) {
        console.warn('AI analysis returned no data');
        return;
      }

      const extracted = data.data;
      console.log('AI extracted:', extracted);

      // Update the analysis with extracted data
      const { error: updateError } = await supabase
        .from('landing_page_analyses')
        .update({
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
        })
        .eq('id', analysisId);

      if (updateError) throw updateError;

      // Update local state with new scores
      setAnalyses(prev => prev.map(a => 
        a.id === analysisId 
          ? { 
              ...a, 
              ai_summary: extracted.summary || null,
              ai_recommendations: extracted.recommendations,
              issues: extracted.issues,
              quick_wins: extracted.quick_wins,
              strengths: extracted.strengths,
              overall_score: extracted.scores?.overall || null,
              seo_score: extracted.scores?.seo || null,
              mobile_score: extracted.scores?.mobile || null,
              performance_score: extracted.scores?.performance || null,
              conversion_score: extracted.scores?.conversion || null,
              trust_score: extracted.scores?.trust || null,
              ux_score: extracted.scores?.ux || null,
              accessibility_score: extracted.scores?.accessibility || null,
            }
          : a
      ));

      toast.success('AI-Analyse abgeschlossen!');
    } catch (error) {
      console.error('Error analyzing feedback with AI:', error);
      toast.error('AI-Analyse fehlgeschlagen');
    }
  };

  // Save feedback
  const saveFeedback = async () => {
    if (!selectedAnalysisForFeedback || !feedbackText.trim()) {
      toast.error('Bitte gib Feedback ein');
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
        .eq('id', selectedAnalysisForFeedback.id);

      if (error) throw error;

      // Update local state
      setAnalyses(prev => prev.map(a => 
        a.id === selectedAnalysisForFeedback.id 
          ? { 
              ...a, 
              chatgpt_feedback: feedbackText.trim(),
              chatgpt_feedback_date: new Date().toISOString(),
              status: 'completed'
            }
          : a
      ));

      toast.success('Feedback gespeichert!');
      setFeedbackDialogOpen(false);

      // Get page info and trigger AI analysis
      const page = pages.find(p => p.id === selectedAnalysisForFeedback.landing_page_id);
      if (page) {
        // Run AI analysis in background
        analyzeFeedbackWithAI(
          selectedAnalysisForFeedback.id,
          feedbackText.trim(),
          page.display_name,
          page.url_path
        );
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Fehler beim Speichern');
    } finally {
      setIsSavingFeedback(false);
    }
  };

  // Delete analysis
  const deleteAnalysis = async (analysisId: string) => {
    if (!confirm('Diese Analyse wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('landing_page_analyses')
        .delete()
        .eq('id', analysisId);

      if (error) throw error;

      setAnalyses(prev => prev.filter(a => a.id !== analysisId));
      toast.success('Analyse gelöscht');
      setViewDialogOpen(false);
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  // Export feedback as markdown
  const exportFeedbackAsMarkdown = (analysis: LandingPageAnalysis, page: LandingPage) => {
    const content = `# Landing Page Analyse: ${page.display_name}

**URL:** ${page.url_path}
**Datum:** ${analysis.chatgpt_feedback_date ? new Date(analysis.chatgpt_feedback_date).toLocaleDateString('de-CH') : 'N/A'}
**Status:** ${analysis.status}

---

## ChatGPT Feedback

${analysis.chatgpt_feedback || 'Kein Feedback vorhanden'}

---

## Scores

| Kategorie | Score |
|-----------|-------|
| Overall | ${analysis.overall_score ?? '-'} |
| SEO | ${analysis.seo_score ?? '-'} |
| Mobile | ${analysis.mobile_score ?? '-'} |
| Performance | ${analysis.performance_score ?? '-'} |
| Conversion | ${analysis.conversion_score ?? '-'} |
| Trust | ${analysis.trust_score ?? '-'} |
| UX | ${analysis.ux_score ?? '-'} |
| Accessibility | ${analysis.accessibility_score ?? '-'} |

---

Exportiert am ${new Date().toLocaleString('de-CH')}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    saveAs(blob, `${page.slug}-feedback-${new Date().toISOString().split('T')[0]}.md`);
    toast.success('Markdown exportiert');
  };

  // Copy feedback to clipboard
  const copyFeedback = async (feedback: string) => {
    await navigator.clipboard.writeText(feedback);
    toast.success('Feedback kopiert');
  };

  // Export all feedback as ZIP
  const exportAllFeedbackAsZip = async () => {
    const analysesWithFeedback = analyses.filter(a => a.chatgpt_feedback);
    if (analysesWithFeedback.length === 0) {
      toast.error('Keine Analysen mit Feedback gefunden');
      return;
    }

    const zip = new JSZip();
    
    for (const analysis of analysesWithFeedback) {
      const page = pages.find(p => p.id === analysis.landing_page_id);
      if (!page) continue;

      const content = `# ${page.display_name}\n\n**URL:** ${page.url_path}\n**Datum:** ${analysis.chatgpt_feedback_date}\n\n---\n\n${analysis.chatgpt_feedback}`;
      zip.file(`${page.slug}-feedback.md`, content);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `landing-page-feedback-${new Date().toISOString().split('T')[0]}.zip`);
    toast.success('ZIP exportiert');
  };

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
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Landing Page AI Feedback
              </CardTitle>
              <CardDescription>
                ChatGPT Analysen für Landing Pages verwalten
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Aktualisieren
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportAllFeedbackAsZip}
                disabled={!analyses.some(a => a.chatgpt_feedback)}
              >
                <Download className="h-4 w-4 mr-2" />
                Alle exportieren
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px]"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Alle Typen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Typen ({pages.length})</SelectItem>
                {pageTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type} ({pages.filter(p => p.page_type === type).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="px-3 py-2">
              {analyses.filter(a => a.chatgpt_feedback).length} mit Feedback
            </Badge>
          </div>

          {/* Page List */}
          <ScrollArea className="h-[500px] rounded-lg border">
            <div className="divide-y">
              {filteredPages.map(page => {
                const latestAnalysis = getLatestAnalysis(page.id);
                const hasFeedback = !!latestAnalysis?.chatgpt_feedback;
                const latestVersion = getLatestVersion(page.id);

                return (
                  <div
                    key={page.id}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{page.display_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {page.page_type}
                          </Badge>
                          {page.canton_code && (
                            <Badge variant="secondary" className="text-xs">
                              {page.canton_code}
                            </Badge>
                          )}
                          {hasFeedback && (
                            <Badge className="bg-green-600 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Feedback
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {page.url_path}
                        </div>
                        {latestAnalysis && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Letzte Analyse: {new Date(latestAnalysis.created_at).toLocaleDateString('de-CH')}
                            {latestAnalysis.overall_score && (
                              <Badge variant="outline" className="text-xs ml-2">
                                Score: {latestAnalysis.overall_score}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 shrink-0">
                        {latestVersion?.desktop_screenshot_url && (
                          <img
                            src={latestVersion.desktop_screenshot_url}
                            alt={page.display_name}
                            className="h-16 w-auto rounded border"
                          />
                        )}
                        
                        <div className="flex flex-col gap-1">
                          {latestAnalysis ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setViewingAnalysis(latestAnalysis);
                                  setViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ansehen
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAnalysisForFeedback(latestAnalysis);
                                  setFeedbackText(latestAnalysis.chatgpt_feedback || '');
                                  setFeedbackSource('chatgpt');
                                  setFeedbackDialogOpen(true);
                                }}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {hasFeedback ? 'Bearbeiten' : 'Feedback'}
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => createNewAnalysis(page)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Neue Analyse
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              ChatGPT Feedback eingeben
            </DialogTitle>
            <DialogDescription>
              Füge die ChatGPT Analyse für diese Landing Page ein
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="flex gap-2">
              <Select value={feedbackSource} onValueChange={setFeedbackSource}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_SOURCES.map(source => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline">
                {feedbackText.length} Zeichen
              </Badge>
            </div>
            
            <Textarea
              placeholder="Füge hier die vollständige ChatGPT Analyse ein..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={saveFeedback} disabled={isSavingFeedback || !feedbackText.trim()}>
              {isSavingFeedback ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Analyse Details
              {viewingAnalysis && (
                <Badge variant="outline" className="ml-2">
                  {viewingAnalysis.status}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {viewingAnalysis && (
            <Tabs defaultValue="feedback" className="flex-1 overflow-hidden flex flex-col">
              <TabsList>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="scores">Scores</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="feedback" className="flex-1 overflow-auto">
                <ScrollArea className="h-[400px] p-4 border rounded-lg">
                  {viewingAnalysis.chatgpt_feedback ? (
                    <pre className="whitespace-pre-wrap text-sm">
                      {viewingAnalysis.chatgpt_feedback}
                    </pre>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Kein Feedback vorhanden
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="scores">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                  {[
                    { label: 'Overall', value: viewingAnalysis.overall_score },
                    { label: 'SEO', value: viewingAnalysis.seo_score },
                    { label: 'Mobile', value: viewingAnalysis.mobile_score },
                    { label: 'Performance', value: viewingAnalysis.performance_score },
                    { label: 'Conversion', value: viewingAnalysis.conversion_score },
                    { label: 'Trust', value: viewingAnalysis.trust_score },
                    { label: 'UX', value: viewingAnalysis.ux_score },
                    { label: 'Accessibility', value: viewingAnalysis.accessibility_score },
                  ].map(({ label, value }) => (
                    <Card key={label}>
                      <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold">{value ?? '-'}</div>
                        <div className="text-sm text-muted-foreground">{label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <ScrollArea className="h-[400px] p-4">
                  <pre className="text-xs">
                    {JSON.stringify(viewingAnalysis, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            {viewingAnalysis && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteAnalysis(viewingAnalysis.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Löschen
                </Button>
                {viewingAnalysis.chatgpt_feedback && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyFeedback(viewingAnalysis.chatgpt_feedback!)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Kopieren
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const page = pages.find(p => p.id === viewingAnalysis.landing_page_id);
                        if (page) exportFeedbackAsMarkdown(viewingAnalysis, page);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Markdown
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAnalysisForFeedback(viewingAnalysis);
                    setFeedbackText(viewingAnalysis.chatgpt_feedback || '');
                    setFeedbackSource('chatgpt');
                    setViewDialogOpen(false);
                    setFeedbackDialogOpen(true);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback bearbeiten
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Schliessen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
