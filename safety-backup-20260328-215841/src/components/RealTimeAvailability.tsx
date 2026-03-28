import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, Users, Calendar } from "lucide-react";

interface AvailabilityData {
  canton: string;
  currentCapacity: number;
  trend: "up" | "down" | "stable";
  nextAvailable: string;
  activeProviders: number;
}

export const RealTimeAvailability = () => {
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    updateAvailability();
    const interval = setInterval(() => {
      updateAvailability();
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateAvailability = () => {
    const cantons = [
      { code: "ZH", name: "Zürich" },
      { code: "BE", name: "Bern" },
      { code: "VD", name: "Waadt" },
      { code: "AG", name: "Aargau" },
      { code: "GE", name: "Genf" },
      { code: "LU", name: "Luzern" },
    ];

    const data = cantons.map((canton) => ({
      canton: canton.name,
      currentCapacity: Math.floor(Math.random() * 40) + 60,
      trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
      nextAvailable: `${Math.floor(Math.random() * 7) + 1} Tage`,
      activeProviders: Math.floor(Math.random() * 10) + 8,
    }));

    setAvailability(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Echtzeit-Verfügbarkeit
        </CardTitle>
        <CardDescription>
          Live-Tracking der Anbieterkapazität • Letzte Aktualisierung: {lastUpdate.toLocaleTimeString("de-CH")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {availability.map((data) => (
          <div key={data.canton} className="p-4 rounded-lg border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold">{data.canton}</h4>
                <Badge
                  variant="outline"
                  className={
                    data.trend === "up"
                      ? "border-green-600 text-green-600"
                      : data.trend === "down"
                      ? "border-red-600 text-red-600"
                      : "border-gray-600 text-gray-600"
                  }
                >
                  {data.trend === "up" ? "↗" : data.trend === "down" ? "↘" : "→"} {data.trend === "up" ? "Steigend" : data.trend === "down" ? "Sinkend" : "Stabil"}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                {data.activeProviders} Anbieter
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Aktuelle Kapazität</span>
                <span className="font-bold">{data.currentCapacity}%</span>
              </div>
              <Progress value={data.currentCapacity} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Nächster freier Termin
              </span>
              <span className="font-semibold">{data.nextAvailable}</span>
            </div>

            {data.currentCapacity > 80 && (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                <TrendingUp className="w-3 h-3" />
                <span>Hohe Verfügbarkeit • Günstige Preise möglich</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
