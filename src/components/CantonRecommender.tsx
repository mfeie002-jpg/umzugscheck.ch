import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Star, MapPin, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface CantonRecommendation {
  code: string;
  name: string;
  score: number;
  avgRating: number;
  avgPrice: number;
  availability: number;
  companyCount: number;
  strengths: string[];
}

export const CantonRecommender = () => {
  const [budgetPriority, setBudgetPriority] = useState([50]);
  const [qualityPriority, setQualityPriority] = useState([50]);
  const [availabilityPriority, setAvailabilityPriority] = useState([50]);
  const [recommendations, setRecommendations] = useState<CantonRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const cantons = [
    { code: "ZH", name: "Zürich" },
    { code: "BE", name: "Bern" },
    { code: "VD", name: "Waadt" },
    { code: "AG", name: "Aargau" },
    { code: "GE", name: "Genf" },
    { code: "LU", name: "Luzern" },
  ];

  const getRecommendations = async () => {
    setLoading(true);
    const results: CantonRecommendation[] = [];

    for (const canton of cantons) {
      const { data: companies } = await supabase
        .from("companies")
        .select("rating")
        .contains("service_areas", [canton.code]);

      const avgRating = companies?.length
        ? companies.reduce((sum, c) => sum + (c.rating || 0), 0) / companies.length
        : 0;
      
      const avgPrice = 900 + Math.random() * 400;
      const availability = 60 + Math.random() * 40;
      const companyCount = companies?.length || 0;

      // Calculate score based on priorities
      const budgetScore = ((2000 - avgPrice) / 2000) * 100;
      const qualityScore = (avgRating / 5) * 100;
      const availabilityScore = availability;

      const totalScore = Math.round(
        (budgetScore * (budgetPriority[0] / 100) +
          qualityScore * (qualityPriority[0] / 100) +
          availabilityScore * (availabilityPriority[0] / 100)) / 3
      );

      const strengths = [];
      if (avgRating >= 4.5) strengths.push("Hohe Qualität");
      if (avgPrice < 1100) strengths.push("Günstig");
      if (availability > 80) strengths.push("Hohe Verfügbarkeit");
      if (companyCount > 15) strengths.push("Grosse Auswahl");

      results.push({
        code: canton.code,
        name: canton.name,
        score: totalScore,
        avgRating: Math.round(avgRating * 10) / 10,
        avgPrice: Math.round(avgPrice),
        availability: Math.round(availability),
        companyCount,
        strengths,
      });
    }

    results.sort((a, b) => b.score - a.score);
    setRecommendations(results);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Kanton-Empfehlung
        </CardTitle>
        <CardDescription>
          Finden Sie den besten Kanton basierend auf Ihren Prioritäten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Priority Sliders */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Budget-Priorität</Label>
              <span className="text-sm font-semibold">{budgetPriority[0]}%</span>
            </div>
            <Slider
              value={budgetPriority}
              onValueChange={setBudgetPriority}
              min={0}
              max={100}
              step={10}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Qualitäts-Priorität</Label>
              <span className="text-sm font-semibold">{qualityPriority[0]}%</span>
            </div>
            <Slider
              value={qualityPriority}
              onValueChange={setQualityPriority}
              min={0}
              max={100}
              step={10}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Verfügbarkeits-Priorität</Label>
              <span className="text-sm font-semibold">{availabilityPriority[0]}%</span>
            </div>
            <Slider
              value={availabilityPriority}
              onValueChange={setAvailabilityPriority}
              min={0}
              max={100}
              step={10}
            />
          </div>

          <Button onClick={getRecommendations} disabled={loading} className="w-full">
            Empfehlungen aktualisieren
          </Button>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={rec.code}
                className={`p-4 rounded-lg border transition-all ${
                  index === 0
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/40 hover:shadow-soft"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? "bg-primary text-primary-foreground" :
                      index === 1 ? "bg-accent text-accent-foreground" :
                      "bg-secondary text-secondary-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {rec.name}
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Beste Wahl
                          </Badge>
                        )}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {rec.avgRating}
                        </span>
                        <span>CHF {rec.avgPrice}</span>
                        <span>{rec.companyCount} Firmen</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{rec.score}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>

                <Progress value={rec.score} className="mb-3" />

                {rec.strengths.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {rec.strengths.map((strength, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {strength}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
