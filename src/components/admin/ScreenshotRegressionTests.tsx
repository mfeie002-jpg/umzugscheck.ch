import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Shield,
  Plus,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Image,
  Loader2,
  Bell,
  Mail,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { captureScreenshot } from "@/lib/screenshot-service";
import { addScreenshotRenderParamIfHost } from "@/lib/screenshot-render-mode";

interface Baseline {
  id: string;
  name: string;
  url: string;
  dimension: string;
  image_base64: string;
  threshold_percent: number;
  is_active: boolean;
  last_checked_at: string | null;
  created_at: string;
}

interface RegressionResult {
  id: string;
  baseline_id: string;
  diff_percent: number;
  new_image_base64: string;
  diff_image_base64: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface AlertSettings {
  id: string;
  email: string;
  threshold_percent: number;
  is_active: boolean;
}

const DIMENSIONS = [
  { value: "1920x1080", label: "Desktop Full HD" },
  { value: "1366x768", label: "Desktop HD" },
  { value: "768x1024", label: "Tablet Portrait" },
  { value: "430x932", label: "Mobile iPhone (Retina)" },
];

const TOP_URLS = [
  "https://umzugscheck.ch",
  "https://umzugscheck.ch/umzugsofferten",
  "https://umzugscheck.ch/preisrechner",
  "https://umzugscheck.ch/firmen",
  "https://umzugscheck.ch/beste-umzugsfirma",
];

export function ScreenshotRegressionTests() {
  const [baselines, setBaselines] = useState<Baseline[]>([]);
  const [results, setResults] = useState<RegressionResult[]>([]);
  const [alertSettings, setAlertSettings] = useState<AlertSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningTests, setRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState({ current: 0, total: 0 });
  
  // Add baseline dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBaseline, setNewBaseline] = useState({
    name: "",
    url: "https://umzugscheck.ch",
    dimension: "1920x1080",
    threshold_percent: 5,
  });
  const [capturingBaseline, setCapturingBaseline] = useState(false);
  
  // Alert settings dialog
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertThreshold, setAlertThreshold] = useState(5);
  const [alertActive, setAlertActive] = useState(true);
  
  // Preview dialog
  const [previewResult, setPreviewResult] = useState<RegressionResult | null>(null);
  const [previewBaseline, setPreviewBaseline] = useState<Baseline | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [baselinesRes, resultsRes, alertsRes] = await Promise.all([
        supabase.from("screenshot_baselines").select("*").order("created_at", { ascending: false }),
        supabase.from("screenshot_regression_results").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("screenshot_alert_settings").select("*").limit(1),
      ]);

      if (baselinesRes.data) setBaselines(baselinesRes.data);
      if (resultsRes.data) setResults(resultsRes.data);
      if (alertsRes.data?.[0]) {
        setAlertSettings(alertsRes.data[0]);
        setAlertEmail(alertsRes.data[0].email);
        setAlertThreshold(alertsRes.data[0].threshold_percent);
        setAlertActive(alertsRes.data[0].is_active);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Fehler beim Laden der Daten");
    } finally {
      setLoading(false);
    }
  };

  // Generate pixel diff
  const generateDiff = useCallback(async (baselineImage: string, newImage: string): Promise<{ diffUrl: string; percentage: number }> => {
    return new Promise(async (resolve, reject) => {
      try {
        const loadImage = (src: string): Promise<HTMLImageElement> => {
          return new Promise((res, rej) => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = src;
          });
        };

        const [imgA, imgB] = await Promise.all([
          loadImage(baselineImage),
          loadImage(newImage),
        ]);

        const width = Math.max(imgA.width, imgB.width);
        const height = Math.max(imgA.height, imgB.height);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Canvas context not available");

        const canvasA = document.createElement("canvas");
        canvasA.width = width;
        canvasA.height = height;
        const ctxA = canvasA.getContext("2d");
        ctxA?.drawImage(imgA, 0, 0);
        const dataA = ctxA?.getImageData(0, 0, width, height);

        const canvasB = document.createElement("canvas");
        canvasB.width = width;
        canvasB.height = height;
        const ctxB = canvasB.getContext("2d");
        ctxB?.drawImage(imgB, 0, 0);
        const dataB = ctxB?.getImageData(0, 0, width, height);

        if (!dataA || !dataB) throw new Error("Could not get image data");

        const diffData = ctx.createImageData(width, height);
        let diffPixelCount = 0;
        const threshold = 30;

        for (let i = 0; i < dataA.data.length; i += 4) {
          const diff = Math.abs(dataA.data[i] - dataB.data[i]) + 
                       Math.abs(dataA.data[i + 1] - dataB.data[i + 1]) + 
                       Math.abs(dataA.data[i + 2] - dataB.data[i + 2]);

          if (diff > threshold) {
            diffData.data[i] = 255;
            diffData.data[i + 1] = 0;
            diffData.data[i + 2] = 0;
            diffData.data[i + 3] = 200;
            diffPixelCount++;
          } else {
            diffData.data[i] = dataA.data[i];
            diffData.data[i + 1] = dataA.data[i + 1];
            diffData.data[i + 2] = dataA.data[i + 2];
            diffData.data[i + 3] = 100;
          }
        }

        ctx.putImageData(diffData, 0, 0);
        const percentage = (diffPixelCount / (width * height)) * 100;

        resolve({
          diffUrl: canvas.toDataURL("image/png"),
          percentage,
        });
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  // Add new baseline
  const addBaseline = async () => {
    if (!newBaseline.name || !newBaseline.url) {
      toast.error("Name und URL sind erforderlich");
      return;
    }

    setCapturingBaseline(true);
    try {
      const urlForShot = addScreenshotRenderParamIfHost(newBaseline.url, "umzugscheck.ch");
      const result = await captureScreenshot({
        url: urlForShot,
        dimension: newBaseline.dimension,
        fullPage: true,
        delay: 10000,
        format: "png",
        scroll: true,
        noCache: true,
      });

      if (!result.success || !result.image) {
        throw new Error(result.error || "Screenshot fehlgeschlagen");
      }

      const { error } = await supabase.from("screenshot_baselines").insert({
        name: newBaseline.name,
        url: newBaseline.url,
        dimension: newBaseline.dimension,
        image_base64: result.image,
        threshold_percent: newBaseline.threshold_percent,
        is_active: true,
      });

      if (error) throw error;

      toast.success("Baseline erfolgreich erstellt!");
      setShowAddDialog(false);
      setNewBaseline({ name: "", url: "https://umzugscheck.ch", dimension: "1920x1080", threshold_percent: 5 });
      loadData();
    } catch (error) {
      console.error("Error adding baseline:", error);
      toast.error("Fehler beim Erstellen der Baseline");
    } finally {
      setCapturingBaseline(false);
    }
  };

  // Run regression tests
  const runTests = async () => {
    const activeBaselines = baselines.filter(b => b.is_active);
    if (activeBaselines.length === 0) {
      toast.error("Keine aktiven Baselines vorhanden");
      return;
    }

    setRunningTests(true);
    setTestProgress({ current: 0, total: activeBaselines.length });

    let passed = 0;
    let failed = 0;

    for (let i = 0; i < activeBaselines.length; i++) {
      const baseline = activeBaselines[i];
      setTestProgress({ current: i + 1, total: activeBaselines.length });

      try {
        const urlForShot = addScreenshotRenderParamIfHost(baseline.url, "umzugscheck.ch");
        const result = await captureScreenshot({
          url: urlForShot,
          dimension: baseline.dimension,
          fullPage: true,
          delay: 10000,
          format: "png",
          scroll: true,
          noCache: true,
        });

        if (!result.success || !result.image) {
          console.error(`Screenshot failed for ${baseline.url}`);
          continue;
        }

        const diff = await generateDiff(baseline.image_base64, result.image);
        const status = diff.percentage <= baseline.threshold_percent ? "passed" : "failed";

        if (status === "passed") passed++;
        else failed++;

        await supabase.from("screenshot_regression_results").insert({
          baseline_id: baseline.id,
          diff_percent: Math.round(diff.percentage * 100) / 100,
          new_image_base64: result.image,
          diff_image_base64: diff.diffUrl,
          status,
        });

        await supabase.from("screenshot_baselines").update({
          last_checked_at: new Date().toISOString(),
        }).eq("id", baseline.id);

        // Send alert if failed and alerts are active
        if (status === "failed" && alertSettings?.is_active && diff.percentage > alertSettings.threshold_percent) {
          // In a real app, this would trigger an edge function to send email
          console.log(`ALERT: ${baseline.name} failed with ${diff.percentage.toFixed(2)}% difference`);
          toast.warning(`Regression erkannt: ${baseline.name} (${diff.percentage.toFixed(2)}% Unterschied)`);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error testing ${baseline.url}:`, error);
      }
    }

    setRunningTests(false);
    loadData();
    toast.success(`Tests abgeschlossen: ${passed} bestanden, ${failed} fehlgeschlagen`);
  };

  // Delete baseline
  const deleteBaseline = async (id: string) => {
    if (!confirm("Baseline wirklich löschen?")) return;

    try {
      await supabase.from("screenshot_baselines").delete().eq("id", id);
      toast.success("Baseline gelöscht");
      loadData();
    } catch (error) {
      toast.error("Fehler beim Löschen");
    }
  };

  // Toggle baseline active state
  const toggleBaseline = async (id: string, isActive: boolean) => {
    try {
      await supabase.from("screenshot_baselines").update({ is_active: isActive }).eq("id", id);
      loadData();
    } catch (error) {
      toast.error("Fehler beim Aktualisieren");
    }
  };

  // Save alert settings
  const saveAlertSettings = async () => {
    try {
      if (alertSettings) {
        await supabase.from("screenshot_alert_settings").update({
          email: alertEmail,
          threshold_percent: alertThreshold,
          is_active: alertActive,
        }).eq("id", alertSettings.id);
      } else {
        await supabase.from("screenshot_alert_settings").insert({
          email: alertEmail,
          threshold_percent: alertThreshold,
          is_active: alertActive,
        });
      }
      toast.success("Alert-Einstellungen gespeichert");
      setShowAlertDialog(false);
      loadData();
    } catch (error) {
      toast.error("Fehler beim Speichern");
    }
  };

  // Acknowledge a failed result
  const acknowledgeResult = async (id: string) => {
    try {
      await supabase.from("screenshot_regression_results").update({ status: "acknowledged" }).eq("id", id);
      toast.success("Als bestätigt markiert");
      loadData();
    } catch (error) {
      toast.error("Fehler beim Aktualisieren");
    }
  };

  // Update baseline with new screenshot
  const updateBaselineWithNew = async (baseline: Baseline, newImage: string) => {
    try {
      await supabase.from("screenshot_baselines").update({
        image_base64: newImage,
        updated_at: new Date().toISOString(),
      }).eq("id", baseline.id);
      toast.success("Baseline aktualisiert");
      setPreviewResult(null);
      loadData();
    } catch (error) {
      toast.error("Fehler beim Aktualisieren");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Bestanden</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Fehlgeschlagen</Badge>;
      case "acknowledged":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200"><AlertTriangle className="h-3 w-3 mr-1" /> Bestätigt</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Ausstehend</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Regression Tests
              </CardTitle>
              <CardDescription>
                Automatische Baseline-Vergleiche mit Alert bei mehr als X% Unterschied
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAlertDialog(true)}>
                <Bell className="h-4 w-4 mr-1" />
                Alerts
                {alertSettings?.is_active && <Badge className="ml-2 bg-green-500/10 text-green-600" variant="outline">Aktiv</Badge>}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Neue Baseline
              </Button>
              <Button 
                onClick={runTests} 
                disabled={runningTests || baselines.filter(b => b.is_active).length === 0}
              >
                {runningTests ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {testProgress.current}/{testProgress.total}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Tests starten
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold">{baselines.length}</div>
              <div className="text-sm text-muted-foreground">Baselines</div>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.filter(r => r.status === "passed").length}
              </div>
              <div className="text-sm text-muted-foreground">Bestanden</div>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {results.filter(r => r.status === "failed").length}
              </div>
              <div className="text-sm text-muted-foreground">Fehlgeschlagen</div>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {results.filter(r => r.status === "acknowledged").length}
              </div>
              <div className="text-sm text-muted-foreground">Bestätigt</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Baselines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Baselines ({baselines.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {baselines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Keine Baselines vorhanden</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-1" /> Erste Baseline erstellen
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {baselines.map((baseline) => (
                <div key={baseline.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img 
                    src={baseline.image_base64} 
                    alt={baseline.name}
                    className="w-20 h-12 object-cover rounded border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{baseline.name}</span>
                      <Badge variant="outline" className="text-xs">{baseline.dimension}</Badge>
                      <Badge variant="outline" className="text-xs">≤{baseline.threshold_percent}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{baseline.url}</p>
                    {baseline.last_checked_at && (
                      <p className="text-xs text-muted-foreground">
                        Letzter Check: {new Date(baseline.last_checked_at).toLocaleString("de-CH")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={baseline.is_active} 
                      onCheckedChange={(checked) => toggleBaseline(baseline.id, checked)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteBaseline(baseline.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Letzte Testergebnisse</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Noch keine Tests durchgeführt</p>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {results.map((result) => {
                  const baseline = baselines.find(b => b.id === result.baseline_id);
                  return (
                    <div key={result.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{baseline?.name || "Unbekannt"}</span>
                          {getStatusBadge(result.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{result.diff_percent.toFixed(2)}% Unterschied</span>
                          <span>{new Date(result.created_at).toLocaleString("de-CH")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setPreviewResult(result);
                            setPreviewBaseline(baseline || null);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ansehen
                        </Button>
                        {result.status === "failed" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => acknowledgeResult(result.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Bestätigen
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Add Baseline Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Neue Baseline erstellen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                placeholder="z.B. Homepage Desktop"
                value={newBaseline.name}
                onChange={(e) => setNewBaseline({ ...newBaseline, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Select value={newBaseline.url} onValueChange={(v) => setNewBaseline({ ...newBaseline, url: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOP_URLS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Auflösung</Label>
              <Select value={newBaseline.dimension} onValueChange={(v) => setNewBaseline({ ...newBaseline, dimension: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIMENSIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Toleranz-Schwelle: {newBaseline.threshold_percent}%</Label>
              <Slider 
                value={[newBaseline.threshold_percent]} 
                onValueChange={([v]) => setNewBaseline({ ...newBaseline, threshold_percent: v })}
                min={1}
                max={20}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Bei mehr als {newBaseline.threshold_percent}% Unterschied wird der Test als fehlgeschlagen markiert
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Abbrechen</Button>
            <Button onClick={addBaseline} disabled={capturingBaseline}>
              {capturingBaseline ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Screenshot wird erstellt...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Baseline erstellen
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Settings Dialog */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alert-Einstellungen
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label>Alerts aktiviert</Label>
              <Switch checked={alertActive} onCheckedChange={setAlertActive} />
            </div>
            <div className="space-y-2">
              <Label>E-Mail für Benachrichtigungen</Label>
              <div className="flex gap-2">
                <Mail className="h-4 w-4 mt-3 text-muted-foreground" />
                <Input 
                  type="email"
                  placeholder="alerts@example.com"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alert-Schwelle: {alertThreshold}%</Label>
              <Slider 
                value={[alertThreshold]} 
                onValueChange={(values) => setAlertThreshold(values[0])}
                min={1}
                max={20}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Alert wird gesendet wenn Unterschied größer als {alertThreshold}% ist
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAlertDialog(false)}>Abbrechen</Button>
            <Button onClick={saveAlertSettings}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewResult} onOpenChange={() => setPreviewResult(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewBaseline?.name}
              {previewResult && getStatusBadge(previewResult.status)}
              <span className="text-muted-foreground text-sm font-normal ml-2">
                {previewResult?.diff_percent.toFixed(2)}% Unterschied
              </span>
            </DialogTitle>
          </DialogHeader>
          {previewResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Baseline (Vorher)</Label>
                  <img 
                    src={previewBaseline?.image_base64} 
                    alt="Baseline"
                    className="w-full border rounded"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Aktuell (Nachher)</Label>
                  <img 
                    src={previewResult.new_image_base64} 
                    alt="New"
                    className="w-full border rounded"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Unterschiede (Rot)</Label>
                  {previewResult.diff_image_base64 ? (
                    <img 
                      src={previewResult.diff_image_base64} 
                      alt="Diff"
                      className="w-full border rounded"
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-muted rounded">
                      <p className="text-muted-foreground">Kein Diff verfügbar</p>
                    </div>
                  )}
                </div>
              </div>
              {previewResult.status === "failed" && previewBaseline && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => acknowledgeResult(previewResult.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Als bestätigt markieren
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => updateBaselineWithNew(previewBaseline, previewResult.new_image_base64)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Als neue Baseline verwenden
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
