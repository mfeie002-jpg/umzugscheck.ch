import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, TrendingDown, Download, ArrowDown } from "lucide-react";

interface FunnelStep {
  name: string;
  visitors: number;
  dropoff: number;
  conversionToNext: number;
}

interface FunnelData {
  name: string;
  steps: FunnelStep[];
  overallConversion: number;
}

const MOCK_FUNNELS: FunnelData[] = [
  {
    name: "Lead-Generierung",
    overallConversion: 14.2,
    steps: [
      { name: "Homepage Besuch", visitors: 10000, dropoff: 0, conversionToNext: 58 },
      { name: "Preisrechner Start", visitors: 5800, dropoff: 42, conversionToNext: 72 },
      { name: "Rechner abgeschlossen", visitors: 4176, dropoff: 28, conversionToNext: 54 },
      { name: "Offerten-Formular", visitors: 2255, dropoff: 46, conversionToNext: 63 },
      { name: "Lead eingereicht", visitors: 1420, dropoff: 37, conversionToNext: 100 },
    ]
  },
  {
    name: "Firmensuche",
    overallConversion: 8.5,
    steps: [
      { name: "Firmenverzeichnis", visitors: 5000, dropoff: 0, conversionToNext: 62 },
      { name: "Regionale Seite", visitors: 3100, dropoff: 38, conversionToNext: 55 },
      { name: "Firmenprofil", visitors: 1705, dropoff: 45, conversionToNext: 50 },
      { name: "Kontaktaufnahme", visitors: 852, dropoff: 50, conversionToNext: 50 },
      { name: "Anfrage gesendet", visitors: 426, dropoff: 50, conversionToNext: 100 },
    ]
  },
];

export function ConversionFunnels() {
  const [selectedFunnel, setSelectedFunnel] = useState<string>(MOCK_FUNNELS[0].name);
  const currentFunnel = MOCK_FUNNELS.find(f => f.name === selectedFunnel) || MOCK_FUNNELS[0];

  const exportFunnels = () => {
    const blob = new Blob([JSON.stringify({ funnels: MOCK_FUNNELS, exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversion-funnels-${Date.now()}.json`;
    a.click();
  };

  const maxVisitors = currentFunnel.steps[0].visitors;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Conversion Funnels
        </CardTitle>
        <CardDescription>Analysiere Konversionspfade und Trichter</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOCK_FUNNELS.map((funnel) => (
                <SelectItem key={funnel.name} value={funnel.name}>{funnel.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportFunnels}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Funnel Visualization */}
        <div className="space-y-2">
          {currentFunnel.steps.map((step, i) => {
            const widthPercent = (step.visitors / maxVisitors) * 100;
            return (
              <div key={i}>
                <div className="flex items-center gap-4">
                  <div className="w-40 text-sm font-medium text-right">{step.name}</div>
                  <div className="flex-1 relative">
                    <div 
                      className="bg-primary/20 rounded-r-lg h-12 transition-all duration-500 relative"
                      style={{ width: `${widthPercent}%`, minWidth: '60px' }}
                    >
                      <div 
                        className="absolute inset-0 bg-primary rounded-r-lg"
                        style={{ width: `${step.conversionToNext}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-white mix-blend-difference">
                          {step.visitors.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    {step.dropoff > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {step.dropoff}%
                      </Badge>
                    )}
                  </div>
                </div>
                {i < currentFunnel.steps.length - 1 && (
                  <div className="flex items-center gap-4 py-1">
                    <div className="w-40"></div>
                    <div className="flex-1 flex items-center gap-2 text-xs text-muted-foreground pl-4">
                      <ArrowDown className="h-3 w-3" />
                      {step.conversionToNext}% konvertieren zum nächsten Schritt
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Eintritte</p>
            <p className="text-2xl font-bold">{currentFunnel.steps[0].visitors.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Konversionen</p>
            <p className="text-2xl font-bold text-green-600">
              {currentFunnel.steps[currentFunnel.steps.length - 1].visitors.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gesamt-Conversion</p>
            <p className="text-2xl font-bold text-primary">{currentFunnel.overallConversion}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
