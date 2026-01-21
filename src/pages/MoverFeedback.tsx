/**
 * Mover Feedback Page
 * Partner enters real move data after completion (for AI training)
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { GoldenNavigation } from "@/components/golden/navigation/GoldenNavigation";

const MoverFeedback = () => {
  const [searchParams] = useSearchParams();
  const movescanId = searchParams.get("id");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    actualVolume: "",
    actualWeight: "",
    actualDuration: "",
    crewSize: "",
    truckType: "",
    invoiceTotal: "",
    distanceKm: "",
    notes: "",
    estimatedVolume: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const volumeDeviation = formData.estimatedVolume && formData.actualVolume
        ? ((parseFloat(formData.actualVolume) - parseFloat(formData.estimatedVolume)) / parseFloat(formData.estimatedVolume)) * 100
        : null;

      // Use type assertion for new table
      await (supabase.from("movescan_hard_truth" as any) as any).insert({
        movescan_id: movescanId || null,
        actual_volume_m3: parseFloat(formData.actualVolume) || null,
        actual_weight_kg: parseFloat(formData.actualWeight) || null,
        actual_duration_hours: parseFloat(formData.actualDuration) || null,
        actual_crew_size: parseInt(formData.crewSize) || null,
        actual_truck_type: formData.truckType || null,
        invoice_total_chf: parseFloat(formData.invoiceTotal) || null,
        distance_km: parseFloat(formData.distanceKm) || null,
        mover_notes: formData.notes || null,
        estimated_volume_m3: parseFloat(formData.estimatedVolume) || null,
        volume_deviation_percent: volumeDeviation,
        feedback_source: "mover",
        verified: false
      });

      setSubmitted(true);
      toast.success("Feedback gespeichert! Vielen Dank.");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Fehler beim Speichern");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <GoldenNavigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Umzug abgeschlossen?</CardTitle>
              <CardDescription>
                Helfen Sie uns, unsere KI zu verbessern! Geben Sie die echten Daten des Umzugs ein.
                {movescanId && (
                  <span className="block mt-2 text-xs">
                    MoveScan ID: {movescanId}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Vielen Dank!</h3>
                  <p className="text-muted-foreground mb-6">
                    Ihre Daten helfen uns, präzisere Schätzungen zu liefern.
                  </p>
                  <Button asChild>
                    <a href="/">Zur Startseite</a>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Volume & Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tatsächliches Volumen (m³)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="z.B. 25.5"
                        value={formData.actualVolume}
                        onChange={(e) => updateField("actualVolume", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Geschätztes Volumen (m³)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Aus Offerte"
                        value={formData.estimatedVolume}
                        onChange={(e) => updateField("estimatedVolume", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Duration & Crew */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Dauer (Stunden)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="z.B. 6.5"
                        value={formData.actualDuration}
                        onChange={(e) => updateField("actualDuration", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Anzahl Mitarbeiter</Label>
                      <Input
                        type="number"
                        placeholder="z.B. 3"
                        value={formData.crewSize}
                        onChange={(e) => updateField("crewSize", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Truck & Distance */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>LKW-Typ</Label>
                      <Select 
                        value={formData.truckType} 
                        onValueChange={(v) => updateField("truckType", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transporter">Transporter (3.5t)</SelectItem>
                          <SelectItem value="small_truck">Klein-LKW (7.5t)</SelectItem>
                          <SelectItem value="medium_truck">Mittel-LKW (12t)</SelectItem>
                          <SelectItem value="large_truck">Gross-LKW (18t+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Distanz (km)</Label>
                      <Input
                        type="number"
                        placeholder="z.B. 45"
                        value={formData.distanceKm}
                        onChange={(e) => updateField("distanceKm", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Invoice Total */}
                  <div>
                    <Label>Rechnungsbetrag (CHF)</Label>
                    <Input
                      type="number"
                      placeholder="Endbetrag inkl. MwSt"
                      value={formData.invoiceTotal}
                      onChange={(e) => updateField("invoiceTotal", e.target.value)}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <Label>Notizen (optional)</Label>
                    <Textarea
                      placeholder="Besonderheiten, Probleme, Abweichungen..."
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Privacy Notice */}
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Diese Daten werden anonymisiert zur Verbesserung unserer KI-Schätzungen verwendet. 
                      Keine Kundendaten werden weitergegeben.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Wird gespeichert..." : "Feedback senden"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default MoverFeedback;
