import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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

// Flow definitions with their steps
const CALCULATOR_FLOWS = [
  {
    id: "v1",
    name: "Classic",
    path: "/umzugsrechner",
    steps: [
      { step: 0, name: "Start - Locations" },
      { step: 1, name: "Wohnungsgrösse" },
      { step: 2, name: "Services" },
      { step: 3, name: "Datum" },
      { step: 4, name: "Kontakt" },
      { step: 5, name: "Bestätigung" },
    ],
  },
  {
    id: "v2",
    name: "Slider",
    path: "/umzugsrechner-v2",
    steps: [
      { step: 0, name: "Service-Level Slider" },
      { step: 1, name: "Details" },
      { step: 2, name: "Firmenauswahl" },
      { step: 3, name: "Kontakt" },
      { step: 4, name: "Bestätigung" },
    ],
  },
  {
    id: "v3",
    name: "Visual",
    path: "/umzugsrechner-v3",
    steps: [
      { step: 0, name: "Visuelle Auswahl" },
      { step: 1, name: "Details" },
      { step: 2, name: "Services" },
      { step: 3, name: "Firmenauswahl" },
      { step: 4, name: "Kontakt" },
      { step: 5, name: "Bestätigung" },
    ],
  },
  {
    id: "v4",
    name: "Chat",
    path: "/umzugsrechner-v4",
    steps: [
      { step: 0, name: "Chat Start" },
      { step: 1, name: "Location" },
      { step: 2, name: "Wohnung" },
      { step: 3, name: "Services" },
      { step: 4, name: "Datum" },
      { step: 5, name: "Firmen" },
      { step: 6, name: "Kontakt" },
      { step: 7, name: "Bestätigung" },
    ],
  },
  {
    id: "v5",
    name: "Gamified",
    path: "/umzugsrechner-v5",
    steps: [
      { step: 0, name: "Level Start" },
      { step: 1, name: "Mission 1" },
      { step: 2, name: "Mission 2" },
      { step: 3, name: "Mission 3" },
      { step: 4, name: "Firmen" },
      { step: 5, name: "Kontakt" },
      { step: 6, name: "Erfolg" },
    ],
  },
  {
    id: "v6",
    name: "Split-Screen",
    path: "/umzugsrechner-v6",
    steps: [
      { step: 0, name: "Split Start" },
      { step: 1, name: "Details" },
      { step: 2, name: "Services" },
      { step: 3, name: "Firmen" },
      { step: 4, name: "Kontakt" },
      { step: 5, name: "Bestätigung" },
    ],
  },
  {
    id: "v7",
    name: "Story",
    path: "/umzugsrechner-v7",
    steps: [
      { step: 0, name: "Story Intro" },
      { step: 1, name: "Kapitel 1" },
      { step: 2, name: "Kapitel 2" },
      { step: 3, name: "Kapitel 3" },
      { step: 4, name: "Firmen" },
      { step: 5, name: "Kontakt" },
      { step: 6, name: "Happy End" },
    ],
  },
  {
    id: "v8",
    name: "Single-Page",
    path: "/umzugsrechner-v8",
    steps: [
      { step: 0, name: "Komplettansicht" },
      { step: 1, name: "Mit Daten" },
    ],
  },
  {
    id: "v9",
    name: "Zero Friction",
    path: "/umzugsrechner-v9",
    steps: [
      { step: 0, name: "Start" },
      { step: 1, name: "Verfeinerung" },
      { step: 2, name: "Service" },
      { step: 3, name: "Anpassung" },
      { step: 4, name: "Optionen" },
      { step: 5, name: "Firmen" },
      { step: 6, name: "Bestätigung" },
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
  const [selectedFlows, setSelectedFlows] = useState<string[]>(
    CALCULATOR_FLOWS.map((f) => f.id)
  );
  const [captureDesktop, setCaptureDesktop] = useState(true);
  const [captureMobile, setCaptureMobile] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentItem: "" });
  const [results, setResults] = useState<CaptureResult[]>([]);

  const getBaseUrl = () => {
    // Screenshot providers cannot access Lovable preview/sandbox domains (login wall).
    // Default to the public site URL so automation works reliably.
    if (typeof window === "undefined") return SITE_CONFIG.url;

    const { hostname, origin } = window.location;
    const isLovableHost = hostname.includes("lovable.app") || hostname.includes("lovableproject.com");

    if (isLovableHost) return SITE_CONFIG.url.replace(/\/$/, "");
    return origin;
  };

  const buildCaptureUrl = (flowPath: string, step: number) => {
    const baseUrl = getBaseUrl().replace(/\/$/, "");
    return `${baseUrl}${flowPath}?uc_capture=1&uc_step=${step}&uc_render=1`;
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
              delay: 8000, // Give time for animations
              format: "png",
              fullPage: false,
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
          <div className="flex items-center justify-between pt-4 border-t">
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
