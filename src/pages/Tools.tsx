import { useState } from "react";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Package, FileText, Clock, Truck, CheckSquare, BarChart3, Sparkles } from "lucide-react";

// Import utility components
import MovingChecklist from "@/components/MovingChecklist";
import ServicePackageRecommendations from "@/components/ServicePackageRecommendations";
import CostBreakdownVisualization from "@/components/CostBreakdownVisualization";
import MoveTimeline from "@/components/MoveTimeline";
import MoveProgressTracker from "@/components/MoveProgressTracker";
import InstantPriceEstimator from "@/components/InstantPriceEstimator";
import MovingCostCalculatorMini from "@/components/MovingCostCalculatorMini";
import MovingTipsCarousel from "@/components/MovingTipsCarousel";
import QuoteComparisonTable from "@/components/QuoteComparisonTable";
import NeighborhoodInsights from "@/components/NeighborhoodInsights";

const toolCategories = [
  {
    id: "calculators",
    label: "Rechner",
    icon: Calculator,
    description: "Kostenrechner und Preisschätzer"
  },
  {
    id: "planning",
    label: "Planung",
    icon: FileText,
    description: "Checklisten und Timeline"
  },
  {
    id: "comparison",
    label: "Vergleich",
    icon: BarChart3,
    description: "Angebote vergleichen"
  },
  {
    id: "insights",
    label: "Insights",
    icon: Sparkles,
    description: "Tipps und Analysen"
  }
];

export default function Tools() {
  const [activeTab, setActiveTab] = useState("calculators");

  return (
    <>
      <OptimizedSEO
        title="Umzugs-Tools & Rechner | Umzugscheck.ch"
        description="Nutzen Sie unsere kostenlosen Umzugs-Tools: Kostenrechner, Checklisten, Timeline-Planer und mehr für Ihren perfekten Umzug in der Schweiz."
        keywords="umzug tools, umzugsrechner, umzug checkliste, umzug planen, schweiz"
        canonicalUrl="https://umzugscheck.ch/tools"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="gradient-light py-12 md:py-16">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <Badge className="mb-4 bg-primary/10 text-primary">
                  Kostenlose Tools
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Umzugs-Tools & Rechner
                </h1>
                <p className="text-lg text-muted-foreground">
                  Alles was Sie für die Planung Ihres Umzugs brauchen – 
                  von Kostenrechnern bis zur vollständigen Checkliste.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2 bg-muted/50">
                {toolCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-background"
                  >
                    <category.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Calculators Tab */}
              <TabsContent value="calculators" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-primary" />
                        Schneller Preisrechner
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <InstantPriceEstimator />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        Mini-Kostenrechner
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MovingCostCalculatorMini />
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Kostenaufschlüsselung
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CostBreakdownVisualization />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Planning Tab */}
              <TabsContent value="planning" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-primary" />
                        Umzugs-Checkliste
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MovingChecklist />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Fortschritts-Tracker
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MoveProgressTracker />
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Umzugs-Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MoveTimeline />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Comparison Tab */}
              <TabsContent value="comparison" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Offerten vergleichen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuoteComparisonTable />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Service-Pakete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ServicePackageRecommendations />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Umzugstipps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MovingTipsCarousel />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Quartier-Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NeighborhoodInsights canton="Zürich" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}
