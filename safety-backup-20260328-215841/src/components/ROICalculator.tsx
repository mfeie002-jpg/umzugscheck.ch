import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ROICalculatorProps {
  onGetStarted?: () => void;
}

export const ROICalculator = ({ onGetStarted }: ROICalculatorProps) => {
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  const [region, setRegion] = useState("zurich");
  const [conversionRate, setConversionRate] = useState(25);

  // Calculate estimated leads based on budget
  // Average cost per lead: CHF 25-50 depending on region
  const costPerLead = region === "zurich" ? 35 : region === "rural" ? 20 : 28;
  const estimatedLeads = Math.floor(monthlyBudget / costPerLead);
  const estimatedConversions = Math.floor(estimatedLeads * (conversionRate / 100));
  const avgJobValue = 1500;
  const estimatedRevenue = estimatedConversions * avgJobValue;
  const roi = monthlyBudget > 0 ? ((estimatedRevenue - monthlyBudget) / monthlyBudget * 100).toFixed(0) : 0;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">ROI-Rechner</CardTitle>
            <p className="text-sm text-muted-foreground">Berechnen Sie Ihren potenziellen Ertrag</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Budget Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Monatliches Budget</label>
            <span className="text-lg font-bold text-primary">CHF {monthlyBudget}</span>
          </div>
          <Slider
            value={[monthlyBudget]}
            onValueChange={([value]) => setMonthlyBudget(value)}
            min={100}
            max={2000}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>CHF 100</span>
            <span>CHF 2'000</span>
          </div>
        </div>

        {/* Region Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Hauptregion</label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zurich">Zürich / Genf (höhere Nachfrage)</SelectItem>
              <SelectItem value="urban">Andere Städte</SelectItem>
              <SelectItem value="rural">Ländliche Regionen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conversion Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Erwartete Conversion-Rate</label>
            <span className="font-bold">{conversionRate}%</span>
          </div>
          <Slider
            value={[conversionRate]}
            onValueChange={([value]) => setConversionRate(value)}
            min={10}
            max={50}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Durchschnitt: 25% (abhängig von Ihrer Reaktionszeit und Preisgestaltung)
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="bg-background rounded-lg p-4 text-center">
            <Users className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{estimatedLeads}</div>
            <div className="text-xs text-muted-foreground">Leads pro Monat</div>
          </div>
          <div className="bg-background rounded-lg p-4 text-center">
            <Zap className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{estimatedConversions}</div>
            <div className="text-xs text-muted-foreground">Aufträge</div>
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
          <div className="text-3xl font-bold text-primary">CHF {estimatedRevenue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Geschätzter Umsatz pro Monat</div>
          <div className="mt-2 text-sm font-medium text-green-600">
            ROI: +{roi}%
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * Basierend auf einem durchschnittlichen Auftragswert von CHF {avgJobValue}
        </p>

        {onGetStarted && (
          <Button onClick={onGetStarted} className="w-full" size="lg">
            Jetzt Partner werden
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
