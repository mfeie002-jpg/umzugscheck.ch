import { useState } from "react";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Package, FileText, Clock, Truck, CheckSquare, BarChart3, Sparkles, Calendar, Wallet, Bell, ClipboardList, MapPin, Zap, Home, Sun } from "lucide-react";

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
import MovingDateOptimizer from "@/components/MovingDateOptimizer";
import PriceAlertSetup from "@/components/PriceAlertSetup";
import CompanyResponseTracker from "@/components/CompanyResponseTracker";
import MovingInventoryManager from "@/components/MovingInventoryManager";
import DocumentChecklist from "@/components/DocumentChecklist";
import AddressChangeHelper from "@/components/AddressChangeHelper";
import UtilityTransferGuide from "@/components/UtilityTransferGuide";
import MovingBudgetPlanner from "@/components/MovingBudgetPlanner";
import PackingProgressTracker from "@/components/PackingProgressTracker";
import MovingDayScheduler from "@/components/MovingDayScheduler";
import { MovingCalendar } from "@/components/MovingCalendar";

const toolCategories = [
  { id: "calculators", label: "Rechner", icon: Calculator, description: "Kostenrechner und Preisschätzer" },
  { id: "planning", label: "Planung", icon: FileText, description: "Checklisten und Timeline" },
  { id: "comparison", label: "Vergleich", icon: BarChart3, description: "Angebote vergleichen" },
  { id: "insights", label: "Insights", icon: Sparkles, description: "Tipps und Analysen" },
  { id: "organization", label: "Organisation", icon: ClipboardList, description: "Inventar und Dokumente" },
  { id: "utilities", label: "Versorgung", icon: Zap, description: "Adresse und Ummeldung" }
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
        <section className="gradient-light py-12 md:py-16">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <Badge className="mb-4 bg-primary/10 text-primary">20+ Kostenlose Tools</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Umzugs-Tools & Rechner</h1>
                <p className="text-lg text-muted-foreground">
                  Alles was Sie für die Planung Ihres Umzugs brauchen – von Kostenrechnern bis zur vollständigen Checkliste.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto p-2 bg-muted/50">
                {toolCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center gap-2 p-3 md:p-4 data-[state=active]:bg-background">
                    <category.icon className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-xs md:text-sm font-medium">{category.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="calculators" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" />Schneller Preisrechner</CardTitle></CardHeader>
                    <CardContent><InstantPriceEstimator /></CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" />Mini-Kostenrechner</CardTitle></CardHeader>
                    <CardContent><MovingCostCalculatorMini /></CardContent>
                  </Card>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Kostenaufschlüsselung</CardTitle></CardHeader>
                    <CardContent><CostBreakdownVisualization /></CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" />Budget-Planer</CardTitle></CardHeader>
                    <CardContent><MovingBudgetPlanner /></CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Datum-Optimierer</CardTitle></CardHeader>
                  <CardContent><MovingDateOptimizer /></CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="planning" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><CheckSquare className="h-5 w-5 text-primary" />Umzugs-Checkliste</CardTitle></CardHeader>
                    <CardContent><MovingChecklist /></CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Fortschritts-Tracker</CardTitle></CardHeader>
                    <CardContent><MoveProgressTracker /></CardContent>
                  </Card>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Umzugs-Timeline</CardTitle></CardHeader>
                    <CardContent><MoveTimeline /></CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Sun className="h-5 w-5 text-primary" />Umzugstag-Planer</CardTitle></CardHeader>
                    <CardContent><MovingDayScheduler /></CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Pack-Fortschritt</CardTitle></CardHeader>
                  <CardContent><PackingProgressTracker /></CardContent>
                </Card>
                <MovingCalendar />
              </TabsContent>

              <TabsContent value="comparison" className="space-y-8">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Offerten vergleichen</CardTitle></CardHeader>
                  <CardContent><QuoteComparisonTable /></CardContent>
                </Card>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Service-Pakete</CardTitle></CardHeader>
                    <CardContent><ServicePackageRecommendations /></CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Antwort-Tracker</CardTitle></CardHeader>
                    <CardContent><CompanyResponseTracker /></CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Preis-Alarm einrichten</CardTitle></CardHeader>
                  <CardContent><PriceAlertSetup /></CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-8">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Umzugstipps</CardTitle></CardHeader>
                  <CardContent><MovingTipsCarousel /></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Quartier-Insights</CardTitle></CardHeader>
                  <CardContent><NeighborhoodInsights canton="Zürich" /></CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="organization" className="space-y-8">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Inventar-Manager</CardTitle></CardHeader>
                  <CardContent><MovingInventoryManager /></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Dokumente-Checkliste</CardTitle></CardHeader>
                  <CardContent><DocumentChecklist /></CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="utilities" className="space-y-8">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Home className="h-5 w-5 text-primary" />Adressänderungs-Helfer</CardTitle></CardHeader>
                  <CardContent><AddressChangeHelper /></CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />Versorgungs-Ummeldung</CardTitle></CardHeader>
                  <CardContent><UtilityTransferGuide /></CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}