import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

interface FlowStepConfig {
  step: number;
  name: string;
  description: string;
}

interface AddFlowDialogProps {
  onFlowAdded: () => void;
}

export function AddFlowDialog({ onFlowAdded }: AddFlowDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [flowId, setFlowId] = useState("");
  const [label, setLabel] = useState("");
  const [path, setPath] = useState("/umzugsofferten");
  const [description, setDescription] = useState("");
  const [stepCount, setStepCount] = useState(5);
  const [color, setColor] = useState("bg-purple-500");

  const generateSteps = (count: number): FlowStepConfig[] => {
    return Array.from({ length: count }, (_, i) => ({
      step: i + 1,
      name: `Step ${i + 1}`,
      description: `Schritt ${i + 1} des Flows`,
    }));
  };

  const handleSubmit = async () => {
    if (!flowId.trim() || !label.trim()) {
      toast.error("Flow-ID und Label sind erforderlich");
      return;
    }

    setIsSubmitting(true);
    try {
      const steps = generateSteps(stepCount);
      
      const { error } = await supabase
        .from('custom_flow_configs')
        .insert({
          flow_id: flowId.trim(),
          label: label.trim(),
          path: path.trim(),
          description: description.trim(),
          steps: steps as unknown as any,
          color,
          is_active: true,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("Diese Flow-ID existiert bereits");
        } else {
          throw error;
        }
        return;
      }

      toast.success(`Flow "${label}" erfolgreich hinzugefügt`);
      setOpen(false);
      onFlowAdded();
      
      // Reset form
      setFlowId("");
      setLabel("");
      setPath("/umzugsofferten");
      setDescription("");
      setStepCount(5);
      setColor("bg-purple-500");
    } catch (error) {
      console.error("Failed to add flow:", error);
      toast.error("Fehler beim Hinzufügen des Flows");
    } finally {
      setIsSubmitting(false);
    }
  };

  const colorOptions = [
    { value: "bg-purple-500", label: "Lila" },
    { value: "bg-blue-500", label: "Blau" },
    { value: "bg-green-500", label: "Grün" },
    { value: "bg-orange-500", label: "Orange" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-cyan-500", label: "Cyan" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Neuen Flow hinzufügen">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neuen Flow hinzufügen</DialogTitle>
          <DialogDescription>
            Erstelle eine neue Flow-Variante, die in der Datenbank gespeichert wird.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="flowId" className="text-right">
              Flow-ID
            </Label>
            <Input
              id="flowId"
              value={flowId}
              onChange={(e) => setFlowId(e.target.value)}
              placeholder="z.B. v9a oder v10"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="z.B. V9.A - Mobile First"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="path" className="text-right">
              Pfad
            </Label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/umzugsofferten"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="steps" className="text-right">
              Steps
            </Label>
            <Input
              id="steps"
              type="number"
              min={1}
              max={20}
              value={stepCount}
              onChange={(e) => setStepCount(parseInt(e.target.value) || 5)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Farbe
            </Label>
            <div className="col-span-3 flex gap-2">
              {colorOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className={`w-6 h-6 rounded-full ${opt.value} ${
                    color === opt.value ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Beschreibung
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung des Flows..."
              className="col-span-3"
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Speichern...
              </>
            ) : (
              "Flow hinzufügen"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
