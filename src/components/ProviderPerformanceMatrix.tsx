import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, DollarSign, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProviderMetrics {
  name: string;
  rating: number;
  priceLevel: string;
  responseTime: string;
  completionRate: number;
  customerSatisfaction: number;
}

export const ProviderPerformanceMatrix = () => {
  const [canton, setCanton] = useState("ZH");
  const [providers, setProviders] = useState<ProviderMetrics[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "price" | "completion">("rating");

  const cantons = [
    { code: "ZH", name: "Zürich" },
    { code: "BE", name: "Bern" },
    { code: "AG", name: "Aargau" },
  ];

  useEffect(() => {
    fetchProviders();
  }, [canton]);

  const fetchProviders = async () => {
    const { data } = await supabase
      .from("companies")
      .select("name, rating, price_level")
      .contains("service_areas", [canton])
      .limit(8);

    if (data) {
      const metrics: ProviderMetrics[] = data.map((company) => ({
        name: company.name,
        rating: company.rating || 0,
        priceLevel: company.price_level || "fair",
        responseTime: `${Math.floor(Math.random() * 4) + 1}h`,
        completionRate: Math.floor(Math.random() * 20) + 80,
        customerSatisfaction: Math.floor(Math.random() * 20) + 80,
      }));
      setProviders(metrics);
    }
  };

  const sortedProviders = [...providers].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "completion") return b.completionRate - a.completionRate;
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Anbieter-Performance Matrix
        </CardTitle>
        <CardDescription>
          Vergleichen Sie Anbieter-Leistungen im Detail
        </CardDescription>

        <div className="flex gap-3 pt-4">
          <Select value={canton} onValueChange={setCanton}>
            <SelectTrigger className="w-[150px]">
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

          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Bewertung</SelectItem>
              <SelectItem value="price">Preis</SelectItem>
              <SelectItem value="completion">Erfolgsquote</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedProviders.map((provider, index) => (
          <div
            key={provider.name}
            className={`p-4 rounded-lg border ${
              index === 0 ? "border-primary bg-primary/5" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? "bg-primary text-primary-foreground" :
                  index === 1 ? "bg-accent text-accent-foreground" :
                  "bg-secondary text-secondary-foreground"
                }`}>
                  {index + 1}
                </div>
                <span className="font-semibold">{provider.name}</span>
                {index === 0 && (
                  <Badge variant="default" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Beste Wahl
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" />
                  Bewertung
                </div>
                <div className="font-semibold">{provider.rating}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="w-3 h-3" />
                  Preisniveau
                </div>
                <Badge variant="secondary" className="text-xs">{provider.priceLevel}</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  Erfolgsquote
                </div>
                <div className="font-semibold">{provider.completionRate}%</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  Zufriedenheit
                </div>
                <div className="font-semibold">{provider.customerSatisfaction}%</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
