/**
 * FeedbackToVariantGenerator
 * 
 * Allows users to paste ChatGPT/AI feedback and generate new flow variants
 * directly from the admin interface without needing to chat with Lovable.
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Sparkles, 
  MessageSquare, 
  Save, 
  Copy, 
  Check,
  FileCode,
  Lightbulb,
  ArrowRight,
  Clock,
  Wand2
} from "lucide-react";

// Available flow versions
const FLOW_VERSIONS = [
  { id: "v2", label: "V2 - UX Optimiert", variants: ["a", "b", "c", "d", "e"] },
  { id: "v3", label: "V3 - Mobile-First", variants: ["a", "b", "c", "d", "e"] },
  { id: "v4", label: "V4 - Conversion-Fokus", variants: ["a", "b", "c", "d", "e"] },
  { id: "v5", label: "V5 - Accessibility", variants: ["a", "b", "c", "d", "e"] },
];

// All letter variants possible
const ALL_VARIANTS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

interface FeedbackEntry {
  id: string;
  flow_id: string;
  variant_label: string;
  variant_name: string;
  prompt: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  feedback_source?: string;
  result_notes?: string;
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

  // Fetch existing variants to suggest next one
  useEffect(() => {
    suggestNextVariant();
    fetchRecentFeedback();
  }, [selectedFlow]);

  const suggestNextVariant = async () => {
    try {
      // Check flow_feedback_variants table for existing variants
      const { data } = await supabase
        .from("flow_feedback_variants")
        .select("variant_label")
        .eq("flow_id", selectedFlow)
        .order("created_at", { ascending: false });

      const existingVariants = (data || []).map(v => v.variant_label.toLowerCase());
      
      // Find next available variant letter
      const flowInfo = FLOW_VERSIONS.find(f => f.id === selectedFlow);
      const baseVariants = flowInfo?.variants || [];
      
      // Combine existing coded variants with feedback-generated ones
      const allUsed = new Set([...baseVariants, ...existingVariants]);
      
      // Find first unused letter
      for (const letter of ALL_VARIANTS) {
        if (!allUsed.has(letter)) {
          setTargetVariant(letter);
          break;
        }
      }
    } catch (err) {
      console.error("Failed to suggest variant:", err);
      setTargetVariant("f"); // Default to f if error
    }
  };

  const fetchRecentFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("flow_feedback_variants")
        .select("*")
        .eq("flow_id", selectedFlow)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentFeedback((data || []) as unknown as FeedbackEntry[]);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    }
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
      // Store the feedback in the database
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

      toast.success(`Feedback für ${selectedFlow.toUpperCase()}.${targetVariant} gespeichert!`, {
        description: "Du kannst jetzt in Lovable chatten um diese Variante zu bauen.",
      });

      // Generate a prompt for Lovable
      const lovablePrompt = generateLovablePrompt();
      
      // Copy to clipboard
      await navigator.clipboard.writeText(lovablePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

      toast.info("Lovable-Prompt in Zwischenablage kopiert!", {
        description: "Füge den Prompt in den Lovable-Chat ein.",
      });

      // Reset form
      setFeedbackText("");
      setVariantName("");
      suggestNextVariant();
      fetchRecentFeedback();
      setActiveTab("history");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      toast.error("Fehler beim Speichern des Feedbacks");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateLovablePrompt = () => {
    const flowNumber = selectedFlow.replace("v", "");
    const componentName = `V${flowNumber}${targetVariant.toLowerCase()}`;
    const fileName = `V${flowNumber}${targetVariant.toLowerCase()}FeedbackBased.tsx`;

    return `Erstelle eine neue Flow-Variante basierend auf diesem ChatGPT Feedback:

**Ziel-Variante:** ${selectedFlow.toUpperCase()}.${targetVariant} (${variantName || "Feedback-basierte Variante"})
**Datei:** src/components/calculator-variants/${fileName}
**Komponenten-Name:** ${componentName}FeedbackBased

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

  const copyPromptToClipboard = async () => {
    const prompt = generateLovablePrompt();
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    toast.success("Prompt kopiert!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">Implementiert</Badge>;
      case "processing":
        return <Badge className="bg-blue-600">In Arbeit</Badge>;
      case "failed":
        return <Badge variant="destructive">Fehlgeschlagen</Badge>;
      default:
        return <Badge variant="secondary">Ausstehend</Badge>;
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Neue Variante aus Feedback generieren
        </CardTitle>
        <CardDescription>
          Füge ChatGPT-Feedback ein → Speichere als neue Variante → Kopiere den Lovable-Prompt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="input" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Feedback eingeben
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <FileCode className="h-4 w-4" />
              Prompt Vorschau
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Verlauf
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            {/* Flow Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Basis-Flow</Label>
                <Select value={selectedFlow} onValueChange={setSelectedFlow}>
                  <SelectTrigger>
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
              <div>
                <Label>Neue Variante</Label>
                <div className="flex gap-2">
                  <Input
                    value={targetVariant}
                    onChange={(e) => setTargetVariant(e.target.value.toLowerCase().slice(0, 1))}
                    placeholder="f"
                    className="w-16 text-center font-mono text-lg"
                    maxLength={1}
                  />
                  <div className="flex items-center text-muted-foreground">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    <span className="font-mono font-semibold">
                      {selectedFlow.toUpperCase()}.{targetVariant || "?"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variant Name */}
            <div>
              <Label>Varianten-Name (optional)</Label>
              <Input
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                placeholder="z.B. 'Optimierte CTAs' oder 'Vereinfachte Navigation'"
              />
            </div>

            {/* Feedback Source */}
            <div>
              <Label>Feedback-Quelle</Label>
              <Select value={feedbackSource} onValueChange={setFeedbackSource}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="manual">Manuell / Eigenes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback Text */}
            <div>
              <Label className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                ChatGPT Feedback / Verbesserungsvorschläge
              </Label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={`Füge hier das komplette ChatGPT-Feedback ein...

Beispiel:
1. Der CTA-Button sollte prominenter sein
2. Die Progress-Bar braucht mehr Kontrast
3. Mobile: Touch-Targets zu klein
4. Step 2 hat zu viele Eingabefelder
...`}
                rows={12}
                className="font-mono text-sm"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {feedbackText.length} Zeichen
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || !feedbackText.trim()}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Speichern & Prompt generieren
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={copyPromptToClipboard}
                disabled={!feedbackText.trim()}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Generierter Lovable-Prompt</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPromptToClipboard}
                  disabled={!feedbackText.trim()}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Kopieren
                    </>
                  )}
                </Button>
              </div>
              <ScrollArea className="h-[400px] border rounded-lg p-4 bg-muted/30">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {feedbackText.trim() ? generateLovablePrompt() : "Gib zuerst Feedback ein um den Prompt zu sehen..."}
                </pre>
              </ScrollArea>
              <p className="text-sm text-muted-foreground">
                Kopiere diesen Prompt und füge ihn in den Lovable-Chat ein, um die neue Variante zu erstellen.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-3">
              {recentFeedback.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Noch kein Feedback für {selectedFlow.toUpperCase()} gespeichert</p>
                </div>
              ) : (
                recentFeedback.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-semibold">
                          {entry.flow_id.toUpperCase()}.{entry.variant_label}
                        </span>
                        {getStatusBadge(entry.status)}
                        <Badge variant="outline" className="text-xs">
                          {entry.feedback_source || "chatgpt"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {entry.prompt?.substring(0, 150)}...
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.created_at).toLocaleDateString("de-CH", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFeedbackText(entry.prompt || "");
                        setTargetVariant(entry.variant_label);
                        setActiveTab("input");
                      }}
                    >
                      Bearbeiten
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default FeedbackToVariantGenerator;
