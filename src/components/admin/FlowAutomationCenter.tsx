/**
 * Flow Automation Center
 * ======================
 * Vollautomatisierte V1-V9 Analyse und Varianten-Erstellung
 * 
 * Features:
 * 1. One-Click: Alle 9 Flows analysieren (Screenshots + AI)
 * 2. Feedback-Integration: ChatGPT/Gemini Feedback einfügen → automatische Implementierung
 * 3. Varianten-Tracking in DB
 * 4. Fortschritts-Anzeige
 */

import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { FLOW_CONFIGS } from "@/data/flowConfigs";
import { toast } from "sonner";
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
  Eye
} from "lucide-react";

// Flow options from config
const FLOW_OPTIONS = Object.entries(FLOW_CONFIGS).map(([key, config]) => ({
  id: key,
  label: config.label,
  path: config.path,
  steps: config.steps.length,
  color: config.color
}));

interface AnalysisResult {
  flowId: string;
  flowName: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  score?: number;
  issuesCount?: number;
  criticalCount?: number;
  summary?: string;
  error?: string;
}

interface FeedbackEntry {
  id: string;
  flow_id: string;
  variant_label: string;
  variant_name: string;
  prompt: string;
  status: string;
  created_at: string;
}

export function FlowAutomationCenter() {
  // Analysis state
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>(() =>
    FLOW_OPTIONS.map((flow) => ({
      flowId: flow.id,
      flowName: flow.label,
      status: "pending" as const,
    }))
  );
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentFlowAnalyzing, setCurrentFlowAnalyzing] = useState<string | null>(null);

  // Feedback state
  const [selectedFlow, setSelectedFlow] = useState("umzugsofferten-v9");
  const [feedbackText, setFeedbackText] = useState("");
  const [variantLetter, setVariantLetter] = useState("a");
  const [variantName, setVariantName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentEntries, setRecentEntries] = useState<FeedbackEntry[]>([]);

  // Get flow number from ID
  const getFlowNumber = (flowId: string) => {
    const match = flowId.match(/v(\d+)/);
    return match ? match[1] : "1";
  };

  const loadLatestAnalysisResults = async () => {
    setIsLoadingResults(true);
    try {
      const { data, error } = await supabase
        .from("flow_analysis_runs")
        .select("id, flow_id, status, overall_score, ai_summary, created_at, metadata")
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;

      const latestByFlow = new Map<string, any>();
      (data ?? []).forEach((row: any) => {
        if (!latestByFlow.has(row.flow_id)) latestByFlow.set(row.flow_id, row);
      });

      setAnalysisResults(
        FLOW_OPTIONS.map((flow) => {
          const row = latestByFlow.get(flow.id);
          if (!row) {
            return { flowId: flow.id, flowName: flow.label, status: "pending" as const };
          }

          const meta = (row.metadata ?? {}) as any;
          return {
            flowId: flow.id,
            flowName: flow.label,
            status: "completed" as const,
            score: row.overall_score ?? undefined,
            summary: row.ai_summary ?? undefined,
            issuesCount: meta.issuesCount ?? meta.issues_count ?? undefined,
            criticalCount: meta.criticalCount ?? meta.critical_count ?? undefined,
          };
        })
      );

      toast.success("Letzte Analyse-Ergebnisse geladen");
    } catch (e) {
      console.error("loadLatestAnalysisResults error:", e);
      toast.error("Konnte letzte Analyse-Ergebnisse nicht laden");
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Analyze all 9 flows
  const analyzeAllFlows = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const results: AnalysisResult[] = FLOW_OPTIONS.map(flow => ({
      flowId: flow.id,
      flowName: flow.label,
      status: 'pending' as const
    }));
    setAnalysisResults(results);

    const baseUrl = window.location.origin.includes('localhost') 
      ? 'https://www.umzugscheck.ch'
      : window.location.origin;

    for (let i = 0; i < FLOW_OPTIONS.length; i++) {
      const flow = FLOW_OPTIONS[i];
      setCurrentFlowAnalyzing(flow.id);
      
      // Update status to running
      setAnalysisResults(prev => prev.map(r => 
        r.flowId === flow.id ? { ...r, status: 'running' as const } : r
      ));

      try {
        const { data, error } = await supabase.functions.invoke('auto-analyze-flow', {
          body: { 
            flowId: flow.id, 
            runType: 'manual',
            baseUrl 
          }
        });

        if (error) throw error;

        setAnalysisResults(prev => prev.map(r => 
          r.flowId === flow.id ? {
            ...r,
            status: 'completed' as const,
            score: data.overallScore,
            issuesCount: data.issuesCount,
            criticalCount: data.criticalCount,
            summary: data.summary
          } : r
        ));

        toast.success(`${flow.label} analysiert: Score ${data.overallScore}/100`);
      } catch (error) {
        console.error(`Error analyzing ${flow.id}:`, error);
        setAnalysisResults(prev => prev.map(r => 
          r.flowId === flow.id ? {
            ...r,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
          } : r
        ));
      }

      setAnalysisProgress(((i + 1) / FLOW_OPTIONS.length) * 100);
    }

    setIsAnalyzing(false);
    setCurrentFlowAnalyzing(null);
    toast.success("Alle 9 Flows analysiert!");
  };

  // Generate Lovable implementation prompt
  const generateImplementationPrompt = () => {
    const flowNumber = getFlowNumber(selectedFlow);
    const componentName = `V${flowNumber}${variantLetter.toLowerCase()}FeedbackBased`;

    return `# Neue Flow-Variante erstellen: V${flowNumber}.${variantLetter}

## Ziel
Erstelle eine neue Variante "${variantName || 'Feedback-basierte Optimierung'}" basierend auf dem folgenden AI-Feedback.

## Komponente
- **Datei:** \`src/components/calculator-variants/${componentName}.tsx\`
- **Export-Name:** \`${componentName}\`

## AI-Feedback / Verbesserungsvorschläge

${feedbackText}

---

## Implementierungsanweisungen

1. **Erstelle die neue Komponente** in \`src/components/calculator-variants/${componentName}.tsx\`
2. **Orientiere dich am Stil** der existierenden V${flowNumber}a-e Varianten
3. **Implementiere alle Verbesserungen** aus dem Feedback
4. **Exportiere die Komponente** in \`src/components/calculator-variants/index.ts\`
5. **Füge sie zum VARIANT_REGISTRY hinzu** mit der korrekten stepCount

## Technische Anforderungen
- React + TypeScript
- shadcn/ui Komponenten
- Tailwind CSS
- Mobile-first & responsive
- 4-Step Wizard Flow (oder wie im Feedback spezifiziert)

## Nach der Implementierung
Die Variante wird automatisch unter \`/umzugsofferten?v=${flowNumber}${variantLetter}\` verfügbar sein.
`;
  };

  // Submit feedback and generate prompt
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast.error("Bitte Feedback eingeben");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase
        .from("flow_feedback_variants")
        .insert({
          flow_id: selectedFlow,
          variant_label: variantLetter.toLowerCase(),
          variant_name: variantName.trim() || `V${getFlowNumber(selectedFlow)}.${variantLetter} - AI Feedback`,
          prompt: feedbackText.trim(),
          status: "pending",
        });

      if (error) throw error;

      // Copy prompt
      const prompt = generateImplementationPrompt();
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

      toast.success("Feedback gespeichert & Prompt kopiert!", {
        description: "Füge ihn jetzt in den Lovable-Chat ein.",
      });

      // Refresh entries
      fetchRecentEntries();

      // Reset form
      setFeedbackText("");
      setVariantName("");
      
      // Suggest next letter
      const nextLetter = String.fromCharCode(variantLetter.charCodeAt(0) + 1);
      setVariantLetter(nextLetter);

    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Fehler beim Speichern");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch recent feedback entries
  const fetchRecentEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("flow_feedback_variants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentEntries((data || []) as FeedbackEntry[]);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Mark as implemented
  const markAsImplemented = async (entry: FeedbackEntry) => {
    try {
      await supabase
        .from("flow_feedback_variants")
        .update({ 
          status: "done",
          executed_at: new Date().toISOString(),
          output_flow_id: `${entry.flow_id}-${entry.variant_label}`
        })
        .eq("id", entry.id);

      toast.success("Als implementiert markiert");
      fetchRecentEntries();
    } catch (error) {
      toast.error("Fehler beim Aktualisieren");
    }
  };

  // Copy prompt for existing entry
  const copyEntryPrompt = async (entry: FeedbackEntry) => {
    const flowNumber = getFlowNumber(entry.flow_id);
    const componentName = `V${flowNumber}${entry.variant_label.toLowerCase()}FeedbackBased`;

    const prompt = `# Implementiere V${flowNumber}.${entry.variant_label}: ${entry.variant_name}

## Komponente: \`${componentName}.tsx\`

## Feedback:
${entry.prompt}

## Erstelle die Komponente in src/components/calculator-variants/${componentName}.tsx`;

    await navigator.clipboard.writeText(prompt);
    toast.success("Prompt kopiert!");
  };

  // Initial load
  useEffect(() => {
    fetchRecentEntries();
    loadLatestAnalysisResults();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            Flow Automation Center
          </h2>
          <p className="text-muted-foreground">
            Automatisierte Analyse und Varianten-Erstellung für V1-V9
          </p>
        </div>
      </div>

      <Tabs defaultValue="analyze" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analyze" className="gap-2">
            <Zap className="h-4 w-4" />
            Alle analysieren
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-2">
            <Bot className="h-4 w-4" />
            AI-Feedback
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <FileText className="h-4 w-4" />
            Verlauf
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Analyze All Flows */}
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Alle 9 Flows analysieren
              </CardTitle>
              <CardDescription>
                Automatische Screenshot-Erfassung und AI-Analyse für V1-V9
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  <strong>One-Click Analyse:</strong> Erfasst Screenshots aller Steps, 
                  analysiert mit Gemini AI, speichert Ergebnisse in der Datenbank.
                </AlertDescription>
              </Alert>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  onClick={analyzeAllFlows}
                  disabled={isAnalyzing}
                  size="lg"
                  className="w-full gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analysiere {currentFlowAnalyzing}...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Alle 9 Flows analysieren (V1-V9)
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={loadLatestAnalysisResults}
                  disabled={isAnalyzing || isLoadingResults}
                  size="lg"
                  className="w-full gap-2"
                >
                  {isLoadingResults ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Lade Ergebnisse...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      Letzte Ergebnisse laden
                    </>
                  )}
                </Button>
              </div>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fortschritt</span>
                    <span>{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} />
                </div>
              )}

              {analysisResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Ergebnisse:</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!analysisResults.some((r) => r.status === "completed")}
                      onClick={async () => {
                        const exportData = {
                          exportedAt: new Date().toISOString(),
                          flows: analysisResults.map((r) => ({
                            flowId: r.flowId,
                            flowName: r.flowName,
                            score: r.score,
                            issuesCount: r.issuesCount,
                            criticalCount: r.criticalCount,
                            summary: r.summary,
                          })),
                        };

                        const prompt = `# Umzugscheck.ch Flow-Analyse Ergebnisse

Hier sind die Analyse-Ergebnisse für alle 9 Flows (V1-V9):

${analysisResults
  .filter((r) => r.status === "completed")
  .map(
    (r) => `
## ${r.flowName}
- **Score:** ${r.score ?? "—"}/100
- **Issues:** ${r.issuesCount ?? "—"} (${r.criticalCount ?? "—"} kritisch)
${r.summary ? `- **Summary:** ${r.summary}` : ""}`
  )
  .join("\n")}

---

**Aufgabe:** Analysiere diese Ergebnisse und gib mir für jeden Flow:
1. Die 3 kritischsten UX-Probleme
2. Konkrete Verbesserungsvorschläge mit Code-Beispielen (React/Tailwind)
3. Priorisierte Massnahmen für mehr Conversions

Fokus: Mobile-UX, Trust-Elemente, CTA-Optimierung, Formular-Vereinfachung.
Antworte auf Deutsch.`;

                        await navigator.clipboard.writeText(prompt);
                        toast.success("Export-Prompt kopiert!", {
                          description: "Füge ihn in ChatGPT oder Gemini ein.",
                        });
                      }}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export für ChatGPT/Gemini
                    </Button>
                  </div>
                  
                  <div className="grid gap-2">
                    {analysisResults.map((result) => {
                      const copyPrompt = async () => {
                        const singlePrompt = `# ${result.flowName} - Detailanalyse

Score: ${result.score ?? "—"}/100
Issues: ${result.issuesCount ?? "—"} (${result.criticalCount ?? "—"} kritisch)
${result.summary ? `\nSummary: ${result.summary}` : ""}

Bitte analysiere diesen Flow und gib mir:
1. Die 3 kritischsten UX-Probleme
2. Konkrete Code-Fixes (React + Tailwind)
3. Quick-Wins für sofortige Verbesserung`;
                        await navigator.clipboard.writeText(singlePrompt);
                        toast.success(`${result.flowName} Prompt kopiert!`);
                      };

                      return (
                        <button
                          type="button"
                          key={result.flowId}
                          onClick={() => {
                            if (result.status === "completed") copyPrompt();
                          }}
                          disabled={result.status !== "completed"}
                          className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer disabled:cursor-default ${
                            result.status === "completed"
                              ? "bg-green-50 dark:bg-green-950/20 border-green-200 hover:bg-green-100 dark:hover:bg-green-950/30"
                              : result.status === "running"
                              ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200"
                              : result.status === "error"
                              ? "bg-red-50 dark:bg-red-950/20 border-red-200"
                              : "bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {result.status === "completed" && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              {result.status === "running" && (
                                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                              )}
                              {result.status === "error" && (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                              {result.status === "pending" && (
                                <div className="h-4 w-4 rounded-full bg-muted" />
                              )}
                              <span className="font-medium">{result.flowName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {result.score !== undefined && (
                                <Badge variant={result.score >= 70 ? "default" : "destructive"}>
                                  Score: {result.score}/100
                                </Badge>
                              )}
                              {result.issuesCount !== undefined && (
                                <Badge variant="outline">
                                  {result.issuesCount} Issues ({result.criticalCount} kritisch)
                                </Badge>
                              )}
                              {result.error && (
                                <Badge variant="destructive">{result.error}</Badge>
                              )}
                              {result.status === "completed" && (
                                <Copy className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          {result.summary && (
                            <p className="text-sm text-muted-foreground mt-2 pl-7">
                              {result.summary}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: AI Feedback Integration */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI-Feedback → Implementierung
              </CardTitle>
              <CardDescription>
                Füge ChatGPT/Gemini Feedback ein → Lovable-Prompt wird generiert
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Flow & Variant Selection */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Basis-Flow</Label>
                  <Select value={selectedFlow} onValueChange={setSelectedFlow}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FLOW_OPTIONS.map(flow => (
                        <SelectItem key={flow.id} value={flow.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${flow.color}`} />
                            {flow.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Variante</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={variantLetter}
                      onChange={(e) => setVariantLetter(e.target.value.toLowerCase().slice(0, 1))}
                      placeholder="a"
                      className="w-14 text-center font-mono text-lg"
                      maxLength={1}
                    />
                    <span className="text-lg font-bold text-primary">
                      → V{getFlowNumber(selectedFlow)}.{variantLetter}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Name (optional)</Label>
                  <Input
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    placeholder="z.B. Mobile UX Fix"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Feedback Input */}
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  ChatGPT / Gemini Feedback
                </Label>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={`Füge hier das AI-Feedback ein...

Beispiel:
## Verbesserungsvorschläge für V${getFlowNumber(selectedFlow)}

1. **CTA-Button optimieren**: Der "Weiter" Button sollte grösser und auffälliger sein
2. **Progress-Anzeige verbessern**: Prozentanzeige hinzufügen
3. **Mobile Touch-Targets**: Mindestens 44px für alle klickbaren Elemente
...`}
                  rows={12}
                  className="font-mono text-sm mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {feedbackText.length} Zeichen
                </div>
              </div>

              {/* Preview of generated prompt */}
              {feedbackText.trim() && (
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-medium">Vorschau: Lovable-Prompt</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generateImplementationPrompt());
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                        toast.success("Prompt kopiert!");
                      }}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <ScrollArea className="h-[150px]">
                    <pre className="text-xs whitespace-pre-wrap">
                      {generateImplementationPrompt().slice(0, 500)}...
                    </pre>
                  </ScrollArea>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || !feedbackText.trim()}
                className="w-full gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Speichere...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Speichern & Prompt kopieren
                  </>
                )}
              </Button>

              <Alert>
                <ArrowRight className="h-4 w-4" />
                <AlertDescription>
                  <strong>Nächster Schritt:</strong> Nach dem Kopieren, füge den Prompt 
                  in den Lovable-Chat ein. Lovable erstellt dann automatisch die neue 
                  Komponente. Danach markiere sie als "implementiert".
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Feedback-Verlauf
                  </CardTitle>
                  <CardDescription>
                    Alle gespeicherten AI-Feedback Einträge
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchRecentEntries}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Noch keine Einträge vorhanden
                </div>
              ) : (
                <div className="space-y-3">
                  {recentEntries.map(entry => (
                    <div 
                      key={entry.id}
                      className={`p-4 border rounded-lg ${
                        entry.status === 'done' 
                          ? 'bg-green-50 dark:bg-green-950/20 border-green-200' 
                          : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={entry.status === 'done' ? "default" : "secondary"}>
                            V{getFlowNumber(entry.flow_id)}.{entry.variant_label}
                          </Badge>
                          <span className="font-medium">{entry.variant_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.status === 'done' ? 'Implementiert' : 'Ausstehend'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyEntryPrompt(entry)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {entry.status !== 'done' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => markAsImplemented(entry)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Fertig
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {entry.prompt.slice(0, 200)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.created_at).toLocaleString('de-CH')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
