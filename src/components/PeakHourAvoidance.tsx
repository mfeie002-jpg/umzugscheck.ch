import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingDown, AlertCircle } from "lucide-react";

const timeSlots = [
  { time: "06:00-08:00", traffic: 25, price: 950, recommendation: "good", label: "Früh" },
  { time: "08:00-10:00", traffic: 85, price: 1250, recommendation: "avoid", label: "Rush Hour" },
  { time: "10:00-12:00", traffic: 45, price: 1100, recommendation: "ideal", label: "Vormittag" },
  { time: "12:00-14:00", traffic: 55, price: 1150, recommendation: "good", label: "Mittag" },
  { time: "14:00-16:00", traffic: 40, price: 1050, recommendation: "ideal", label: "Nachmittag" },
  { time: "16:00-18:00", traffic: 90, price: 1300, recommendation: "avoid", label: "Feierabend" },
  { time: "18:00-20:00", traffic: 60, price: 1200, recommendation: "acceptable", label: "Abend" },
];

export const PeakHourAvoidance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Zeitfenster-Optimierung
        </CardTitle>
        <CardDescription>
          Vermeiden Sie Stosszeiten und sparen Sie Geld
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {timeSlots.map((slot) => (
          <div
            key={slot.time}
            className={`p-4 rounded-lg border ${
              slot.recommendation === "ideal" ? "border-green-500 bg-green-50 dark:bg-green-900/20" :
              slot.recommendation === "good" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" :
              slot.recommendation === "avoid" ? "border-red-500 bg-red-50 dark:bg-red-900/20" :
              "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{slot.time}</div>
                  <div className="text-xs text-muted-foreground">{slot.label}</div>
                </div>
              </div>
              <Badge
                variant={
                  slot.recommendation === "ideal" ? "default" :
                  slot.recommendation === "avoid" ? "destructive" :
                  "secondary"
                }
              >
                {slot.recommendation === "ideal" ? "Ideal" :
                 slot.recommendation === "good" ? "Gut" :
                 slot.recommendation === "avoid" ? "Meiden" :
                 "OK"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Verkehr</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        slot.traffic > 70 ? "bg-red-500" :
                        slot.traffic > 50 ? "bg-yellow-500" :
                        "bg-green-500"
                      }`}
                      style={{ width: `${slot.traffic}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold">{slot.traffic}%</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">Preis</div>
                <div className="font-bold text-primary">CHF {slot.price}</div>
              </div>
            </div>

            {slot.recommendation === "ideal" && (
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                <TrendingDown className="w-3 h-3" />
                <span>Bis zu CHF 250 günstiger als Stosszeiten</span>
              </div>
            )}

            {slot.recommendation === "avoid" && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" />
                <span>Hoher Verkehr erhöht Kosten um bis zu 30%</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
