import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { FLOW_CONFIGS, getFlowVariants } from "@/data/flowConfigs";
import { toast } from "sonner";
import {
  Plus,
  Play,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Sparkles,
  Eye,
  Copy,
  RefreshCw,
  Zap,
  FileText,
  GitBranch
} from "lucide-react";

interface FeedbackVariant {
  id: string;
  flow_id: string;
  variant_name: string;
  variant_label: string;
  prompt: string;
  zip_url: string | null;
  status: string;
  result_json: any;
  output_flow_id: string | null;
  error_message: string | null;
  executed_at: string | null;
  created_at: string;
}

const VARIANT_COLORS: Record<string, string> = {
  A: "bg-blue-500",
  B: "bg-green-500",
  C: "bg-purple-500",
  D: "bg-orange-500",
  E: "bg-pink-500",
  F: "bg-cyan-500"
};

const STATUS_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-muted-foreground", label: "Ausstehend" },
  processing: { icon: Loader2, color: "text-yellow-500", label: "Verarbeitung..." },
  done: { icon: CheckCircle, color: "text-green-500", label: "Fertig" },
  error: { icon: XCircle, color: "text-destructive", label: "Fehler" }
};

export const FlowFeedbackVariants = () => {
  const [variants, setVariants] = useState<FeedbackVariant[]>([]);
  const [selectedFlow, setSelectedFlow] = useState("umzugsofferten");
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [selectedResult, setSelectedResult] = useState<FeedbackVariant | null>(null);
  
  // Form state
  const [formVariantName, setFormVariantName] = useState("A");
  const [formLabel, setFormLabel] = useState("");
  const [formPrompt, setFormPrompt] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const flowVariants = getFlowVariants();

  useEffect(() => {
    fetchVariants();
  }, [selectedFlow]);

  const fetchVariants = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_feedback_variants')
        .select('*')
        .eq('flow_id', selectedFlow)
        .order('variant_name');

      if (error) throw error;
      setVariants(data || []);
    } catch (err) {
      console.error('Failed to fetch variants:', err);
      toast.error('Fehler beim Laden der Varianten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVariant = async () => {
    if (!formLabel.trim() || !formPrompt.trim()) {
      toast.error('Bitte Label und Prompt ausfüllen');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('flow_feedback_variants')
          .update({
            variant_label: formLabel,
            prompt: formPrompt,
            status: 'pending',
            result_json: null
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Variante aktualisiert');
      } else {
        const { error } = await supabase
          .from('flow_feedback_variants')
          .insert({
            flow_id: selectedFlow,
            variant_name: formVariantName,
            variant_label: formLabel,
            prompt: formPrompt
          });

        if (error) throw error;
        toast.success('Variante hinzugefügt');
      }

      resetForm();
      fetchVariants();
    } catch (err: any) {
      console.error('Save failed:', err);
      toast.error(err.message || 'Speichern fehlgeschlagen');
    }
  };

  const handleDeleteVariant = async (id: string) => {
    if (!confirm('Variante wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('flow_feedback_variants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Variante gelöscht');
      fetchVariants();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Löschen fehlgeschlagen');
    }
  };

  const handleExecuteVariant = async (variant: FeedbackVariant) => {
    setExecutingId(variant.id);
    setProgress(10);

    try {
      // Update status to processing
      await supabase
        .from('flow_feedback_variants')
        .update({ status: 'processing' })
        .eq('id', variant.id);

      setProgress(30);

      // Call AI function
      const { data, error } = await supabase.functions.invoke('ai-flow-generator', {
        body: {
          systemPrompt: `Du bist ein Elite-UX-Architekt für Conversion-optimierte Funnels.
Generiere eine verbesserte Flow-Version basierend auf dem Feedback.
Antworte im JSON-Format mit: flowName, flowLabel, description, steps (array mit step, name, changes), improvements (array), expectedImpact.`,
          userPrompt: `Basis-Flow: ${selectedFlow}
Neue Variante: ${selectedFlow}-${variant.variant_name.toLowerCase()}
Label: ${variant.variant_label}

FEEDBACK:
${variant.prompt}

Generiere die verbesserte Version.`,
          baseFlow: selectedFlow,
          newFlowName: `${selectedFlow}-${variant.variant_name.toLowerCase()}`
        }
      });

      setProgress(80);

      if (error) throw error;

      // Save result
      const outputFlowId = `${selectedFlow}-v1${variant.variant_name.toLowerCase()}`;
      
      await supabase
        .from('flow_feedback_variants')
        .update({
          status: 'done',
          result_json: data?.result || {},
          output_flow_id: outputFlowId,
          executed_at: new Date().toISOString(),
          error_message: null
        })
        .eq('id', variant.id);

      setProgress(100);
      toast.success(`${variant.variant_label} erfolgreich generiert!`);
      fetchVariants();
    } catch (err: any) {
      console.error('Execution failed:', err);
      
      await supabase
        .from('flow_feedback_variants')
        .update({
          status: 'error',
          error_message: err.message
        })
        .eq('id', variant.id);

      toast.error('Ausführung fehlgeschlagen');
      fetchVariants();
    } finally {
      setExecutingId(null);
      setProgress(0);
    }
  };

  const handleExecuteAll = async () => {
    const pendingVariants = variants.filter(v => v.status === 'pending' || v.status === 'error');
    
    if (pendingVariants.length === 0) {
      toast.info('Keine ausstehenden Varianten');
      return;
    }

    setIsExecuting(true);
    let completed = 0;

    for (const variant of pendingVariants) {
      await handleExecuteVariant(variant);
      completed++;
      setProgress((completed / pendingVariants.length) * 100);
    }

    setIsExecuting(false);
    toast.success(`${pendingVariants.length} Varianten generiert!`);
  };

  const resetForm = () => {
    setFormVariantName("A");
    setFormLabel("");
    setFormPrompt("");
    setEditingId(null);
    setShowAddDialog(false);
  };

  const handleEdit = (variant: FeedbackVariant) => {
    setFormVariantName(variant.variant_name);
    setFormLabel(variant.variant_label);
    setFormPrompt(variant.prompt);
    setEditingId(variant.id);
    setShowAddDialog(true);
  };

  const getAvailableVariantNames = () => {
    const used = variants.map(v => v.variant_name);
    return ['A', 'B', 'C', 'D', 'E', 'F'].filter(n => !used.includes(n) || (editingId && variants.find(v => v.id === editingId)?.variant_name === n));
  };

  const copyResultToClipboard = async (result: any) => {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast.success('In Zwischenablage kopiert');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Feedback Varianten</CardTitle>
                <CardDescription>
                  Erstelle A/B/C/D Varianten pro Flow mit ChatGPT-Feedback
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedFlow} onValueChange={setSelectedFlow}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {flowVariants.map(flow => (
                    <SelectItem key={flow.id} value={flow.id}>
                      {flow.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dialog open={showAddDialog} onOpenChange={(open) => {
            if (!open) resetForm();
            setShowAddDialog(open);
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Variante hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Variante bearbeiten' : 'Neue Feedback-Variante'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Variante</Label>
                    <Select 
                      value={formVariantName} 
                      onValueChange={setFormVariantName}
                      disabled={!!editingId}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableVariantNames().map(name => (
                          <SelectItem key={name} value={name}>
                            Variante {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={formLabel}
                      onChange={(e) => setFormLabel(e.target.value)}
                      placeholder="z.B. UX Optimierung, Mobile-First..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ChatGPT Feedback / Prompt</Label>
                  <Textarea
                    value={formPrompt}
                    onChange={(e) => setFormPrompt(e.target.value)}
                    placeholder="Füge hier das ChatGPT-Feedback ein oder beschreibe die gewünschten Änderungen...

Beispiel:
- Step 1: Größere CTA-Buttons, klarere Headline
- Step 2: Weniger Formularfelder, Progressive Disclosure
- Step 3: Mehr Trust-Signals, Testimonials
- Allgemein: Mobile-First Redesign"
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetForm}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleSaveVariant} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {editingId ? 'Aktualisieren' : 'Speichern'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={fetchVariants}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <Button
          onClick={handleExecuteAll}
          disabled={isExecuting || variants.filter(v => v.status === 'pending').length === 0}
          className="gap-2"
          variant="default"
        >
          {isExecuting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Wird ausgeführt...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Alle ausführen ({variants.filter(v => v.status === 'pending').length})
            </>
          )}
        </Button>
      </div>

      {isExecuting && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            Varianten werden generiert...
          </p>
        </div>
      )}

      {/* Variants Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : variants.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Keine Varianten</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Erstelle deine erste Feedback-Variante für {selectedFlow}
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Variante erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants.map((variant) => {
            const StatusIcon = STATUS_CONFIG[variant.status]?.icon || Clock;
            const statusColor = STATUS_CONFIG[variant.status]?.color || "text-muted-foreground";
            const isThisExecuting = executingId === variant.id;

            return (
              <Card key={variant.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${VARIANT_COLORS[variant.variant_name]}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${VARIANT_COLORS[variant.variant_name]} text-white`}>
                        {variant.variant_name}
                      </Badge>
                      <span className="font-medium">{variant.variant_label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusIcon className={`h-4 w-4 ${statusColor} ${isThisExecuting ? 'animate-spin' : ''}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {variant.prompt.slice(0, 150)}...
                  </p>

                  {variant.output_flow_id && (
                    <div className="flex items-center gap-2 text-xs">
                      <FileText className="h-3 w-3" />
                      <span className="font-mono">{variant.output_flow_id}</span>
                    </div>
                  )}

                  {variant.error_message && (
                    <p className="text-xs text-destructive">
                      {variant.error_message}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    {variant.status === 'done' && variant.result_json && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          setSelectedResult(variant);
                          setShowResultDialog(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                        Ergebnis
                      </Button>
                    )}

                    {(variant.status === 'pending' || variant.status === 'error') && (
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleExecuteVariant(variant)}
                        disabled={isThisExecuting}
                      >
                        {isThisExecuting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                        Ausführen
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(variant)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteVariant(variant.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Badge className={`${VARIANT_COLORS[selectedResult?.variant_name || 'A']} text-white`}>
                  {selectedResult?.variant_name}
                </Badge>
                {selectedResult?.variant_label} - Ergebnis
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyResultToClipboard(selectedResult?.result_json)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {selectedResult?.result_json && (
              <div className="space-y-4 p-4">
                {/* Description */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">
                    {selectedResult.result_json.flowLabel || selectedResult.output_flow_id}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedResult.result_json.description || "Optimierte Flow-Variante"}
                  </p>
                </div>

                {/* Improvements */}
                {selectedResult.result_json.improvements && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Verbesserungen:</h4>
                    <ul className="space-y-1">
                      {selectedResult.result_json.improvements.map((imp: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Steps */}
                {selectedResult.result_json.steps && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Steps:</h4>
                    <Accordion type="single" collapsible>
                      {selectedResult.result_json.steps.map((step: any, i: number) => (
                        <AccordionItem key={i} value={`step-${i}`}>
                          <AccordionTrigger className="text-sm">
                            <span className="flex items-center gap-2">
                              <Badge variant="outline">{step.step}</Badge>
                              {step.name}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-1 pl-4">
                              {step.changes?.map((change: string, j: number) => (
                                <li key={j} className="text-sm text-muted-foreground">
                                  • {change}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Expected Impact */}
                {selectedResult.result_json.expectedImpact && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-lg bg-green-500/10 text-center">
                      <div className="text-lg font-bold text-green-600">
                        {selectedResult.result_json.expectedImpact.conversionIncrease || '+10%'}
                      </div>
                      <div className="text-xs text-muted-foreground">Conversion ↑</div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedResult.result_json.expectedImpact.dropOffReduction || '-15%'}
                      </div>
                      <div className="text-xs text-muted-foreground">Drop-off ↓</div>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/10 text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {selectedResult.result_json.expectedImpact.userSatisfaction || 'Höher'}
                      </div>
                      <div className="text-xs text-muted-foreground">Zufriedenheit</div>
                    </div>
                  </div>
                )}

                {/* Raw JSON */}
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">Raw JSON</summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-[200px]">
                    {JSON.stringify(selectedResult.result_json, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
