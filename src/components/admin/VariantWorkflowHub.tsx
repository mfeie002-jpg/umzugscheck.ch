/**
 * VariantWorkflowHub - Konsolidierte Komponente für den gesamten Feedback-Workflow
 * 
 * Workflow:
 * 1. ChatGPT-Feedback einfügen
 * 2. Lovable-Prompt generieren & kopieren
 * 3. In Lovable implementieren (extern)
 * 4. Als implementiert markieren → Screenshots erfassen
 * 5. Versionen vergleichen
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from "@/data/flowConfigs";
import { useAllFlowVariants } from "@/hooks/useAllFlowVariants";
import { toast } from "sonner";
import { 
  Sparkles, 
  MessageSquare, 
  Copy, 
  Check,
  FileCode,
  ArrowRight,
  Clock,
  Wand2,
  ExternalLink,
  Camera,
  Eye,
  Trash2,
  CheckCircle,
  Play,
  RefreshCw,
  GitCompare,
  Rocket
} from "lucide-react";
import { ScreenshotCaptureStep } from "./ScreenshotCaptureStep";

// Flow versions with variants
const FLOW_OPTIONS = Object.entries(FLOW_CONFIGS).map(([key, config]) => ({
  id: key,
  label: config.label,
  color: config.color
}));

const ALL_VARIANT_LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

interface VariantEntry {
  id: string;
  flow_id: string;
  variant_label: string;
  variant_name: string;
  prompt: string;
  status: "pending" | "done";
  created_at: string;
  executed_at?: string;
  output_flow_id?: string;
}

export function VariantWorkflowHub() {
  // State
  const navigate = useNavigate();
  const [selectedFlow, setSelectedFlow] = useState("umzugsofferten-v9");
  const [feedbackText, setFeedbackText] = useState("");
  const [targetVariant, setTargetVariant] = useState("");
  const [variantName, setVariantName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [entries, setEntries] = useState<VariantEntry[]>([]);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Use unified flow variants hook
  const { 
    getSubVariantsForFlow, 
    pendingWorkflowVariants, 
    completedWorkflowVariants,
    refetch: refetchVariants 
  } = useAllFlowVariants(selectedFlow);

  useEffect(() => {
    fetchEntries();
    suggestNextVariant();
  }, [selectedFlow]);

  const suggestNextVariant = async () => {
    const extractLetter = (raw: string): string | null => {
      const label = (raw || '').trim();
      const m = label.match(/^([a-z])$/i) || label.match(/\.([a-z])$/i);
      return m?.[1]?.toLowerCase() ?? null;
    };

    try {
      const { data } = await supabase
        .from("flow_feedback_variants")
        .select("variant_label")
        .eq("flow_id", selectedFlow)
        .order("created_at", { ascending: false });

      const dbLetters = (data || [])
        .map(v => extractLetter(v.variant_label))
        .filter(Boolean) as string[];

      const staticLetters = Object.values(SUB_VARIANT_CONFIGS)
        .filter(v => v.parentFlow === selectedFlow)
        .map(v => v.id.match(/^v\d+([a-z])$/i)?.[1]?.toLowerCase() ?? null)
        .filter(Boolean) as string[];

      const usedVariants = new Set([...dbLetters, ...staticLetters]);

      // Find first unused letter (avoid collisions with existing coded variants)
      for (const letter of ALL_VARIANT_LETTERS) {
        if (!usedVariants.has(letter)) {
          setTargetVariant(letter);
          return;
        }
      }
      setTargetVariant("k"); // Fallback
    } catch (err) {
      console.error("Failed to suggest variant:", err);
      setTargetVariant("f");
    }
  };

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("flow_feedback_variants")
        .select("*")
        .eq("flow_id", selectedFlow)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) throw error;
      setEntries((data || []) as unknown as VariantEntry[]);
      refetchVariants();
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    }
  };

  const getFlowNumber = () => {
    // Handle V1 which is just "umzugsofferten" without -v1
    if (selectedFlow === "umzugsofferten") return "1";
    const match = selectedFlow.match(/v(\d+)/);
    return match ? match[1] : "1";
  };

  const getComponentName = () => {
    return `V${getFlowNumber()}${targetVariant.toLowerCase()}FeedbackBased`;
  };

  const generateLovablePrompt = () => {
    const flowNumber = getFlowNumber();
    const componentName = getComponentName();

    return `Erstelle eine neue Flow-Variante basierend auf diesem ChatGPT Feedback:

**Ziel-Variante:** V${flowNumber}.${targetVariant} (${variantName || "Feedback-basierte Variante"})
**Datei:** src/components/calculator-variants/${componentName}.tsx
**Komponenten-Name:** ${componentName}

**ChatGPT Feedback / Verbesserungsvorschläge:**
${feedbackText}

---

Bitte implementiere diese Verbesserungen als neue kodierte Komponente. Orientiere dich am Stil der existierenden V${flowNumber}a-e Varianten in src/components/calculator-variants/. Die Komponente soll:
1. Alle Verbesserungen aus dem Feedback umsetzen
2. Den gleichen 4-Step Wizard Flow haben (Umzugsart → Details → Services → Kontakt)
3. Mobile-first und responsive sein
4. Die bestehenden UI-Komponenten (shadcn) nutzen

Exportiere die Komponente und füge sie zum index.ts hinzu.`;
  };

  const handleSubmit = async () => {
    if (!feedbackText.trim() || !targetVariant) {
      toast.error("Bitte Feedback und Variante angeben");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("flow_feedback_variants")
        .insert({
          flow_id: selectedFlow,
          variant_label: targetVariant.toLowerCase(),
          variant_name: variantName.trim() || `V${getFlowNumber()}.${targetVariant} - Feedback`,
          prompt: feedbackText.trim(),
          status: "pending",
        });

      if (error) throw error;

      // Copy prompt
      await navigator.clipboard.writeText(generateLovablePrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

      toast.success(`V${getFlowNumber()}.${targetVariant} erstellt - Prompt kopiert!`, {
        description: "Füge ihn jetzt in den Lovable-Chat ein.",
      });

      setFeedbackText("");
      setVariantName("");
      suggestNextVariant();
      fetchEntries();
      setActiveStep(3);
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Fehler beim Speichern");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(generateLovablePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    toast.success("Prompt kopiert!");
  };

  const markAsImplemented = async (entry: VariantEntry) => {
    try {
      const flowNumber = getFlowNumber();
      const variantLetter = entry.variant_label.toLowerCase();
      const flowCode = `V${flowNumber}.${variantLetter}`;
      const versionNumber = `${flowNumber}.${variantLetter}`;
      
      // 1. Update flow_feedback_variants status
      await supabase
        .from("flow_feedback_variants")
        .update({ 
          status: "done",
          executed_at: new Date().toISOString(),
          output_flow_id: `${selectedFlow}-${variantLetter}`
        })
        .eq("id", entry.id);

      // 2. CRITICAL: Also create/update entry in flow_versions for AI feedback tracking
      // This is what enables the ⭐ icon and stores the ChatGPT feedback
      const { data: existingVersion, error: existingError } = await supabase
        .from("flow_versions")
        .select("id")
        .eq("flow_id", selectedFlow)
        .eq("version_number", versionNumber)
        .maybeSingle();

      if (existingError) {
        console.error('Failed to check existing flow_versions entry:', existingError);
      }

      const versionPayload = {
        flow_id: selectedFlow,
        flow_code: flowCode,
        version_number: versionNumber,
        version_name: entry.variant_name,
        description: `ChatGPT Agent: ${entry.variant_name}`,
        ai_feedback: entry.prompt,
        ai_feedback_source: 'ChatGPT',
        ai_feedback_date: new Date().toISOString(),
        is_active: true,
        flow_number: parseInt(flowNumber, 10),
        variant_letter: variantLetter,
      };

      if (existingVersion?.id) {
        const { error: updateError } = await supabase
          .from("flow_versions")
          .update(versionPayload)
          .eq("id", existingVersion.id);
        if (updateError) console.error('Failed to update flow_versions entry:', updateError);
      } else {
        const { error: insertError } = await supabase
          .from("flow_versions")
          .insert(versionPayload);
        if (insertError) console.error('Failed to insert flow_versions entry:', insertError);
      }

      toast.success(`V${flowNumber}.${variantLetter} als implementiert markiert`);
      fetchEntries();
      refetchVariants(); // Refresh to show the ⭐ icon
    } catch (err) {
      console.error('markAsImplemented failed:', err);
      toast.error("Fehler beim Aktualisieren");
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Eintrag löschen?")) return;
    
    try {
      await supabase.from("flow_feedback_variants").delete().eq("id", id);
      toast.success("Gelöscht");
      fetchEntries();
    } catch (err) {
      toast.error("Löschen fehlgeschlagen");
    }
  };

  const pendingEntries = entries.filter(e => e.status === "pending");
  const completedEntries = entries.filter(e => e.status === "done");

  // Workflow step indicators
  const steps = [
    { num: 1, label: "Feedback", icon: MessageSquare },
    { num: 2, label: "Prompt", icon: FileCode },
    { num: 3, label: "Implementieren", icon: Wand2 },
    { num: 4, label: "Screenshots", icon: Camera },
    { num: 5, label: "Vergleichen", icon: GitCompare },
  ];

  return (
    <div className="space-y-6">
      {/* Workflow Steps Indicator */}
      <div className="flex items-center justify-center gap-2 p-4 bg-muted/30 rounded-xl">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === step.num;
          const isCompleted = activeStep > step.num;
          
          return (
            <div key={step.num} className="flex items-center">
              <button
                onClick={() => setActiveStep(step.num as 1|2|3|4|5)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : isCompleted 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  isActive ? "bg-primary-foreground/20" : isCompleted ? "bg-primary/30" : "bg-muted-foreground/20"
                }`}>
                  {isCompleted ? <Check className="h-3 w-3" /> : step.num}
                </span>
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>

      {/* Flow Selector */}
      <div className="flex items-center gap-4">
        <Label className="text-sm font-medium">Flow:</Label>
        <Select value={selectedFlow} onValueChange={setSelectedFlow}>
          <SelectTrigger className="w-[200px]">
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
        <Badge variant="outline" className="font-mono">
          {pendingEntries.length} ausstehend
        </Badge>
        <Badge variant="secondary" className="font-mono">
          {completedEntries.length} fertig
        </Badge>
      </div>

      {/* Step 1: Feedback Input */}
      {activeStep === 1 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">1. ChatGPT-Feedback einfügen</CardTitle>
                <CardDescription>Kopiere die Analyse von ChatGPT hier rein</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Neue Variante</Label>
                <div className="flex gap-2 items-center mt-1">
                  <Input
                    value={targetVariant}
                    onChange={(e) => setTargetVariant(e.target.value.toLowerCase().slice(0, 1))}
                    placeholder="g"
                    className="w-14 text-center font-mono text-lg"
                    maxLength={1}
                  />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <code className="font-mono font-bold text-primary text-lg">
                    V{getFlowNumber()}.{targetVariant || "?"}
                  </code>
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

            <div>
              <Label className="text-xs flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                ChatGPT Feedback
              </Label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Füge hier das ChatGPT-Feedback ein..."
                rows={12}
                className="font-mono text-xs mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {feedbackText.length} Zeichen
              </div>
            </div>

            <Button
              onClick={() => {
                if (feedbackText.trim()) {
                  setActiveStep(2);
                } else {
                  toast.error("Bitte Feedback eingeben");
                }
              }}
              className="w-full"
              disabled={!feedbackText.trim()}
            >
              Weiter zu Prompt
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Preview & Copy Prompt */}
      {activeStep === 2 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileCode className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">2. Lovable-Prompt</CardTitle>
                <CardDescription>Kopiere und füge in Lovable-Chat ein</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono">
                V{getFlowNumber()}.{targetVariant}
              </Badge>
              <Button onClick={copyPrompt} size="sm" className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Kopiert!" : "Prompt kopieren"}
              </Button>
            </div>
            
            <ScrollArea className="h-[300px] border rounded-lg p-3 bg-muted/30">
              <pre className="text-xs whitespace-pre-wrap font-mono">
                {generateLovablePrompt()}
              </pre>
            </ScrollArea>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActiveStep(1)}>
                Zurück
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Speichern & Kopieren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Implementation Guide */}
      {activeStep === 3 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wand2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">3. In Lovable implementieren</CardTitle>
                <CardDescription>Füge den Prompt in den Lovable-Chat ein</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>So geht's:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Öffne den Lovable-Chat (rechts unten auf dieser Seite)</li>
                  <li>Füge den kopierten Prompt ein (Ctrl+V)</li>
                  <li>Warte bis die Komponente erstellt wurde</li>
                  <li>Komm zurück und markiere als "Fertig"</li>
                </ol>
              </AlertDescription>
            </Alert>

            {/* Pending entries */}
            {pendingEntries.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Ausstehende Implementierungen:</Label>
                {pendingEntries.map(entry => (
                  <div 
                    key={entry.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-amber-50 dark:bg-amber-950/20"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <div>
                        <div className="font-mono font-bold text-sm">
                          V{getFlowNumber()}.{entry.variant_label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.variant_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await navigator.clipboard.writeText(entry.prompt);
                          toast.success("Prompt kopiert");
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => markAsImplemented(entry)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Fertig
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={() => setActiveStep(4)} className="w-full" disabled={completedEntries.length === 0 && pendingEntries.length === 0}>
              Weiter zu Screenshots
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Screenshot Capture */}
      {activeStep === 4 && (
        <ScreenshotCaptureStep
          selectedFlow={selectedFlow}
          getSubVariantsForFlow={getSubVariantsForFlow}
          navigate={navigate}
          onNext={() => setActiveStep(5)}
        />
      )}

      {/* Step 5: Compare */}
      {activeStep === 5 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GitCompare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">5. Varianten vergleichen</CardTitle>
                <CardDescription>Finde die beste Version</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <a href={`/admin/tools?tab=calculator-review&flow=${encodeURIComponent(selectedFlow)}`} target="_blank" rel="noopener noreferrer">
                <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <div className="flex items-center gap-3">
                    <Rocket className="h-8 w-8 text-primary" />
                    <div>
                      <div className="font-medium">Calculator Review</div>
                      <div className="text-xs text-muted-foreground">Flow-Analyse öffnen (neuer Tab)</div>
                    </div>
                  </div>
                </Card>
              </a>
              <a href={`/admin/tools?tab=regression&flow=${encodeURIComponent(selectedFlow)}`} target="_blank" rel="noopener noreferrer">
                <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <div className="flex items-center gap-3">
                    <GitCompare className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="font-medium">Visual Diff</div>
                      <div className="text-xs text-muted-foreground">Pixel-Vergleich (neuer Tab)</div>
                    </div>
                  </div>
                </Card>
              </a>
            </div>

            {/* Direct Variant Links */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Direkt testen:</Label>
              <div className="grid grid-cols-3 gap-2">
                {getSubVariantsForFlow(selectedFlow).slice(0, 6).map(variant => (
                  <a 
                    key={variant.id}
                    href={variant.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 text-sm"
                  >
                    <Eye className="h-3 w-3" />
                    <span className="font-mono">{variant.id}</span>
                    <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                  </a>
                ))}
              </div>
            </div>

            {/* All entries summary */}
            <Separator />
            <div className="text-sm text-muted-foreground">
              <strong>{selectedFlow}:</strong> {completedEntries.length} implementiert, {pendingEntries.length} ausstehend
            </div>

            <Button 
              variant="outline" 
              onClick={() => {
                setActiveStep(1);
                setFeedbackText("");
                setVariantName("");
              }}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Neue Variante erstellen
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
