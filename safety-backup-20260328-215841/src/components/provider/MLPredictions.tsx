import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, TrendingUp, Target, Lightbulb, Loader2 } from "lucide-react";
import { getMLRecommendations } from "@/lib/ml-predictions";

interface MLPredictionsProps {
  providerId: string;
}

export const MLPredictions = ({ providerId }: MLPredictionsProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [providerId]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const recs = await getMLRecommendations(providerId);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading ML recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high': return 'Hohe Wirkung';
      case 'medium': return 'Mittlere Wirkung';
      case 'low': return 'Niedrige Wirkung';
      default: return impact;
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'volume': return <Target className="w-5 h-5" />;
      case 'seasonal': return <TrendingUp className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>KI-Empfehlungen</CardTitle>
            <CardDescription>
              Personalisierte Vorschläge basierend auf Ihren historischen Daten
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : recommendations.length === 0 ? (
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              Noch nicht genügend Daten für personalisierte Empfehlungen. 
              Konvertieren Sie mindestens 3 Leads, um KI-basierte Insights zu erhalten.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {getIconForType(rec.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getImpactColor(rec.impact)}>
                        {getImpactLabel(rec.impact)}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{rec.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
