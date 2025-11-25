import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, RefreshCw, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateOrganicScore, generateRanking, type CompanyData } from "@/lib/ranking-algorithm";

const MOCK_COMPANIES: CompanyData[] = [
  {
    id: "1",
    name: "SwissMove AG",
    rating: 4.8,
    review_count: 156,
    price_level: "fair",
    is_featured: false,
    service_areas: ["Zürich"],
    services_offered: ["Umzug", "Reinigung"],
    profile_completeness: 85,
  },
  {
    id: "2",
    name: "Budget Umzüge",
    rating: 4.5,
    review_count: 89,
    price_level: "günstig",
    is_featured: false,
    service_areas: ["Zürich"],
    services_offered: ["Umzug"],
    profile_completeness: 70,
  },
  {
    id: "3",
    name: "Premium Relocation",
    rating: 4.9,
    review_count: 234,
    price_level: "premium",
    is_featured: true,
    featured_position: 1,
    service_areas: ["Zürich"],
    services_offered: ["Umzug", "Reinigung", "Lagerung"],
    profile_completeness: 95,
  },
];

export const RankingSimulator = () => {
  const [ratingWeight, setRatingWeight] = useState(40);
  const [reviewWeight, setReviewWeight] = useState(25);
  const [priceWeight, setpriceWeight] = useState(20);
  const [completenessWeight, setCompletenessWeight] = useState(15);
  const [simulationResults, setSimulationResults] = useState<any[]>([]);

  const runSimulation = () => {
    // In real implementation, this would use the modified weights
    // For now, using the default algorithm
    const ranked = generateRanking(MOCK_COMPANIES);
    setSimulationResults(ranked);
  };

  const resetWeights = () => {
    setRatingWeight(40);
    setReviewWeight(25);
    setpriceWeight(20);
    setCompletenessWeight(15);
  };

  const totalWeight = ratingWeight + reviewWeight + priceWeight + completenessWeight;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Ranking-Simulation
          </CardTitle>
          <CardDescription>
            Testen Sie verschiedene Gewichtungen für den Ranking-Algorithmus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weight Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Bewertung (Rating)</Label>
                <span className="text-sm font-medium">{ratingWeight} Punkte</span>
              </div>
              <Slider
                value={[ratingWeight]}
                onValueChange={([value]) => setRatingWeight(value)}
                max={60}
                step={5}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Anzahl Bewertungen</Label>
                <span className="text-sm font-medium">{reviewWeight} Punkte</span>
              </div>
              <Slider
                value={[reviewWeight]}
                onValueChange={([value]) => setReviewWeight(value)}
                max={40}
                step={5}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Preisniveau</Label>
                <span className="text-sm font-medium">{priceWeight} Punkte</span>
              </div>
              <Slider
                value={[priceWeight]}
                onValueChange={([value]) => setpriceWeight(value)}
                max={30}
                step={5}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Profil-Vollständigkeit</Label>
                <span className="text-sm font-medium">{completenessWeight} Punkte</span>
              </div>
              <Slider
                value={[completenessWeight]}
                onValueChange={([value]) => setCompletenessWeight(value)}
                max={25}
                step={5}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-medium">Gesamt</span>
              <Badge variant={totalWeight === 100 ? "default" : "destructive"}>
                {totalWeight} / 100 Punkte
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={runSimulation} disabled={totalWeight !== 100}>
              <PlayCircle className="w-4 h-4 mr-2" />
              Simulation starten
            </Button>
            <Button variant="outline" onClick={resetWeights}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Zurücksetzen
            </Button>
          </div>

          {/* Results */}
          {simulationResults.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Simulierte Rankings</h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {simulationResults.map((company) => (
                    <Card key={company.id} className={company.isSponsored ? "border-primary" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {company.rank}
                            </div>
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {company.rating} ⭐ • {company.review_count} Bewertungen
                              </div>
                              {company.isSponsored && (
                                <Badge variant="secondary" className="mt-1">Gesponsert</Badge>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {company.score} Punkte
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
