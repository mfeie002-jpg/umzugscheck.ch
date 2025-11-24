import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, BarChart3 } from "lucide-react";

const seasonalTrends = [
  { month: "Jan", avgPrice: 950, volume: 45, multiplier: 0.85 },
  { month: "Feb", avgPrice: 970, volume: 48, multiplier: 0.87 },
  { month: "Mar", avgPrice: 1100, volume: 65, multiplier: 1.0 },
  { month: "Apr", avgPrice: 1280, volume: 92, multiplier: 1.15 },
  { month: "Mai", avgPrice: 1300, volume: 98, multiplier: 1.17 },
  { month: "Jun", avgPrice: 1350, volume: 105, multiplier: 1.22 },
  { month: "Jul", avgPrice: 1380, volume: 110, multiplier: 1.24 },
  { month: "Aug", avgPrice: 1320, volume: 95, multiplier: 1.19 },
  { month: "Sep", avgPrice: 1180, volume: 72, multiplier: 1.06 },
  { month: "Okt", avgPrice: 1120, volume: 68, multiplier: 1.01 },
  { month: "Nov", avgPrice: 1000, volume: 52, multiplier: 0.90 },
  { month: "Dez", avgPrice: 980, volume: 48, multiplier: 0.88 },
];

const demandImpact = [
  { providers: "1-2", avgPrice: 1450, volume: 15 },
  { providers: "3-4", avgPrice: 1280, volume: 35 },
  { providers: "5-7", avgPrice: 1150, volume: 58 },
  { providers: "8-10", avgPrice: 1050, volume: 72 },
  { providers: "10+", avgPrice: 950, volume: 85 },
];

const availabilityImpact = [
  { capacity: "0-20%", avgPrice: 1400, volume: 18 },
  { capacity: "20-40%", avgPrice: 1250, volume: 35 },
  { capacity: "40-60%", avgPrice: 1150, volume: 52 },
  { capacity: "60-80%", avgPrice: 1080, volume: 68 },
  { capacity: "80-100%", avgPrice: 1020, volume: 78 },
];

const priceDistribution = [
  { range: "CHF 700-900", percentage: 15, leads: 120 },
  { range: "CHF 900-1100", percentage: 28, leads: 224 },
  { range: "CHF 1100-1300", percentage: 32, leads: 256 },
  { range: "CHF 1300-1500", percentage: 18, leads: 144 },
  { range: "CHF 1500+", percentage: 7, leads: 56 },
];

export const PricingAnalyticsDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Preis-Analytics Dashboard
        </CardTitle>
        <CardDescription>
          Detaillierte Einblicke in Preisgestaltung und Marktdynamik
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-primary/5 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              Durchschnittspreis
            </div>
            <div className="text-2xl font-bold">CHF 1,165</div>
            <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" />
              -3% vs. Vormonat
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-accent/5 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              Saisonaler Aufschlag
            </div>
            <div className="text-2xl font-bold">+15%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Hochsaison aktiv
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/30 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              Nachfrage-Multiplikator
            </div>
            <div className="text-2xl font-bold">1.12x</div>
            <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              Hohe Nachfrage
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <BarChart3 className="w-4 h-4" />
              Verfügbarkeitsrabatt
            </div>
            <div className="text-2xl font-bold">-8%</div>
            <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" />
              Gute Verfügbarkeit
            </div>
          </div>
        </div>

        <Tabs defaultValue="seasonal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="seasonal">Saisonal</TabsTrigger>
            <TabsTrigger value="demand">Nachfrage</TabsTrigger>
            <TabsTrigger value="availability">Verfügbarkeit</TabsTrigger>
            <TabsTrigger value="distribution">Verteilung</TabsTrigger>
          </TabsList>

          <TabsContent value="seasonal" className="space-y-4 mt-4">
            <div className="space-y-2">
              {seasonalTrends.map((item) => (
                <div key={item.month} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-semibold w-12">{item.month}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(item.volume / 110) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground w-24">CHF {item.avgPrice}</span>
                  </div>
                  <Badge variant={item.multiplier > 1.1 ? "destructive" : item.multiplier < 0.9 ? "default" : "secondary"}>
                    {item.multiplier > 1 ? "+" : ""}{((item.multiplier - 1) * 100).toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              📊 Insight: Juni-August sind 22% teurer als November-Februar
            </p>
          </TabsContent>

          <TabsContent value="demand" className="space-y-4 mt-4">
            <div className="space-y-2">
              {demandImpact.map((item) => (
                <div key={item.providers} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-semibold w-16">{item.providers}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${(item.volume / 85) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground w-32">CHF {item.avgPrice}</span>
                    <span className="text-xs text-muted-foreground">{item.volume} Leads</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              📊 Insight: 10+ konkurrierende Firmen senken Preis um durchschnittlich 34%
            </p>
          </TabsContent>

          <TabsContent value="availability" className="space-y-4 mt-4">
            <div className="space-y-2">
              {availabilityImpact.map((item) => (
                <div key={item.capacity} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-semibold w-20">{item.capacity}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(item.volume / 78) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground w-32">CHF {item.avgPrice}</span>
                    <span className="text-xs text-muted-foreground">{item.volume} Leads</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              📊 Insight: Hohe Kapazität (80%+) führt zu 27% niedrigeren Preisen
            </p>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4 mt-4">
            <div className="space-y-2">
              {priceDistribution.map((item) => (
                <div key={item.range} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{item.range}</span>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.leads} Leads</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Preisoptimierungs-Empfehlungen
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Preise im CHF 1100-1300 Bereich haben die höchste Conversion-Rate (32%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Bieten Sie Nebensaison-Rabatte (-15%) von November-Februar an</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Dynamische Preisanpassung basierend auf Verfügbarkeit implementieren</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
