/**
 * FeedbackToVariantGenerator
 * 
 * Improved UX with clear workflow:
 * 1. Paste ChatGPT feedback
 * 2. Generate Lovable prompt → copy to chat
 * 3. After implementation → mark as "Implementiert" 
 * 4. Capture screenshots via AutoFlow
 * 5. View/compare in Flow Versionen
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
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
  AlertCircle,
  Play,
  RefreshCw,
  ChevronRight
} from "lucide-react";

// Available flow versions
const FLOW_VERSIONS = [
  { id: "v2", label: "V2 - UX Optimiert", variants: ["a", "b", "c", "d", "e"] },
  { id: "v3", label: "V3 - Mobile-First", variants: ["a", "b", "c", "d", "e"] },
  { id: "v4", label: "V4 - Conversion-Fokus", variants: ["a", "b", "c", "d", "e"] },
  { id: "v5", label: "V5 - Accessibility", variants: ["a", "b", "c", "d", "e"] },
];

const ALL_VARIANTS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

interface FeedbackEntry {
  id: string;
  flow_id: string;
  variant_label: string;
  variant_name: string;
  prompt: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  executed_at?: string;
  output_flow_id?: string;
}

export function FeedbackToVariantGenerator() {
  const [selectedFlow, setSelectedFlow] = useState("v3");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSource, setFeedbackSource] = useState("chatgpt");
  const [targetVariant, setTargetVariant] = useState("");
  const [variantName, setVariantName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentFeedback, setRecentFeedback] = useState<FeedbackEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  useEffect(() => {
    suggestNextVariant();
    fetchRecentFeedback();
  }, [selectedFlow]);

  const suggestNextVariant = async () => {
    try {
      const { data } = await supabase
        .from("flow_feedback_variants")
        .select("variant_label")
        .eq("flow_id", selectedFlow)
        .order("created_at", { ascending: false });

      const existingVariants = (data || []).map(v => v.variant_label.toLowerCase());
      const flowInfo = FLOW_VERSIONS.find(f => f.id === selectedFlow);
      const baseVariants = flowInfo?.variants || [];
      const allUsed = new Set([...baseVariants, ...existingVariants]);
      
      for (const letter of ALL_VARIANTS) {
        if (!allUsed.has(letter)) {
          setTargetVariant(letter);
          break;
        }
      }
    } catch (err) {
      console.error("Failed to suggest variant:", err);
      setTargetVariant("f");
    }
  };

  const fetchRecentFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("flow_feedback_variants")
        .select("*")
        .eq("flow_id", selectedFlow)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setRecentFeedback((data || []) as unknown as FeedbackEntry[]);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    }
  };

  const generateLovablePrompt = () => {
    const flowNumber = selectedFlow.replace("v", "");
    const componentName = `V${flowNumber}${targetVariant.toLowerCase()}FeedbackBased`;
    const fileName = `${componentName}.tsx`;

    return `Erstelle eine neue Flow-Variante basierend auf diesem ChatGPT Feedback:

**Ziel-Variante:** ${selectedFlow.toUpperCase()}.${targetVariant} (${variantName || "Feedback-basierte Variante"})
**Datei:** src/components/calculator-variants/${fileName}
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

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast.error("Bitte Feedback eingeben");
      return;
    }

    if (!targetVariant) {
      toast.error("Bitte Varianten-Buchstabe wählen");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("flow_feedback_variants")
        .insert({
          flow_id: selectedFlow,
          variant_label: targetVariant.toLowerCase(),
          variant_name: variantName.trim() || `${selectedFlow.toUpperCase()}${targetVariant} - ChatGPT Feedback`,
          prompt: feedbackText.trim(),
          status: "pending",
        });

      if (error) throw error;

      const lovablePrompt = generateLovablePrompt();
      await navigator.clipboard.writeText(lovablePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

      toast.success(`Variante ${selectedFlow.toUpperCase()}.${targetVariant} erstellt!`, {
        description: "Prompt wurde in Zwischenablage kopiert. Füge ihn jetzt in den Lovable-Chat ein.",
        duration: 5000,
      });

      setFeedbackText("");
      setVariantName("");
      suggestNextVariant();
      fetchRecentFeedback();
      setActiveTab("history");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      toast.error("Fehler beim Speichern");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPromptToClipboard = async () => {
    const prompt = generateLovablePrompt();
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    toast.success("Prompt kopiert!");
  };

  const markAsImplemented = async (entry: FeedbackEntry) => {
    try {
      const flowNumber = selectedFlow.replace("v", "");
      const componentName = `V${flowNumber}${entry.variant_label.toLowerCase()}FeedbackBased`;
      
      await supabase
        .from("flow_feedback_variants")
        .update({ 
          status: "completed",
          executed_at: new Date().toISOString(),
          output_flow_id: `${selectedFlow}${entry.variant_label}`
        })
        .eq("id", entry.id);

      toast.success(`${selectedFlow.toUpperCase()}.${entry.variant_label} als implementiert markiert`);
      fetchRecentFeedback();
    } catch (err) {
      toast.error("Fehler beim Aktualisieren");
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Eintrag wirklich löschen?")) return;
    
    try {
      await supabase
        .from("flow_feedback_variants")
        .delete()
        .eq("id", id);
      
      toast.success("Gelöscht");
      fetchRecentFeedback();
    } catch (err) {
      toast.error("Löschen fehlgeschlagen");
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Implementiert" };
      case "processing":
        return { icon: RefreshCw, color: "text-blue-600", bg: "bg-blue-100", label: "In Arbeit" };
      case "failed":
        return { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: "Fehler" };
      default:
        return { icon: Clock, color: "text-amber-600", bg: "bg-amber-100", label: "Ausstehend" };
    }
  };

  const pendingCount = recentFeedback.filter(f => f.status === "pending").length;
  const completedCount = recentFeedback.filter(f => f.status === "completed").length;

  return (
    <div className="space-y-4">
      {/* Workflow Overview */}
      <Alert className="border-primary/30 bg-primary/5">
        <Wand2 className="h-4 w-4 text-primary" />
        <AlertDescription>
          <div className="flex items-center gap-2 text-sm font-medium mb-2">Workflow:</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Badge variant="outline" className="gap-1">
              <span className="font-bold">1</span> Feedback einfügen
            </Badge>
            <ChevronRight className="h-3 w-3" />
            <Badge variant="outline" className="gap-1">
              <span className="font-bold">2</span> Prompt kopieren
            </Badge>
            <ChevronRight className="h-3 w-3" />
            <Badge variant="outline" className="gap-1">
              <span className="font-bold">3</span> In Lovable Chat einfügen
            </Badge>
            <ChevronRight className="h-3 w-3" />
            <Badge variant="outline" className="gap-1">
              <span className="font-bold">4</span> Als implementiert markieren
            </Badge>
            <ChevronRight className="h-3 w-3" />
            <Badge variant="outline" className="gap-1">
              <span className="font-bold">5</span> Screenshots erfassen
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Feedback zu Variante</CardTitle>
                <CardDescription className="text-xs">
                  ChatGPT-Analyse → Lovable-Prompt → Implementierung
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedFlow} onValueChange={setSelectedFlow}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FLOW_VERSIONS.map(flow => (
                    <SelectItem key={flow.id} value={flow.id}>
                      {flow.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="input" className="flex items-center gap-1 text-xs">
                <MessageSquare className="h-3 w-3" />
                Eingeben
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1 text-xs">
                <FileCode className="h-3 w-3" />
                Prompt
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                Verlauf
                {pendingCount > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Input Tab */}
            <TabsContent value="input" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Neue Variante</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={targetVariant}
                      onChange={(e) => setTargetVariant(e.target.value.toLowerCase().slice(0, 1))}
                      placeholder="g"
                      className="w-14 text-center font-mono text-lg h-10"
                      maxLength={1}
                    />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <code className="font-mono font-bold text-primary">
                      {selectedFlow.toUpperCase()}.{targetVariant || "?"}
                    </code>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Name (optional)</Label>
                  <Input
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    placeholder="z.B. Mobile UX Fix"
                    className="h-10"
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
                  placeholder="Füge hier das ChatGPT-Feedback oder deine eigenen Verbesserungsvorschläge ein..."
                  rows={10}
                  className="font-mono text-xs mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {feedbackText.length} Zeichen
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || !feedbackText.trim() || !targetVariant}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Erstellen & Prompt kopieren
                </Button>
                <Button
                  variant="outline"
                  onClick={copyPromptToClipboard}
                  disabled={!feedbackText.trim()}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Generierter Lovable-Prompt</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyPromptToClipboard}
                    disabled={!feedbackText.trim()}
                    className="h-7 text-xs"
                  >
                    {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    Kopieren
                  </Button>
                </div>
                <ScrollArea className="h-[350px] border rounded-lg p-3 bg-muted/30">
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {feedbackText.trim() ? generateLovablePrompt() : "Gib zuerst Feedback ein..."}
                  </pre>
                </ScrollArea>
                <p className="text-xs text-muted-foreground">
                  Nach dem Kopieren: Füge den Prompt in den Lovable-Chat ein, um die Variante zu implementieren.
                </p>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <div className="space-y-3">
                {/* Stats */}
                <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500" />
                    {pendingCount} ausstehend
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {completedCount} implementiert
                  </span>
                </div>

                {recentFeedback.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Noch kein Feedback für {selectedFlow.toUpperCase()}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentFeedback.map((entry) => {
                      const statusConfig = getStatusConfig(entry.status);
                      const StatusIcon = statusConfig.icon;
                      const variantCode = `${selectedFlow.toUpperCase()}.${entry.variant_label}`;
                      
                      return (
                        <div
                          key={entry.id}
                          className="p-3 border rounded-lg hover:bg-accent/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <code className="font-mono font-bold text-sm">{variantCode}</code>
                                <Badge 
                                  variant="outline" 
                                  className={`text-[10px] px-1.5 py-0 ${statusConfig.bg} ${statusConfig.color} border-0`}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {entry.variant_name || entry.prompt?.substring(0, 100)}...
                              </p>
                              <div className="text-[10px] text-muted-foreground mt-1">
                                {new Date(entry.created_at).toLocaleDateString("de-CH", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {entry.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs gap-1"
                                    onClick={() => {
                                      setFeedbackText(entry.prompt || "");
                                      setTargetVariant(entry.variant_label);
                                      setActiveTab("preview");
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                    Prompt
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="h-7 text-xs gap-1"
                                    onClick={() => markAsImplemented(entry)}
                                  >
                                    <Check className="h-3 w-3" />
                                    Fertig
                                  </Button>
                                </>
                              )}
                              {entry.status === "completed" && (
                                <>
                                  <Link 
                                    to={`/umzugsofferten?variant=${selectedFlow}${entry.variant_label}`}
                                    target="_blank"
                                  >
                                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                      <Eye className="h-3 w-3" />
                                      Anzeigen
                                    </Button>
                                  </Link>
                                  <Link to="/admin/tools?tab=autoflow">
                                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                      <Camera className="h-3 w-3" />
                                      Screenshots
                                    </Button>
                                  </Link>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteEntry(entry.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Separator className="my-3" />
                
                {/* Quick Actions */}
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Nächste Schritte nach Implementierung:</Label>
                  <div className="flex gap-2">
                    <Link to="/flow-tester" target="_blank">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <Play className="h-3 w-3" />
                        Flow Tester
                      </Button>
                    </Link>
                    <Link to="/admin/tools">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <Camera className="h-3 w-3" />
                        AutoFlow Capture
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default FeedbackToVariantGenerator;
