import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Search,
  Code,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Download,
  RefreshCw,
  Globe,
  FileCode2,
  Layers,
  Bot,
  Copy,
  Check,
  FileDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { saveAs } from "file-saver";

interface SEOAnalysis {
  url: string;
  rawHtml: string | null;
  renderedHtml: string | null;
  markdown: string | null;
  metadata: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonical?: string;
  } | null;
  comparison: {
    rawLength: number;
    renderedLength: number;
    difference: number;
    percentageIncrease: number;
    h1Raw: string[];
    h1Rendered: string[];
    h2Raw: string[];
    h2Rendered: string[];
    linksRaw: number;
    linksRendered: number;
  } | null;
  capturedAt: string;
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  details?: string;
}

const DEFAULT_SITE_ORIGIN = "https://www.umzugscheck.ch";

const PRESET_URLS = [
  { label: "Homepage", url: `${DEFAULT_SITE_ORIGIN}/` },
  { label: "Umzugsofferten", url: `${DEFAULT_SITE_ORIGIN}/umzugsofferten` },
  { label: "Preisrechner", url: `${DEFAULT_SITE_ORIGIN}/preisrechner` },
  { label: "Firmenverzeichnis", url: `${DEFAULT_SITE_ORIGIN}/firmen` },
  { label: "Beste Umzugsfirma", url: `${DEFAULT_SITE_ORIGIN}/beste-umzugsfirma` },
  { label: "Zürich", url: `${DEFAULT_SITE_ORIGIN}/umzugsfirmen/zuerich` },
  { label: "Bern", url: `${DEFAULT_SITE_ORIGIN}/umzugsfirmen/bern` },
];

export function SEOHtmlAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [issues, setIssues] = useState<SEOIssue[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedRendered, setCopiedRendered] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const copyToClipboard = async (content: string, type: 'raw' | 'rendered' | 'markdown') => {
    try {
      await navigator.clipboard.writeText(content);
      if (type === 'raw') {
        setCopiedRaw(true);
        setTimeout(() => setCopiedRaw(false), 2000);
      } else if (type === 'rendered') {
        setCopiedRendered(true);
        setTimeout(() => setCopiedRendered(false), 2000);
      } else {
        setCopiedMarkdown(true);
        setTimeout(() => setCopiedMarkdown(false), 2000);
      }
      toast.success(`${type === 'raw' ? 'Raw' : type === 'rendered' ? 'Rendered' : 'Markdown'} HTML kopiert!`);
    } catch (error) {
      toast.error("Fehler beim Kopieren");
    }
  };

  const downloadHtml = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    saveAs(blob, filename);
    toast.success(`${filename} heruntergeladen!`);
  };

  const extractHeadings = (html: string, tag: 'h1' | 'h2'): string[] => {
    const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'gi');
    const matches = html.matchAll(regex);
    return Array.from(matches).map(m => m[1].trim()).filter(Boolean);
  };

  const countLinks = (html: string): number => {
    const matches = html.match(/<a\s/gi);
    return matches?.length || 0;
  };

  const extractMetadata = (html: string) => {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    
    return {
      title: titleMatch?.[1],
      description: descMatch?.[1],
      ogImage: ogImageMatch?.[1],
      canonical: canonicalMatch?.[1],
    };
  };

  const analyzeIssues = (rawHtml: string | null, renderedHtml: string | null, metadata: SEOAnalysis['metadata']): SEOIssue[] => {
    const issues: SEOIssue[] = [];

    // Check if raw HTML is empty or minimal
    if (!rawHtml || rawHtml.length < 500) {
      issues.push({
        type: 'error',
        message: 'Raw HTML ist leer oder minimal',
        details: 'Suchmaschinen ohne JavaScript-Rendering sehen keinen Inhalt. SSR/SSG empfohlen.'
      });
    }

    // Check for missing title
    if (!metadata?.title) {
      issues.push({
        type: 'error',
        message: 'Kein Title-Tag gefunden',
        details: 'Der Title-Tag ist einer der wichtigsten SEO-Faktoren.'
      });
    }

    // Check for missing description
    if (!metadata?.description) {
      issues.push({
        type: 'warning',
        message: 'Keine Meta-Description',
        details: 'Eine Meta-Description verbessert die CTR in Suchergebnissen.'
      });
    }

    // Check for H1 differences
    if (rawHtml && renderedHtml) {
      const h1Raw = extractHeadings(rawHtml, 'h1');
      const h1Rendered = extractHeadings(renderedHtml, 'h1');
      
      if (h1Raw.length === 0 && h1Rendered.length > 0) {
        issues.push({
          type: 'error',
          message: 'H1 nur nach JavaScript-Rendering sichtbar',
          details: `H1 "${h1Rendered[0]}" ist im Raw HTML nicht vorhanden.`
        });
      }
      
      if (h1Rendered.length === 0) {
        issues.push({
          type: 'error',
          message: 'Kein H1-Tag gefunden',
          details: 'Jede Seite sollte genau ein H1-Tag haben.'
        });
      } else if (h1Rendered.length > 1) {
        issues.push({
          type: 'warning',
          message: `Mehrere H1-Tags (${h1Rendered.length})`,
          details: 'Idealerweise nur ein H1 pro Seite verwenden.'
        });
      }
    }

    // Check content difference
    if (rawHtml && renderedHtml) {
      const diff = renderedHtml.length - rawHtml.length;
      const percentage = (diff / rawHtml.length) * 100;
      
      if (percentage > 500) {
        issues.push({
          type: 'warning',
          message: 'Sehr grosser Unterschied zwischen Raw und Rendered HTML',
          details: `${percentage.toFixed(0)}% mehr Inhalt nach JavaScript. Crawler ohne JS sehen wenig.`
        });
      }
    }

    // Positive checks
    if (metadata?.canonical) {
      issues.push({
        type: 'info',
        message: 'Canonical-Tag vorhanden',
        details: metadata.canonical
      });
    }

    if (metadata?.ogImage) {
      issues.push({
        type: 'info',
        message: 'OG:Image vorhanden',
        details: 'Social Media Sharing wird korrekt dargestellt.'
      });
    }

    return issues;
  };

  const fetchRawHtml = async (targetUrl: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-html', {
        body: { url: targetUrl }
      });
      
      if (error) {
        console.error('Raw HTML fetch error:', error);
        return null;
      }
      
      return data?.html || null;
    } catch (error) {
      console.error('Error fetching raw HTML:', error);
      return null;
    }
  };

  const fetchRenderedHtml = async (targetUrl: string): Promise<{ html: string | null; markdown: string | null; metadata: any }> => {
    try {
      const { data, error } = await supabase.functions.invoke('capture-rendered-html', {
        body: { 
          url: targetUrl,
          waitFor: 5000,
          onlyMainContent: false,
          formats: ['html', 'markdown']
        }
      });
      
      if (error) {
        console.error('Rendered HTML fetch error:', error);
        return { html: null, markdown: null, metadata: null };
      }
      
      return {
        html: data?.html || null,
        markdown: data?.markdown || null,
        metadata: data?.metadata || null
      };
    } catch (error) {
      console.error('Error fetching rendered HTML:', error);
      return { html: null, markdown: null, metadata: null };
    }
  };

  const analyzeUrl = async () => {
    if (!url) {
      toast.error("Bitte gib eine URL ein");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setIssues([]);

    try {
      toast.info("Lade Raw HTML (ohne JavaScript)...");
      const rawHtml = await fetchRawHtml(url);
      
      toast.info("Lade Rendered HTML (mit JavaScript via Firecrawl)...");
      const { html: renderedHtml, markdown, metadata: firecrawlMetadata } = await fetchRenderedHtml(url);

      if (!renderedHtml) {
        toast.error("Fehler beim Laden des gerenderten HTML");
        setLoading(false);
        return;
      }

      // Extract metadata from rendered HTML
      const extractedMetadata = extractMetadata(renderedHtml);
      const metadata = {
        ...extractedMetadata,
        ...firecrawlMetadata
      };

      // Build comparison
      const comparison = rawHtml && renderedHtml ? {
        rawLength: rawHtml.length,
        renderedLength: renderedHtml.length,
        difference: renderedHtml.length - rawHtml.length,
        percentageIncrease: rawHtml.length > 0 
          ? ((renderedHtml.length - rawHtml.length) / rawHtml.length) * 100 
          : 100,
        h1Raw: extractHeadings(rawHtml, 'h1'),
        h1Rendered: extractHeadings(renderedHtml, 'h1'),
        h2Raw: extractHeadings(rawHtml, 'h2'),
        h2Rendered: extractHeadings(renderedHtml, 'h2'),
        linksRaw: countLinks(rawHtml),
        linksRendered: countLinks(renderedHtml),
      } : null;

      const result: SEOAnalysis = {
        url,
        rawHtml,
        renderedHtml,
        markdown,
        metadata,
        comparison,
        capturedAt: new Date().toISOString(),
      };

      setAnalysis(result);
      setIssues(analyzeIssues(rawHtml, renderedHtml, metadata));
      toast.success("SEO-Analyse abgeschlossen!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Fehler bei der Analyse");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;

    const report = {
      ...analysis,
      issues,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-analysis-${new URL(analysis.url).hostname}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO HTML Analyzer
          </CardTitle>
          <CardDescription>
            Vergleiche Raw HTML (ohne JavaScript) mit gerendertem HTML (nach JavaScript-Ausführung)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preset URLs */}
          <div className="space-y-2">
            <Label>Schnellauswahl</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_URLS.map((preset) => (
                <Button
                  key={preset.url}
                  variant="outline"
                  size="sm"
                  onClick={() => setUrl(preset.url)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* URL Input */}
          <div className="flex gap-2">
            <Input
              placeholder="https://www.umzugscheck.ch/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={analyzeUrl} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analysieren
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Analyse: {new URL(analysis.url).pathname || '/'}
              </CardTitle>
              <CardDescription>
                Erfasst am {new Date(analysis.capturedAt).toLocaleString('de-CH')}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={analyzeUrl}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Neu laden
              </Button>
              <Button variant="outline" size="sm" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Übersicht
                </TabsTrigger>
                <TabsTrigger value="issues" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Issues ({issues.filter(i => i.type !== 'info').length})
                </TabsTrigger>
                <TabsTrigger value="raw" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Raw HTML
                </TabsTrigger>
                <TabsTrigger value="rendered" className="flex items-center gap-2">
                  <FileCode2 className="h-4 w-4" />
                  Rendered HTML
                </TabsTrigger>
                <TabsTrigger value="markdown" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  LLM-Ready
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Stats Grid */}
                {analysis.comparison && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Raw HTML</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {(analysis.comparison.rawLength / 1024).toFixed(1)} KB
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Was Suchmaschinen ohne JS sehen
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Rendered HTML</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {(analysis.comparison.renderedLength / 1024).toFixed(1)} KB
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Nach JavaScript-Rendering
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Unterschied</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${analysis.comparison.percentageIncrease > 100 ? 'text-destructive' : 'text-green-600'}`}>
                          +{analysis.comparison.percentageIncrease.toFixed(0)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Mehr Inhalt nach JS
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Headings Comparison */}
                {analysis.comparison && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          H1-Tags
                          {analysis.comparison.h1Raw.length === 0 && analysis.comparison.h1Rendered.length > 0 && (
                            <Badge variant="destructive" className="text-xs">Nur nach JS</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <span className="text-xs text-muted-foreground">Raw:</span>
                          {analysis.comparison.h1Raw.length > 0 ? (
                            analysis.comparison.h1Raw.map((h, i) => (
                              <Badge key={i} variant="secondary" className="ml-2 text-xs">{h}</Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="ml-2 text-xs text-destructive">Keine</Badge>
                          )}
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Rendered:</span>
                          {analysis.comparison.h1Rendered.map((h, i) => (
                            <Badge key={i} variant="default" className="ml-2 text-xs">{h}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Links</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Raw HTML:</span>
                          <span className="font-medium">{analysis.comparison.linksRaw}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Rendered HTML:</span>
                          <span className="font-medium">{analysis.comparison.linksRendered}</span>
                        </div>
                        <Progress 
                          value={(analysis.comparison.linksRaw / Math.max(analysis.comparison.linksRendered, 1)) * 100} 
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {analysis.comparison.linksRendered - analysis.comparison.linksRaw} Links nur nach JS sichtbar
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Metadata */}
                {analysis.metadata && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Meta-Daten</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground w-24 shrink-0">Title:</span>
                          <span className="text-sm font-medium">{analysis.metadata.title || '—'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground w-24 shrink-0">Description:</span>
                          <span className="text-sm">{analysis.metadata.description || '—'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground w-24 shrink-0">Canonical:</span>
                          <span className="text-sm text-primary">{analysis.metadata.canonical || '—'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="issues">
                <div className="space-y-3">
                  {issues.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      Keine Probleme gefunden
                    </div>
                  ) : (
                    issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          issue.type === 'error' 
                            ? 'bg-destructive/10 border-destructive/30' 
                            : issue.type === 'warning'
                            ? 'bg-yellow-500/10 border-yellow-500/30'
                            : 'bg-primary/10 border-primary/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {issue.type === 'error' ? (
                            <XCircle className="h-5 w-5 text-destructive shrink-0" />
                          ) : issue.type === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                          )}
                          <div>
                            <p className="font-medium">{issue.message}</p>
                            {issue.details && (
                              <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="raw">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Raw HTML (ohne JavaScript)</span>
                      {analysis.rawHtml && (
                        <Badge variant="secondary">{(analysis.rawHtml.length / 1024).toFixed(1)} KB</Badge>
                      )}
                    </div>
                    {analysis.rawHtml && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(analysis.rawHtml!, 'raw')}
                        >
                          {copiedRaw ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                          {copiedRaw ? 'Kopiert!' : 'Copy outerHTML'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => downloadHtml(analysis.rawHtml!, `${new URL(analysis.url).hostname}-raw.html`)}
                        >
                          <FileDown className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    {analysis.rawHtml ? (
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {analysis.rawHtml}
                      </pre>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                        Kein Raw HTML verfügbar
                        <p className="text-sm mt-2">
                          Dies bedeutet, dass Suchmaschinen ohne JavaScript-Rendering keinen Inhalt sehen.
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="rendered">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">Rendered HTML (nach JavaScript)</span>
                      {analysis.renderedHtml && (
                        <Badge variant="default">{(analysis.renderedHtml.length / 1024).toFixed(1)} KB</Badge>
                      )}
                    </div>
                    {analysis.renderedHtml && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(analysis.renderedHtml!, 'rendered')}
                        >
                          {copiedRendered ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                          {copiedRendered ? 'Kopiert!' : 'Copy outerHTML'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => downloadHtml(analysis.renderedHtml!, `${new URL(analysis.url).hostname}-rendered.html`)}
                        >
                          <FileDown className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    {analysis.renderedHtml ? (
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {analysis.renderedHtml}
                      </pre>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Kein gerendertes HTML verfügbar
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="markdown">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg flex-1">
                      <Bot className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">LLM-Ready Markdown</p>
                        <p className="text-sm text-muted-foreground">
                          Bereinigter Inhalt, optimiert für AI-Verarbeitung (ChatGPT, Claude, etc.)
                        </p>
                      </div>
                    </div>
                    {analysis.markdown && (
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(analysis.markdown!, 'markdown')}
                        >
                          {copiedMarkdown ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                          {copiedMarkdown ? 'Kopiert!' : 'Kopieren'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const blob = new Blob([analysis.markdown!], { type: 'text/markdown;charset=utf-8' });
                            saveAs(blob, `${new URL(analysis.url).hostname}-content.md`);
                            toast.success('Markdown heruntergeladen!');
                          }}
                        >
                          <FileDown className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    {analysis.markdown ? (
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {analysis.markdown}
                      </pre>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Kein Markdown verfügbar
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
