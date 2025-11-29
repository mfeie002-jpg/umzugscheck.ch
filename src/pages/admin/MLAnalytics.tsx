import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, TrendingUp, Target, DollarSign, ArrowLeft, RefreshCw } from "lucide-react";
import { predictLeadQuality, predictOptimalPricing, LeadPrediction, PricePrediction } from "@/lib/ml-predictions";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const MLAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<LeadPrediction[]>([]);
  const [pricingPrediction, setPricingPrediction] = useState<PricePrediction | null>(null);

  useEffect(() => {
    loadMLAnalytics();
  }, []);

  const loadMLAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch recent leads for prediction
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentLeads) {
        const leadPredictions = await Promise.all(
          recentLeads.map(async (lead) => {
            const output = lead.calculator_output as any;
            const prediction = await predictLeadQuality({
              volume: output?.volume,
              distance: output?.distance,
              moveDate: lead.move_date || undefined,
              priceRange: output?.priceRange
            });
            return {
              ...prediction,
              leadId: lead.id,
              leadName: lead.name,
              createdAt: lead.created_at
            };
          })
        );
        setPredictions(leadPredictions);
      }

      // Get pricing prediction
      const pricing = await predictOptimalPricing({
        volume: 30,
        region: 'Zürich',
        urgency: 14
      });
      setPricingPrediction(pricing);

    } catch (error) {
      console.error('Error loading ML analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQualityGrade = (score: number) => {
    if (score >= 80) return { label: 'A+', color: 'bg-green-500' };
    if (score >= 70) return { label: 'A', color: 'bg-green-400' };
    if (score >= 60) return { label: 'B', color: 'bg-blue-400' };
    if (score >= 50) return { label: 'C', color: 'bg-yellow-400' };
    return { label: 'D', color: 'bg-red-400' };
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 bg-gradient-light">
        <section className="gradient-hero text-white py-12">
          <div className="container mx-auto px-4">
            <Button
              onClick={() => navigate('/admin/dashboard')}
              variant="ghost"
              className="mb-4 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Dashboard
            </Button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Brain className="w-12 h-12" />
                <div>
                  <h1 className="text-4xl font-bold mb-2">KI-Analytics</h1>
                  <p className="text-white/80">Machine Learning basierte Vorhersagen & Insights</p>
                </div>
              </div>
              <Button
                onClick={loadMLAnalytics}
                variant="outline"
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Aktualisieren
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Pricing Prediction */}
            {pricingPrediction && (
              <Card className="shadow-strong mb-8">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle>Optimale Preis-Vorhersage</CardTitle>
                      <CardDescription>
                        KI-basierte Preisempfehlung für maximale Conversions
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Empfohlener Preis</p>
                      <p className="text-3xl font-bold text-primary">
                        CHF {pricingPrediction.recommendedPrice}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Preisspanne</p>
                      <p className="text-lg font-semibold">
                        CHF {pricingPrediction.priceRange.min} - {pricingPrediction.priceRange.max}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Nachfrage-Faktor</p>
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={pricingPrediction.demandFactor * 100} className="w-20" />
                        <span className="font-semibold">
                          {Math.round(pricingPrediction.demandFactor * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Vertrauen</p>
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={pricingPrediction.confidenceLevel * 100} className="w-20" />
                        <span className="font-semibold">
                          {Math.round(pricingPrediction.confidenceLevel * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lead Quality Predictions */}
            <Card className="shadow-strong">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Lead-Qualität Vorhersagen</CardTitle>
                    <CardDescription>
                      KI-Score und Conversion-Wahrscheinlichkeit für aktuelle Leads
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : predictions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Keine Leads für Vorhersagen verfügbar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {predictions.map((pred: any) => {
                      const grade = getQualityGrade(pred.qualityScore);
                      return (
                        <div
                          key={pred.leadId}
                          className="p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg ${grade.color} flex items-center justify-center text-white font-bold text-lg`}>
                                {grade.label}
                              </div>
                              <div>
                                <p className="font-semibold">{pred.leadName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(pred.createdAt).toLocaleDateString('de-CH')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Qualität-Score</p>
                              <p className="text-2xl font-bold">{pred.qualityScore}</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Conversion-Wahrscheinlichkeit</p>
                              <div className="flex items-center gap-2">
                                <Progress value={pred.conversionProbability * 100} />
                                <span className="font-semibold min-w-[3rem]">
                                  {Math.round(pred.conversionProbability * 100)}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Vorhergesagter Wert</p>
                              <p className="text-xl font-bold text-primary">
                                CHF {pred.predictedValue.toLocaleString('de-CH')}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2 pt-3 border-t">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">Volumen</p>
                              <Badge variant="outline">{pred.factors.volumeImpact}%</Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">Distanz</p>
                              <Badge variant="outline">{pred.factors.distanceImpact}%</Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">Dringlichkeit</p>
                              <Badge variant="outline">{pred.factors.urgencyImpact}%</Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">Match</p>
                              <Badge variant="outline">{pred.factors.historicalMatch}%</Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MLAnalytics;
