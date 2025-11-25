import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Sun,
  Snowflake,
  Leaf,
  Flower2,
  Play,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeasonalPreset {
  id: string;
  name: string;
  season: string;
  description: string;
  configuration: any;
  is_active: boolean;
  created_at: string;
}

const SEASONS = [
  { value: "spring", label: "Frühling (März-Mai)", icon: Flower2, color: "text-pink-600" },
  { value: "summer", label: "Sommer (Juni-Aug)", icon: Sun, color: "text-yellow-600" },
  { value: "fall", label: "Herbst (Sep-Nov)", icon: Leaf, color: "text-orange-600" },
  { value: "winter", label: "Winter (Dez-Feb)", icon: Snowflake, color: "text-blue-600" },
];

export function SeasonalPresets() {
  const [loading, setLoading] = useState(false);
  const [presets, setPresets] = useState<SeasonalPreset[]>([]);
  const [editingPreset, setEditingPreset] = useState<Partial<SeasonalPreset> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const { data, error } = await supabase
        .from("seasonal_ranking_presets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPresets(data || []);
    } catch (error) {
      console.error("Error loading presets:", error);
      toast({
        title: "Fehler",
        description: "Vorlagen konnten nicht geladen werden",
        variant: "destructive",
      });
    }
  };

  const savePreset = async () => {
    if (!editingPreset?.name || !editingPreset?.season) {
      toast({
        title: "Fehlende Angaben",
        description: "Name und Saison sind erforderlich",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Get current ranking configuration
      const { data: companies } = await supabase
        .from("service_providers")
        .select("id, company_name, ranking_position, is_featured, featured_position")
        .eq("verification_status", "approved")
        .order("ranking_position", { ascending: true });

      const configuration = {
        companies: companies || [],
        timestamp: new Date().toISOString(),
      };

      if (editingPreset.id) {
        // Update
        const { error } = await supabase
          .from("seasonal_ranking_presets")
          .update({
            name: editingPreset.name,
            season: editingPreset.season,
            description: editingPreset.description,
            configuration,
          })
          .eq("id", editingPreset.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from("seasonal_ranking_presets")
          .insert([
            {
              name: editingPreset.name,
              season: editingPreset.season,
              description: editingPreset.description,
              configuration,
            },
          ]);

        if (error) throw error;
      }

      toast({
        title: "Gespeichert",
        description: "Vorlage wurde erfolgreich gespeichert",
      });

      setDialogOpen(false);
      setEditingPreset(null);
      loadPresets();
    } catch (error) {
      console.error("Error saving preset:", error);
      toast({
        title: "Fehler",
        description: "Vorlage konnte nicht gespeichert werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = async (preset: SeasonalPreset) => {
    if (!confirm(`"${preset.name}" aktivieren? Dies ändert die aktuellen Rankings.`)) {
      return;
    }

    try {
      setLoading(true);

      // Deactivate all presets
      await supabase
        .from("seasonal_ranking_presets")
        .update({ is_active: false })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      // Activate this preset
      await supabase
        .from("seasonal_ranking_presets")
        .update({ is_active: true })
        .eq("id", preset.id);

      // Apply configuration
      const companies = preset.configuration.companies || [];
      for (const company of companies) {
        await supabase
          .from("service_providers")
          .update({
            ranking_position: company.ranking_position,
            is_featured: company.is_featured,
            featured_position: company.featured_position,
          })
          .eq("id", company.id);
      }

      toast({
        title: "Aktiviert",
        description: `Vorlage "${preset.name}" wurde angewendet`,
      });

      loadPresets();
    } catch (error) {
      console.error("Error applying preset:", error);
      toast({
        title: "Fehler",
        description: "Vorlage konnte nicht angewendet werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePreset = async (id: string) => {
    if (!confirm("Vorlage wirklich löschen?")) return;

    try {
      const { error } = await supabase
        .from("seasonal_ranking_presets")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Gelöscht",
        description: "Vorlage wurde entfernt",
      });

      loadPresets();
    } catch (error) {
      console.error("Error deleting preset:", error);
      toast({
        title: "Fehler",
        description: "Vorlage konnte nicht gelöscht werden",
        variant: "destructive",
      });
    }
  };

  const getSeasonIcon = (season: string) => {
    const seasonData = SEASONS.find((s) => s.value === season);
    if (!seasonData) return Sun;
    return seasonData.icon;
  };

  const getSeasonColor = (season: string) => {
    const seasonData = SEASONS.find((s) => s.value === season);
    return seasonData?.color || "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Saisonale Vorlagen</h3>
            <p className="text-sm text-muted-foreground">
              Vordefinierte Ranking-Konfigurationen für verschiedene Jahreszeiten
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingPreset({})}>
                <Plus className="w-4 h-4 mr-2" />
                Neue Vorlage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Saisonale Vorlage erstellen</DialogTitle>
                <DialogDescription>
                  Speichern Sie die aktuelle Ranking-Konfiguration als Vorlage
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editingPreset?.name || ""}
                    onChange={(e) =>
                      setEditingPreset({ ...editingPreset, name: e.target.value })
                    }
                    placeholder="z.B. Hauptsaison 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Saison</Label>
                  <Select
                    value={editingPreset?.season || ""}
                    onValueChange={(value) =>
                      setEditingPreset({ ...editingPreset, season: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Saison wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEASONS.map((season) => (
                        <SelectItem key={season.value} value={season.value}>
                          {season.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Beschreibung (optional)</Label>
                  <Textarea
                    value={editingPreset?.description || ""}
                    onChange={(e) =>
                      setEditingPreset({
                        ...editingPreset,
                        description: e.target.value,
                      })
                    }
                    placeholder="Zusätzliche Informationen..."
                    rows={3}
                  />
                </div>
                <Button onClick={savePreset} disabled={loading} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Vorlage speichern
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {presets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Noch keine Vorlagen erstellt
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presets.map((preset) => {
              const Icon = getSeasonIcon(preset.season);
              const colorClass = getSeasonColor(preset.season);

              return (
                <Card
                  key={preset.id}
                  className={`p-4 ${preset.is_active ? "border-primary border-2" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-accent ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{preset.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {SEASONS.find((s) => s.value === preset.season)?.label}
                        </p>
                      </div>
                    </div>
                    {preset.is_active && (
                      <Badge variant="default">Aktiv</Badge>
                    )}
                  </div>

                  {preset.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {preset.description}
                    </p>
                  )}

                  <div className="text-xs text-muted-foreground mb-4">
                    Erstellt:{" "}
                    {new Date(preset.created_at).toLocaleDateString("de-CH")}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      disabled={loading || preset.is_active}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Anwenden
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deletePreset(preset.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">🎭 Verwendungszweck</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Speichern Sie optimale Rankings für Haupt- und Nebensaison</li>
            <li>• Wechseln Sie schnell zwischen verschiedenen Konfigurationen</li>
            <li>• Testen Sie verschiedene Strategien für unterschiedliche Zeiträume</li>
            <li>• Vorlagen enthalten Positionen und Featured-Status aller Firmen</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
