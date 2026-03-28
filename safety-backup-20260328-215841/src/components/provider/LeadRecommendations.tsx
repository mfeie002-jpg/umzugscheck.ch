import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, MapPin, Package, Calendar, CheckCircle2 } from "lucide-react";
import { LeadRecommendation } from "@/lib/lead-recommendations";

interface LeadRecommendationsProps {
  recommendations: LeadRecommendation[];
  leads: any[];
  onViewLead: (leadId: string) => void;
}

export function LeadRecommendations({ recommendations, leads, onViewLead }: LeadRecommendationsProps) {
  const getLeadDetails = (leadId: string) => {
    return leads.find(l => l.id === leadId);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, label: "Ausgezeichnet" };
    if (score >= 60) return { variant: "secondary" as const, label: "Gut" };
    return { variant: "outline" as const, label: "Möglich" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Smart-Empfehlungen für Sie
        </CardTitle>
        <CardDescription>
          Basierend auf Ihrer Historie und Präferenzen
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Keine passenden Leads gefunden</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.slice(0, 10).map((rec) => {
              const lead = getLeadDetails(rec.leadId);
              if (!lead) return null;

              const scoreBadge = getScoreBadge(rec.score);
              const volume = lead.calculator_output?.volumeM3 || lead.calculator_output?.volume || 0;

              return (
                <div
                  key={rec.leadId}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {lead.from_city} → {lead.to_city}
                        </span>
                        <Badge {...scoreBadge}>{scoreBadge.label}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          <span>{volume} m³</span>
                        </div>
                        {lead.move_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(lead.move_date).toLocaleDateString('de-CH')}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Match-Score</span>
                          <span className="font-semibold">{rec.score}/100</span>
                        </div>
                        <Progress value={rec.score} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {rec.reasons.map((reason, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {reason}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">
                          Conversion-Wahrscheinlichkeit:
                        </span>
                        <span className="font-semibold text-green-600">
                          {(rec.estimatedConversionProbability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Empfohlener Preis: CHF {rec.recommendedPrice}
                      </div>
                    </div>
                    <Button
                      onClick={() => onViewLead(rec.leadId)}
                      size="sm"
                    >
                      Details ansehen
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
