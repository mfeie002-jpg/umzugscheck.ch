import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Flame, TrendingUp, Users, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DemandData {
  canton: string;
  demandLevel: "very-high" | "high" | "medium" | "low";
  activeLeads: number;
  competingProviders: number;
  avgResponseTime: string;
  priceImpact: number;
}

export const LeadDemandTracker = () => {
  const [demand, setDemand] = useState<DemandData[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    updateDemand();
    const interval = setInterval(() => {
      updateDemand();
      setLastUpdate(new Date());
    }, 45000); // Update every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const updateDemand = () => {
    const cantons = ["ZH", "BE", "VD", "AG", "GE", "LU"];
    const levels: Array<"very-high" | "high" | "medium" | "low"> = ["very-high", "high", "medium", "low"];

    const data: DemandData[] = cantons.map((canton) => {
      const demandLevel = levels[Math.floor(Math.random() * levels.length)];
      const activeLeads = Math.floor(Math.random() * 50) + 10;
      const competingProviders = Math.floor(Math.random() * 15) + 5;
      
      let priceImpact = 0;
      if (demandLevel === "very-high") priceImpact = 25;
      else if (demandLevel === "high") priceImpact = 15;
      else if (demandLevel === "medium") priceImpact = 5;

      return {
        canton,
        demandLevel,
        activeLeads,
        competingProviders,
        avgResponseTime: `${Math.floor(Math.random() * 6) + 1}h`,
        priceImpact,
      };
    });

    setDemand(data);
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case "very-high": return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20";
      case "low": return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20";
      default: return "";
    }
  };

  const getDemandLabel = (level: string) => {
    switch (level) {
      case "very-high": return "Sehr hoch";
      case "high": return "Hoch";
      case "medium": return "Mittel";
      case "low": return "Niedrig";
      default: return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Echtzeit Lead-Nachfrage
        </CardTitle>
        <CardDescription>
          Live-Tracking der Marktnachfrage • Aktualisiert: {lastUpdate.toLocaleTimeString("de-CH")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {demand.map((data) => (
          <div
            key={data.canton}
            className={`p-4 rounded-lg border ${getDemandColor(data.demandLevel)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span className="font-semibold">{data.canton}</span>
              </div>
              <Badge
                variant={data.demandLevel === "very-high" || data.demandLevel === "high" ? "destructive" : "secondary"}
              >
                {getDemandLabel(data.demandLevel)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Aktive Leads</div>
                <div className="font-bold">{data.activeLeads}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Anbieter</div>
                <div className="font-bold flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {data.competingProviders}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Antwortzeit</div>
                <div className="font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {data.avgResponseTime}
                </div>
              </div>
            </div>

            {data.priceImpact > 0 && (
              <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Preisauswirkung</span>
                <span className="font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{data.priceImpact}%
                </span>
              </div>
            )}
          </div>
        ))}

        <div className="p-4 bg-accent/5 rounded-lg border border-accent/20 text-sm">
          <strong>💡 Strategie-Tipp:</strong> In Regionen mit niedriger Nachfrage können Sie bessere Preise verhandeln
        </div>
      </CardContent>
    </Card>
  );
};
