import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingDown, Calendar, MapPin, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Optimization {
  title: string;
  savings: number;
  month: string;
  route: string;
  canton: string;
  reason: string;
}

export const CostOptimizer = () => {
  const [budget, setBudget] = useState<number[]>([1500]);
  const [flexibility, setFlexibility] = useState("medium");
  const [fromCanton, setFromCanton] = useState("");
  const [toCanton, setToCanton] = useState("");
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);

  const cantons = [
    { code: "ZH", name: "Zürich" },
    { code: "BE", name: "Bern" },
    { code: "VD", name: "Waadt" },
    { code: "AG", name: "Aargau" },
    { code: "GE", name: "Genf" },
    { code: "LU", name: "Luzern" },
  ];

  const optimize = () => {
    const suggestions: Optimization[] = [
      {
        title: "Nebensaison nutzen",
        savings: Math.round(budget[0] * 0.18),
        month: "Februar 2025",
        route: "Hauptroute",
        canton: fromCanton || "ZH",
        reason: "Bis zu 18% günstiger als Hochsaison (Juni-August)",
      },
      {
        title: "Werktag statt Wochenende",
        savings: Math.round(budget[0] * 0.12),
        month: "Montag-Donnerstag",
        route: "Flexible Route",
        canton: fromCanton || "ZH",
        reason: "Werktage sind durchschnittlich 12% günstiger",
      },
      {
        title: "Alternative Route",
        savings: Math.round(budget[0] * 0.08),
        month: "Jederzeit",
        route: "Landstrasse",
        canton: toCanton || "BE",
        reason: "Maut-freie Route senkt Transportkosten um 8%",
      },
    ];

    if (flexibility === "high") {
      suggestions.push({
        title: "Monatsende bevorzugen",
        savings: Math.round(budget[0] * 0.15),
        month: "Letzte Monatswoche",
        route: "Hauptroute",
        canton: fromCanton || "ZH",
        reason: "Höhere Verfügbarkeit am Monatsende",
      });
    }

    setOptimizations(suggestions);
  };

  const totalSavings = optimizations.reduce((sum, opt) => sum + opt.savings, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Kostenoptimierung
        </CardTitle>
        <CardDescription>
          Finden Sie den günstigsten Zeitpunkt und Route für Ihren Umzug
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Budget (CHF {budget[0]})</Label>
            <Slider
              value={budget}
              onValueChange={setBudget}
              min={500}
              max={3000}
              step={100}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Von</Label>
              <Select value={fromCanton} onValueChange={setFromCanton}>
                <SelectTrigger>
                  <SelectValue placeholder="Kanton" />
                </SelectTrigger>
                <SelectContent>
                  {cantons.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nach</Label>
              <Select value={toCanton} onValueChange={setToCanton}>
                <SelectTrigger>
                  <SelectValue placeholder="Kanton" />
                </SelectTrigger>
                <SelectContent>
                  {cantons.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Zeitliche Flexibilität</Label>
            <Select value={flexibility} onValueChange={setFlexibility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Niedrig (Fixer Termin)</SelectItem>
                <SelectItem value="medium">Mittel (±2 Wochen)</SelectItem>
                <SelectItem value="high">Hoch (±1 Monat)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={optimize} className="w-full">
            Optimierungen berechnen
          </Button>
        </div>

        {/* Results */}
        {optimizations.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-green-900 dark:text-green-100">
                  Gesamtersparnis
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  CHF {totalSavings}
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Das sind {Math.round((totalSavings / budget[0]) * 100)}% Ihres Budgets
              </p>
            </div>

            {/* Optimizations */}
            <div className="space-y-3">
              {optimizations.map((opt, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border hover:border-primary/40 hover:shadow-soft transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{opt.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{opt.reason}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      CHF {opt.savings}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {opt.month}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {opt.route}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {opt.canton}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
