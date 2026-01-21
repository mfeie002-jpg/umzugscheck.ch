import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Trophy, 
  Plus, 
  X, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  COMPARISON_METRICS,
  NeighborhoodScore,
  generateComparisonData,
  getMetricWinner,
  formatMetricValue,
} from "@/lib/neighborhood-comparison";

interface NeighborhoodComparisonProps {
  initialCities?: string[];
  maxCities?: number;
}

export const NeighborhoodComparison = ({
  initialCities = ['Zürich', 'Zug', 'Luzern'],
  maxCities = 5,
}: NeighborhoodComparisonProps) => {
  const [cities, setCities] = useState<string[]>(initialCities);
  const [newCity, setNewCity] = useState('');

  const scores = useMemo(() => generateComparisonData(cities), [cities]);

  const addCity = () => {
    if (newCity.trim() && !cities.includes(newCity.trim()) && cities.length < maxCities) {
      setCities([...cities, newCity.trim()]);
      setNewCity('');
    }
  };

  const removeCity = (city: string) => {
    if (cities.length > 2) {
      setCities(cities.filter(c => c !== city));
    }
  };

  const categories = ['financial', 'lifestyle', 'infrastructure'] as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Standort-Vergleich
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Vergleichen Sie bis zu {maxCities} Städte
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* City Input */}
        {cities.length < maxCities && (
          <div className="flex gap-2">
            <Input
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Stadt hinzufügen..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && addCity()}
            />
            <Button size="sm" onClick={addCity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Overall Ranking */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Gesamtranking</p>
          <div className="grid gap-2">
            {scores.map((score) => (
              <div
                key={score.cityName}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  score.rank === 1 && "bg-green-50 border-green-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    score.rank === 1 && "bg-green-500 text-white",
                    score.rank === 2 && "bg-gray-300 text-gray-700",
                    score.rank === 3 && "bg-amber-400 text-amber-900",
                    score.rank > 3 && "bg-muted text-muted-foreground"
                  )}>
                    {score.rank === 1 ? <Trophy className="h-3 w-3" /> : score.rank}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{score.cityName}</p>
                    <p className="text-xs text-muted-foreground">{score.canton}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-bold">
                    {score.overallScore}/100
                  </Badge>
                  {cities.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeCity(score.cityName)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Comparison Table */}
        {categories.map(category => {
          const categoryMetrics = COMPARISON_METRICS.filter(m => m.category === category);
          
          return (
            <div key={category} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground capitalize">
                {category === 'financial' && 'Finanzen'}
                {category === 'lifestyle' && 'Lebensstil'}
                {category === 'infrastructure' && 'Infrastruktur'}
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Metrik</th>
                      {scores.map(score => (
                        <th key={score.cityName} className="text-center py-2 px-2">
                          {score.cityName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categoryMetrics.map(metric => {
                      const winner = getMetricWinner(scores, metric.id);
                      
                      return (
                        <tr key={metric.id} className="border-b last:border-0">
                          <td className="py-2 pr-4 text-muted-foreground">
                            {metric.label}
                          </td>
                          {scores.map(score => {
                            const value = score.metrics[metric.id];
                            const isWinner = winner?.cityName === score.cityName;
                            
                            return (
                              <td
                                key={score.cityName}
                                className={cn(
                                  "text-center py-2 px-2",
                                  isWinner && "font-bold text-green-600"
                                )}
                              >
                                <span className="flex items-center justify-center gap-1">
                                  {formatMetricValue(metric.id, value)}
                                  {isWinner && <Trophy className="h-3 w-3" />}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Insights */}
        <div className="space-y-3 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground">Insights</p>
          {scores.slice(0, 2).map(score => (
            <div key={score.cityName} className="space-y-1">
              <p className="text-sm font-medium">{score.cityName}</p>
              <div className="flex flex-wrap gap-1.5">
                {score.highlights.map(h => (
                  <Badge key={h} variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-2.5 w-2.5 mr-1" />
                    {h}
                  </Badge>
                ))}
                {score.concerns.map(c => (
                  <Badge key={c} variant="outline" className="text-[10px] bg-orange-50 text-orange-700 border-orange-200">
                    <AlertCircle className="h-2.5 w-2.5 mr-1" />
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NeighborhoodComparison;
