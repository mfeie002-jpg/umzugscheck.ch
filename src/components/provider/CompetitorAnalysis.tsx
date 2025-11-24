import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Award,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Provider {
  id: string;
  company_name: string;
  cantons_served: string[];
  services_offered: string[];
  price_level: string | null;
  employees_count?: number | null;
  fleet_size?: number | null;
}

interface CompetitorMetrics {
  totalCompetitors: number;
  directCompetitors: number;
  marketPosition: {
    servicesRank: number;
    coverageRank: number;
    resourcesRank: number;
  };
  pricingComparison: {
    cheaper: number;
    similar: number;
    expensive: number;
  };
  servicesComparison: {
    moreServices: number;
    sameServices: number;
    lessServices: number;
  };
  coverageComparison: {
    moreCoverage: number;
    sameCoverage: number;
    lessCoverage: number;
  };
  topCompetitors: Array<{
    id: string;
    company_name: string;
    cantons_served: string[];
    services_offered: string[];
    price_level: string | null;
    employees_count?: number | null;
    fleet_size?: number | null;
    overlapScore: number;
  }>;
  insights: string[];
}

export function CompetitorAnalysis({ provider }: { provider: Provider }) {
  const [metrics, setMetrics] = useState<CompetitorMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeCompetitors();
  }, [provider]);

  const analyzeCompetitors = async () => {
    setLoading(true);

    try {
      // Fetch all approved active providers except current one
      const { data: competitors, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('verification_status', 'approved')
        .eq('account_status', 'active')
        .neq('id', provider.id);

      if (error) throw error;

      if (!competitors || competitors.length === 0) {
        setMetrics({
          totalCompetitors: 0,
          directCompetitors: 0,
          marketPosition: { servicesRank: 1, coverageRank: 1, resourcesRank: 1 },
          pricingComparison: { cheaper: 0, similar: 0, expensive: 0 },
          servicesComparison: { moreServices: 0, sameServices: 0, lessServices: 0 },
          coverageComparison: { moreCoverage: 0, sameCoverage: 0, lessCoverage: 0 },
          topCompetitors: [],
          insights: ['Keine Wettbewerber gefunden. Sie haben einen First-Mover-Vorteil!']
        });
        setLoading(false);
        return;
      }

      // Calculate overlap scores and identify direct competitors
      const competitorsWithScores = competitors.map(comp => {
        const cantonOverlap = comp.cantons_served.filter(c => 
          provider.cantons_served.includes(c)
        ).length;
        const serviceOverlap = comp.services_offered.filter(s => 
          provider.services_offered.includes(s)
        ).length;
        
        const overlapScore = (
          (cantonOverlap / Math.max(provider.cantons_served.length, comp.cantons_served.length)) * 50 +
          (serviceOverlap / Math.max(provider.services_offered.length, comp.services_offered.length)) * 50
        );

        return { ...comp, overlapScore };
      });

      // Direct competitors: >40% overlap
      const directCompetitors = competitorsWithScores.filter(c => c.overlapScore > 40);

      // Top 5 competitors by overlap
      const topCompetitors = competitorsWithScores
        .sort((a, b) => b.overlapScore - a.overlapScore)
        .slice(0, 5);

      // Pricing comparison
      const priceLevelOrder = { 'günstig': 1, 'fair': 2, 'premium': 3 };
      const currentPriceLevel = priceLevelOrder[provider.price_level as keyof typeof priceLevelOrder] || 2;
      
      const pricingComparison = directCompetitors.reduce((acc, comp) => {
        const compPriceLevel = priceLevelOrder[comp.price_level as keyof typeof priceLevelOrder] || 2;
        if (compPriceLevel < currentPriceLevel) acc.cheaper++;
        else if (compPriceLevel === currentPriceLevel) acc.similar++;
        else acc.expensive++;
        return acc;
      }, { cheaper: 0, similar: 0, expensive: 0 });

      // Services comparison
      const currentServiceCount = provider.services_offered.length;
      const servicesComparison = directCompetitors.reduce((acc, comp) => {
        if (comp.services_offered.length > currentServiceCount) acc.moreServices++;
        else if (comp.services_offered.length === currentServiceCount) acc.sameServices++;
        else acc.lessServices++;
        return acc;
      }, { moreServices: 0, sameServices: 0, lessServices: 0 });

      // Coverage comparison
      const currentCoverage = provider.cantons_served.length;
      const coverageComparison = directCompetitors.reduce((acc, comp) => {
        if (comp.cantons_served.length > currentCoverage) acc.moreCoverage++;
        else if (comp.cantons_served.length === currentCoverage) acc.sameCoverage++;
        else acc.lessCoverage++;
        return acc;
      }, { moreCoverage: 0, sameCoverage: 0, lessCoverage: 0 });

      // Market position ranking
      const allProviders = [...competitors, provider as any];
      
      const servicesRank = allProviders
        .sort((a, b) => b.services_offered.length - a.services_offered.length)
        .findIndex(p => p.id === provider.id) + 1;
      
      const coverageRank = allProviders
        .sort((a, b) => b.cantons_served.length - a.cantons_served.length)
        .findIndex(p => p.id === provider.id) + 1;
      
      const resourcesScore = (p: any) => (p.employees_count || 0) + (p.fleet_size || 0);
      const resourcesRank = allProviders
        .sort((a, b) => resourcesScore(b) - resourcesScore(a))
        .findIndex(p => p.id === provider.id) + 1;

      // Generate insights
      const insights: string[] = [];

      if (directCompetitors.length === 0) {
        insights.push('Sie haben keine direkten Wettbewerber in Ihren Regionen - Nutzen Sie diesen Vorteil!');
      } else if (directCompetitors.length < 3) {
        insights.push(`Nur ${directCompetitors.length} direkte Wettbewerber - Markt ist nicht übersättigt.`);
      } else if (directCompetitors.length > 10) {
        insights.push(`${directCompetitors.length} direkte Wettbewerber - Stark umkämpfter Markt. Differenzierung wichtig!`);
      }

      if (pricingComparison.cheaper > pricingComparison.expensive) {
        insights.push('Die meisten Wettbewerber sind günstiger - Erwägen Sie Preisstrategie oder Premium-Positionierung.');
      } else if (pricingComparison.expensive > pricingComparison.cheaper) {
        insights.push('Sie sind preislich wettbewerbsfähig - Guter Spielraum für Margen.');
      }

      if (servicesComparison.moreServices > servicesComparison.lessServices) {
        insights.push('Viele Wettbewerber bieten mehr Services - Service-Erweiterung könnte Wachstum bringen.');
      } else if (servicesComparison.lessServices > servicesComparison.moreServices) {
        insights.push('Sie bieten mehr Services als die meisten - Nutzen Sie dies im Marketing!');
      }

      if (coverageComparison.moreCoverage > coverageComparison.lessCoverage) {
        insights.push('Wettbewerber decken mehr Regionen ab - Geografische Expansion erwägen.');
      } else if (coverageComparison.lessCoverage > coverageComparison.moreCoverage) {
        insights.push('Starke regionale Abdeckung - Sie sind gut positioniert für lokale Leads.');
      }

      if (servicesRank <= 3) {
        insights.push('🏆 Top 3 im Service-Angebot - Ausgezeichnete Position!');
      }
      if (coverageRank <= 3) {
        insights.push('🏆 Top 3 in regionaler Abdeckung - Starker Marktzugang!');
      }

      setMetrics({
        totalCompetitors: competitors.length,
        directCompetitors: directCompetitors.length,
        marketPosition: {
          servicesRank,
          coverageRank,
          resourcesRank
        },
        pricingComparison,
        servicesComparison,
        coverageComparison,
        topCompetitors: topCompetitors as any,
        insights
      });

    } catch (error) {
      console.error('Error analyzing competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (better: number, worse: number) => {
    if (better > worse) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (worse > better) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wettbewerbsanalyse</CardTitle>
          <CardDescription>Analysiere Marktposition...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wettbewerbsanalyse</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Wettbewerbsdaten konnten nicht geladen werden.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Wettbewerbsanalyse
            </CardTitle>
            <CardDescription>
              Vergleich mit {metrics.totalCompetitors} aktiven Anbietern
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {metrics.directCompetitors} Direkte Wettbewerber
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Insights */}
        {metrics.insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Wichtige Erkenntnisse</h4>
            <div className="space-y-2">
              {metrics.insights.map((insight, i) => (
                <Alert key={i}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{insight}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Market Position Overview */}
        <div>
          <h4 className="font-semibold mb-4">Marktposition</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <Badge variant={metrics.marketPosition.servicesRank <= 5 ? "default" : "secondary"}>
                    #{metrics.marketPosition.servicesRank}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Service-Angebot</div>
                <div className="text-2xl font-bold">{provider.services_offered.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Services angeboten</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <Badge variant={metrics.marketPosition.coverageRank <= 5 ? "default" : "secondary"}>
                    #{metrics.marketPosition.coverageRank}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Regionale Abdeckung</div>
                <div className="text-2xl font-bold">{provider.cantons_served.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Kantone bedient</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <Badge variant={metrics.marketPosition.resourcesRank <= 5 ? "default" : "secondary"}>
                    #{metrics.marketPosition.resourcesRank}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Ressourcen</div>
                <div className="text-2xl font-bold">
                  {(provider.employees_count || 0) + (provider.fleet_size || 0)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Mitarbeiter + Fahrzeuge</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="pricing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pricing">Preise</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="coverage">Abdeckung</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Preis-Positionierung</h4>
              {getTrendIcon(metrics.pricingComparison.cheaper, metrics.pricingComparison.expensive)}
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Günstiger als Sie</span>
                  <span className="font-medium">{metrics.pricingComparison.cheaper}</span>
                </div>
                <Progress 
                  value={(metrics.pricingComparison.cheaper / metrics.directCompetitors) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Ähnliches Preisniveau</span>
                  <span className="font-medium">{metrics.pricingComparison.similar}</span>
                </div>
                <Progress 
                  value={(metrics.pricingComparison.similar / metrics.directCompetitors) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Teurer als Sie</span>
                  <span className="font-medium">{metrics.pricingComparison.expensive}</span>
                </div>
                <Progress 
                  value={(metrics.pricingComparison.expensive / metrics.directCompetitors) * 100} 
                  className="h-2"
                />
              </div>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Ihr Preisniveau: {provider.price_level || 'fair'}</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.pricingComparison.cheaper > metrics.pricingComparison.expensive ? (
                        'Sie sind im oberen Preissegment positioniert. Premium-Qualität kommunizieren!'
                      ) : metrics.pricingComparison.expensive > metrics.pricingComparison.cheaper ? (
                        'Wettbewerbsfähige Preisposition mit gutem Margenspielraum.'
                      ) : (
                        'Ausgeglichenes Preisniveau im Markt.'
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Service-Vergleich</h4>
              {getTrendIcon(metrics.servicesComparison.lessServices, metrics.servicesComparison.moreServices)}
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mehr Services angeboten</span>
                  <span className="font-medium">{metrics.servicesComparison.moreServices}</span>
                </div>
                <Progress 
                  value={(metrics.servicesComparison.moreServices / metrics.directCompetitors) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Gleiches Service-Level</span>
                  <span className="font-medium">{metrics.servicesComparison.sameServices}</span>
                </div>
                <Progress 
                  value={(metrics.servicesComparison.sameServices / metrics.directCompetitors) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Weniger Services angeboten</span>
                  <span className="font-medium">{metrics.servicesComparison.lessServices}</span>
                </div>
                <Progress 
                  value={(metrics.servicesComparison.lessServices / metrics.directCompetitors) * 100} 
                  className="h-2"
                />
              </div>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Ihre Services: {provider.services_offered.length}</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.servicesComparison.lessServices > metrics.servicesComparison.moreServices ? (
                        'Starkes Service-Portfolio! Dies ist ein klarer Wettbewerbsvorteil.'
                      ) : metrics.servicesComparison.moreServices > metrics.servicesComparison.lessServices ? (
                        'Erwägen Sie Service-Erweiterungen für bessere Wettbewerbsposition.'
                      ) : (
                        'Ausgewogenes Service-Angebot im Marktvergleich.'
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coverage" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Regionale Abdeckung</h4>
              {getTrendIcon(metrics.coverageComparison.lessCoverage, metrics.coverageComparison.moreCoverage)}
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Größere Abdeckung</span>
                  <span className="font-medium">{metrics.coverageComparison.moreCoverage}</span>
                </div>
                <Progress 
                  value={(metrics.coverageComparison.moreCoverage / metrics.directCompetitors) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Gleiche Abdeckung</span>
                  <span className="font-medium">{metrics.coverageComparison.sameCoverage}</span>
                </div>
                <Progress 
                  value={(metrics.coverageComparison.sameCoverage / metrics.directCompetitors) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Kleinere Abdeckung</span>
                  <span className="font-medium">{metrics.coverageComparison.lessCoverage}</span>
                </div>
                <Progress 
                  value={(metrics.coverageComparison.lessCoverage / metrics.directCompetitors) * 100} 
                  className="h-2"
                />
              </div>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Ihre Kantone: {provider.cantons_served.length}</div>
                    <div className="text-sm text-muted-foreground">
                      {metrics.coverageComparison.lessCoverage > metrics.coverageComparison.moreCoverage ? (
                        'Exzellente regionale Präsenz! Nutzen Sie dies für lokales Marketing.'
                      ) : metrics.coverageComparison.moreCoverage > metrics.coverageComparison.lessCoverage ? (
                        'Geografische Expansion könnte mehr Leads generieren.'
                      ) : (
                        'Gute Balance zwischen Abdeckung und Fokus.'
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Top Competitors */}
        {metrics.topCompetitors.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Top Wettbewerber</h4>
            <div className="space-y-2">
              {metrics.topCompetitors.map((competitor, index) => (
                <Card key={competitor.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {index < 3 && <Award className="h-4 w-4 text-primary" />}
                          <span className="font-medium">{competitor.company_name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {Math.round(competitor.overlapScore)}% Überschneidung
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{competitor.cantons_served.length} Kantone</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3 w-3" />
                            <span>{competitor.services_offered.length} Services</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3" />
                            <span>{competitor.price_level || 'fair'}</span>
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={competitor.overlapScore} 
                        className="w-20 h-2 mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
