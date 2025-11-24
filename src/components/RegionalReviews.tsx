import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Award, MapPin, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface RegionalReview {
  canton: string;
  avgRating: number;
  reviewCount: number;
  topCompany: string;
}

export const RegionalReviews = () => {
  const [regionalData, setRegionalData] = useState<RegionalReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "companies">("rating");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  useEffect(() => {
    const fetchRegionalReviews = async () => {
      const cantons = ["ZH", "BE", "VD", "AG", "GE", "LU"];
      const results: RegionalReview[] = [];

      for (const canton of cantons) {
        const { data: companies } = await supabase
          .from("companies")
          .select("name, rating, review_count")
          .contains("service_areas", [canton])
          .order("rating", { ascending: false })
          .limit(1);

        if (companies && companies.length > 0) {
          const { data: allCompanies } = await supabase
            .from("companies")
            .select("rating, review_count")
            .contains("service_areas", [canton]);

          const totalReviews = allCompanies?.reduce((sum, c) => sum + (c.review_count || 0), 0) || 0;
          const avgRating = allCompanies?.length
            ? allCompanies.reduce((sum, c) => sum + (c.rating || 0), 0) / allCompanies.length
            : 0;

          results.push({
            canton,
            avgRating: Math.round(avgRating * 10) / 10,
            reviewCount: totalReviews,
            topCompany: companies[0].name,
          });
        }
      }

      setRegionalData(results);
      setLoading(false);
    };

    fetchRegionalReviews();
  }, []);

  const cantonNames: Record<string, string> = {
    ZH: "Zürich",
    BE: "Bern",
    VD: "Waadt",
    AG: "Aargau",
    GE: "Genf",
    LU: "Luzern",
  };

  // Sort data based on selected criteria
  const sortedData = [...regionalData].sort((a, b) => {
    if (sortBy === "rating") return b.avgRating - a.avgRating;
    if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Regionale Bewertungen
        </CardTitle>
        <CardDescription>
          Die am besten bewerteten Umzugsfirmen nach Region
        </CardDescription>
        
        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Höchste Bewertung</SelectItem>
              <SelectItem value="reviews">Meiste Bewertungen</SelectItem>
              <SelectItem value="companies">Meiste Firmen</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Services</SelectItem>
              <SelectItem value="moving">Umzug</SelectItem>
              <SelectItem value="cleaning">Reinigung</SelectItem>
              <SelectItem value="storage">Lagerung</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
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
                    <span className="font-bold">{data.avgRating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {data.reviewCount} Bewertungen • Top: {data.topCompany}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
