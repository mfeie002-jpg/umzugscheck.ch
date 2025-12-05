import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, TrendingUp, Users, AlertCircle, CheckCircle2, Calendar, Zap } from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
  hour: number;
  demand: "low" | "medium" | "high" | "peak";
  avgRequests: number;
  competitorActivity: number;
  recommendedPricing: number;
}

interface DayAnalysis {
  day: string;
  overallDemand: "low" | "medium" | "high";
  peakHours: string;
  recommendations: string[];
}

interface PeakHourOptimizationProps {
  providerId: string;
}

export function PeakHourOptimization({ providerId }: PeakHourOptimizationProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [dayAnalysis, setDayAnalysis] = useState<DayAnalysis[]>([]);
  const [autoPricing, setAutoPricing] = useState(false);
  const [peakSurcharge, setPeakSurcharge] = useState(15);

  useEffect(() => {
    // Generate time slot data
    const slots: TimeSlot[] = [];
    for (let hour = 6; hour <= 20; hour++) {
      let demand: "low" | "medium" | "high" | "peak" = "low";
      let avgRequests = 5;
      let competitorActivity = 30;
      let recommendedPricing = 100;

      if (hour >= 8 && hour <= 10) {
        demand = "peak";
        avgRequests = 25;
        competitorActivity = 85;
        recommendedPricing = 115;
      } else if (hour >= 14 && hour <= 17) {
        demand = "high";
        avgRequests = 18;
        competitorActivity = 70;
        recommendedPricing = 110;
      } else if (hour >= 11 && hour <= 13) {
        demand = "medium";
        avgRequests = 12;
        competitorActivity = 55;
        recommendedPricing = 105;
      }

      slots.push({ hour, demand, avgRequests, competitorActivity, recommendedPricing });
    }
    setTimeSlots(slots);

    // Day analysis
    setDayAnalysis([
      {
        day: "Montag",
        overallDemand: "high",
        peakHours: "08:00-10:00",
        recommendations: ["Frühzeitig Personal einplanen", "Höhere Preise möglich"]
      },
      {
        day: "Dienstag",
        overallDemand: "medium",
        peakHours: "09:00-11:00",
        recommendations: ["Normaler Betrieb", "Guter Tag für Grossprojekte"]
      },
      {
        day: "Mittwoch",
        overallDemand: "medium",
        peakHours: "14:00-16:00",
        recommendations: ["Nachmittagsnachfrage beachten"]
      },
      {
        day: "Donnerstag",
        overallDemand: "medium",
        peakHours: "08:00-10:00",
        recommendations: ["Ähnlich wie Montag"]
      },
      {
        day: "Freitag",
        overallDemand: "high",
        peakHours: "08:00-12:00",
        recommendations: ["Hohe Nachfrage", "Wochenend-Vorbereitung"]
      },
      {
        day: "Samstag",
        overallDemand: "high",
        peakHours: "08:00-14:00",
        recommendations: ["Peak-Tag", "Premium-Preise anwenden"]
      },
      {
        day: "Sonntag",
        overallDemand: "low",
        peakHours: "-",
        recommendations: ["Reduzierter Betrieb", "Nur Notfälle"]
      }
    ]);
  }, [providerId]);

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "peak": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-green-500";
    }
  };

  const getDemandBadge = (demand: string) => {
    switch (demand) {
      case "peak": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const handleSaveSettings = () => {
    toast.success("Einstellungen gespeichert");
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <div className="space-y-6">
      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Peak-Hour-Optimierung
          </CardTitle>
          <CardDescription>
            Automatische Preisanpassung basierend auf Nachfrage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatische Preisanpassung</Label>
              <p className="text-sm text-muted-foreground">
                Preise automatisch an Nachfrage anpassen
              </p>
            </div>
            <Switch
              checked={autoPricing}
              onCheckedChange={setAutoPricing}
            />
          </div>

          {autoPricing && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <Label>Peak-Zuschlag (%)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={peakSurcharge}
                  onChange={(e) => setPeakSurcharge(Number(e.target.value))}
                  className="w-full"
                />
                <span className="font-semibold w-12">{peakSurcharge}%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Maximaler Preisaufschlag während Peak-Zeiten
              </p>
            </div>
          )}

          <Button onClick={handleSaveSettings}>
            Einstellungen speichern
          </Button>
        </CardContent>
      </Card>

      {/* Hourly Demand Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Nachfrage nach Tageszeit
          </CardTitle>
          <CardDescription>
            Übersicht der Anfragen über den Tag verteilt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div
                key={slot.hour}
                className="flex items-center gap-4 p-2 rounded hover:bg-muted/50"
              >
                <div className="w-16 text-sm font-medium">
                  {formatHour(slot.hour)}
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getDemandColor(slot.demand)} transition-all`}
                      style={{ width: `${slot.avgRequests * 4}%` }}
                    />
                  </div>
                </div>
                <Badge variant={getDemandBadge(slot.demand) as any}>
                  {slot.demand === "peak" ? "Spitze" : 
                   slot.demand === "high" ? "Hoch" :
                   slot.demand === "medium" ? "Mittel" : "Niedrig"}
                </Badge>
                <div className="w-24 text-sm text-right">
                  <span className="text-muted-foreground">~</span>{slot.avgRequests} Anfragen
                </div>
                {autoPricing && (
                  <div className="w-16 text-sm text-right font-medium">
                    {slot.recommendedPricing}%
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Spitze</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Hoch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Mittel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Niedrig</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Wochenübersicht
          </CardTitle>
          <CardDescription>
            Nachfragemuster nach Wochentagen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayAnalysis.map((day) => (
              <div
                key={day.day}
                className={`p-4 rounded-lg border ${
                  day.overallDemand === "high" ? "border-orange-200 bg-orange-50" :
                  day.overallDemand === "medium" ? "border-yellow-200 bg-yellow-50" :
                  "border-green-200 bg-green-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{day.day}</span>
                  <Badge variant={
                    day.overallDemand === "high" ? "default" :
                    day.overallDemand === "medium" ? "secondary" : "outline"
                  }>
                    {day.overallDemand === "high" ? "Hoch" :
                     day.overallDemand === "medium" ? "Mittel" : "Niedrig"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Peak: {day.peakHours}
                </div>
                <ul className="text-xs space-y-1">
                  {day.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Optimierungsempfehlungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">Mehr Kapazität am Samstag</h4>
                <p className="text-sm text-green-700">
                  Samstag ist Ihr nachfragestärkster Tag. Erwägen Sie zusätzliches Personal einzuplanen, 
                  um mehr Aufträge annehmen zu können.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">Off-Peak-Rabatte anbieten</h4>
                <p className="text-sm text-amber-700">
                  Zwischen 12:00-14:00 Uhr ist die Nachfrage gering. Ein Rabatt von 10-15% könnte 
                  mehr Kunden für diese Zeit gewinnen.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800">Frühbucher-Bonus</h4>
                <p className="text-sm text-blue-700">
                  Kunden, die für Randzeiten (vor 8:00 oder nach 17:00) buchen, 
                  können mit einem kleinen Rabatt belohnt werden.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
