import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PriceHistoryChartProps {
  selectedCanton?: string;
}

const CANTONS = ["Zürich", "Bern", "Basel", "Luzern", "Aargau", "St. Gallen"];

const generatePriceData = (canton: string) => {
  const basePrice = {
    "Zürich": 1200,
    "Bern": 1000,
    "Basel": 1100,
    "Luzern": 950,
    "Aargau": 850,
    "St. Gallen": 900,
  }[canton] || 1000;

  const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  
  return months.map((month, i) => {
    const seasonalFactor = [0.9, 0.85, 0.95, 1.05, 1.1, 1.15, 1.2, 1.15, 1.1, 1.0, 0.9, 0.85][i];
    const randomVariation = 0.95 + Math.random() * 0.1;
    return {
      month,
      [canton]: Math.round(basePrice * seasonalFactor * randomVariation),
    };
  });
};

const PriceHistoryChart = ({ selectedCanton = "Zürich" }: PriceHistoryChartProps) => {
  const [cantons, setCantons] = useState<string[]>([selectedCanton]);
  const [addCanton, setAddCanton] = useState("");

  const chartData = useMemo(() => {
    const baseData = generatePriceData(cantons[0]);
    
    cantons.slice(1).forEach(canton => {
      const cantonData = generatePriceData(canton);
      cantonData.forEach((item, i) => {
        baseData[i][canton] = item[canton];
      });
    });
    
    return baseData;
  }, [cantons]);

  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

  const handleAddCanton = (canton: string) => {
    if (canton && !cantons.includes(canton) && cantons.length < 4) {
      setCantons([...cantons, canton]);
    }
    setAddCanton("");
  };

  const handleRemoveCanton = (canton: string) => {
    if (cantons.length > 1) {
      setCantons(cantons.filter(c => c !== canton));
    }
  };

  // Calculate trend
  const getTrend = (canton: string) => {
    const data = chartData;
    const first = (data[0]?.[canton] as number) || 0;
    const last = (data[data.length - 1]?.[canton] as number) || 0;
    const change = first > 0 ? ((last - first) / first) * 100 : 0;
    return { change, direction: change > 2 ? "up" : change < -2 ? "down" : "stable" };
  };

  return (
    <Card className="border-2 bg-white shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Preisentwicklung 2024
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Historische Umzugspreise nach Kanton
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canton Selector */}
        <div className="flex flex-wrap gap-2 items-center">
          {cantons.map((canton, i) => {
            const trend = getTrend(canton);
            return (
              <Badge 
                key={canton}
                variant="outline"
                className="gap-1 pr-1 cursor-pointer hover:bg-muted"
                style={{ borderColor: colors[i] }}
                onClick={() => handleRemoveCanton(canton)}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                {canton}
                {trend.direction === "up" && <TrendingUp className="w-3 h-3 text-red-500" />}
                {trend.direction === "down" && <TrendingDown className="w-3 h-3 text-green-500" />}
                {trend.direction === "stable" && <Minus className="w-3 h-3 text-muted-foreground" />}
              </Badge>
            );
          })}
          {cantons.length < 4 && (
            <Select value={addCanton} onValueChange={handleAddCanton}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="+ Kanton" />
              </SelectTrigger>
              <SelectContent>
                {CANTONS.filter(c => !cantons.includes(c)).map(canton => (
                  <SelectItem key={canton} value={canton}>{canton}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }} 
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => [`CHF ${value}`, name]}
              />
              <Legend />
              {cantons.map((canton, i) => (
                <Line
                  key={canton}
                  type="monotone"
                  dataKey={canton}
                  stroke={colors[i]}
                  strokeWidth={2}
                  dot={{ fill: colors[i], strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-medium text-green-800">Günstigster Monat</p>
            <p className="text-green-600">Februar (–15% ggü. Sommer)</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="font-medium text-amber-800">Teuerster Monat</p>
            <p className="text-amber-600">Juli (+20% ggü. Winter)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryChart;
