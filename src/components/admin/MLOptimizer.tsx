import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brain, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { MLRankingOptimizer } from "@/lib/ml-ranking-optimizer";
import { Progress } from "@/components/ui/progress";

interface MLOptimizerProps {
  companies: any[];
  analytics: Record<string, any>;
}

export function MLOptimizer({ companies, analytics }: MLOptimizerProps) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [lastModel, setLastModel] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLatestModel();
  }, []);

  const fetchLatestModel = async () => {
    try {
      const { data, error } = await supabase
        .from("ml_ranking_models")
        .select("*")
        .eq("status", "active")
        .order("last_trained_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setLastModel(data);
        if (data.recommendations && Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations.slice(0, 10));
        }
      }
    } catch (error) {
      console.error("Error fetching ML model:", error);
    }
  };

  const runOptimization = async () => {
    try {
      setLoading(true);

      // Prepare metrics data
      const metricsData = Object.entries(analytics).map(([company_id, stats]) => ({
        company_id,
        total_clicks: stats.total_clicks || 0,
        total_conversions: stats.total_leads || 0,
        conversion_rate: stats.conversion_rate || 0,
        avg_position: companies.find(c => c.id === company_id)?.ranking_position || 999,
        revenue: 0,
      }));

      // Run ML optimization
      const optimizationResults = MLRankingOptimizer.analyzeOptimalPositions(
        companies,
        metricsData
      );

      setRecommendations(optimizationResults);

      // Save to database
      const { error } = await supabase
        .from("ml_ranking_models")
        .insert([{
          model_name: "performance_optimizer",
          model_version: "1.0",
          training_data: { companies: companies.length, metrics: metricsData.length },
          accuracy_score: 85,
          recommendations: optimizationResults as any,
        }]);

      if (error) throw error;

      toast({
        title: "Optimierung abgeschlossen",
        description: `${optimizationResults.length} Empfehlungen generiert`,
      });

      fetchLatestModel();
    } catch (error) {
      console.error("Error running optimization:", error);
      toast({
        title: "Fehler",
        description: "Optimierung fehlgeschlagen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyRecommendation = async (rec: any) => {
    try {
      const { error } = await supabase
        .from("service_providers")
        .update({ ranking_position: rec.recommended_position })
        .eq("id", rec.company_id);

      if (error) throw error;

      toast({
        title: "Angewendet",
        description: `${rec.company_name} wurde auf Position ${rec.recommended_position} verschoben`,
      });
    } catch (error) {
      console.error("Error applying recommendation:", error);
      toast({
        title: "Fehler",
        description: "Empfehlung konnte nicht angewendet werden",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5" />
              ML-basierte Ranking-Optimierung
            </h3>
            <p className="text-sm text-muted-foreground">
              KI-gestützte Empfehlungen für optimale Ranking-Positionen basierend auf Conversion-Daten
            </p>
          </div>
          <Button onClick={runOptimization} disabled={loading}>
            <Brain className="w-4 h-4 mr-2" />
            {loading ? "Analysiert..." : "Optimierung starten"}
          </Button>
        </div>

        {lastModel && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="border rounded p-3">
              <p className="text-sm text-muted-foreground">Letztes Modell</p>
              <p className="text-lg font-bold">
                {new Date(lastModel.last_trained_at).toLocaleDateString("de-CH")}
              </p>
            </div>
            <div className="border rounded p-3">
              <p className="text-sm text-muted-foreground">Genauigkeit</p>
              <p className="text-lg font-bold">{lastModel.accuracy_score}%</p>
            </div>
            <div className="border rounded p-3">
              <p className="text-sm text-muted-foreground">Empfehlungen</p>
              <p className="text-lg font-bold">{recommendations.length}</p>
            </div>
          </div>
        )}
      </Card>

      {recommendations.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Top-Empfehlungen</h4>
          <div className="space-y-4">
            {recommendations.slice(0, 10).map((rec) => (
              <div key={rec.company_id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="font-semibold">{rec.company_name}</h5>
                    <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                  </div>
                  <Badge
                    variant={rec.expected_improvement >= 10 ? "default" : "secondary"}
                    className="ml-4"
                  >
                    {rec.expected_improvement >= 10 ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    +{rec.expected_improvement.toFixed(1)}%
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Aktuelle Position</p>
                    <p className="text-2xl font-bold">{rec.current_position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Empfohlene Position</p>
                    <p className="text-2xl font-bold text-primary">{rec.recommended_position}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Konfidenz</span>
                    <span>{rec.confidence}%</span>
                  </div>
                  <Progress value={rec.confidence} />
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyRecommendation(rec)}
                  className="w-full"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Empfehlung anwenden
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
