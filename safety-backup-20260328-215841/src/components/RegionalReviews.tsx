import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Award, MapPin, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDisplayRating } from "@/hooks/usePublicProviders";

interface RegionalReview {
  canton: string;
  avgRating: number;
  providerCount: number;
  topCompany: string;
}

const cantonNames: Record<string, string> = {
  ZH: "Zürich",
  BE: "Bern",
  VD: "Waadt",
  AG: "Aargau",
  GE: "Genf",
  LU: "Luzern",
  BS: "Basel-Stadt",
  SG: "St. Gallen",
  ZG: "Zug",
};

export const RegionalReviews = () => {
  const [sortBy, setSortBy] = useState<"rating" | "providers">("rating");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const { data: regionalData = [], isLoading } = useQuery({
    queryKey: ["regional-reviews", serviceFilter],
    queryFn: async () => {
      const cantons = ["ZH", "BE", "AG", "LU", "BS", "SG", "ZG"];
      const results: RegionalReview[] = [];

      for (const canton of cantons) {
        let query = supabase
          .from("service_providers")
          .select("company_name, quality_score")
          .eq("account_status", "active")
          .eq("verification_status", "approved")
          .contains("cantons_served", [canton]);

        if (serviceFilter !== "all") {
          query = query.contains("services_offered", [serviceFilter]);
        }

        const { data: providers } = await query.order("quality_score", { ascending: false });

        if (providers && providers.length > 0) {
          const avgQuality = providers.reduce((sum, p) => sum + (p.quality_score || 0), 0) / providers.length;
          
          results.push({
            canton,
            avgRating: getDisplayRating(avgQuality),
            providerCount: providers.length,
            topCompany: providers[0].company_name,
          });
        }
      }

      return results;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Sort data based on selected criteria
  const sortedData = [...regionalData].sort((a, b) => {
    if (sortBy === "rating") return b.avgRating - a.avgRating;
    if (sortBy === "providers") return b.providerCount - a.providerCount;
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Regionale Übersicht
        </CardTitle>
        <CardDescription>
          Die am besten bewerteten Umzugsfirmen nach Region
        </CardDescription>
        
        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <Select value={sortBy} onValueChange={(value: "rating" | "providers") => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Höchste Bewertung</SelectItem>
              <SelectItem value="providers">Meiste Firmen</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Services</SelectItem>
              <SelectItem value="Privatumzug">Umzug</SelectItem>
              <SelectItem value="Reinigung">Reinigung</SelectItem>
              <SelectItem value="Lagerung">Lagerung</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedData.map((data, index) => (
              <div
                key={data.canton}
                className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">{cantonNames[data.canton]}</h4>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Top Region
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{data.avgRating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {data.providerCount} Firmen • Top: {data.topCompany}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
