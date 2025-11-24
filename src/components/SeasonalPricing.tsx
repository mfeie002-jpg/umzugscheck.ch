import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const seasonalData = [
  { month: "Januar", trend: "low", multiplier: 0.85, label: "Günstig" },
  { month: "Februar", trend: "low", multiplier: 0.85, label: "Günstig" },
  { month: "März", trend: "medium", multiplier: 1.0, label: "Normal" },
  { month: "April", trend: "high", multiplier: 1.15, label: "Hochsaison" },
  { month: "Mai", trend: "high", multiplier: 1.15, label: "Hochsaison" },
  { month: "Juni", trend: "high", multiplier: 1.2, label: "Hochsaison" },
  { month: "Juli", trend: "high", multiplier: 1.2, label: "Hochsaison" },
  { month: "August", trend: "high", multiplier: 1.15, label: "Hochsaison" },
  { month: "September", trend: "medium", multiplier: 1.05, label: "Normal" },
  { month: "Oktober", trend: "medium", multiplier: 1.0, label: "Normal" },
  { month: "November", trend: "low", multiplier: 0.9, label: "Günstig" },
  { month: "Dezember", trend: "low", multiplier: 0.85, label: "Günstig" },
];

export const SeasonalPricing = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saisonale Preisentwicklung</CardTitle>
        <CardDescription>
          Sparen Sie bis zu 20% durch optimales Timing Ihres Umzugs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {seasonalData.map((item) => (
            <div
              key={item.month}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.trend === "high" && <TrendingUp className="w-4 h-4 text-red-500" />}
                {item.trend === "low" && <TrendingDown className="w-4 h-4 text-green-500" />}
                {item.trend === "medium" && <Minus className="w-4 h-4 text-yellow-500" />}
                <span className="font-medium">{item.month}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    item.trend === "high"
                      ? "destructive"
                      : item.trend === "low"
                      ? "default"
                      : "secondary"
                  }
                >
                  {item.label}
                </Badge>
                <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                  {item.multiplier > 1 ? "+" : ""}
                  {((item.multiplier - 1) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Umzüge in der Nebensaison (November-Februar) sind durchschnittlich 15% günstiger
          als in der Hochsaison (April-August).
        </p>
      </CardContent>
    </Card>
  );
};
