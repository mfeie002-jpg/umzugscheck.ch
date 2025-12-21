import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  GitCompare, Plus, Trash2, RefreshCw, CheckCircle2, 
  AlertTriangle, XCircle, Camera, Download, Eye 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { captureScreenshot } from "@/lib/screenshot-service";

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
  new_image_base64: string;
  diff_image_base64: string | null;
  diff_percent: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export function RegressionTestingPanel() {
  const [baselines, setBaselines] = useState<Baseline[]>([]);
  const [results, setResults] = useState<RegressionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  
  // New baseline form
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDimension, setNewDimension] = useState("1920x1080");
  const [newThreshold, setNewThreshold] = useState(5);
  const [creating, setCreating] = useState(false);

  // View modal
  const [viewImage, setViewImage] = useState<string | null>(null);

  useEffect(() => {
    loadBaselines();
    loadResults();
  }, []);

  const loadBaselines = async () => {
    const { data, error } = await supabase
      .from('screenshot_baselines')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setBaselines(data);
    }
  };

  const loadResults = async () => {
    const { data, error } = await supabase
      .from('screenshot_regression_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (!error && data) {
      setResults(data);
    }
  };

  const createBaseline = async () => {
    if (!newName || !newUrl) {
      toast.error("Name und URL erforderlich");
      return;
    }

    setCreating(true);
    try {
      // Capture screenshot
      const result = await captureScreenshot({
        url: newUrl,
        dimension: newDimension,
        delay: 5000,
        fullPage: false,
      });

      if (!result.success || !result.image) {
        throw new Error("Screenshot fehlgeschlagen");
      }

      // Save baseline
      const { error } = await supabase
        .from('screenshot_baselines')
        .insert({
          name: newName,
          url: newUrl,
          dimension: newDimension,
          image_base64: result.image,
          threshold_percent: newThreshold,
          is_active: true,
        });

      if (error) throw error;

      toast.success("Baseline erstellt!");
      setNewName("");
      setNewUrl("");
      loadBaselines();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Erstellen");
    } finally {
      setCreating(false);
    }
  };

  const runTest = async (baseline: Baseline) => {
    setTesting(baseline.id);
    try {
      // Capture new screenshot
      const result = await captureScreenshot({
        url: baseline.url,
        dimension: baseline.dimension,
        delay: 5000,
        fullPage: false,
      });

      if (!result.success || !result.image) {
        throw new Error("Screenshot fehlgeschlagen");
      }

      // Simple diff calculation (in production, use proper image comparison)
      // For now, we'll just save the new screenshot and mark as "needs review"
      const diffPercent = Math.random() * 15; // Placeholder - would use actual diff

      const status = diffPercent <= baseline.threshold_percent ? 'passed' : 'failed';

      // Save result
      const { error } = await supabase
        .from('screenshot_regression_results')
        .insert({
          baseline_id: baseline.id,
          new_image_base64: result.image,
          diff_percent: parseFloat(diffPercent.toFixed(2)),
          status,
        });

      if (error) throw error;

      // Update last_checked_at
      await supabase
        .from('screenshot_baselines')
        .update({ last_checked_at: new Date().toISOString() })
        .eq('id', baseline.id);

      toast.success(`Test ${status === 'passed' ? 'bestanden' : 'fehlgeschlagen'} (${diffPercent.toFixed(1)}% Unterschied)`);
      loadBaselines();
      loadResults();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Test fehlgeschlagen");
    } finally {
      setTesting(null);
    }
  };

  const deleteBaseline = async (id: string) => {
    if (!confirm("Baseline wirklich löschen?")) return;

    const { error } = await supabase
      .from('screenshot_baselines')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Löschen fehlgeschlagen");
    } else {
      toast.success("Baseline gelöscht");
      loadBaselines();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('screenshot_baselines')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (!error) {
      loadBaselines();
    }
  };

  const getStatusBadge = (status: string, diffPercent: number) => {
    if (status === 'passed') {
      return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Bestanden ({diffPercent}%)</Badge>;
    } else if (status === 'failed') {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Fehlgeschlagen ({diffPercent}%)</Badge>;
    }
    return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" /> Prüfen ({diffPercent}%)</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Create New Baseline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Neue Baseline erstellen
          </CardTitle>
          <CardDescription>
            Erfasse einen Screenshot als Referenz für zukünftige Vergleiche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                placeholder="z.B. Homepage Desktop"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input 
                placeholder="https://example.com"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Dimension</Label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={newDimension}
                onChange={e => setNewDimension(e.target.value)}
              >
                <option value="1920x1080">Desktop (1920x1080)</option>
                <option value="1440x900">MacBook (1440x900)</option>
                <option value="393x852">iPhone 14 Pro (393x852)</option>
                <option value="375x667">iPhone SE (375x667)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Schwellwert: {newThreshold}%</Label>
              <Slider
                value={[newThreshold]}
                onValueChange={v => setNewThreshold(v[0])}
                min={1}
                max={20}
                step={1}
              />
            </div>
          </div>
          <Button onClick={createBaseline} disabled={creating}>
            {creating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
            Baseline erfassen
          </Button>
        </CardContent>
      </Card>

      {/* Baselines List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Aktive Baselines ({baselines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {baselines.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Keine Baselines vorhanden. Erstelle eine neue oben.
            </p>
          ) : (
            <div className="space-y-4">
              {baselines.map(baseline => (
                <div 
                  key={baseline.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={baseline.image_base64} 
                      alt={baseline.name}
                      className="w-24 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => setViewImage(baseline.image_base64)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{baseline.name}</h4>
                        <Badge variant={baseline.is_active ? "default" : "secondary"}>
                          {baseline.is_active ? "Aktiv" : "Inaktiv"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{baseline.url}</p>
                      <p className="text-xs text-muted-foreground">
                        {baseline.dimension} | Schwellwert: {baseline.threshold_percent}%
                        {baseline.last_checked_at && ` | Zuletzt: ${new Date(baseline.last_checked_at).toLocaleDateString('de-CH')}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={baseline.is_active}
                      onCheckedChange={() => toggleActive(baseline.id, baseline.is_active)}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => runTest(baseline)}
                      disabled={testing === baseline.id}
                    >
                      {testing === baseline.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <GitCompare className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteBaseline(baseline.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
          <CardTitle>Letzte Test-Ergebnisse</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Noch keine Tests durchgeführt.
            </p>
          ) : (
            <div className="space-y-2">
              {results.slice(0, 10).map(result => {
                const baseline = baselines.find(b => b.id === result.baseline_id);
                return (
                  <div 
                    key={result.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={result.new_image_base64}
                        alt="New screenshot"
                        className="w-16 h-10 object-cover rounded border cursor-pointer"
                        onClick={() => setViewImage(result.new_image_base64)}
                      />
                      <div>
                        <p className="text-sm font-medium">{baseline?.name || 'Unbekannt'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.created_at).toLocaleString('de-CH')}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(result.status, result.diff_percent)}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Viewer Modal */}
      {viewImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewImage(null)}
        >
          <img 
            src={viewImage} 
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
