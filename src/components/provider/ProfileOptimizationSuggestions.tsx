import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, MapPin, DollarSign, Briefcase, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { calculateLeadMatchScore } from "@/lib/lead-matching";

interface Provider {
  id: string;
  cantons_served: string[];
  preferred_regions?: string[] | null;
  min_job_value?: number | null;
  max_leads_per_month?: number | null;
  price_level?: string | null;
  services_offered: string[];
}

interface OptimizationSuggestion {
  type: 'service_area' | 'pricing' | 'services' | 'capacity';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actionItems: string[];
  potentialImpact: number; // Estimated % improvement in match scores
}

export function ProfileOptimizationSuggestions({ provider }: { provider: Provider }) {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageMatchScore, setAverageMatchScore] = useState<number>(0);

  useEffect(() => {
    analyzeProviderProfile();
  }, [provider]);

  const analyzeProviderProfile = async () => {
    setLoading(true);

    try {
      // Fetch recent leads (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentLeads, error } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Get current month lead count
      const { count: currentMonthLeads } = await supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .contains('assigned_provider_ids', [provider.id])
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      const newSuggestions: OptimizationSuggestion[] = [];
      let totalMatchScore = 0;
      let matchCount = 0;

      // Analyze each lead for match patterns
      const cantonAnalysis: Record<string, { count: number; avgScore: number; totalScore: number }> = {};
      const serviceAnalysis: Record<string, number> = {};
      const lowScoreLeads: any[] = [];

      recentLeads?.forEach(lead => {
        const matchScore = calculateLeadMatchScore(provider, lead, currentMonthLeads || 0);
        totalMatchScore += matchScore.totalScore;
        matchCount++;

        // Track canton patterns
        const fromCanton = getCantonFromPostal(lead.from_postal);
        const toCanton = getCantonFromPostal(lead.to_postal);

        [fromCanton, toCanton].forEach(canton => {
          if (!cantonAnalysis[canton]) {
            cantonAnalysis[canton] = { count: 0, avgScore: 0, totalScore: 0 };
          }
          cantonAnalysis[canton].count++;
          cantonAnalysis[canton].totalScore += matchScore.totalScore;
        });

        // Track service requirements
        const requiredServices = getRequiredServices(lead.calculator_type);
        requiredServices.forEach(service => {
          serviceAnalysis[service] = (serviceAnalysis[service] || 0) + 1;
        });

        // Collect low-score leads for analysis
        if (matchScore.totalScore < 60) {
          lowScoreLeads.push({ lead, matchScore });
        }
      });

      // Calculate average scores
      Object.keys(cantonAnalysis).forEach(canton => {
        cantonAnalysis[canton].avgScore = cantonAnalysis[canton].totalScore / cantonAnalysis[canton].count;
      });

      const avgScore = matchCount > 0 ? totalMatchScore / matchCount : 0;
      setAverageMatchScore(avgScore);

      // Generate service area suggestions
      const missedCantons = Object.entries(cantonAnalysis)
        .filter(([canton, data]) => !provider.cantons_served.includes(canton) && data.count >= 3)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3);

      if (missedCantons.length > 0) {
        newSuggestions.push({
          type: 'service_area',
          priority: 'high',
          title: 'Servicegebiet erweitern',
          description: `Sie verpassen regelmäßig Leads in ${missedCantons.length} Kantonen, die Sie nicht bedienen.`,
          impact: `${missedCantons.reduce((sum, [, data]) => sum + data.count, 0)} Leads in den letzten 30 Tagen`,
          actionItems: missedCantons.map(([canton, data]) => 
            `${canton}: ${data.count} Leads verfügbar (Ø Wert CHF ${Math.round(data.avgScore * 30)})`
          ),
          potentialImpact: 15
        });
      }

      // Generate service offering suggestions
      const missingServices = Object.entries(serviceAnalysis)
        .filter(([service]) => !provider.services_offered.includes(service))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      if (missingServices.length > 0) {
        newSuggestions.push({
          type: 'services',
          priority: 'medium',
          title: 'Service-Angebot erweitern',
          description: `Viele Leads benötigen Services, die Sie nicht anbieten.`,
          impact: `${missingServices.reduce((sum, [, count]) => sum + count, 0)} Leads könnten profitieren`,
          actionItems: missingServices.map(([service, count]) => 
            `${service}: ${count} Anfragen in den letzten 30 Tagen`
          ),
          potentialImpact: 12
        });
      }

      // Analyze pricing competitiveness
      const lowValueMatches = lowScoreLeads.filter(({ matchScore }) => 
        matchScore.breakdown.valueMatch < 8 && matchScore.details.meetsMinValue === false
      );

      if (lowValueMatches.length >= 5 && provider.min_job_value) {
        newSuggestions.push({
          type: 'pricing',
          priority: 'medium',
          title: 'Mindestauftragswert anpassen',
          description: `Ihr Mindestauftragswert (CHF ${provider.min_job_value}) schließt ${lowValueMatches.length} potenzielle Leads aus.`,
          impact: `Mögliche zusätzliche Leads: ${lowValueMatches.length}/Monat`,
          actionItems: [
            `Erwägen Sie die Senkung auf CHF ${Math.round(provider.min_job_value * 0.8)}`,
            'Oder: Separate Preisstruktur für kleinere Umzüge',
            'Kleinere Aufträge können Auslastung optimieren'
          ],
          potentialImpact: 10
        });
      }

      // Capacity analysis
      if (provider.max_leads_per_month && currentMonthLeads) {
        const capacityUsed = currentMonthLeads / provider.max_leads_per_month;
        
        if (capacityUsed > 0.9) {
          newSuggestions.push({
            type: 'capacity',
            priority: 'high',
            title: 'Kapazitätslimit erhöhen',
            description: `Sie nutzen ${Math.round(capacityUsed * 100)}% Ihrer monatlichen Lead-Kapazität.`,
            impact: 'Sie verpassen hochwertige Leads aufgrund Ihres Limits',
            actionItems: [
              'Upgrade auf höheren Abonnement-Plan erwägen',
              'Kapazität von aktuell ' + provider.max_leads_per_month + ' Leads/Monat erhöhen',
              'Bessere Leads priorisieren durch Filterkriterien'
            ],
            potentialImpact: 20
          });
        }
      }

      // Preferred regions suggestion
      const topPerformingCantons = Object.entries(cantonAnalysis)
        .filter(([canton]) => provider.cantons_served.includes(canton))
        .sort((a, b) => b[1].avgScore - a[1].avgScore)
        .slice(0, 3)
        .map(([canton]) => canton);

      if (topPerformingCantons.length > 0 && 
          (!provider.preferred_regions || provider.preferred_regions.length === 0)) {
        newSuggestions.push({
          type: 'service_area',
          priority: 'low',
          title: 'Bevorzugte Regionen definieren',
          description: 'Priorisieren Sie Ihre besten Regionen für höhere Match-Scores.',
          impact: 'Verbessert Matching-Algorithmus und Lead-Qualität',
          actionItems: topPerformingCantons.map(canton => 
            `${canton}: Ihre beste Region (Ø ${Math.round(cantonAnalysis[canton].avgScore)}% Match)`
          ),
          potentialImpact: 8
        });
      }

      setSuggestions(newSuggestions.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }));

    } catch (error) {
      console.error('Error analyzing provider profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCantonFromPostal = (postalCode: string): string => {
    const code = postalCode.substring(0, 1);
    const codeMap: Record<string, string> = {
      '1': 'VD', '2': 'NE', '3': 'BE', '4': 'BS',
      '5': 'AG', '6': 'LU', '7': 'GR', '8': 'ZH', '9': 'SG'
    };
    return codeMap[code] || 'Other';
  };

  const getRequiredServices = (calculatorType: string): string[] => {
    const serviceMap: Record<string, string[]> = {
      'Umzugsrechner': ['Umzug'],
      'Reinigungsrechner': ['Umzug', 'Reinigung'],
      'Entsorgungsrechner': ['Umzug', 'Entsorgung'],
      'Lagerrechner': ['Umzug', 'Lagerung'],
      'Packservice-Rechner': ['Umzug', 'Packservice'],
      'Möbelmontage-Rechner': ['Umzug', 'Möbelmontage'],
      'Gesamtpreis-Konfigurator': ['Umzug', 'Reinigung', 'Entsorgung', 'Lagerung', 'Packservice', 'Möbelmontage']
    };
    return serviceMap[calculatorType] || ['Umzug'];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service_area': return MapPin;
      case 'pricing': return DollarSign;
      case 'services': return Briefcase;
      case 'capacity': return TrendingUp;
      default: return Lightbulb;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profil-Optimierungsvorschläge</CardTitle>
          <CardDescription>Analysiere historische Daten...</CardDescription>
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Profil-Optimierungsvorschläge
            </CardTitle>
            <CardDescription>
              Basierend auf Analyse von Leads der letzten 30 Tage
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{Math.round(averageMatchScore)}%</div>
            <div className="text-xs text-muted-foreground">Durchschn. Match-Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ihr Profil ist gut optimiert! Keine dringenden Verbesserungsvorschläge gefunden.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-4">
              {suggestions.length} Optimierungsmöglichkeit{suggestions.length !== 1 ? 'en' : ''} gefunden
            </div>
            
            {suggestions.map((suggestion, index) => {
              const Icon = getTypeIcon(suggestion.type);
              
              return (
                <Card key={index} className="border-l-4" style={{
                  borderLeftColor: suggestion.priority === 'high' ? 'hsl(var(--destructive))' : 
                                   suggestion.priority === 'medium' ? 'hsl(var(--primary))' : 
                                   'hsl(var(--muted-foreground))'
                }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {suggestion.title}
                              <Badge variant={getPriorityColor(suggestion.priority) as any}>
                                {suggestion.priority === 'high' ? 'Hoch' : 
                                 suggestion.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                              </Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {suggestion.description}
                            </p>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <div className="text-lg font-bold text-primary">+{suggestion.potentialImpact}%</div>
                            <div className="text-xs text-muted-foreground">Match-Score</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{suggestion.impact}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Empfohlene Maßnahmen:</div>
                          <ul className="space-y-1.5">
                            {suggestion.actionItems.map((item, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2">
                          <Progress value={suggestion.potentialImpact * 5} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">
                            Geschätztes Verbesserungspotenzial
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}

        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={analyzeProviderProfile}
          >
            Analyse aktualisieren
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
