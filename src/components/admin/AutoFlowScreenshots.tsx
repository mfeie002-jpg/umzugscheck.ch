import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/data/constants";
import {
  Camera,
  Download,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
  Smartphone,
  Monitor,
  Package,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { captureScreenshot } from "@/lib/screenshot-service";

// Flow definitions with their steps (Offerten-Funnel Varianten)
// Uses uc_capture mode for deterministic screenshots.
// IMPORTANT: Step definitions MUST match the stepMap inside each flow component.
const CALCULATOR_FLOWS = [
  {
    id: "umzugsofferten",
    name: "V1 - Control",
    path: "/umzugsofferten",
    steps: [
      { step: 1, name: "Step 1 - Umzugstyp" },
      { step: 2, name: "Step 2 - Details" },
      { step: 3, name: "Step 3 - Firmen" },
      { step: 4, name: "Step 4 - Kontakt" },
    ],
  },
  {
    id: "umzugsofferten-v2",
    name: "V2",
    path: "/umzugsofferten-v2",
    steps: [
      { step: 1, name: "Step 1 - Intro" },
      { step: 2, name: "Step 2 - Details" },
      { step: 3, name: "Step 3 - Paket" },
      { step: 4, name: "Step 4 - Extras" },
      { step: 5, name: "Step 5 - Termin" },
      { step: 6, name: "Step 6 - Kontakt" },
    ],
  },
  {
    id: "umzugsofferten-v3",
    name: "V3",
    path: "/umzugsofferten-v3",
    steps: [
      { step: 1, name: "Step 1 - Slider" },
      { step: 2, name: "Step 2 - Details" },
      { step: 3, name: "Step 3 - Bestätigung" },
      { step: 4, name: "Step 4 - Kontakt" },
    ],
  },
  {
    id: "umzugsofferten-v4",
    name: "V4",
    path: "/umzugsofferten-v4",
    steps: [
      { step: 1, name: "Step 1 - Video" },
      { step: 2, name: "Step 2 - Analyse" },
      { step: 3, name: "Step 3 - Offerten" },
      { step: 4, name: "Step 4 - Extras" },
      { step: 5, name: "Step 5 - Buchung" },
      { step: 6, name: "Step 6 - Bestätigung" },
    ],
  },
  {
    id: "umzugsofferten-v5",
    name: "V5",
    path: "/umzugsofferten-v5",
    steps: [
      { step: 1, name: "Step 1 - Details" },
      { step: 2, name: "Step 2 - Services" },
      { step: 3, name: "Step 3 - Inventar" },
      { step: 4, name: "Step 4 - Offerten" },
      { step: 5, name: "Step 5 - Buchung" },
      { step: 6, name: "Step 6 - Bestätigung" },
    ],
  },
  {
    id: "umzugsofferten-v6",
    name: "V6",
    path: "/umzugsofferten-v6",
    steps: [
      { step: 1, name: "Step 1 - Intro" },
      { step: 2, name: "Step 2 - Scan" },
      { step: 3, name: "Step 3 - Service" },
      { step: 4, name: "Step 4 - Preis" },
      { step: 5, name: "Step 5 - Buchung" },
      { step: 6, name: "Step 6 - Dashboard" },
    ],
  },
  {
    id: "umzugsofferten-v7",
    name: "V7",
    path: "/umzugsofferten-v7",
    steps: [
      { step: 1, name: "Step 1 - Start" },
      { step: 2, name: "Step 2 - Konfigurieren" },
      { step: 3, name: "Step 3 - Checkout" },
      { step: 4, name: "Step 4 - Dashboard" },
      { step: 5, name: "Step 5 - Tracking" },
    ],
  },
  {
    id: "umzugsofferten-v8",
    name: "V8",
    path: "/umzugsofferten-v8",
    steps: [
      { step: 1, name: "Step 1 - Welcome" },
      { step: 2, name: "Step 2 - Scan" },
      { step: 3, name: "Step 3 - Vorschlag" },
      { step: 4, name: "Step 4 - Bestätigen" },
      { step: 5, name: "Step 5 - Dashboard" },
      { step: 6, name: "Step 6 - Moving Day" },
    ],
  },
  {
    id: "umzugsofferten-v9",
    name: "V9",
    path: "/umzugsofferten-v9",
    steps: [
      { step: 1, name: "Step 1 - Start" },
      { step: 2, name: "Step 2 - Refine" },
      { step: 3, name: "Step 3 - Service" },
      { step: 4, name: "Step 4 - Customize" },
      { step: 5, name: "Step 5 - Firmen" },
      { step: 6, name: "Step 6 - Bestätigen" },
    ],
  },
];

const DIMENSIONS = {
  desktop: { value: "1920x1080", label: "Desktop (1920x1080)" },
  mobile: { value: "390x844", label: "Mobile (390x844)" },
};

interface CaptureResult {
  flowId: string;
  step: number;
  stepName: string;
  dimension: string;
  success: boolean;
  imageBase64?: string;
  error?: string;
}

export function AutoFlowScreenshots() {
  // Default to current origin (preview) instead of production
  // This ensures we capture what's actually deployed in the current preview
  const defaultPreviewUrl = useMemo(() => {
    if (typeof window === "undefined") return SITE_CONFIG.url.replace(/\/$/, "");
    return window.location.origin.replace(/\/$/, "");
  }, []);

  const [baseUrlOverride, setBaseUrlOverride] = useState<string>(defaultPreviewUrl);
  const [selectedFlows, setSelectedFlows] = useState<string[]>(
    CALCULATOR_FLOWS.map((f) => f.id)
  );
  const [captureDesktop, setCaptureDesktop] = useState(true);
  const [captureMobile, setCaptureMobile] = useState(true);
  const [fullPage, setFullPage] = useState(true);
  const [delayMs, setDelayMs] = useState(25000); // 25s default for lazy-loaded SPAs

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentItem: "" });
  const [results, setResults] = useState<CaptureResult[]>([]);

  // Debug: run the same capture multiple times to verify stability
  const [debugFlowId, setDebugFlowId] = useState(CALCULATOR_FLOWS[0]?.id || "");
  const [debugStep, setDebugStep] = useState(1);
  const [debugRuns, setDebugRuns] = useState(10);
  const [debugRunning, setDebugRunning] = useState(false);
  const [debugStats, setDebugStats] = useState<{ ok: number; fail: number; lastError?: string } | null>(null);

  const getBaseUrl = () => (baseUrlOverride.trim() || defaultPreviewUrl).replace(/\/$/, "");

  const buildCaptureUrl = (flowPath: string, step: number) => {
    const baseUrl = getBaseUrl();
    // uc_cb busts caches for screenshot tooling.
    // uc_render=1 triggers render-mode patches (eager images, IntersectionObserver bypass)
    return `${baseUrl}${flowPath}?uc_capture=1&uc_step=${step}&uc_render=1&uc_cb=${Date.now()}`;
  };

  const toggleFlow = (flowId: string) => {
    setSelectedFlows((prev) =>
      prev.includes(flowId)
        ? prev.filter((id) => id !== flowId)
        : [...prev, flowId]
    );
  };

  const selectAllFlows = () => {
    setSelectedFlows(CALCULATOR_FLOWS.map((f) => f.id));
  };

  const deselectAllFlows = () => {
    setSelectedFlows([]);
  };

  const calculateTotalCaptures = () => {
    const dimensions = (captureDesktop ? 1 : 0) + (captureMobile ? 1 : 0);
    return selectedFlows.reduce((acc, flowId) => {
      const flow = CALCULATOR_FLOWS.find((f) => f.id === flowId);
      return acc + (flow?.steps.length || 0) * dimensions;
    }, 0);
  };

  const runAutomaticCapture = async () => {
    if (selectedFlows.length === 0) {
      toast.error("Bitte wähle mindestens einen Flow aus");
      return;
    }
    if (!captureDesktop && !captureMobile) {
      toast.error("Bitte wähle mindestens eine Auflösung");
      return;
    }

    setIsRunning(true);
    setResults([]);
    const totalCaptures = calculateTotalCaptures();
    setProgress({ current: 0, total: totalCaptures, currentItem: "" });

    const newResults: CaptureResult[] = [];
    let captureCount = 0;

    const dimensionsToCapture = [
      ...(captureDesktop ? [DIMENSIONS.desktop] : []),
      ...(captureMobile ? [DIMENSIONS.mobile] : []),
    ];

    for (const flowId of selectedFlows) {
      const flow = CALCULATOR_FLOWS.find((f) => f.id === flowId);
      if (!flow) continue;

      for (const stepDef of flow.steps) {
        for (const dim of dimensionsToCapture) {
          captureCount++;
          const itemLabel = `${flow.name} - Step ${stepDef.step} (${dim.label})`;
          setProgress({
            current: captureCount,
            total: totalCaptures,
            currentItem: itemLabel,
          });

          const captureUrl = buildCaptureUrl(flow.path, stepDef.step);

          try {
            const result = await captureScreenshot({
              url: captureUrl,
              dimension: dim.value,
              delay: delayMs,
              format: "png",
              fullPage,
              noCache: true,
            });

            const captureResult: CaptureResult = {
              flowId: flow.id,
              step: stepDef.step,
              stepName: stepDef.name,
              dimension: dim.value,
              success: result.success,
              imageBase64: result.image,
              error: result.error,
            };

            newResults.push(captureResult);
            setResults([...newResults]);

            if (!result.success) {
              console.error(`Failed: ${itemLabel}`, result.error);
            }
          } catch (error) {
            const captureResult: CaptureResult = {
              flowId: flow.id,
              step: stepDef.step,
              stepName: stepDef.name,
              dimension: dim.value,
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            };
            newResults.push(captureResult);
            setResults([...newResults]);
          }

          // Small delay between captures
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }

    setIsRunning(false);
    const successCount = newResults.filter((r) => r.success).length;
    toast.success(
      `Fertig! ${successCount}/${totalCaptures} Screenshots erfolgreich`
    );
  };

  const downloadAllAsZip = async () => {
    const successfulResults = results.filter((r) => r.success && r.imageBase64);
    if (successfulResults.length === 0) {
      toast.error("Keine Screenshots zum Download verfügbar");
      return;
    }

    const zip = new JSZip();

    for (const result of successfulResults) {
      const flow = CALCULATOR_FLOWS.find((f) => f.id === result.flowId);
      const dimLabel = result.dimension.includes("390") ? "mobile" : "desktop";
      const fileName = `${result.flowId}-${flow?.name || "unknown"}/step-${result.step}-${result.stepName.replace(/\s+/g, "_")}-${dimLabel}.png`;

      // Convert base64 to blob
      const base64Data = result.imageBase64!.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      zip.file(fileName, base64Data, { base64: true });
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `flow-screenshots-${new Date().toISOString().split("T")[0]}.zip`);
    toast.success("ZIP-Download gestartet!");
  };

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <div className="space-y-6">
      {/* Flow Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Automatische Flow-Screenshots
          </CardTitle>
          <CardDescription>
            Erfasse alle Calculator-Flows automatisch mit Demo-Daten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base URL + capture settings */}
          <div className="grid grid-cols-1 gap-3 rounded-lg border border-border p-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Base URL (wo die Screenshots gemacht werden)</label>
              <Input
                value={baseUrlOverride}
                onChange={(e) => setBaseUrlOverride(e.target.value)}
                placeholder={defaultPreviewUrl}
              />
              <p className="text-xs text-muted-foreground">
                Tipp: Muss öffentlich erreichbar sein (Preview-Domains haben oft eine Login-Wall).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Delay (ms)</label>
                <Input
                  type="number"
                  value={delayMs}
                  min={0}
                  step={1000}
                  onChange={(e) => setDelayMs(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <Checkbox checked={fullPage} onCheckedChange={(v) => setFullPage(Boolean(v))} />
                <span className="text-sm">Full Page</span>
              </div>

              <div className="flex items-center justify-end sm:justify-start pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBaseUrlOverride(defaultPreviewUrl);
                    toast.success("Base URL zurückgesetzt");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAllFlows}>
              Alle auswählen
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAllFlows}>
              Alle abwählen
            </Button>
          </div>

          {/* Flow Grid */}
          <div className="grid grid-cols-3 gap-3">
            {CALCULATOR_FLOWS.map((flow) => (
              <div
                key={flow.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedFlows.includes(flow.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => toggleFlow(flow.id)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFlows.includes(flow.id)}
                    onCheckedChange={() => toggleFlow(flow.id)}
                  />
                  <div>
                    <div className="font-medium">
                      {flow.id.toUpperCase()} - {flow.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {flow.steps.length} Steps
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dimension Selection */}
          <div className="flex gap-4 pt-2">
            <div
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                captureDesktop ? "border-primary bg-primary/5" : "border-border"
              }`}
              onClick={() => setCaptureDesktop(!captureDesktop)}
            >
              <Checkbox
                checked={captureDesktop}
                onCheckedChange={() => setCaptureDesktop(!captureDesktop)}
              />
              <Monitor className="h-4 w-4" />
              <span>Desktop (1920x1080)</span>
            </div>
            <div
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                captureMobile ? "border-primary bg-primary/5" : "border-border"
              }`}
              onClick={() => setCaptureMobile(!captureMobile)}
            >
              <Checkbox
                checked={captureMobile}
                onCheckedChange={() => setCaptureMobile(!captureMobile)}
              />
              <Smartphone className="h-4 w-4" />
              <span>Mobile (390x844)</span>
            </div>
          </div>

          {/* Summary & Action */}
          <div className="flex flex-col gap-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {calculateTotalCaptures()}
                </span>{" "}
                Screenshots werden erstellt
              </div>
              <Button
                onClick={runAutomaticCapture}
                disabled={isRunning || selectedFlows.length === 0}
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Läuft...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Alle Screenshots erstellen
                  </>
                )}
              </Button>
            </div>

            {/* Stability test */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end rounded-lg border border-border p-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Debug Flow</label>
                <Input value={debugFlowId} onChange={(e) => setDebugFlowId(e.target.value)} placeholder="umzugsofferten" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Step</label>
                <Input
                  type="number"
                  min={1}
                  value={debugStep}
                  onChange={(e) => setDebugStep(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Runs</label>
                <Input
                  type="number"
                  min={1}
                  max={25}
                  value={debugRuns}
                  onChange={(e) => setDebugRuns(Math.min(25, Math.max(1, Number(e.target.value) || 10)))}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  disabled={debugRunning}
                  onClick={async () => {
                    const flow = CALCULATOR_FLOWS.find((f) => f.id === debugFlowId);
                    if (!flow) {
                      toast.error("Unbekannter Flow (ID prüfen)");
                      return;
                    }

                    const urlToTest = buildCaptureUrl(flow.path, debugStep);
                    setDebugRunning(true);
                    setDebugStats(null);

                    let ok = 0;
                    let fail = 0;
                    let lastError: string | undefined;

                    for (let i = 0; i < debugRuns; i++) {
                      try {
                        const r = await captureScreenshot({
                          url: urlToTest,
                          dimension: DIMENSIONS.desktop.value,
                          delay: delayMs,
                          format: "png",
                          fullPage,
                          noCache: true,
                        });
                        if (r.success) ok++;
                        else {
                          fail++;
                          lastError = r.error;
                        }
                      } catch (e) {
                        fail++;
                        lastError = e instanceof Error ? e.message : "Unknown error";
                      }
                      await new Promise((resolve) => setTimeout(resolve, 900));
                    }

                    setDebugStats({ ok, fail, lastError });
                    setDebugRunning(false);
                    toast.success(`Debug fertig: ${ok}/${debugRuns} OK`);
                  }}
                >
                  {debugRunning ? "Testing…" : "Run Test"}
                </Button>
              </div>

              {debugStats && (
                <div className="md:col-span-4 text-xs text-muted-foreground">
                  Ergebnis: <span className="text-foreground font-medium">{debugStats.ok}</span> OK, {debugStats.fail} Fail
                  {debugStats.lastError ? ` • Last error: ${debugStats.lastError}` : ""}
                </div>
              )}
            </div>
          </div>

          {/* end Flow Selection card */}
        </CardContent>
      </Card>

      {/* Progress */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress.currentItem}</span>
                <span>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <Progress
                value={(progress.current / progress.total) * 100}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ergebnisse
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {successCount} OK
                  </Badge>
                  {failCount > 0 && (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      {failCount} Fehler
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAllAsZip}
                  disabled={successCount === 0}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Als ZIP herunterladen
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {results.map((result, idx) => {
                  const flow = CALCULATOR_FLOWS.find(
                    (f) => f.id === result.flowId
                  );
                  const dimLabel = result.dimension.includes("390")
                    ? "Mobile"
                    : "Desktop";
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded border ${
                        result.success
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">
                          {flow?.id.toUpperCase()} - {flow?.name}
                        </span>
                        <Badge variant="outline">Step {result.step}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {result.stepName}
                        </span>
                        <Badge variant="secondary">{dimLabel}</Badge>
                      </div>
                      {result.success && result.imageBase64 && (
                        <img
                          src={result.imageBase64}
                          alt={`${flow?.name} Step ${result.step}`}
                          className="h-12 w-auto rounded border"
                        />
                      )}
                      {result.error && (
                        <span className="text-xs text-red-600 max-w-[200px] truncate">
                          {result.error}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
