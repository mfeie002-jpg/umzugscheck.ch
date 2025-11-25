import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Camera, LineChart } from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Benchmark {
  id: string;
  snapshot_date: string;
  total_impressions: number;
  total_conversions: number;
  avg_conversion_rate: number;
  revenue_generated: number;
  notes: string;
}

export function PerformanceBenchmark() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchBenchmarks();
  }, []);

  const fetchBenchmarks = async () => {
    try {
      const { data, error } = await supabase
        .from("ranking_benchmarks")
        .select("*")
        .order("snapshot_date", { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) setBenchmarks(data);
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
    }
  };

  const captureSnapshot = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .rpc("capture_ranking_benchmark", { p_notes: notes || null });

      if (error) throw error;

      toast({
        title: "Snapshot erfasst",
        description: "Performance-Benchmark wurde gespeichert",
      });

      setNotes("");
      fetchBenchmarks();
    } catch (error) {
      console.error("Error capturing benchmark:", error);
      toast({
        title: "Fehler",
        description: "Snapshot konnte nicht erstellt werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (index: number) => {
    if (index >= benchmarks.length - 1) return null;
    
    const current = benchmarks[index];
    const previous = benchmarks[index + 1];
    
    const conversionChange = current.avg_conversion_rate - previous.avg_conversion_rate;
    const impressionChange = ((current.total_impressions - previous.total_impressions) / previous.total_impressions) * 100;
    
    return { conversionChange, impressionChange };
  };

  const chartData = benchmarks
    .slice()
    .reverse()
    .map(b => ({
      date: new Date(b.snapshot_date).toLocaleDateString("de-CH", { month: "short", day: "numeric" }),
      "Conversion Rate": b.avg_conversion_rate,
      Impressionen: b.total_impressions / 100,
    }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Neuen Benchmark erfassen
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="benchmark-notes">Notizen (optional)</Label>
            <Textarea
              id="benchmark-notes"
              placeholder="z.B. Nach Kampagnen-Update, Neue Featured-Strategie"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button onClick={captureSnapshot} disabled={loading}>
            <Camera className="w-4 h-4 mr-2" />
            Snapshot erstellen
          </Button>
        </div>
      </Card>

      {benchmarks.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Performance-Trend
          </h3>

          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="Conversion Rate"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="Impressionen"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {benchmarks.map((benchmark, index) => {
              const change = calculateChange(index);
              return (
                <div key={benchmark.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">
                        {new Date(benchmark.snapshot_date).toLocaleString("de-CH")}
                      </h4>
                      {benchmark.notes && (
                        <p className="text-sm text-muted-foreground">{benchmark.notes}</p>
                      )}
                    </div>
                    {change && (
                      <div className="flex gap-2">
                        <Badge
                          variant={change.conversionChange >= 0 ? "default" : "destructive"}
                          className="flex items-center gap-1"
                        >
                          {change.conversionChange >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {change.conversionChange >= 0 ? "+" : ""}
                          {change.conversionChange.toFixed(2)}%
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Impressionen</p>
                      <p className="text-xl font-bold">{benchmark.total_impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-xl font-bold">{benchmark.total_conversions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Rate</p>
                      <p className="text-xl font-bold">{benchmark.avg_conversion_rate.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
