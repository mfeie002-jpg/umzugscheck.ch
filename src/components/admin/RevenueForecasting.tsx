import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, ArrowUpRight } from "lucide-react";
import { RevenueForecast } from "@/lib/revenue-forecast";
import { Progress } from "@/components/ui/progress";

export function RevenueForecasting() {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      setLoading(true);

      // Fetch historical transaction data
      const { data: transactions, error } = await supabase
        .from("lead_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Generate forecast
      const forecastData = RevenueForecast.generateForecast(transactions || [], 6);
      const metricsData = RevenueForecast.calculateMetrics(transactions || []);

      setForecast(forecastData);
      setMetrics(metricsData);
    } catch (error) {
      console.error("Error loading forecast:", error);
      toast({
        title: "Fehler",
        description: "Prognose konnte nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "bg-green-50 text-green-700 border-green-200";
      case "down":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gesamt-Umsatz</p>
                <p className="text-2xl font-bold">CHF {metrics.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ø Lead-Wert</p>
                <p className="text-2xl font-bold">CHF {metrics.avgLeadValue.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monatl. Wachstum</p>
                <p className="text-2xl font-bold">
                  {metrics.monthlyGrowth > 0 ? "+" : ""}
                  {metrics.monthlyGrowth}%
                </p>
              </div>
              {metrics.monthlyGrowth > 0 ? (
                <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600 opacity-50" />
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Forecast */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Umsatz-Prognose (6 Monate)</h3>
            <p className="text-sm text-muted-foreground">
              Basierend auf historischen Daten und saisonalen Trends
            </p>
          </div>
          <Button onClick={loadForecast} disabled={loading} variant="outline" size="sm">
            Aktualisieren
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Lädt Prognose...</div>
        ) : forecast.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Keine historischen Daten für Prognose verfügbar
          </div>
        ) : (
          <div className="space-y-4">
            {forecast.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.month}</h4>
                      <p className="text-sm text-muted-foreground">
                        Prognose: CHF {item.predictedRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {item.confidence}% Konfidenz
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Prognosesicherheit</span>
                    <span className="font-medium">{item.confidence}%</span>
                  </div>
                  <Progress value={item.confidence} className="h-2" />
                </div>

                {index === 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      📊 Diese Prognose basiert auf historischen Conversion-Daten und
                      berücksichtigt saisonale Schwankungen im Umzugsmarkt
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">💡 Hinweise zur Prognose</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Prognosen werden genauer mit mehr historischen Daten</li>
            <li>• Saisonale Faktoren berücksichtigen Hauptumzugszeiten (April-September)</li>
            <li>• Konfidenz nimmt ab, je weiter die Prognose in die Zukunft reicht</li>
            <li>• Ranking-Änderungen können zukünftige Ergebnisse beeinflussen</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
