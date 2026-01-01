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
import { supabase } from "@/integrations/supabase/client";
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from "@/data/flowConfigs";
import { SITE_CONFIG } from "@/data/constants";
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
  Wrench
} from "lucide-react";

// Flow options from config
const FLOW_OPTIONS = Object.entries(FLOW_CONFIGS).map(([key, config]) => ({
  id: key,
  label: config.label,
  path: config.path,
  steps: config.steps.length,
  color: config.color
}));

// Special "all flows" option for multi-version feedback
const ALL_FLOWS_OPTION = {
  id: 'all-flows-v1-v9',
  label: 'Alle Flows (V1-V9)',
  path: '/all',
  steps: 0,
  color: 'bg-gradient-to-r from-blue-500 to-purple-500'
};

// Combined options for AI feedback dropdown
const FEEDBACK_FLOW_OPTIONS = [ALL_FLOWS_OPTION, ...FLOW_OPTIONS];

interface AnalysisResult {
  flowId: string;
  flowName: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  score?: number;
  issuesCount?: number;
  criticalCount?: number;
  summary?: string;
  error?: string;
  runId?: string;
  currentStep?: number;
  totalSteps?: number;
  stepName?: string;
  startedAt?: string;
  elapsedSeconds?: number;
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

// Expandable Flow Result Component
interface ExpandableFlowResultProps {
  result: AnalysisResult;
  onCopyPrompt: () => void;
  onCopyFixPrompt: () => void;
  onExport: () => void;
  isExporting: boolean;
  getFlowNumber: (flowId: string) => string | number;
}

function ExpandableFlowResult({
  result,
  onCopyPrompt,
  onCopyFixPrompt,
  onExport,
  isExporting,
  getFlowNumber,
}: ExpandableFlowResultProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
              <div className="min-w-0">
                <span className="font-semibold block truncate">{result.flowName}</span>
                {/* Enhanced: Show step progress while running */}
                {result.status === "running" && result.currentStep !== undefined && result.totalSteps !== undefined && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px]">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                        style={{ width: `${(result.currentStep / result.totalSteps) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-blue-600 whitespace-nowrap">
                      Step {result.currentStep}/{result.totalSteps}
                      {result.stepName && <span className="hidden sm:inline"> • {result.stepName}</span>}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {result.score !== undefined && (
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
            {/* Summary */}
            {result.summary && (
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                {result.summary}
              </p>
            )}

            {/* Stats */}
            {result.status === "completed" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className={`text-2xl font-bold ${(result.score ?? 0) >= 70 ? "text-green-600" : (result.score ?? 0) >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                    {result.score ?? 0}/100
                  </div>
                  <div className="text-xs text-muted-foreground">Gesamt-Score</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{result.issuesCount ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Issues</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{result.criticalCount ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Kritisch</div>
                </div>
              </div>
            )}

            {result.error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
                <span className="text-sm text-red-600">{result.error}</span>
              </div>
            )}

            {/* Actions */}
            {result.status === "completed" && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyFixPrompt();
                  }}
                  className="gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  Fix-Prompt kopieren
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyPrompt();
                  }}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Analyse-Prompt
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
                  ZIP Export
                </Button>
                <Link
                  to={`/admin/flow-comparison/${getFlowNumber(result.flowId)}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <Layers className="h-4 w-4" />
                    Varianten
                  </Button>
                </Link>
                <Link
                  to={`/umzugsofferten?v=${result.flowId.replace('umzugsofferten-', '')}`}
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

// SessionStorage key for state persistence (survives Lovable preview reloads)
const STORAGE_KEY = "uc:flow-automation-state";

function loadPersistedState(): Partial<{
  analysisResults: AnalysisResult[];
  selectedFlow: string;
  feedbackText: string;
  variantLetter: string;
  variantName: string;
  selectedVariantFlowNumber: number;
}> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function persistState(state: Record<string, unknown>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function FlowAutomationCenter() {
  // Load persisted state once on mount
  const persisted = loadPersistedState();

  // Analysis state - restore from sessionStorage if available
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>(() => {
    if (persisted.analysisResults?.length) {
      return persisted.analysisResults;
    }
    return FLOW_OPTIONS.map((flow) => ({
      flowId: flow.id,
      flowName: flow.label,
      status: "pending" as const,
    }));
  });
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentFlowAnalyzing, setCurrentFlowAnalyzing] = useState<string | null>(null);

  // Feedback state - restore from sessionStorage
  const [selectedFlow, setSelectedFlow] = useState(persisted.selectedFlow ?? "umzugsofferten-v9");
  const [feedbackText, setFeedbackText] = useState(persisted.feedbackText ?? "");
  const [variantLetter, setVariantLetter] = useState(persisted.variantLetter ?? "a");
  const [variantName, setVariantName] = useState(persisted.variantName ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentEntries, setRecentEntries] = useState<FeedbackEntry[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFlowId, setExportingFlowId] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(true); // Default to bulk mode for full AI responses
  const [selectedVariantFlowNumber, setSelectedVariantFlowNumber] = useState<number>(persisted.selectedVariantFlowNumber ?? 1);
  const [isAnalyzingVariants, setIsAnalyzingVariants] = useState(false);
  const [variantAnalysisProgress, setVariantAnalysisProgress] = useState(0);
  const [variantAnalysisResults, setVariantAnalysisResults] = useState<AnalysisResult[]>([]);
  const [dbVariantsCache, setDbVariantsCache] = useState<Record<number, Array<{ id: string; label: string; path: string }>>>({});
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);

  // Persist important state changes to sessionStorage
  useEffect(() => {
    persistState({
      analysisResults,
      selectedFlow,
      feedbackText,
      variantLetter,
      variantName,
      selectedVariantFlowNumber,
    });
  }, [analysisResults, selectedFlow, feedbackText, variantLetter, variantName, selectedVariantFlowNumber]);

  // Get flow number from ID - handles special "all-flows" case
  const getFlowNumber = (flowId: string) => {
    if (flowId === 'all-flows-v1-v9') return 'All';
    const match = flowId.match(/v(\d+)/);
    return match ? match[1] : "1";
  };

  // Get display label for version badge (handles multi-flow case)
  const getVersionBadgeLabel = (flowId: string, variantLabel: string) => {
    if (flowId === 'all-flows-v1-v9') {
      return `Multi.${variantLabel}`;
    }
    return `V${getFlowNumber(flowId)}.${variantLabel}`;
  };

  // Export single flow as ZIP
  const exportFlowZip = async (result: AnalysisResult) => {
    if (result.status !== "completed") return;
    setExportingFlowId(result.flowId);

    try {
      const zip = new JSZip();
      const flowFolder = zip.folder(result.flowId) as JSZip;

      // Add analysis summary
      const analysisJson = {
        flowId: result.flowId,
        flowName: result.flowName,
        score: result.score,
        issuesCount: result.issuesCount,
        criticalCount: result.criticalCount,
        summary: result.summary,
        exportedAt: new Date().toISOString(),
      };
      flowFolder.file("analysis.json", JSON.stringify(analysisJson, null, 2));

      // Add ChatGPT prompt
      const prompt = `# ${result.flowName} - Detailanalyse

Score: ${result.score ?? "—"}/100
Issues: ${result.issuesCount ?? "—"} (${result.criticalCount ?? "—"} kritisch)
${result.summary ? `\nSummary: ${result.summary}` : ""}

Bitte analysiere diesen Flow und gib mir:
1. Die 3 kritischsten UX-Probleme
2. Konkrete Code-Fixes (React + Tailwind)
3. Quick-Wins für sofortige Verbesserung

Fokus: Mobile-UX, Trust-Elemente, CTA-Optimierung.
Antworte auf Deutsch.`;
      flowFolder.file("chatgpt-prompt.md", prompt);

      // Fetch step metrics with screenshots and issues
      if (result.runId) {
        const { data: steps } = await supabase
          .from("flow_step_metrics")
          .select("*")
          .eq("run_id", result.runId)
          .order("step_number", { ascending: true });

        if (steps && steps.length > 0) {
          const stepsFolder = flowFolder.folder("steps") as JSZip;
          for (const step of steps) {
            const stepFolder = stepsFolder.folder(`step-${step.step_number}`) as JSZip;

            // Add step info
            stepFolder.file(
              "info.json",
              JSON.stringify(
                {
                  stepNumber: step.step_number,
                  stepName: step.step_name,
                  stepUrl: step.step_url,
                  issues: step.ai_issues,
                  suggestions: step.ai_suggestions,
                },
                null,
                2
              )
            );

            // Try to fetch desktop screenshot if URL exists
            if (step.desktop_screenshot_url && !step.desktop_screenshot_url.startsWith("data:")) {
              try {
                const resp = await fetch(step.desktop_screenshot_url);
                if (resp.ok) {
                  const blob = await resp.blob();
                  stepFolder.file("desktop.png", blob);
                }
              } catch {
                /* ignore */
              }
            }

            // Try to fetch mobile screenshot if URL exists
            if (step.mobile_screenshot_url && !step.mobile_screenshot_url.startsWith("data:")) {
              try {
                const resp = await fetch(step.mobile_screenshot_url);
                if (resp.ok) {
                  const blob = await resp.blob();
                  stepFolder.file("mobile.png", blob);
                }
              } catch {
                /* ignore */
              }
            }
          }
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${result.flowId}-export.zip`);
      toast.success(`${result.flowName} ZIP heruntergeladen`);
    } catch (e) {
      console.error("Export error:", e);
      toast.error("Fehler beim Export");
    } finally {
      setExportingFlowId(null);
    }
  };

  // Export all flows as single ZIP
  const exportAllFlowsZip = async () => {
    const completedResults = analysisResults.filter((r) => r.status === "completed");
    if (completedResults.length === 0) {
      toast.error("Keine abgeschlossenen Analysen zum Exportieren");
      return;
    }

    setIsExporting(true);

    try {
      const zip = new JSZip();

      // Add combined prompt
      const combinedPrompt = `# Umzugscheck.ch Flow-Analyse Ergebnisse

Hier sind die Analyse-Ergebnisse für alle ${completedResults.length} Flows:

${completedResults
  .map(
    (r) => `## ${r.flowName}
- **Score:** ${r.score ?? "—"}/100
- **Issues:** ${r.issuesCount ?? "—"} (${r.criticalCount ?? "—"} kritisch)
${r.summary ? `- **Summary:** ${r.summary}` : ""}`
  )
  .join("\n\n")}

---

**Aufgabe:** Analysiere diese Ergebnisse und gib mir für jeden Flow:
1. Die 3 kritischsten UX-Probleme
2. Konkrete Verbesserungsvorschläge mit Code-Beispielen (React/Tailwind)
3. Priorisierte Massnahmen für mehr Conversions

Fokus: Mobile-UX, Trust-Elemente, CTA-Optimierung, Formular-Vereinfachung.
Antworte auf Deutsch.`;

      zip.file("chatgpt-prompt-all.md", combinedPrompt);

      // Add each flow
      for (const result of completedResults) {
        const flowFolder = zip.folder(result.flowId) as JSZip;

        const analysisJson = {
          flowId: result.flowId,
          flowName: result.flowName,
          score: result.score,
          issuesCount: result.issuesCount,
          criticalCount: result.criticalCount,
          summary: result.summary,
          exportedAt: new Date().toISOString(),
        };
        flowFolder.file("analysis.json", JSON.stringify(analysisJson, null, 2));

        // Fetch step metrics
        if (result.runId) {
          const { data: steps } = await supabase
            .from("flow_step_metrics")
            .select("*")
            .eq("run_id", result.runId)
            .order("step_number", { ascending: true });

          if (steps && steps.length > 0) {
            const stepsFolder = flowFolder.folder("steps") as JSZip;
            for (const step of steps) {
              const stepFolder = stepsFolder.folder(`step-${step.step_number}`) as JSZip;
              stepFolder.file(
                "info.json",
                JSON.stringify(
                  {
                    stepNumber: step.step_number,
                    stepName: step.step_name,
                    stepUrl: step.step_url,
                    issues: step.ai_issues,
                    suggestions: step.ai_suggestions,
                  },
                  null,
                  2
                )
              );
            }
          }
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `umzugscheck-flows-export-${new Date().toISOString().slice(0, 10)}.zip`);
      toast.success("Alle Flows als ZIP heruntergeladen");
    } catch (e) {
      console.error("Export all error:", e);
      toast.error("Fehler beim Export");
    } finally {
      setIsExporting(false);
    }
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

      const runIds = Array.from(latestByFlow.values())
        .map((r: any) => r.id)
        .filter(Boolean);
      const countsByRun = new Map<string, { total: number; critical: number }>();

      // Backfill counts for older runs that didn't store metadata
      if (runIds.length > 0) {
        const { data: issues, error: issuesErr } = await supabase
          .from("flow_ux_issues")
          .select("run_id, severity")
          .in("run_id", runIds);

        if (!issuesErr) {
          (issues ?? []).forEach((i: any) => {
            const runId = i.run_id as string;
            const current = countsByRun.get(runId) ?? { total: 0, critical: 0 };
            current.total += 1;
            if (i.severity === "critical") current.critical += 1;
            countsByRun.set(runId, current);
          });
        }
      }

      // IMPORTANT: do NOT rebuild the whole list from scratch.
      // That felt like a "refresh" to users (all cards visually update at once).
      // Instead, merge newest completed results into the existing list and keep running states.
      setAnalysisResults((prev) => {
        const prevByFlow = new Map(prev.map((r) => [r.flowId, r] as const));

        return FLOW_OPTIONS.map((flow) => {
          const existing = prevByFlow.get(flow.id);

          // Keep running entries untouched (polling will update them).
          if (existing?.status === "running") return existing;

          const row = latestByFlow.get(flow.id);
          if (!row) {
            // Keep whatever we already had (completed/pending/error) to avoid a visual reset.
            if (existing) return existing;
            return { flowId: flow.id, flowName: flow.label, status: "pending" as const };
          }

          const meta = (row.metadata ?? {}) as any;
          const counts = countsByRun.get(row.id);

          return {
            flowId: flow.id,
            flowName: flow.label,
            status: "completed" as const,
            score: row.overall_score ?? undefined,
            summary: row.ai_summary ?? undefined,
            issuesCount: meta.issuesCount ?? meta.issues_count ?? counts?.total ?? undefined,
            criticalCount: meta.criticalCount ?? meta.critical_count ?? counts?.critical ?? undefined,
            runId: row.id,
          };
        });
      });

      toast.success("Letzte Analyse-Ergebnisse geladen");
    } catch (e) {
      console.error("loadLatestAnalysisResults error:", e);
      toast.error("Konnte letzte Analyse-Ergebnisse nicht laden");
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Poll running analysis runs (main + variants) so the UI updates automatically.
  const mainRunningRunIdsKey = useMemo(() => {
    return analysisResults
      .filter((r) => r.status === "running" && !!r.runId)
      .map((r) => r.runId as string)
      .sort()
      .join(",");
  }, [analysisResults]);

  useEffect(() => {
    if (!mainRunningRunIdsKey) return;

    let cancelled = false;
    const runIds = mainRunningRunIdsKey.split(",").filter(Boolean);

    const tick = async () => {
      if (cancelled || runIds.length === 0) return;

      const [{ data: runs, error: runsErr }, { data: issues, error: issuesErr }] = await Promise.all([
        supabase
          .from("flow_analysis_runs")
          .select("id, status, overall_score, ai_summary, metadata, steps_captured, total_steps")
          .in("id", runIds),
        supabase
          .from("flow_ux_issues")
          .select("run_id, severity")
          .in("run_id", runIds),
      ]);

      if (cancelled) return;
      if (runsErr) {
        console.warn("Polling flow_analysis_runs failed:", runsErr);
        return;
      }

      const runById = new Map<string, any>();
      (runs ?? []).forEach((r: any) => runById.set(r.id, r));

      const countsByRun = new Map<string, { total: number; critical: number }>();
      if (!issuesErr) {
        (issues ?? []).forEach((i: any) => {
          const rid = i.run_id as string;
          const current = countsByRun.get(rid) ?? { total: 0, critical: 0 };
          current.total += 1;
          if (i.severity === "critical") current.critical += 1;
          countsByRun.set(rid, current);
        });
      }

      setAnalysisResults((prev) =>
        prev.map((item) => {
          if (!item.runId) return item;
          const run = runById.get(item.runId);
          if (!run) return item;

          const meta = (run.metadata ?? {}) as any;
          const counts = countsByRun.get(item.runId);

          const status: AnalysisResult["status"] =
            run.status === "completed"
              ? "completed"
              : run.status === "failed"
              ? "error"
              : "running";

          return {
            ...item,
            status,
            score: run.overall_score ?? item.score,
            summary: run.ai_summary ?? item.summary,
            issuesCount: meta.issuesCount ?? counts?.total ?? item.issuesCount,
            criticalCount: meta.criticalCount ?? counts?.critical ?? item.criticalCount,
            currentStep: run.steps_captured ?? item.currentStep,
            totalSteps: run.total_steps ?? item.totalSteps,
            error: status === "error" ? meta?.error ?? item.error : undefined,
          };
        })
      );
    };

    // Immediate tick + interval
    tick();
    const id = window.setInterval(tick, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [mainRunningRunIdsKey]);

  const variantRunningRunIdsKey = useMemo(() => {
    return variantAnalysisResults
      .filter((r) => r.status === "running" && !!r.runId)
      .map((r) => r.runId as string)
      .sort()
      .join(",");
  }, [variantAnalysisResults]);

  useEffect(() => {
    if (!variantRunningRunIdsKey) return;

    let cancelled = false;
    const runIds = variantRunningRunIdsKey.split(",").filter(Boolean);

    const tick = async () => {
      if (cancelled || runIds.length === 0) return;

      const [{ data: runs, error: runsErr }, { data: issues, error: issuesErr }] = await Promise.all([
        supabase
          .from("flow_analysis_runs")
          .select("id, status, overall_score, ai_summary, metadata, steps_captured, total_steps")
          .in("id", runIds),
        supabase
          .from("flow_ux_issues")
          .select("run_id, severity")
          .in("run_id", runIds),
      ]);

      if (cancelled) return;
      if (runsErr) {
        console.warn("Polling variant flow_analysis_runs failed:", runsErr);
        return;
      }

      const runById = new Map<string, any>();
      (runs ?? []).forEach((r: any) => runById.set(r.id, r));

      const countsByRun = new Map<string, { total: number; critical: number }>();
      if (!issuesErr) {
        (issues ?? []).forEach((i: any) => {
          const rid = i.run_id as string;
          const current = countsByRun.get(rid) ?? { total: 0, critical: 0 };
          current.total += 1;
          if (i.severity === "critical") current.critical += 1;
          countsByRun.set(rid, current);
        });
      }

      setVariantAnalysisResults((prev) =>
        prev.map((item) => {
          if (!item.runId) return item;
          const run = runById.get(item.runId);
          if (!run) return item;

          const meta = (run.metadata ?? {}) as any;
          const counts = countsByRun.get(item.runId);

          const status: AnalysisResult["status"] =
            run.status === "completed"
              ? "completed"
              : run.status === "failed"
              ? "error"
              : "running";

          return {
            ...item,
            status,
            score: run.overall_score ?? item.score,
            summary: run.ai_summary ?? item.summary,
            issuesCount: meta.issuesCount ?? counts?.total ?? item.issuesCount,
            criticalCount: meta.criticalCount ?? counts?.critical ?? item.criticalCount,
            currentStep: run.steps_captured ?? item.currentStep,
            totalSteps: run.total_steps ?? item.totalSteps,
            error: status === "error" ? meta?.error ?? item.error : undefined,
          };
        })
      );
    };

    tick();
    const id = window.setInterval(tick, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [variantRunningRunIdsKey]);

  // Analyze all 9 flows
  const analyzeAllFlows = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const results: AnalysisResult[] = FLOW_OPTIONS.map((flow) => ({
      flowId: flow.id,
      flowName: flow.label,
      status: "pending" as const,
    }));
    setAnalysisResults(results);

    // Always use preview URL for flow analysis
    const baseUrl = 'https://preview--umzugscheckv2.lovable.app';

    for (let i = 0; i < FLOW_OPTIONS.length; i++) {
      const flow = FLOW_OPTIONS[i];
      setCurrentFlowAnalyzing(flow.id);

      // Update status to running
      setAnalysisResults((prev) =>
        prev.map((r) => (r.flowId === flow.id ? { ...r, status: "running" as const } : r))
      );

      try {
        const { data, error } = await supabase.functions.invoke("auto-analyze-flow", {
          body: {
            flowId: flow.id,
            runType: "manual",
            baseUrl,
          },
        });

        if (error) throw error;

        // IMPORTANT: auto-analyze-flow runs in the background and returns runId.
        // We keep the card in "running" state and poll the DB until it becomes completed.
        setAnalysisResults((prev) =>
          prev.map((r) =>
            r.flowId === flow.id
              ? {
                  ...r,
                  status: "running" as const,
                  runId: data?.runId ?? r.runId,
                  currentStep: 0,
                  totalSteps: data?.totalSteps ?? r.totalSteps,
                }
              : r
          )
        );

        toast.info(`${flow.label}: Analyse gestartet`);
      } catch (error) {
        console.error(`Error analyzing ${flow.id}:`, error);
        setAnalysisResults((prev) =>
          prev.map((r) =>
            r.flowId === flow.id
              ? {
                  ...r,
                  status: "error" as const,
                  error: error instanceof Error ? error.message : "Unbekannter Fehler",
                }
              : r
          )
        );
      }

      // Progress here means "started" (actual completion is tracked via polling)
      setAnalysisProgress(((i + 1) / FLOW_OPTIONS.length) * 100);
    }

    setIsAnalyzing(false);
    setCurrentFlowAnalyzing(null);
    toast.success("Analysen gestartet – Ergebnisse werden automatisch aktualisiert.");
  };

  // Load variants from database for a specific flow number
  const loadVariantsFromDb = async (flowNum: number): Promise<Array<{ id: string; label: string; path: string }>> => {
    // Check cache first
    if (dbVariantsCache[flowNum]) {
      return dbVariantsCache[flowNum];
    }

    const flowId = `umzugsofferten-v${flowNum}`;
    const { data: dbVariants, error } = await supabase
      .from('flow_versions')
      .select('flow_code, version_name, flow_id')
      .eq('flow_id', flowId)
      .eq('is_active', true)
      .order('flow_code');

    if (error) {
      console.error('Error loading variants:', error);
      return [];
    }

    const variants: Array<{ id: string; label: string; path: string }> = [];

    // Add main flow from config
    const mainKey = `umzugsofferten-v${flowNum}`;
    const mainFlow = FLOW_CONFIGS[mainKey];
    if (mainFlow) {
      variants.push({ id: mainKey, label: mainFlow.label, path: mainFlow.path });
    }

    // Add variants from database
    dbVariants?.forEach((v) => {
      if (!v.flow_code) return;
      
      // Skip if it's just the main flow baseline
      const isBaseline = v.flow_code.toLowerCase() === `v${flowNum}` || v.flow_code.toLowerCase() === mainKey;
      if (isBaseline) return;

      // Parse flow_code like "V1.b" or "v1b"
      const flowCode = v.flow_code.toLowerCase().replace('.', '');
      const label = v.version_name || flowCode.toUpperCase();
      
      // Determine the path - check SUB_VARIANT_CONFIGS first, then generate
      const subConfig = SUB_VARIANT_CONFIGS[flowCode];
      const path = subConfig?.path || `/umzugsofferten-${flowCode}`;

      // Avoid duplicates
      if (!variants.find(existing => existing.id === flowCode)) {
        variants.push({ id: flowCode, label, path });
      }
    });

    // Also add from SUB_VARIANT_CONFIGS for completeness
    Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
      const match = id.match(/^v(\d+)([a-z])$/i);
      if (match && parseInt(match[1], 10) === flowNum) {
        if (!variants.find(existing => existing.id === id)) {
          variants.push({ id, label: config.label, path: config.path });
        }
      }
    });

    // Cache the result
    setDbVariantsCache(prev => ({ ...prev, [flowNum]: variants }));
    return variants;
  };

  // Get all variants for a specific flow number (uses cached DB data)
  const getVariantsForFlowNumber = (flowNum: number) => {
    return dbVariantsCache[flowNum] || [];
  };

  // Load variants when flow number changes
  useEffect(() => {
    const loadVariants = async () => {
      setIsLoadingVariants(true);
      await loadVariantsFromDb(selectedVariantFlowNumber);
      setIsLoadingVariants(false);
    };
    loadVariants();
  }, [selectedVariantFlowNumber]);

  // Analyze all variants of a specific flow number
  const analyzeFlowVariants = async (flowNum: number) => {
    // Load variants fresh from DB
    const variants = await loadVariantsFromDb(flowNum);
    if (variants.length === 0) {
      toast.error(`Keine Varianten für V${flowNum} gefunden`);
      return;
    }

    setIsAnalyzingVariants(true);
    setVariantAnalysisProgress(0);
    setVariantAnalysisResults(
      variants.map((v) => ({
        flowId: v.id,
        flowName: v.label,
        status: "pending" as const,
      }))
    );

    // Always use preview URL for flow analysis
    const baseUrl = 'https://preview--umzugscheckv2.lovable.app';

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      setCurrentFlowAnalyzing(variant.id);

      setVariantAnalysisResults((prev) =>
        prev.map((r) => (r.flowId === variant.id ? { ...r, status: "running" as const } : r))
      );

      try {
        const { data, error } = await supabase.functions.invoke("auto-analyze-flow", {
          body: {
            flowId: variant.id,
            runType: "manual",
            baseUrl,
          },
        });

        if (error) throw error;

        setVariantAnalysisResults((prev) =>
          prev.map((r) =>
            r.flowId === variant.id
              ? {
                  ...r,
                  status: "running" as const,
                  runId: data?.runId ?? r.runId,
                  currentStep: 0,
                  totalSteps: data?.totalSteps ?? r.totalSteps,
                }
              : r
          )
        );

        toast.info(`${variant.label}: Analyse gestartet`);
      } catch (error) {
        console.error(`Error analyzing ${variant.id}:`, error);
        setVariantAnalysisResults((prev) =>
          prev.map((r) =>
            r.flowId === variant.id
              ? {
                  ...r,
                  status: "error" as const,
                  error: error instanceof Error ? error.message : "Unbekannter Fehler",
                }
              : r
          )
        );
      }

      setVariantAnalysisProgress(((i + 1) / variants.length) * 100);
    }

    setIsAnalyzingVariants(false);
    setCurrentFlowAnalyzing(null);
    toast.success(`Varianten-Analysen gestartet – Ergebnisse werden automatisch aktualisiert.`);
  };

  // Generate Lovable implementation prompt
  const generateImplementationPrompt = () => {
    const flowNumber = getFlowNumber(selectedFlow);
    const isMultiFlow = selectedFlow === 'all-flows-v1-v9';
    const componentName = isMultiFlow 
      ? `Multi${variantLetter.toUpperCase()}FeedbackBased`
      : `V${flowNumber}${variantLetter.toLowerCase()}FeedbackBased`;
    const versionLabel = isMultiFlow ? `Multi.${variantLetter}` : `V${flowNumber}.${variantLetter}`;

    if (isMultiFlow) {
      return `# Implementiere ${versionLabel}: ${variantName || 'Multi-Flow Optimierung'}

## Komponente: \`${componentName}.tsx\`

## Feedback:

${feedbackText}

## Erstelle die Komponente in src/components/calculator-variants/${componentName}.tsx

Diese Variante basiert auf einer Analyse aller Flows (V1-V9) und implementiert die übergreifenden Verbesserungen.
`;
    }

    return `# Implementiere ${versionLabel}: ${variantName || 'Feedback-basierte Optimierung'}

## Komponente: \`${componentName}.tsx\`

## Feedback:

${feedbackText}

## Erstelle die Komponente in src/components/calculator-variants/${componentName}.tsx
`;
  };

  // Submit feedback and generate prompt
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast.error("Bitte Feedback eingeben");
      return;
    }

    setIsSubmitting(true);
    const isMultiFlow = selectedFlow === 'all-flows-v1-v9';
    const versionLabel = isMultiFlow ? `Multi.${variantLetter}` : `V${getFlowNumber(selectedFlow)}.${variantLetter}`;

    try {
      // Save to database
      const { error } = await supabase
        .from("flow_feedback_variants")
        .insert({
          flow_id: selectedFlow,
          variant_label: variantLetter.toLowerCase(),
          variant_name: variantName.trim() || `${versionLabel} - AI Feedback`,
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
    const isMultiFlow = entry.flow_id === 'all-flows-v1-v9';
    const flowNumber = getFlowNumber(entry.flow_id);
    const componentName = isMultiFlow 
      ? `Multi${entry.variant_label.toUpperCase()}FeedbackBased`
      : `V${flowNumber}${entry.variant_label.toLowerCase()}FeedbackBased`;
    const versionLabel = getVersionBadgeLabel(entry.flow_id, entry.variant_label);

    const prompt = `# Implementiere ${versionLabel}: ${entry.variant_name}

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

              {/* Strategic Deep Analysis CTA - Flow Analysis Hub */}
              <div className="p-4 border-2 border-primary/30 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Flow Analysis Hub</h3>
                      <p className="text-sm text-muted-foreground">
                        Ranking • Tiefenanalyse • Gewinner • Ultimate Flow • AI-Fix - alles an einem Ort
                      </p>
                    </div>
                  </div>
                  <Link to="/admin/flow-analysis">
                    <Button className="gap-2" size="lg">
                      <Sparkles className="h-5 w-5" />
                      Flow Analysis Hub öffnen
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Links to Comparison Pages */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground mr-2">
                  <Layers className="h-4 w-4 inline mr-1" />
                  Varianten vergleichen:
                </span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Link key={num} to={`/admin/flow-comparison/${num}`}>
                    <Button variant="outline" size="sm" className="h-7 px-2">
                      V{num}
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Variant-specific Analysis */}
              <div className="p-4 border rounded-lg bg-muted/20 space-y-3">
                <Label className="text-sm font-medium">Alle Varianten eines Flows analysieren:</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={selectedVariantFlowNumber.toString()}
                    onValueChange={(v) => setSelectedVariantFlowNumber(parseInt(v, 10))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          V{num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => analyzeFlowVariants(selectedVariantFlowNumber)}
                    disabled={isAnalyzingVariants || isAnalyzing}
                    className="gap-2"
                  >
                    {isAnalyzingVariants ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analysiere...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Alle V{selectedVariantFlowNumber} Varianten analysieren
                      </>
                    )}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    ({getVariantsForFlowNumber(selectedVariantFlowNumber).length} Varianten)
                  </span>
                </div>

                {isAnalyzingVariants && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>V{selectedVariantFlowNumber} Varianten</span>
                      <span>{Math.round(variantAnalysisProgress)}%</span>
                    </div>
                    <Progress value={variantAnalysisProgress} />
                  </div>
                )}

                {variantAnalysisResults.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ergebnisse:</span>
                      <Link to={`/admin/flow-comparison/${selectedVariantFlowNumber}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Detaillierte Ergebnisse ansehen
                        </Button>
                      </Link>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {variantAnalysisResults.map((r) => (
                        <div
                          key={r.flowId}
                          className={`p-3 rounded-lg border ${
                            r.status === 'completed'
                              ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                              : r.status === 'error'
                              ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                              : r.status === 'running'
                              ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                              : 'bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{r.flowId}</span>
                            {r.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {r.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                            {r.status === 'running' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                          </div>
                          {r.score !== undefined && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Score: {r.score}/100 • {r.issuesCount} Issues
                              {r.criticalCount !== undefined && r.criticalCount > 0 && (
                                <span className="text-red-600 ml-1">({r.criticalCount} kritisch)</span>
                              )}
                            </div>
                          )}
                          {r.runId && (
                            <Link 
                              to={`/admin/flow-comparison/${selectedVariantFlowNumber}?runId=${r.runId}`}
                              className="text-xs text-primary hover:underline mt-1 inline-block"
                            >
                              Details →
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  onClick={analyzeAllFlows}
                  disabled={isAnalyzing || isAnalyzingVariants}
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
                      Alle 9 Haupt-Flows analysieren (V1-V9)
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={loadLatestAnalysisResults}
                  disabled={isAnalyzing || isLoadingResults || isAnalyzingVariants}
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

              {/* Enhanced: Detailed progress view with step info */}
              {isAnalyzing && (
                <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        Analyse läuft im Hintergrund...
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/50 border-blue-300">
                      {Math.round(analysisProgress)}% abgeschlossen
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Gesamtfortschritt</span>
                      <span>{analysisResults.filter(r => r.status === 'completed').length} von {FLOW_OPTIONS.length} Flows</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>

                  {currentFlowAnalyzing && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>Aktuell: <strong>{analysisResults.find(r => r.flowId === currentFlowAnalyzing)?.flowName || currentFlowAnalyzing}</strong></span>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    💡 Sie können diese Seite verlassen - die Analyse wird im Hintergrund fortgesetzt. 
                    Ergebnisse werden automatisch gespeichert.
                  </p>
                </div>
              )}

              {analysisResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label className="text-sm font-medium">Ergebnisse:</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!analysisResults.some((r) => r.status === "completed")}
                        onClick={async () => {
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
                        <Copy className="h-4 w-4" />
                        Prompt kopieren
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        disabled={!analysisResults.some((r) => r.status === "completed") || isExporting}
                        onClick={exportAllFlowsZip}
                        className="gap-2"
                      >
                        {isExporting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Archive className="h-4 w-4" />
                        )}
                        Alle als ZIP
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
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

                      const copyFixPrompt = async () => {
                        const fixPrompt = `# Fix für ${result.flowName}

## Aktuelle Situation:
- **Score:** ${result.score ?? "—"}/100
- **Issues:** ${result.issuesCount ?? "—"} (${result.criticalCount ?? "—"} kritisch)
${result.summary ? `- **Zusammenfassung:** ${result.summary}` : ""}

## Aufgabe:
Bitte behebe die kritischen UX-Probleme in diesem Flow. Fokus auf:

1. **Mobile-Optimierung:** Touch-Targets mindestens 44x44px, Abstände optimieren
2. **Trust-Elemente:** Badges, Bewertungen, Garantien sichtbarer machen
3. **CTA-Optimierung:** Buttons kontrastreicher, klare Handlungsaufforderungen
4. **Formular-UX:** Weniger Felder, bessere Labels, Inline-Validierung

## Technische Anforderungen:
- React + TypeScript
- Tailwind CSS
- Mobile-First Design
- Barrierefreie Komponenten

Zeige mir die konkreten Code-Änderungen als Diffs.`;
                        await navigator.clipboard.writeText(fixPrompt);
                        toast.success(`Fix-Prompt für ${result.flowName} kopiert!`, {
                          description: "Füge ihn in Lovable oder ChatGPT ein."
                        });
                      };

                      return (
                        <ExpandableFlowResult
                          key={result.flowId}
                          result={result}
                          onCopyPrompt={copyPrompt}
                          onCopyFixPrompt={copyFixPrompt}
                          onExport={() => exportFlowZip(result)}
                          isExporting={exportingFlowId === result.flowId}
                          getFlowNumber={getFlowNumber}
                        />
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
                      {FEEDBACK_FLOW_OPTIONS.map(flow => (
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
                      → {getVersionBadgeLabel(selectedFlow, variantLetter)}
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

              {/* Feedback Input Mode Toggle */}
              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <Label className="text-sm font-medium">Eingabe-Modus:</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={!bulkMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBulkMode(false)}
                  >
                    Einzelne Punkte
                  </Button>
                  <Button
                    type="button"
                    variant={bulkMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBulkMode(true)}
                  >
                    Komplette AI-Antwort
                  </Button>
                </div>
              </div>

              {/* Feedback Input */}
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {bulkMode ? "Komplette ChatGPT / Gemini Antwort" : "ChatGPT / Gemini Feedback"}
                </Label>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={bulkMode 
                    ? `Füge hier die komplette ChatGPT/Gemini Antwort ein...

Die AI-Antwort wird automatisch als Kontext für die Implementierung verwendet.
Du kannst die gesamte Antwort inklusive Codebeispielen einfügen.`
                    : `Füge hier das AI-Feedback ein...

Beispiel:
## Verbesserungsvorschläge für V${getFlowNumber(selectedFlow)}

1. **CTA-Button optimieren**: Der "Weiter" Button sollte grösser und auffälliger sein
2. **Progress-Anzeige verbessern**: Prozentanzeige hinzufügen
3. **Mobile Touch-Targets**: Mindestens 44px für alle klickbaren Elemente
...`}
                  rows={bulkMode ? 20 : 12}
                  className="font-mono text-sm mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {feedbackText.length} Zeichen
                  {bulkMode && feedbackText.length > 1000 && (
                    <span className="text-green-600 ml-2">✓ Umfangreiche Antwort erkannt</span>
                  )}
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
                            {getVersionBadgeLabel(entry.flow_id, entry.variant_label)}
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
