import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Star, MapPin, DollarSign, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const cantons = [
  { code: "ZH", name: "Zürich" },
  { code: "BE", name: "Bern" },
  { code: "VD", name: "Waadt" },
  { code: "AG", name: "Aargau" },
  { code: "GE", name: "Genf" },
];

interface CantonStats {
  avgRating: number;
  avgPriceMin: number;
  avgPriceMax: number;
  companyCount: number;
}

export const CantonComparison = () => {
  const [canton1, setCanton1] = useState("ZH");
  const [canton2, setCanton2] = useState("BE");
  const [stats1, setStats1] = useState<CantonStats | null>(null);
  const [stats2, setStats2] = useState<CantonStats | null>(null);
  const { toast } = useToast();

  const fetchCantonStats = async (canton: string): Promise<CantonStats> => {
    const { data: companies } = await supabase
      .from("companies")
      .select("rating, price_level")
      .contains("service_areas", [canton]);

    const avgRating = companies?.length 
      ? companies.reduce((sum, c) => sum + (c.rating || 0), 0) / companies.length 
      : 0;

    return {
      avgRating: Math.round(avgRating * 10) / 10,
      avgPriceMin: 850,
      avgPriceMax: 1200,
      companyCount: companies?.length || 0,
    };
  };

  useEffect(() => {
    fetchCantonStats(canton1).then(setStats1);
    fetchCantonStats(canton2).then(setStats2);
  }, [canton1, canton2]);

  const exportToCSV = () => {
    if (!stats1 || !stats2) return;
    
    const canton1Name = cantons.find(c => c.code === canton1)?.name || canton1;
    const canton2Name = cantons.find(c => c.code === canton2)?.name || canton2;
    
    const csv = [
      ["Metrik", canton1Name, canton2Name],
      ["Durchschnittliche Bewertung", stats1.avgRating, stats2.avgRating],
      ["Anzahl Firmen", stats1.companyCount, stats2.companyCount],
      ["Preisbereich Min (CHF)", stats1.avgPriceMin, stats2.avgPriceMin],
      ["Preisbereich Max (CHF)", stats1.avgPriceMax, stats2.avgPriceMax],
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `canton-comparison-${canton1}-${canton2}.csv`;
    a.click();
    
    toast({
      title: "Export erfolgreich",
      description: "Die Vergleichsdaten wurden als CSV heruntergeladen",
    });
  };

  const exportToPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF-Export ist in Entwicklung",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Kantone vergleichen</CardTitle>
            <CardDescription>Vergleichen Sie Umzugsfirmen zwischen Kantonen</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select value={canton1} onValueChange={setCanton1}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cantons.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={canton2} onValueChange={setCanton2}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cantons.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="space-y-3">
            <h3 className="font-semibold">{cantons.find(c => c.code === canton1)?.name}</h3>
            {stats1 && (
              <>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">{stats1.avgRating} ⌀ Bewertung</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{stats1.companyCount} Firmen</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm">CHF {stats1.avgPriceMin}-{stats1.avgPriceMax}</span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 border-l pl-4">
            <h3 className="font-semibold">{cantons.find(c => c.code === canton2)?.name}</h3>
            {stats2 && (
              <>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">{stats2.avgRating} ⌀ Bewertung</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{stats2.companyCount} Firmen</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm">CHF {stats2.avgPriceMin}-{stats2.avgPriceMax}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
