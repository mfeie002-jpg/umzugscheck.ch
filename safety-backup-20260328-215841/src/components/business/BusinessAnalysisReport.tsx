import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, TrendingDown, Clock, DollarSign, AlertTriangle, 
  CheckCircle2, XCircle, ArrowRight, Zap, BarChart3, Users,
  Target, Shield, Award, Lightbulb, Calculator, Building2,
  ChevronDown, ChevronUp, Sparkles, Brain, Rocket
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

interface AnalysisInputs {
  currentLeadsPerMonth: number;
  conversionRate: number;
  averageJobValue: number;
  currentMarketingSpend: number;
  employeeCount: number;
  hasOnlinePresence: boolean;
  hasReviews: boolean;
  responseTimeHours: number;
}

interface OptimizationArea {
  name: string;
  icon: React.ElementType;
  hoursToFix: number;
  costIfDIY: number;
  costIfWeDo: number;
  currentScore: number;
  potentialScore: number;
  revenueImpact: number;
  description: string;
  consequences: string[];
  whatWeDoForYou: string[];
}

export const BusinessAnalysisReport = () => {
  const [inputs, setInputs] = useState<AnalysisInputs>({
    currentLeadsPerMonth: 10,
    conversionRate: 20,
    averageJobValue: 1500,
    currentMarketingSpend: 300,
    employeeCount: 3,
    hasOnlinePresence: false,
    hasReviews: false,
    responseTimeHours: 24,
  });

  const [expandedArea, setExpandedArea] = useState<string | null>(null);

  const optimizationAreas: OptimizationArea[] = useMemo(() => [
    {
      name: "Website & Online-Präsenz",
      icon: Building2,
      hoursToFix: 80,
      costIfDIY: 8000,
      costIfWeDo: 0, // Included
      currentScore: inputs.hasOnlinePresence ? 50 : 15,
      potentialScore: 95,
      revenueImpact: 0.35,
      description: "Professionelle Website mit Conversion-Optimierung",
      consequences: [
        "78% der Kunden recherchieren online vor einem Kauf",
        "Ohne Website verlieren Sie täglich potenzielle Kunden",
        "Konkurrenten mit starker Online-Präsenz gewinnen Ihre Kunden",
        "Vertrauensverlust: Kunden zweifeln an Seriosität"
      ],
      whatWeDoForYou: [
        "Vollständiges Firmenprofil auf umzugscheck.ch",
        "SEO-optimierte Präsenz in allen Schweizer Regionen",
        "Mobile-optimierte Darstellung",
        "Professionelle Bildergalerie und Beschreibung"
      ]
    },
    {
      name: "Bewertungen & Reputation",
      icon: Award,
      hoursToFix: 40,
      costIfDIY: 3500,
      costIfWeDo: 0,
      currentScore: inputs.hasReviews ? 45 : 10,
      potentialScore: 90,
      revenueImpact: 0.28,
      description: "Aktives Bewertungsmanagement und Reputation",
      consequences: [
        "92% lesen Bewertungen vor einer Entscheidung",
        "Firmen ohne Bewertungen wirken unseriös",
        "Jeder Stern mehr = 5-9% mehr Umsatz",
        "Negative Bewertungen ohne Antwort schrecken Kunden ab"
      ],
      whatWeDoForYou: [
        "Automatische Bewertungsanfragen nach jedem Auftrag",
        "Dashboard zur Bewertungsverwaltung",
        "Antwortvorlagen für positive & negative Reviews",
        "Verifiziert-Badge für mehr Vertrauen"
      ]
    },
    {
      name: "Lead-Generierung",
      icon: Users,
      hoursToFix: 60,
      costIfDIY: 5000,
      costIfWeDo: 0,
      currentScore: 25,
      potentialScore: 85,
      revenueImpact: 0.45,
      description: "Konstanter Strom qualifizierter Kundenanfragen",
      consequences: [
        "Ohne stetige Lead-Quelle: Umsatzschwankungen",
        "Abhängigkeit von Empfehlungen ist riskant",
        "Saisonale Einbrüche ohne Absicherung",
        "Wachstum ohne neue Leads unmöglich"
      ],
      whatWeDoForYou: [
        "Qualifizierte Leads aus Ihrer Region",
        "Vorselektierte Kunden die aktiv suchen",
        "Vollständige Kontaktdaten und Umzugsdetails",
        "Lead-Garantie: Erstattung bei ungültigen Leads"
      ]
    },
    {
      name: "Reaktionszeit & Verfügbarkeit",
      icon: Clock,
      hoursToFix: 20,
      costIfDIY: 2000,
      costIfWeDo: 0,
      currentScore: inputs.responseTimeHours <= 2 ? 85 : inputs.responseTimeHours <= 12 ? 50 : 20,
      potentialScore: 95,
      revenueImpact: 0.22,
      description: "Schnelle Reaktion = mehr Aufträge",
      consequences: [
        "78% der Kunden buchen beim ersten Anbieter der antwortet",
        "Nach 1 Stunde sinkt Conversion um 50%",
        "Langsame Antworten = Kunde geht zur Konkurrenz",
        "Verpasste Anrufe = verlorene Aufträge"
      ],
      whatWeDoForYou: [
        "Sofortige Lead-Benachrichtigung per SMS/E-Mail",
        "Mobile App für unterwegs",
        "Automatische Erst-Antwort",
        "Verfügbarkeitskalender für Kunden"
      ]
    },
    {
      name: "Marketing & Werbung",
      icon: Target,
      hoursToFix: 100,
      costIfDIY: 12000,
      costIfWeDo: 0,
      currentScore: 20,
      potentialScore: 80,
      revenueImpact: 0.30,
      description: "Effektives Marketing ohne Streuverluste",
      consequences: [
        "Google Ads ohne Expertise = Geldverbrennung",
        "Falsche Zielgruppe = niedrige Conversion",
        "Ständige Optimierung nötig (8-15h/Woche)",
        "Ohne Marketing: Stillstand beim Wachstum"
      ],
      whatWeDoForYou: [
        "Wir investieren in Google/Social Ads für Sie",
        "SEO-Traffic ohne Ihre Kosten",
        "Targeting auf Ihre Wunschregionen",
        "Keine Marketing-Expertise nötig"
      ]
    },
    {
      name: "Analytics & Optimierung",
      icon: BarChart3,
      hoursToFix: 30,
      costIfDIY: 4000,
      costIfWeDo: 0,
      currentScore: 10,
      potentialScore: 85,
      revenueImpact: 0.15,
      description: "Datenbasierte Entscheidungen für Wachstum",
      consequences: [
        "Ohne Daten: Blindflug bei Entscheidungen",
        "Sie wissen nicht, was funktioniert",
        "Keine Insights = keine Optimierung",
        "Konkurrenten mit Analytics überholen Sie"
      ],
      whatWeDoForYou: [
        "Partner-Dashboard mit allen KPIs",
        "Lead-Statistiken und Trends",
        "Conversion-Tracking",
        "Wettbewerbsvergleich"
      ]
    }
  ], [inputs]);

  // Calculate totals
  const totalHoursDIY = optimizationAreas.reduce((sum, area) => sum + area.hoursToFix, 0);
  const totalCostDIY = optimizationAreas.reduce((sum, area) => sum + area.costIfDIY, 0);
  const hourlyRate = 85; // CHF per hour opportunity cost

  // Current vs Potential calculations
  const currentMonthlyRevenue = inputs.currentLeadsPerMonth * (inputs.conversionRate / 100) * inputs.averageJobValue;
  const averageScoreNow = optimizationAreas.reduce((sum, area) => sum + area.currentScore, 0) / optimizationAreas.length;
  const averageScorePotential = optimizationAreas.reduce((sum, area) => sum + area.potentialScore, 0) / optimizationAreas.length;
  
  const totalRevenueMultiplier = optimizationAreas.reduce((sum, area) => sum + area.revenueImpact, 0);
  const potentialMonthlyRevenue = currentMonthlyRevenue * (1 + totalRevenueMultiplier);
  const monthlyRevenueGain = potentialMonthlyRevenue - currentMonthlyRevenue;
  const yearlyRevenueGain = monthlyRevenueGain * 12;

  // Cost of inaction (per year)
  const costOfInactionPerMonth = monthlyRevenueGain;
  const costOfInactionPerYear = yearlyRevenueGain;

  // Potential leads with optimization
  const potentialLeadsPerMonth = Math.round(inputs.currentLeadsPerMonth * (1 + totalRevenueMultiplier * 0.7));
  const potentialConversions = Math.round(potentialLeadsPerMonth * ((inputs.conversionRate + 10) / 100));

  return (
    <div className="space-y-8">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            <Brain className="w-4 h-4 mr-2" />
            Kostenlose Business-Analyse
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Was kostet Sie der aktuelle Zustand?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sehen Sie genau, wie viel Umsatz und Kunden Sie verlieren – und wie Ihr Business 
            mit vollständiger Optimierung aussehen würde.
          </p>
        </div>
      </ScrollReveal>

      {/* Input Section */}
      <ScrollReveal delay={0.1}>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Ihre aktuellen Kennzahlen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium flex justify-between">
                  <span>Leads pro Monat</span>
                  <span className="text-primary font-bold">{inputs.currentLeadsPerMonth}</span>
                </label>
                <Slider
                  value={[inputs.currentLeadsPerMonth]}
                  onValueChange={([v]) => setInputs(p => ({ ...p, currentLeadsPerMonth: v }))}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium flex justify-between">
                  <span>Conversion-Rate</span>
                  <span className="text-primary font-bold">{inputs.conversionRate}%</span>
                </label>
                <Slider
                  value={[inputs.conversionRate]}
                  onValueChange={([v]) => setInputs(p => ({ ...p, conversionRate: v }))}
                  min={5}
                  max={60}
                  step={5}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium flex justify-between">
                  <span>Ø Auftragswert</span>
                  <span className="text-primary font-bold">CHF {inputs.averageJobValue.toLocaleString()}</span>
                </label>
                <Slider
                  value={[inputs.averageJobValue]}
                  onValueChange={([v]) => setInputs(p => ({ ...p, averageJobValue: v }))}
                  min={500}
                  max={5000}
                  step={100}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium flex justify-between">
                  <span>Reaktionszeit</span>
                  <span className="text-primary font-bold">{inputs.responseTimeHours}h</span>
                </label>
                <Slider
                  value={[inputs.responseTimeHours]}
                  onValueChange={([v]) => setInputs(p => ({ ...p, responseTimeHours: v }))}
                  min={1}
                  max={48}
                  step={1}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={inputs.hasOnlinePresence}
                  onChange={(e) => setInputs(p => ({ ...p, hasOnlinePresence: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm">Professionelle Website vorhanden</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={inputs.hasReviews}
                  onChange={(e) => setInputs(p => ({ ...p, hasReviews: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm">Aktives Bewertungsmanagement</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mitarbeiter</label>
                <Select 
                  value={String(inputs.employeeCount)}
                  onValueChange={(v) => setInputs(p => ({ ...p, employeeCount: parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Person</SelectItem>
                    <SelectItem value="2">2-3 Personen</SelectItem>
                    <SelectItem value="5">4-10 Personen</SelectItem>
                    <SelectItem value="15">10+ Personen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Current vs Potential Overview */}
      <ScrollReveal delay={0.2}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current State */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <TrendingDown className="h-5 w-5" />
                Aktueller Zustand
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Business-Score</span>
                <div className="flex items-center gap-2">
                  <Progress value={averageScoreNow} className="w-24 h-2" />
                  <span className="font-bold text-destructive">{Math.round(averageScoreNow)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Leads/Monat</span>
                <span className="font-bold">{inputs.currentLeadsPerMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Aufträge/Monat</span>
                <span className="font-bold">{Math.round(inputs.currentLeadsPerMonth * inputs.conversionRate / 100)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Monatlicher Umsatz</span>
                <span className="text-2xl font-bold">CHF {currentMonthlyRevenue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Potential State */}
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-5 w-5" />
                Nach Optimierung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Business-Score</span>
                <div className="flex items-center gap-2">
                  <Progress value={averageScorePotential} className="w-24 h-2 [&>div]:bg-green-500" />
                  <span className="font-bold text-green-600">{Math.round(averageScorePotential)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Leads/Monat</span>
                <span className="font-bold text-green-600">
                  {potentialLeadsPerMonth}
                  <span className="text-xs ml-1">
                    (+{potentialLeadsPerMonth - inputs.currentLeadsPerMonth})
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Aufträge/Monat</span>
                <span className="font-bold text-green-600">
                  {potentialConversions}
                  <span className="text-xs ml-1">
                    (+{potentialConversions - Math.round(inputs.currentLeadsPerMonth * inputs.conversionRate / 100)})
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Monatlicher Umsatz</span>
                <span className="text-2xl font-bold text-green-600">
                  CHF {Math.round(potentialMonthlyRevenue).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollReveal>

      {/* Cost of Inaction - Big Alert */}
      <ScrollReveal delay={0.3}>
        <Card className="border-2 border-amber-500/50 bg-gradient-to-r from-amber-50 to-red-50 dark:from-amber-950/20 dark:to-red-950/20">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-10 w-10 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-amber-800 dark:text-amber-400">
                  Was Sie jeden Monat verlieren, wenn Sie nichts ändern
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ihre Konkurrenten optimieren bereits. Je länger Sie warten, desto mehr Marktanteil verlieren Sie.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-white/50 dark:bg-background/50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-destructive">
                      CHF {Math.round(costOfInactionPerMonth).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">pro Monat</div>
                  </div>
                  <div className="bg-white/50 dark:bg-background/50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-destructive">
                      CHF {Math.round(costOfInactionPerYear).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">pro Jahr</div>
                  </div>
                  <div className="bg-white/50 dark:bg-background/50 rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-destructive">
                      {potentialLeadsPerMonth - inputs.currentLeadsPerMonth}+ Leads
                    </div>
                    <div className="text-xs text-muted-foreground">entgangene Anfragen</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* DIY vs We Do It - Time & Cost Comparison */}
      <ScrollReveal delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Zeit- und Kostenaufwand: Selbst machen vs. Wir machen es
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="diy">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="diy" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  Selbst machen
                </TabsTrigger>
                <TabsTrigger value="wedo" className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Wir machen es
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="diy" className="mt-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-destructive/10 rounded-lg p-4 text-center">
                      <Clock className="h-6 w-6 text-destructive mx-auto mb-2" />
                      <div className="text-3xl font-bold text-destructive">{totalHoursDIY}h</div>
                      <div className="text-sm text-muted-foreground">Arbeitszeit total</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ≈ {Math.round(totalHoursDIY / 8)} Arbeitstage
                      </div>
                    </div>
                    <div className="bg-destructive/10 rounded-lg p-4 text-center">
                      <DollarSign className="h-6 w-6 text-destructive mx-auto mb-2" />
                      <div className="text-3xl font-bold text-destructive">
                        CHF {totalCostDIY.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Direkte Kosten</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Tools, Freelancer, Ads, etc.
                      </div>
                    </div>
                    <div className="bg-destructive/10 rounded-lg p-4 text-center">
                      <TrendingDown className="h-6 w-6 text-destructive mx-auto mb-2" />
                      <div className="text-3xl font-bold text-destructive">
                        CHF {(totalHoursDIY * hourlyRate).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Opportunitätskosten</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        (bei CHF {hourlyRate}/h Stundensatz)
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Gesamtkosten wenn Sie alles selbst machen:</span>
                      <span className="text-2xl font-bold text-destructive">
                        CHF {(totalCostDIY + totalHoursDIY * hourlyRate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    * Plus: Lernkurve, Fehler, verpasste Leads während der Umsetzung, laufende Wartung
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="wedo" className="mt-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-500/10 rounded-lg p-4 text-center">
                      <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-600">0h</div>
                      <div className="text-sm text-muted-foreground">Ihr Zeitaufwand</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Wir erledigen alles für Sie
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 text-center">
                      <Zap className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-600">&lt; 48h</div>
                      <div className="text-sm text-muted-foreground">Bis zum ersten Lead</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Schnelle Freischaltung
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-600">Alles inkl.</div>
                      <div className="text-sm text-muted-foreground">Von A bis Z</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Keine versteckten Kosten
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-500/10 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">Alles inklusive ab:</span>
                        <p className="text-sm text-muted-foreground">Pay-per-Lead oder Premium-Abo</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">
                          CHF 25
                        </span>
                        <span className="text-sm text-muted-foreground"> / Lead</span>
                      </div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {[
                      "Komplettes Firmenprofil einrichten",
                      "SEO & Sichtbarkeit optimieren",
                      "Bewertungssystem aktivieren",
                      "Lead-Management Dashboard",
                      "Benachrichtigungen einrichten",
                      "Laufende Optimierung & Support"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Detailed Optimization Areas */}
      <ScrollReveal delay={0.5}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Detaillierte Analyse: Was muss optimiert werden?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {optimizationAreas.map((area) => (
              <div 
                key={area.name}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedArea(expandedArea === area.name ? null : area.name)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    area.currentScore > 60 ? 'bg-green-100 text-green-600' :
                    area.currentScore > 30 ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <area.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{area.name}</span>
                      <Badge variant={area.currentScore > 60 ? "default" : "destructive"} className="text-xs">
                        {area.currentScore}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{area.hoursToFix}h DIY</span>
                      <span>CHF {area.costIfDIY.toLocaleString()} Kosten</span>
                      <span className="text-green-600">+{Math.round(area.revenueImpact * 100)}% Umsatz</span>
                    </div>
                  </div>
                  <Progress value={area.currentScore} className="w-24 h-2" />
                  {expandedArea === area.name ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                
                {expandedArea === area.name && (
                  <div className="p-4 pt-0 space-y-4 animate-accordion-down">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-destructive flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Wenn Sie nichts ändern:
                        </h4>
                        <ul className="space-y-2">
                          {area.consequences.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-green-600 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Was wir für Sie tun:
                        </h4>
                        <ul className="space-y-2">
                          {area.whatWeDoForYou.map((w, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t bg-muted/30 -mx-4 px-4 py-3 -mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Umsatzpotenzial:</span>
                        <span className="ml-2 font-bold text-green-600">
                          +CHF {Math.round(currentMonthlyRevenue * area.revenueImpact).toLocaleString()}/Monat
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{area.currentScore}%</span>
                        <ArrowRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-bold text-green-600">{area.potentialScore}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Final CTA - Decision */}
      <ScrollReveal delay={0.6}>
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background overflow-hidden">
          <CardContent className="py-10">
            <div className="text-center max-w-3xl mx-auto">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Wie möchten Sie weitermachen?
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Sie haben die Wahl: Selbst machen oder von uns erledigen lassen.
                <br />
                <span className="font-medium">
                  Eines ist sicher: Wenn Sie nichts tun, verlieren Sie jeden Monat 
                  CHF {Math.round(costOfInactionPerMonth).toLocaleString()}.
                </span>
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="text-left hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-2">Selbst machen</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      <li>• {totalHoursDIY} Stunden Arbeit</li>
                      <li>• CHF {totalCostDIY.toLocaleString()} direkte Kosten</li>
                      <li>• Lernkurve und Trial-Error</li>
                      <li>• Laufende Wartung nötig</li>
                    </ul>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/ratgeber/umzugsfirma-marketing">
                        Zur DIY-Anleitung
                      </a>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="text-left border-2 border-primary hover:shadow-lg transition-shadow relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Empfohlen</Badge>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-2">Wir machen es für Sie</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      <li className="text-green-600">✓ 0 Stunden Ihr Zeitaufwand</li>
                      <li className="text-green-600">✓ Alles inklusive ab CHF 25/Lead</li>
                      <li className="text-green-600">✓ Sofort einsatzbereit (&lt;48h)</li>
                      <li className="text-green-600">✓ Laufender Support & Optimierung</li>
                    </ul>
                    <Button className="w-full" size="lg" asChild>
                      <a href="#bewerbung">
                        <Rocket className="mr-2 h-4 w-4" />
                        Jetzt Partner werden
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-sm text-muted-foreground">
                100% kostenlos und unverbindlich. Keine Kreditkarte nötig.
              </p>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
};

export default BusinessAnalysisReport;
