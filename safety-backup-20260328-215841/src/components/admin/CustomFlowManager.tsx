import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Loader2,
  Layers,
  GripVertical,
  RefreshCw,
  Eye,
  Copy,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface FlowStep {
  step: number;
  name: string;
  description: string;
}

interface CustomFlow {
  id: string;
  flow_id: string;
  label: string;
  path: string;
  color: string;
  description: string | null;
  steps: FlowStep[];
  is_active: boolean;
  created_at: string;
}

const COLORS = [
  { value: 'bg-blue-500', label: 'Blau' },
  { value: 'bg-green-500', label: 'Grün' },
  { value: 'bg-purple-500', label: 'Lila' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-cyan-500', label: 'Cyan' },
  { value: 'bg-yellow-500', label: 'Gelb' },
  { value: 'bg-red-500', label: 'Rot' },
  { value: 'bg-indigo-500', label: 'Indigo' },
  { value: 'bg-teal-500', label: 'Teal' },
];

export const CustomFlowManager = () => {
  const [flows, setFlows] = useState<CustomFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingFlow, setEditingFlow] = useState<CustomFlow | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formFlowId, setFormFlowId] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formPath, setFormPath] = useState("");
  const [formColor, setFormColor] = useState("bg-blue-500");
  const [formDescription, setFormDescription] = useState("");
  const [formSteps, setFormSteps] = useState<FlowStep[]>([
    { step: 1, name: "", description: "" }
  ]);

  useEffect(() => {
    fetchFlows();
  }, []);

  const fetchFlows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('custom_flow_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Parse steps from JSONB with proper typing
      const parsed = (data || []).map(flow => ({
        ...flow,
        steps: Array.isArray(flow.steps) 
          ? (flow.steps as unknown as FlowStep[])
          : []
      }));
      
      setFlows(parsed as unknown as CustomFlow[]);
    } catch (err) {
      console.error('Failed to fetch flows:', err);
      toast.error('Fehler beim Laden');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormFlowId("");
    setFormLabel("");
    setFormPath("");
    setFormColor("bg-blue-500");
    setFormDescription("");
    setFormSteps([{ step: 1, name: "", description: "" }]);
    setEditingFlow(null);
    setShowDialog(false);
  };

  const handleEdit = (flow: CustomFlow) => {
    setFormFlowId(flow.flow_id);
    setFormLabel(flow.label);
    setFormPath(flow.path);
    setFormColor(flow.color);
    setFormDescription(flow.description || "");
    setFormSteps(flow.steps.length > 0 ? flow.steps : [{ step: 1, name: "", description: "" }]);
    setEditingFlow(flow);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formFlowId.trim() || !formLabel.trim() || !formPath.trim()) {
      toast.error('Flow-ID, Label und Pfad sind erforderlich');
      return;
    }

    if (formSteps.some(s => !s.name.trim())) {
      toast.error('Alle Steps brauchen einen Namen');
      return;
    }

    setIsSaving(true);
    try {
      const stepsWithNumbers = formSteps.map((s, i) => ({
        ...s,
        step: i + 1
      }));

      if (editingFlow) {
        const { error } = await supabase
          .from('custom_flow_configs')
          .update({
            flow_id: formFlowId,
            label: formLabel,
            path: formPath,
            color: formColor,
            description: formDescription || null,
            steps: stepsWithNumbers
          })
          .eq('id', editingFlow.id);

        if (error) throw error;
        toast.success('Flow aktualisiert');
      } else {
        const { error } = await supabase
          .from('custom_flow_configs')
          .insert({
            flow_id: formFlowId,
            label: formLabel,
            path: formPath,
            color: formColor,
            description: formDescription || null,
            steps: stepsWithNumbers
          });

        if (error) throw error;
        toast.success('Flow erstellt');
      }

      resetForm();
      fetchFlows();
    } catch (err: any) {
      console.error('Save failed:', err);
      toast.error(err.message || 'Speichern fehlgeschlagen');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Flow wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('custom_flow_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Flow gelöscht');
      fetchFlows();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Löschen fehlgeschlagen');
    }
  };

  const handleToggleActive = async (flow: CustomFlow) => {
    try {
      const { error } = await supabase
        .from('custom_flow_configs')
        .update({ is_active: !flow.is_active })
        .eq('id', flow.id);

      if (error) throw error;
      fetchFlows();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const addStep = () => {
    setFormSteps([...formSteps, { 
      step: formSteps.length + 1, 
      name: "", 
      description: "" 
    }]);
  };

  const removeStep = (index: number) => {
    if (formSteps.length <= 1) return;
    setFormSteps(formSteps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof FlowStep, value: string | number) => {
    setFormSteps(formSteps.map((s, i) => 
      i === index ? { ...s, [field]: value } : s
    ));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formSteps.length - 1) return;
    
    const newSteps = [...formSteps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setFormSteps(newSteps);
  };

  const copyFlowConfig = async (flow: CustomFlow) => {
    const config = {
      id: flow.flow_id,
      label: flow.label,
      path: flow.path,
      color: flow.color,
      description: flow.description,
      steps: flow.steps
    };
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    toast.success('Flow-Config kopiert');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Custom Flow Manager</CardTitle>
                <CardDescription>
                  Erstelle eigene Flow-Varianten (V1.a, V1.b, etc.) mit individuellen Steps
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchFlows} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Dialog open={showDialog} onOpenChange={(open) => {
                if (!open) resetForm();
                setShowDialog(open);
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Neuer Flow
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>
                      {editingFlow ? 'Flow bearbeiten' : 'Neuen Flow erstellen'}
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4 py-4">
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Flow-ID *</Label>
                          <Input
                            value={formFlowId}
                            onChange={(e) => setFormFlowId(e.target.value)}
                            placeholder="z.B. umzugsofferten-v1a"
                          />
                          <p className="text-xs text-muted-foreground">
                            Eindeutige ID (lowercase, keine Leerzeichen)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Label *</Label>
                          <Input
                            value={formLabel}
                            onChange={(e) => setFormLabel(e.target.value)}
                            placeholder="z.B. V1.a - UX Optimiert"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Pfad *</Label>
                          <Input
                            value={formPath}
                            onChange={(e) => setFormPath(e.target.value)}
                            placeholder="/umzugsofferten-v1a"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Farbe</Label>
                          <Select value={formColor} onValueChange={setFormColor}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COLORS.map(c => (
                                <SelectItem key={c.value} value={c.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded ${c.value}`} />
                                    {c.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Beschreibung</Label>
                        <Textarea
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Was macht diesen Flow besonders?"
                          rows={2}
                        />
                      </div>

                      {/* Steps */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium">Steps ({formSteps.length})</Label>
                          <Button variant="outline" size="sm" onClick={addStep}>
                            <Plus className="h-4 w-4 mr-1" />
                            Step hinzufügen
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {formSteps.map((step, index) => (
                            <div key={index} className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30">
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => moveStep(index, 'up')}
                                  disabled={index === 0}
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => moveStep(index, 'down')}
                                  disabled={index === formSteps.length - 1}
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                              </div>
                              <Badge variant="outline" className="mt-2 shrink-0">
                                {index + 1}
                              </Badge>
                              <div className="flex-1 space-y-2">
                                <Input
                                  value={step.name}
                                  onChange={(e) => updateStep(index, 'name', e.target.value)}
                                  placeholder="Step-Name *"
                                  className="h-8"
                                />
                                <Input
                                  value={step.description}
                                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                                  placeholder="Beschreibung (optional)"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive shrink-0"
                                onClick={() => removeStep(index)}
                                disabled={formSteps.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={resetForm}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Speichern
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Flows List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : flows.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Keine Custom Flows</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Erstelle deinen ersten eigenen Flow (z.B. V1.a)
            </p>
            <Button onClick={() => setShowDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Flow erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flows.map((flow) => (
            <Card key={flow.id} className={`relative overflow-hidden ${!flow.is_active ? 'opacity-60' : ''}`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${flow.color}`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`${flow.color} text-white`}>
                      {flow.flow_id.split('-').pop()?.toUpperCase() || flow.flow_id}
                    </Badge>
                    <span className="font-medium text-sm">{flow.label}</span>
                  </div>
                  <Switch
                    checked={flow.is_active}
                    onCheckedChange={() => handleToggleActive(flow)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {flow.description || 'Keine Beschreibung'}
                </p>
                
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline">{flow.steps.length} Steps</Badge>
                  <code className="text-muted-foreground">{flow.path}</code>
                </div>

                <div className="flex flex-wrap gap-1">
                  {flow.steps.slice(0, 4).map((step, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {i + 1}. {step.name}
                    </Badge>
                  ))}
                  {flow.steps.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{flow.steps.length - 4}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(flow)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyFlowConfig(flow)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive ml-auto"
                    onClick={() => handleDelete(flow.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <h4 className="font-medium mb-2">💡 Verwendung</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Erstelle V1.a, V1.b etc. basierend auf ChatGPT-Feedback</li>
            <li>• Definiere individuelle Steps pro Variante</li>
            <li>• Custom Flows erscheinen automatisch im Export</li>
            <li>• Kopiere die Config für manuelle Integration</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
