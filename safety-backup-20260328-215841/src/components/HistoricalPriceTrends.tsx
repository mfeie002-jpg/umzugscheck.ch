import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PriceData {
  month: string;
  year: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  volume: number;
}

export const HistoricalPriceTrends = () => {
  const [canton, setCanton] = useState("ZH");
  const [timeframe, setTimeframe] = useState("12");
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);

  const cantons = [
    { code: "ZH", name: "Zürich" },
    { code: "BE", name: "Bern" },
    { code: "VD", name: "Waadt" },
    { code: "AG", name: "Aargau" },
    { code: "GE", name: "Genf" },
    { code: "LU", name: "Luzern" },
  ];

  useEffect(() => {
    fetchPriceHistory();
  }, [canton, timeframe]);

  const fetchPriceHistory = async () => {
    setLoading(true);
    const monthsBack = parseInt(timeframe);
    const { data } = await supabase
      .from("historical_pricing")
      .select("*")
      .eq("canton_code", canton)
      .order("year", { ascending: false })
      .order("month", { ascending: false })
      .limit(monthsBack);

    if (data) {
      setPriceData(
        data.map((d) => ({
          month: d.month,
          year: d.year,
          avgPrice: d.avg_price,
          minPrice: d.min_price,
          maxPrice: d.max_price,
          volume: d.lead_volume,
        }))
      );
    }
    setLoading(false);
  };

  const currentAvg = priceData[0]?.avgPrice || 0;
  const previousAvg = priceData[1]?.avgPrice || 0;
  const trend = currentAvg - previousAvg;
  const trendPercentage = previousAvg ? ((trend / previousAvg) * 100).toFixed(1) : 0;

  const yearAgoData = priceData.find((d) => d.year === new Date().getFullYear() - 1);
  const yearlyTrend = yearAgoData ? currentAvg - yearAgoData.avgPrice : 0;
  const yearlyTrendPercentage = yearAgoData
    ? ((yearlyTrend / yearAgoData.avgPrice) * 100).toFixed(1)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Historische Preisentwicklung
        </CardTitle>
        <CardDescription>Preistrends der letzten 24 Monate</CardDescription>

        <div className="flex gap-3 pt-4">
          <Select value={canton} onValueChange={setCanton}>
            <SelectTrigger className="w-[180px]">
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

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 Monate</SelectItem>
              <SelectItem value="12">12 Monate</SelectItem>
              <SelectItem value="24">24 Monate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border">
                <div className="text-sm text-muted-foreground mb-1">Aktueller Durchschnitt</div>
                <div className="text-2xl font-bold">CHF {Math.round(currentAvg)}</div>
                <div className={`text-sm flex items-center gap-1 mt-1 ${
                  trend > 0 ? "text-red-600" : "text-green-600"
                }`}>
                  {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(Number(trendPercentage))}% vs. Vormonat
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent/5 border">
                <div className="text-sm text-muted-foreground mb-1">Jahresveränderung</div>
                <div className={`text-2xl font-bold ${
                  yearlyTrend > 0 ? "text-red-600" : "text-green-600"
                }`}>
                  {yearlyTrend > 0 ? "+" : ""}CHF {Math.round(Math.abs(yearlyTrend))}
                </div>
                <div className={`text-sm flex items-center gap-1 mt-1 ${
                  yearlyTrend > 0 ? "text-red-600" : "text-green-600"
                }`}>
                  {yearlyTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(Number(yearlyTrendPercentage))}% vs. Vorjahr
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              {priceData.map((data, index) => {
                const isRecent = index < 3;
                const maxPrice = Math.max(...priceData.map((d) => d.avgPrice));
                const barWidth = (data.avgPrice / maxPrice) * 100;

                return (
                  <div
                    key={`${data.year}-${data.month}`}
                    className={`p-3 rounded-lg border ${
                      isRecent ? "bg-primary/5 border-primary/20" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {data.month} {data.year}
                        </span>
                        {isRecent && <Badge variant="secondary" className="text-xs">Aktuell</Badge>}
                      </div>
                      <span className="font-bold text-primary">CHF {Math.round(data.avgPrice)}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min: CHF {Math.round(data.minPrice)}</span>
                        <span>{data.volume} Leads</span>
                        <span>Max: CHF {Math.round(data.maxPrice)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Insights */}
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Preis-Insights
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>
                    Beste Monate für günstige Preise: Nov-Feb (15-20% günstiger)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>
                    Hochsaison (Jun-Aug): Durchschnittlich 18% teurer als Rest des Jahres
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>
                    Preisstabilität: Preise schwanken um ±12% im Jahresverlauf
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
