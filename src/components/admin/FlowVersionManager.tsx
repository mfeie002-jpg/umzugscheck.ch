import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { 
  Save, 
  GitCompare, 
  History, 
  Plus, 
  Trash2, 
  Star, 
  Play, 
  MessageSquare,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from "lucide-react";

// Helper to ensure proper data URL format for screenshots
const toPngDataUrl = (value: string) =>
  value.startsWith("data:") ? value : `data:image/png;base64,${value}`;

// Extract flow major version from the flowId used in admin tools.
// Examples:
// - "umzugsofferten" -> 1
// - "umzugsofferten-v3" -> 3
const getFlowMajorFromFlowId = (flowId: string): number | null => {
  if (flowId === "umzugsofferten") return 1;
  const match = flowId.match(/-v(\d+)/i);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
};

const parseMinorFromVersionNumber = (raw: string): number | null => {
  const cleaned = String(raw).trim().replace(/^v/i, "");
  const parts = cleaned.split(".");
  const minorRaw = parts.length > 1 ? parts[1] : parts[0];
  const n = Number.parseInt(minorRaw, 10);
  return Number.isFinite(n) ? n : null;
};

interface FlowVersion {
  id: string;
  flow_id: string;
  version_number: string;
  version_name: string | null;
  description: string | null;
  created_at: string;
  step_configs: Json;
  screenshots: Json;
  html_snapshots: Json;
  ai_feedback: string | null;
  ai_feedback_source: string | null;
  ai_feedback_date: string | null;
  is_baseline: boolean;
  is_live: boolean;
  tags: string[];
}

interface FlowStep {
  step: number;
  name: string;
  description: string;
  screenshotDesktop?: string;
  screenshotMobile?: string;
  html?: string;
  url?: string;
}

interface FlowVersionManagerProps {
  flowId: string;
  currentSteps: FlowStep[];
  onVersionSelect?: (version: FlowVersion) => void;
}

export function FlowVersionManager({ flowId, currentSteps, onVersionSelect }: FlowVersionManagerProps) {
  const [versions, setVersions] = useState<FlowVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [newVersionNumber, setNewVersionNumber] = useState("");
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionDescription, setNewVersionDescription] = useState("");
  const [selectedVersionA, setSelectedVersionA] = useState<FlowVersion | null>(null);
  const [selectedVersionB, setSelectedVersionB] = useState<FlowVersion | null>(null);
  const [compareStep, setCompareStep] = useState(1);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedVersionForFeedback, setSelectedVersionForFeedback] = useState<FlowVersion | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSource, setFeedbackSource] = useState("chatgpt");

  useEffect(() => {
    fetchVersions();
  }, [flowId]);

  const flowMajor = getFlowMajorFromFlowId(flowId);

  const formatVersion = (raw?: string | null): string => {
    if (!raw) return "";
    const cleaned = String(raw).trim().replace(/^v/i, "");
    const parts = cleaned.split(".");
    // if stored like "1.5" -> minor=5; if stored like "5" -> minor=5
    const minor = parts.length > 1 ? parts[1] : parts[0];

    // In the Admin Flow tools, we want the major version to follow the selected flow (V1..V9)
    // so comparisons don't accidentally show v1.x while reviewing V3.
    if (flowMajor !== null) return `v${flowMajor}.${minor}`;
    return `v${cleaned}`;
  };

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('flow_versions')
        .select('*')
        .eq('flow_id', flowId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (err) {
      console.error('Failed to fetch versions:', err);
      toast.error('Versionen konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  const suggestNextVersion = (): string => {
    // If we're inside a specific V1..V9 flow in the admin tools, always suggest that major.
    if (flowMajor !== null) {
      const minors = versions
        .map((v) => parseMinorFromVersionNumber(v.version_number))
        .filter((n): n is number => n !== null);

      const nextMinor = (minors.length ? Math.max(...minors) : 0) + 1;
      let candidate = `${flowMajor}.${nextMinor}`;
      const existingVersions = new Set(versions.map((v) => v.version_number));
      // Ensure uniqueness (in case user mixed formats)
      while (existingVersions.has(candidate) || existingVersions.has(`v${candidate}`)) {
        const minor = (parseMinorFromVersionNumber(candidate) ?? nextMinor) + 1;
        candidate = `${flowMajor}.${minor}`;
      }
      return candidate;
    }

    if (versions.length === 0) return "1.0";

    // Find the highest version number and increment
    const versionNumbers = versions.map((v) => {
      const parts = v.version_number.split('.');
      const major = parseInt(parts[0]) || 1;
      const minor = parseInt(parts[1]) || 0;
      return { major, minor, raw: v.version_number };
    });

    // Sort by major then minor descending
    versionNumbers.sort((a, b) => {
      if (a.major !== b.major) return b.major - a.major;
      return b.minor - a.minor;
    });

    const highest = versionNumbers[0];
    let nextMajor = highest.major;
    let nextMinor = highest.minor + 1;

    // Check if this version already exists, if so increment until unique
    let candidate = `${nextMajor}.${nextMinor}`;
    const existingVersions = new Set(versions.map((v) => v.version_number));

    while (existingVersions.has(candidate)) {
      nextMinor++;
      candidate = `${nextMajor}.${nextMinor}`;
    }

    return candidate;
  };

  const saveVersion = async () => {
    if (!newVersionNumber.trim()) {
      toast.error('Versionsnummer erforderlich');
      return;
    }

    try {
      // Convert current steps to storage format
      const screenshots: Record<string, string> = {};
      const htmlSnapshots: Record<string, string> = {};
      
      currentSteps.forEach((step) => {
        if (step.screenshotDesktop) {
          screenshots[`step${step.step}Desktop`] = step.screenshotDesktop;
        }
        if (step.screenshotMobile) {
          screenshots[`step${step.step}Mobile`] = step.screenshotMobile;
        }
        if (step.html) {
          htmlSnapshots[`step${step.step}`] = step.html;
        }
      });

      const { error } = await supabase
        .from('flow_versions')
        .insert({
          flow_id: flowId,
          version_number: newVersionNumber.trim(),
          version_name: newVersionName.trim() || null,
          description: newVersionDescription.trim() || null,
          step_configs: currentSteps.map(s => ({
            step: s.step,
            name: s.name,
            description: s.description,
            url: s.url
          })),
          screenshots,
          html_snapshots: htmlSnapshots,
          is_baseline: versions.length === 0, // First version is baseline
        });

      if (error) throw error;

      toast.success(`Version ${newVersionNumber} gespeichert`);
      setSaveDialogOpen(false);
      setNewVersionNumber("");
      setNewVersionName("");
      setNewVersionDescription("");
      fetchVersions();
    } catch (err) {
      console.error('Failed to save version:', err);
      toast.error('Version konnte nicht gespeichert werden');
    }
  };

  const deleteVersion = async (version: FlowVersion) => {
    if (!confirm(`Version ${version.version_number} wirklich löschen?`)) return;

    try {
      const { error } = await supabase
        .from('flow_versions')
        .delete()
        .eq('id', version.id);

      if (error) throw error;
      toast.success('Version gelöscht');
      fetchVersions();
    } catch (err) {
      console.error('Failed to delete version:', err);
      toast.error('Löschen fehlgeschlagen');
    }
  };

  const setAsBaseline = async (version: FlowVersion) => {
    try {
      // Remove baseline from all other versions
      await supabase
        .from('flow_versions')
        .update({ is_baseline: false })
        .eq('flow_id', flowId);

      // Set this version as baseline
      const { error } = await supabase
        .from('flow_versions')
        .update({ is_baseline: true })
        .eq('id', version.id);

      if (error) throw error;
      toast.success(`Version ${version.version_number} als Baseline gesetzt`);
      fetchVersions();
    } catch (err) {
      console.error('Failed to set baseline:', err);
      toast.error('Baseline setzen fehlgeschlagen');
    }
  };

  const saveFeedback = async () => {
    if (!selectedVersionForFeedback || !feedbackText.trim()) return;

    try {
      const { error } = await supabase
        .from('flow_versions')
        .update({
          ai_feedback: feedbackText.trim(),
          ai_feedback_source: feedbackSource,
          ai_feedback_date: new Date().toISOString(),
        })
        .eq('id', selectedVersionForFeedback.id);

      if (error) throw error;
      toast.success('Feedback gespeichert');
      setFeedbackDialogOpen(false);
      setFeedbackText("");
      setSelectedVersionForFeedback(null);
      fetchVersions();
    } catch (err) {
      console.error('Failed to save feedback:', err);
      toast.error('Feedback speichern fehlgeschlagen');
    }
  };

  const openCompare = (versionA: FlowVersion, versionB?: FlowVersion) => {
    setSelectedVersionA(versionA);
    setSelectedVersionB(versionB || (versions.find(v => v.is_baseline) || versions[versions.length - 1]) || null);
    setCompareStep(1);
    setCompareDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Lade Versionen...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Flow Versionen
          </CardTitle>
          <div className="flex gap-2">
            {versions.length >= 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCompare(versions[0], versions[1])}
              >
                <GitCompare className="h-4 w-4 mr-1" />
                Vergleichen
              </Button>
            )}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  disabled={currentSteps.length === 0}
                  onClick={() => setNewVersionNumber(suggestNextVersion())}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Version speichern
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neue Version speichern</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Versionsnummer *</Label>
                    <Input
                      value={newVersionNumber}
                      onChange={(e) => setNewVersionNumber(e.target.value)}
                      placeholder="z.B. 1.1"
                    />
                  </div>
                  <div>
                    <Label>Name (optional)</Label>
                    <Input
                      value={newVersionName}
                      onChange={(e) => setNewVersionName(e.target.value)}
                      placeholder="z.B. Mit ChatGPT Feedback"
                    />
                  </div>
                  <div>
                    <Label>Beschreibung (optional)</Label>
                    <Textarea
                      value={newVersionDescription}
                      onChange={(e) => setNewVersionDescription(e.target.value)}
                      placeholder="Was wurde geändert?"
                      rows={3}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentSteps.length} Steps mit {currentSteps.filter(s => s.screenshotDesktop || s.screenshotMobile).length} Screenshots werden gespeichert
                  </div>
                  <Button onClick={saveVersion} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Speichern
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Noch keine Versionen gespeichert</p>
            <p className="text-sm">Erfasse zuerst die Flow Steps und speichere dann eine Version</p>
          </div>
        ) : (
          <div className="space-y-2">
            {versions.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg font-semibold">
                    {formatVersion(version.version_number)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {version.version_name && (
                        <span className="font-medium">{version.version_name}</span>
                      )}
                      {version.is_baseline && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Baseline
                        </Badge>
                      )}
                      {version.is_live && (
                        <Badge className="text-xs bg-green-600">
                          <Play className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      )}
                      {version.ai_feedback && (
                        <Badge variant="outline" className="text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {version.ai_feedback_source}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(version.created_at).toLocaleDateString('de-CH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {version.description && ` • ${version.description.substring(0, 50)}${version.description.length > 50 ? '...' : ''}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedVersionForFeedback(version);
                      setFeedbackText(version.ai_feedback || "");
                      setFeedbackSource(version.ai_feedback_source || "chatgpt");
                      setFeedbackDialogOpen(true);
                    }}
                    title="AI Feedback hinzufügen"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openCompare(version)}
                    title="Mit Baseline vergleichen"
                  >
                    <GitCompare className="h-4 w-4" />
                  </Button>
                  {!version.is_baseline && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAsBaseline(version)}
                      title="Als Baseline setzen"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteVersion(version)}
                    className="text-destructive hover:text-destructive"
                    title="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feedback Dialog */}
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                AI Feedback für {selectedVersionForFeedback ? formatVersion(selectedVersionForFeedback.version_number) : ""}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Quelle</Label>
                <Select value={feedbackSource} onValueChange={setFeedbackSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chatgpt">ChatGPT</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="other">Andere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>AI Analyse / Feedback</Label>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Füge hier das AI Feedback ein..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={saveFeedback} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Feedback speichern
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Compare Dialog */}
        <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <GitCompare className="h-5 w-5" />
                Version Vergleich
                <div className="flex items-center gap-2 ml-4">
                  <Select
                    value={selectedVersionA?.id || ""}
                    onValueChange={(id) => setSelectedVersionA(versions.find(v => v.id === id) || null)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Version A" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          {formatVersion(v.version_number)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">vs</span>
                  <Select
                    value={selectedVersionB?.id || ""}
                    onValueChange={(id) => setSelectedVersionB(versions.find(v => v.id === id) || null)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Version B" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          v{v.version_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedVersionA && selectedVersionB && (
              <div className="mt-4">
                <Tabs defaultValue="visual">
                  <TabsList>
                    <TabsTrigger value="visual">Screenshots</TabsTrigger>
                    <TabsTrigger value="config">Konfiguration</TabsTrigger>
                    <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="visual" className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCompareStep(Math.max(1, compareStep - 1))}
                        disabled={compareStep <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Vorheriger Step
                      </Button>
                      <span className="font-medium">Step {compareStep}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCompareStep(Math.min(4, compareStep + 1))}
                        disabled={compareStep >= 4}
                      >
                        Nächster Step
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionA.version_number)}
                          {selectedVersionA.is_baseline && " (Baseline)"}
                        </div>
                        <div className="border rounded-lg overflow-hidden bg-muted/30">
                          {(selectedVersionA.screenshots as Record<string, string>)?.[`step${compareStep}Desktop`] ? (
                            <img
                              src={toPngDataUrl((selectedVersionA.screenshots as Record<string, string>)[`step${compareStep}Desktop`])}
                              alt={`Version A Step ${compareStep}`}
                              className="w-full"
                            />
                          ) : (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                              Kein Screenshot
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionB.version_number)}
                          {selectedVersionB.is_baseline && " (Baseline)"}
                        </div>
                        <div className="border rounded-lg overflow-hidden bg-muted/30">
                          {(selectedVersionB.screenshots as Record<string, string>)?.[`step${compareStep}Desktop`] ? (
                            <img
                              src={toPngDataUrl((selectedVersionB.screenshots as Record<string, string>)[`step${compareStep}Desktop`])}
                              alt={`Version B Step ${compareStep}`}
                              className="w-full"
                            />
                          ) : (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                              Kein Screenshot
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="config" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionA.version_number)} Konfiguration
                        </div>
                        <ScrollArea className="h-[400px] border rounded-lg p-4">
                          <pre className="text-xs font-mono whitespace-pre-wrap">
                            {JSON.stringify(selectedVersionA.step_configs, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionB.version_number)} Konfiguration
                        </div>
                        <ScrollArea className="h-[400px] border rounded-lg p-4">
                          <pre className="text-xs font-mono whitespace-pre-wrap">
                            {JSON.stringify(selectedVersionB.step_configs, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="feedback" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionA.version_number)} Feedback
                          {selectedVersionA.ai_feedback_source && (
                            <Badge variant="outline" className="ml-2">
                              {selectedVersionA.ai_feedback_source}
                            </Badge>
                          )}
                        </div>
                        <ScrollArea className="h-[400px] border rounded-lg p-4">
                          {selectedVersionA.ai_feedback ? (
                            <pre className="text-sm whitespace-pre-wrap">
                              {selectedVersionA.ai_feedback}
                            </pre>
                          ) : (
                            <div className="text-center text-muted-foreground py-8">
                              Kein Feedback vorhanden
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                      <div>
                        <div className="text-center font-medium mb-2">
                          {formatVersion(selectedVersionB.version_number)} Feedback
                          {selectedVersionB.ai_feedback_source && (
                            <Badge variant="outline" className="ml-2">
                              {selectedVersionB.ai_feedback_source}
                            </Badge>
                          )}
                        </div>
                        <ScrollArea className="h-[400px] border rounded-lg p-4">
                          {selectedVersionB.ai_feedback ? (
                            <pre className="text-sm whitespace-pre-wrap">
                              {selectedVersionB.ai_feedback}
                            </pre>
                          ) : (
                            <div className="text-center text-muted-foreground py-8">
                              Kein Feedback vorhanden
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
