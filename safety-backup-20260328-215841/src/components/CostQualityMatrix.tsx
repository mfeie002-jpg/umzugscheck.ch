import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  name: string;
  rating: number;
  estimatedPrice: number;
  quadrant: "budget" | "value" | "premium" | "overpriced";
}

export const CostQualityMatrix = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const { data } = await supabase
      .from("companies")
      .select("name, rating, price_level")
      .limit(12);

    if (data) {
      const mapped: Company[] = data.map((c) => {
        const price = 850 + Math.random() * 600;
        const rating = c.rating || 3.5;
        
        let quadrant: "budget" | "value" | "premium" | "overpriced";
        if (price < 1100 && rating >= 4.0) quadrant = "value";
        else if (price < 1100 && rating < 4.0) quadrant = "budget";
        else if (price >= 1100 && rating >= 4.0) quadrant = "premium";
        else quadrant = "overpriced";

        return {
          name: c.name,
          rating,
          estimatedPrice: Math.round(price),
          quadrant,
        };
      });
      setCompanies(mapped);
    }
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case "value": return "bg-green-500";
      case "budget": return "bg-yellow-500";
      case "premium": return "bg-blue-500";
      case "overpriced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const quadrants = [
    { id: "value", label: "Preis-Leistung ⭐", color: "green", companies: companies.filter(c => c.quadrant === "value") },
    { id: "premium", label: "Premium", color: "blue", companies: companies.filter(c => c.quadrant === "premium") },
    { id: "budget", label: "Budget", color: "yellow", companies: companies.filter(c => c.quadrant === "budget") },
    { id: "overpriced", label: "Überteuert", color: "red", companies: companies.filter(c => c.quadrant === "overpriced") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Kosten-Qualitäts-Matrix
        </CardTitle>
        <CardDescription>
          Visualisierung der Preis-Leistungs-Positionierung
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {quadrants.map((quadrant) => (
            <div
              key={quadrant.id}
              className={`p-4 rounded-lg border-2 ${
                quadrant.id === "value" ? "border-green-500 bg-green-50 dark:bg-green-900/20" :
                quadrant.id === "premium" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" :
                quadrant.id === "budget" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" :
                "border-red-500 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">{quadrant.label}</h4>
                <Badge variant="outline">{quadrant.companies.length}</Badge>
              </div>

              <div className="space-y-2">
                {quadrant.companies.slice(0, 3).map((company) => (
                  <div key={company.name} className="text-xs">
                    <div className="font-medium truncate">{company.name}</div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-2 h-2 fill-yellow-500 text-yellow-500" />
                        {company.rating}
                      </span>
                      <span>CHF {company.estimatedPrice}</span>
                    </div>
                  </div>
                ))}
                {quadrant.companies.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{quadrant.companies.length - 3} weitere
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-semibold text-sm">Interpretation</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span><strong>Preis-Leistung:</strong> Beste Kombination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span><strong>Premium:</strong> Hochwertig & teuer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded" />
              <span><strong>Budget:</strong> Günstig, Basis-Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span><strong>Überteuert:</strong> Zu teuer für Qualität</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
