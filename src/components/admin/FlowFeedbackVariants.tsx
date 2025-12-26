import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  GitBranch,
  MessageSquare,
  ExternalLink,
  Wand2
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

// Suggested prompts based on common feedback patterns
const QUICK_PROMPTS = [
  { label: "Mobile-First Redesign", prompt: "Komplettes Mobile-First Redesign: Touch-optimierte CTAs (min. 48px), Thumb-Zone-optimiertes Layout, Sticky Footer CTA, weniger Text, mehr visuelle Hierarchie." },
  { label: "Conversion Boost", prompt: "Maximale Conversion: Größere CTAs, Trust-Signals in Hero, Social Proof, weniger Formularfelder, Progressive Disclosure, Exit-Intent." },
  { label: "Speed & Performance", prompt: "Performance-Optimierung: Lazy Loading, kritischer CSS-Path, kleinere Bilder, weniger JavaScript, optimierte Fonts." },
  { label: "Trust & Credibility", prompt: "Mehr Vertrauen: Partner-Logos, Zertifikate, Kundenbewertungen, Erfolgsgeschichten, Geld-zurück-Garantie, transparente Preise." },
  { label: "Simplification", prompt: "Radikal vereinfachen: Nur 1 CTA pro Step, weniger Optionen, klarere Sprache, weniger Schritte, Auto-Fill wo möglich." },
];

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
  const [activeTab, setActiveTab] = useState("variants");
  
  // Form state
  const [formVariantName, setFormVariantName] = useState("A");
  const [formLabel, setFormLabel] = useState("");
  const [formPrompt, setFormPrompt] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Quick paste state
  const [quickPasteText, setQuickPasteText] = useState("");
  const [quickPasteLabel, setQuickPasteLabel] = useState("");
  const [isQuickCreating, setIsQuickCreating] = useState(false);

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

      // Call AI function with enhanced prompt
      const { data, error } = await supabase.functions.invoke('ai-flow-generator', {
        body: {
          baseFlow: selectedFlow,
          newFlowName: `${selectedFlow}-v1${variant.variant_name.toLowerCase()}`,
          variantName: variant.variant_name,
          feedbackText: variant.prompt
        }
      });

      setProgress(70);

      if (error) throw error;

      const result = data?.result || {};
      const outputFlowId = result.flowName || `${selectedFlow}-v1${variant.variant_name.toLowerCase()}`;
      
      // Also save as flow_version for versioning
      try {
        await supabase.from('flow_versions').insert({
          flow_id: selectedFlow,
          version_number: `v1.${variant.variant_name.toLowerCase()}`,
          version_name: result.flowLabel || variant.variant_label,
          description: result.description || variant.prompt.slice(0, 200),
          step_configs: result.steps || [],
          screenshots: {},
          html_snapshots: {},
          ai_feedback: variant.prompt,
          ai_feedback_source: 'flow_feedback_variants',
          ai_feedback_date: new Date().toISOString(),
          is_baseline: false,
          is_live: false,
          created_by: 'ai-flow-generator'
        });
      } catch (versionErr) {
        console.warn('Could not save flow version:', versionErr);
      }

      setProgress(90);

      // Save result to variant
      await supabase
        .from('flow_feedback_variants')
        .update({
          status: 'done',
          result_json: result,
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

  // Quick create from pasted ChatGPT analysis
  const handleQuickCreate = async () => {
    if (!quickPasteText.trim()) {
      toast.error('Bitte ChatGPT-Analyse einfügen');
      return;
    }

    setIsQuickCreating(true);
    
    try {
      // Find next available variant name
      const used = variants.map(v => v.variant_name);
      const nextVariant = ['A', 'B', 'C', 'D', 'E', 'F'].find(n => !used.includes(n));
      
      if (!nextVariant) {
        toast.error('Alle Varianten (A-F) bereits belegt');
        return;
      }

      // Auto-generate label if not provided
      const label = quickPasteLabel.trim() || `ChatGPT Analyse ${new Date().toLocaleDateString('de-CH')}`;

      // Create the variant
      const { error } = await supabase
        .from('flow_feedback_variants')
        .insert({
          flow_id: selectedFlow,
          variant_name: nextVariant,
          variant_label: label,
          prompt: quickPasteText
        });

      if (error) throw error;
      
      toast.success(`Variante ${nextVariant} erstellt! Jetzt ausführen für V1.${nextVariant.toLowerCase()}`);
      setQuickPasteText("");
      setQuickPasteLabel("");
      fetchVariants();
    } catch (err: any) {
      console.error('Quick create failed:', err);
      toast.error(err.message || 'Erstellen fehlgeschlagen');
    } finally {
      setIsQuickCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
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
              <Link to="/flow-tester" target="_blank">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Flow Tester
                </Button>
              </Link>
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

      {/* Quick Paste Section - NEW */}
      <Card className="border-dashed border-2 border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">ChatGPT Analyse einfügen</CardTitle>
          </div>
          <CardDescription>
            Paste deine ChatGPT-Analyse hier ein → automatisch neue Variante erstellen → ausführen für V1.a, V1.b etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <Textarea
                value={quickPasteText}
                onChange={(e) => setQuickPasteText(e.target.value)}
                placeholder="Hier ChatGPT-Analyse oder eigene Verbesserungsvorschläge einfügen...

Beispiel:
## Verbesserungen für Step 1:
- Hero-Headline klarer formulieren
- CTA-Button größer und kontrastreicher
- Trust-Badges unter dem CTA hinzufügen

## Step 2 Optimierungen:
- Formularfelder auf das Wesentliche reduzieren
- Progressive Disclosure implementieren
..."
                className="min-h-[150px] font-mono text-sm"
              />
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Label (optional)</Label>
                <Input
                  value={quickPasteLabel}
                  onChange={(e) => setQuickPasteLabel(e.target.value)}
                  placeholder="z.B. Mobile UX Fix"
                  className="text-sm"
                />
              </div>
              <Button 
                onClick={handleQuickCreate}
                disabled={isQuickCreating || !quickPasteText.trim()}
                className="w-full gap-2"
              >
                {isQuickCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                Variante erstellen
              </Button>
              <div className="text-xs text-muted-foreground">
                Nächste: Variante {['A', 'B', 'C', 'D', 'E', 'F'].find(n => !variants.map(v => v.variant_name).includes(n)) || '(voll)'}
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="pt-2 border-t">
            <Label className="text-xs text-muted-foreground mb-2 block">Schnell-Vorlagen:</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((qp, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setQuickPasteText(qp.prompt)}
                >
                  {qp.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
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

      {/* Result Dialog - Enhanced with Tabs */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Badge className={`${VARIANT_COLORS[selectedResult?.variant_name || 'A']} text-white`}>
                  {selectedResult?.variant_name}
                </Badge>
                {selectedResult?.result_json?.flowLabel || selectedResult?.variant_label}
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyResultToClipboard(selectedResult?.result_json)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="mt-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Übersicht</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="max-h-[55vh] mt-4">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 p-1">
                {/* Implementation Summary */}
                {selectedResult?.result_json?.implementation && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Implementation</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedResult.result_json.implementation.summary}
                          </p>
                          <div className="flex gap-4 mt-3 text-xs">
                            <span className="flex items-center gap-1">
                              <Badge variant="outline">{selectedResult.result_json.implementation.priority}</Badge>
                            </span>
                            <span>Impact: {selectedResult.result_json.implementation.estimatedImpact}</span>
                            <span>Zeit: {selectedResult.result_json.implementation.implementationTime}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Description */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">
                    {selectedResult?.result_json?.flowLabel || selectedResult?.output_flow_id}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedResult?.result_json?.description || "Optimierte Flow-Variante"}
                  </p>
                </div>

                {/* Improvements */}
                {selectedResult?.result_json?.improvements && (
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

                {/* Global Changes */}
                {selectedResult?.result_json?.globalChanges && Object.keys(selectedResult.result_json.globalChanges).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Globale Änderungen:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedResult.result_json.globalChanges).map(([key, values]: [string, any]) => (
                        <div key={key} className="p-2 rounded bg-muted/30">
                          <span className="text-xs font-medium capitalize">{key}</span>
                          {Array.isArray(values) && (
                            <ul className="text-xs text-muted-foreground mt-1">
                              {values.slice(0, 3).map((v: string, i: number) => (
                                <li key={i}>• {v}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected Impact */}
                {selectedResult?.result_json?.expectedImpact && (
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-3 rounded-lg bg-green-500/10 text-center">
                      <div className="text-lg font-bold text-green-600">
                        {selectedResult.result_json.expectedImpact.conversionIncrease || '+15%'}
                      </div>
                      <div className="text-xs text-muted-foreground">Conversion ↑</div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedResult.result_json.expectedImpact.dropOffReduction || '-10%'}
                      </div>
                      <div className="text-xs text-muted-foreground">Drop-off ↓</div>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/10 text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {selectedResult.result_json.expectedImpact.mobileConversion || '+25%'}
                      </div>
                      <div className="text-xs text-muted-foreground">Mobile ↑</div>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-500/10 text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {selectedResult.result_json.expectedImpact.userSatisfaction || 'Höher'}
                      </div>
                      <div className="text-xs text-muted-foreground">UX</div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Steps Tab */}
              <TabsContent value="steps" className="space-y-4 p-1">
                {selectedResult?.result_json?.steps && selectedResult.result_json.steps.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {selectedResult.result_json.steps.map((step: any, i: number) => (
                      <AccordionItem key={i} value={`step-${i}`}>
                        <AccordionTrigger className="text-sm hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">Step {step.step}</Badge>
                            <span>{step.name}</span>
                            {step.changes?.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {step.changes.length} Änderungen
                              </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          {/* Original Issues */}
                          {step.originalIssues && (
                            <div className="p-2 rounded bg-red-50 dark:bg-red-950/30">
                              <span className="text-xs font-medium text-red-600">Probleme:</span>
                              <ul className="text-xs text-red-600/80 mt-1">
                                {step.originalIssues.map((issue: string, j: number) => (
                                  <li key={j}>• {issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Changes */}
                          {step.changes?.map((change: any, j: number) => (
                            <div key={j} className="p-3 rounded bg-muted/50 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{change.element}</span>
                                <Badge variant="outline" className="text-xs">{change.reason}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded bg-red-100/50 dark:bg-red-900/20">
                                  <span className="text-red-600 font-medium">Vorher:</span>
                                  <p className="text-muted-foreground">{change.before}</p>
                                </div>
                                <div className="p-2 rounded bg-green-100/50 dark:bg-green-900/20">
                                  <span className="text-green-600 font-medium">Nachher:</span>
                                  <p className="text-muted-foreground">{change.after}</p>
                                </div>
                              </div>
                              {change.cssChanges && (
                                <code className="text-xs bg-muted p-1 rounded block">
                                  {change.cssChanges}
                                </code>
                              )}
                            </div>
                          ))}
                          
                          {/* New Elements */}
                          {step.newElements?.map((el: any, j: number) => (
                            <div key={j} className="p-3 rounded bg-green-50 dark:bg-green-950/30 space-y-2">
                              <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-sm text-green-700">{el.element}</span>
                                <Badge variant="outline" className="text-xs">{el.position}</Badge>
                              </div>
                              {el.code && (
                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                  {el.code}
                                </pre>
                              )}
                            </div>
                          ))}
                          
                          {step.layoutChanges && (
                            <div className="text-xs text-muted-foreground">
                              Layout: {step.layoutChanges}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Keine Step-Details verfügbar
                  </div>
                )}
              </TabsContent>

              {/* Code Tab */}
              <TabsContent value="code" className="space-y-4 p-1">
                {selectedResult?.result_json?.codeSnippets && selectedResult.result_json.codeSnippets.length > 0 ? (
                  <div className="space-y-3">
                    {selectedResult.result_json.codeSnippets.map((snippet: any, i: number) => (
                      <div key={i} className="rounded-lg border overflow-hidden">
                        <div className="bg-muted px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-mono text-sm">{snippet.file}</span>
                            <Badge variant="outline" className="text-xs">{snippet.type}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(snippet.code);
                              toast.success('Code kopiert!');
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="p-3 bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-2">{snippet.description}</p>
                          <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                            {snippet.code}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Keine Code-Snippets verfügbar
                  </div>
                )}
                
                {/* Testing Notes */}
                {selectedResult?.result_json?.testingNotes && (
                  <Card className="mt-4">
                    <CardContent className="pt-4 space-y-2">
                      <h4 className="font-medium text-sm">Testing Notes</h4>
                      <p className="text-xs"><strong>Hypothese:</strong> {selectedResult.result_json.testingNotes.abTestHypothesis}</p>
                      <p className="text-xs"><strong>Metriken:</strong> {selectedResult.result_json.testingNotes.successMetrics?.join(', ')}</p>
                      <p className="text-xs"><strong>Risiken:</strong> {selectedResult.result_json.testingNotes.riskFactors?.join(', ')}</p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Raw JSON */}
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">Raw JSON anzeigen</summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-[200px]">
                    {JSON.stringify(selectedResult?.result_json, null, 2)}
                  </pre>
                </details>
              </TabsContent>

              {/* Prompt Tab */}
              <TabsContent value="prompt" className="space-y-4 p-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Original Prompt / Analyse</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedResult?.prompt || '');
                        toast.success('Prompt kopiert!');
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Kopieren
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {selectedResult?.prompt}
                    </pre>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ausgeführt: {selectedResult?.executed_at ? new Date(selectedResult.executed_at).toLocaleString('de-CH') : 'Nicht ausgeführt'}
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};
