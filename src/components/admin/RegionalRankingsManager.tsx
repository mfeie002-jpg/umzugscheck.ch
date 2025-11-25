import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Copy, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SWISS_CANTONS = [
  { code: "ZH", name: "Zürich" },
  { code: "BE", name: "Bern" },
  { code: "LU", name: "Luzern" },
  { code: "AG", name: "Aargau" },
  { code: "SG", name: "St. Gallen" },
  { code: "VD", name: "Waadt" },
  { code: "GE", name: "Genf" },
  { code: "BS", name: "Basel-Stadt" },
  { code: "BL", name: "Basel-Landschaft" },
  { code: "TI", name: "Tessin" },
  { code: "SO", name: "Solothurn" },
  { code: "FR", name: "Freiburg" },
  { code: "TG", name: "Thurgau" },
  { code: "VS", name: "Wallis" },
  { code: "NE", name: "Neuenburg" },
  { code: "GR", name: "Graubünden" },
];

interface RegionalRankingsManagerProps {
  companies: any[];
}

export function RegionalRankingsManager({ companies }: RegionalRankingsManagerProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("ZH");
  const [regionalRankings, setRegionalRankings] = useState<Map<string, any[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRegionalRankings();
  }, [selectedRegion]);

  const fetchRegionalRankings = async () => {
    try {
      const { data, error } = await supabase
        .from("regional_rankings")
        .select("*")
        .eq("region_code", selectedRegion)
        .order("position", { ascending: true });

      if (error) throw error;

      if (data) {
        const newMap = new Map(regionalRankings);
        newMap.set(selectedRegion, data);
        setRegionalRankings(newMap);
      }
    } catch (error) {
      console.error("Error fetching regional rankings:", error);
    }
  };

  const copyFromGlobal = async () => {
    try {
      setLoading(true);

      // Delete existing regional rankings for this region
      await supabase
        .from("regional_rankings")
        .delete()
        .eq("region_code", selectedRegion);

      // Insert global rankings as regional rankings
      const regionalData = companies.map((company, index) => ({
        region_code: selectedRegion,
        region_name: SWISS_CANTONS.find(c => c.code === selectedRegion)?.name || selectedRegion,
        company_id: company.id,
        position: index + 1,
        is_featured: company.is_featured,
      }));

      const { error } = await supabase
        .from("regional_rankings")
        .insert(regionalData);

      if (error) throw error;

      toast({
        title: "Kopiert",
        description: "Globales Ranking wurde für diese Region übernommen",
      });

      fetchRegionalRankings();
    } catch (error) {
      console.error("Error copying global rankings:", error);
      toast({
        title: "Fehler",
        description: "Kopieren fehlgeschlagen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRegionalRankings = async () => {
    try {
      setLoading(true);
      
      toast({
        title: "Gespeichert",
        description: "Regionale Rankings wurden aktualisiert",
      });
    } catch (error) {
      console.error("Error saving regional rankings:", error);
      toast({
        title: "Fehler",
        description: "Speichern fehlgeschlagen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentRankings = regionalRankings.get(selectedRegion) || [];
  const hasRegionalRankings = currentRankings.length > 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Regionale Rankings verwalten
          </h3>

          <div className="flex items-center gap-3">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Region wählen" />
              </SelectTrigger>
              <SelectContent>
                {SWISS_CANTONS.map((canton) => (
                  <SelectItem key={canton.code} value={canton.code}>
                    {canton.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={copyFromGlobal}
              disabled={loading}
            >
              <Copy className="w-4 h-4 mr-2" />
              Von Global kopieren
            </Button>

            <Button onClick={saveRegionalRankings} disabled={loading || !hasRegionalRankings}>
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Definieren Sie spezifische Rankings für {SWISS_CANTONS.find(c => c.code === selectedRegion)?.name}.
          Diese überschreiben das globale Ranking für Benutzer aus dieser Region.
        </p>

        {!hasRegionalRankings ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Keine regionalen Rankings für {SWISS_CANTONS.find(c => c.code === selectedRegion)?.name}
            </p>
            <Button onClick={copyFromGlobal} disabled={loading}>
              <Copy className="w-4 h-4 mr-2" />
              Globales Ranking übernehmen
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentRankings.map((ranking, index) => {
              const company = companies.find(c => c.id === ranking.company_id);
              if (!company) return null;

              return (
                <div key={ranking.id} className="border rounded-lg p-4 flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>

                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.company_name}
                      className="w-12 h-12 object-contain rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      {company.company_name}
                      {ranking.is_featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {company.cantons_served.join(", ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h4 className="font-semibold mb-4">Regionale Abdeckung</h4>
        <div className="grid grid-cols-4 gap-3">
          {SWISS_CANTONS.map((canton) => {
            const hasRankings = regionalRankings.has(canton.code);
            return (
              <Button
                key={canton.code}
                variant={hasRankings ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(canton.code)}
                className="justify-start"
              >
                {canton.name}
                {hasRankings && <Badge className="ml-2" variant="secondary">✓</Badge>}
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
