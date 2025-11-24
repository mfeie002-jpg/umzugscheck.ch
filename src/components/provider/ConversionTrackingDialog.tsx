import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";

interface ConversionTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: {
    id: string;
    lead_id: string;
    amount: number;
    conversion_status?: string;
    actual_job_value?: number;
  };
  leadDetails: {
    calculator_type: string;
    from_city: string;
    to_city: string;
  };
  onUpdate?: () => void;
}

export function ConversionTrackingDialog({ 
  open, 
  onOpenChange, 
  transaction, 
  leadDetails,
  onUpdate 
}: ConversionTrackingDialogProps) {
  const [conversionStatus, setConversionStatus] = useState(transaction.conversion_status || 'pending');
  const [actualJobValue, setActualJobValue] = useState(transaction.actual_job_value?.toString() || '');
  const [conversionNotes, setConversionNotes] = useState('');
  const [lostReason, setLostReason] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async () => {
    setUpdating(true);

    try {
      const { data, error } = await supabase.functions.invoke('update-lead-conversion', {
        body: {
          transactionId: transaction.id,
          conversionStatus,
          actualJobValue: actualJobValue ? parseFloat(actualJobValue) : null,
          conversionNotes,
          lostReason: conversionStatus === 'lost' ? lostReason : null
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Conversion-Status erfolgreich aktualisiert!');
        onOpenChange(false);
        onUpdate?.();
      } else {
        throw new Error(data?.error || 'Fehler beim Aktualisieren');
      }
    } catch (error: any) {
      console.error('Error updating conversion:', error);
      toast.error(error.message || 'Fehler beim Aktualisieren des Status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lead Conversion Tracking</DialogTitle>
          <DialogDescription>
            {leadDetails.calculator_type} • {leadDetails.from_city} → {leadDetails.to_city}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>Conversion Status</Label>
            <RadioGroup value={conversionStatus} onValueChange={setConversionStatus}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Ausstehend</div>
                    <div className="text-xs text-muted-foreground">Lead wird noch bearbeitet</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="converted" id="converted" />
                <Label htmlFor="converted" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">Gewonnen</div>
                    <div className="text-xs text-muted-foreground">Auftrag erfolgreich abgeschlossen</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="lost" id="lost" />
                <Label htmlFor="lost" className="flex items-center gap-2 cursor-pointer flex-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <div className="font-medium">Verloren</div>
                    <div className="text-xs text-muted-foreground">Auftrag nicht erhalten</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {conversionStatus === 'converted' && (
            <div className="space-y-2">
              <Label htmlFor="actualValue">Tatsächlicher Auftragswert (CHF)</Label>
              <Input
                id="actualValue"
                type="number"
                step="0.01"
                placeholder="z.B. 2500.00"
                value={actualJobValue}
                onChange={(e) => setActualJobValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Lead-Kosten: CHF {transaction.amount}
              </p>
            </div>
          )}

          {conversionStatus === 'lost' && (
            <div className="space-y-2">
              <Label htmlFor="lostReason">Grund für Verlust</Label>
              <Textarea
                id="lostReason"
                placeholder="z.B. Preis zu hoch, Kunde hat sich nicht gemeldet, Konkurrent günstiger..."
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notizen (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Zusätzliche Informationen..."
              value={conversionNotes}
              onChange={(e) => setConversionNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={updating}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={updating}>
            {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
