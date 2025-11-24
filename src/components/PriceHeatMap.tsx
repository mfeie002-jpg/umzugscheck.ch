import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Flame, Snowflake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SwitzerlandMap } from "./SwitzerlandMap";

interface PriceHeat {
  canton: string;
  avgPrice: number;
  heatLevel: "low" | "medium" | "high";
}

export const PriceHeatMap = () => {
  const [priceData, setPriceData] = useState<Record<string, number>>({});
  const [highlightedCantons, setHighlightedCantons] = useState<string[]>([]);

  useEffect(() => {
    fetchPriceHeat();
  }, []);

  const fetchPriceHeat = async () => {
    const cantons = ["ZH", "BE", "VD", "AG", "GE", "LU", "BS", "BL", "SG", "TI"];
    const heat: Record<string, number> = {};

    for (const canton of cantons) {
      // Simulate price data - in production, fetch from historical_pricing
      const basePrice = 900;
      const variance = Math.random() * 600;
      heat[canton] = Math.round(basePrice + variance);
    }

    setPriceData(heat);
    
    // Highlight expensive cantons
    const expensive = Object.entries(heat)
      .filter(([_, price]) => price > 1200)
      .map(([canton]) => canton);
    setHighlightedCantons(expensive);
  };

  const getPriceLevel = (price: number): "low" | "medium" | "high" => {
    if (price < 1000) return "low";
    if (price < 1300) return "medium";
    return "high";
  };

  const priceRanges = [
    { label: "Günstig", range: "< CHF 1000", color: "bg-green-500", icon: Snowflake },
    { label: "Mittel", range: "CHF 1000-1300", color: "bg-yellow-500", icon: MapPin },
    { label: "Teuer", range: "> CHF 1300", color: "bg-red-500", icon: Flame },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Preis-Heatmap
        </CardTitle>
        <CardDescription>
          Visualisierung der Preisverteilung über alle Kantone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {priceRanges.map((range) => (
            <div key={range.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${range.color}`} />
              <span className="text-sm font-medium">{range.label}</span>
              <span className="text-xs text-muted-foreground">{range.range}</span>
            </div>
          ))}
        </div>

        {/* Map */}
        <SwitzerlandMap
          onCantonClick={(code) => console.log("Selected:", code)}
          companyCounts={priceData}
          highlightedCantons={highlightedCantons}
        />

        {/* Price Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(priceData).map(([canton, price]) => {
            const level = getPriceLevel(price);
            return (
              <div
                key={canton}
                className={`p-3 rounded-lg border ${
                  level === "low" ? "bg-green-50 border-green-200 dark:bg-green-900/20" :
                  level === "medium" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20" :
                  "bg-red-50 border-red-200 dark:bg-red-900/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{canton}</span>
                  <Badge variant="outline" className="text-xs">
                    CHF {price}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insights */}
        <div className="p-4 bg-primary/5 rounded-lg border">
          <h4 className="font-semibold mb-2">💡 Preis-Insights</h4>
          <ul className="space-y-1 text-sm">
            <li>• Günstigste Region: CHF {Math.min(...Object.values(priceData))}</li>
            <li>• Teuerste Region: CHF {Math.max(...Object.values(priceData))}</li>
            <li>• Durchschnitt Schweiz: CHF {Math.round(Object.values(priceData).reduce((a, b) => a + b, 0) / Object.keys(priceData).length)}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
