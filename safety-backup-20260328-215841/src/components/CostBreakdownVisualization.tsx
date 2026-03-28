import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon, Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CostBreakdownVisualizationProps {
  totalCost?: number;
  rooms?: number;
  distance?: number;
}

const CostBreakdownVisualization = ({ 
  totalCost = 1200, 
  rooms = 3, 
  distance = 25 
}: CostBreakdownVisualizationProps) => {
  const breakdown = useMemo(() => {
    const baseTransport = totalCost * 0.35;
    const labor = totalCost * 0.30;
    const packing = totalCost * 0.15;
    const insurance = totalCost * 0.08;
    const fuel = totalCost * 0.07;
    const other = totalCost * 0.05;

    return [
      { name: "Transport", value: Math.round(baseTransport), color: "hsl(var(--primary))", description: "Fahrzeug & Fahrzeit" },
      { name: "Personal", value: Math.round(labor), color: "hsl(var(--accent))", description: "Umzugshelfer" },
      { name: "Verpackung", value: Math.round(packing), color: "#10B981", description: "Material & Schutz" },
      { name: "Versicherung", value: Math.round(insurance), color: "#F59E0B", description: "Transportschutz" },
      { name: "Treibstoff", value: Math.round(fuel), color: "#8B5CF6", description: "Kraftstoff & km-Kosten" },
      { name: "Sonstiges", value: Math.round(other), color: "#EC4899", description: "Admin & Aufschläge" },
    ];
  }, [totalCost]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-bold">CHF {data.value}</p>
          <p className="text-xs text-muted-foreground">{data.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {((data.value / totalCost) * 100).toFixed(0)}% des Gesamtpreises
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-2 bg-white shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PieChartIcon className="w-5 h-5 text-primary" />
          Kostenaufschlüsselung
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Typische Kostenverteilung eines Umzugs</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Geschätzter Gesamtpreis: <span className="font-semibold text-foreground">CHF {totalCost}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle"
                formatter={(value: string, entry: any) => (
                  <span className="text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Zimmer</p>
            <p className="font-semibold">{rooms}</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Distanz</p>
            <p className="font-semibold">{distance} km</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Pro Zimmer</p>
            <p className="font-semibold">CHF {Math.round(totalCost / rooms)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownVisualization;
