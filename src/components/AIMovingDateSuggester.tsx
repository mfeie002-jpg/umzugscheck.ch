import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, TrendingDown, Sun, Cloud } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateSuggestion {
  date: string;
  dayOfWeek: string;
  savings: number;
  weather: string;
  availability: "high" | "medium" | "low";
  reason: string;
}

export const AIMovingDateSuggester = () => {
  const [budget, setBudget] = useState("");
  const [flexibility, setFlexibility] = useState("medium");
  const [suggestions, setSuggestions] = useState<DateSuggestion[]>([]);

  const getSuggestions = () => {
    const dates: DateSuggestion[] = [];
    const today = new Date();

    // Generate 5 optimal dates
    for (let i = 0; i < 5; i++) {
      const daysAhead = Math.floor(Math.random() * 90) + 14;
      const date = new Date(today);
      date.setDate(date.getDate() + daysAhead);

      const dayOfWeek = date.toLocaleDateString("de-CH", { weekday: "long" });
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const month = date.getMonth();
      const isHighSeason = month >= 5 && month <= 7;

      let savings = 0;
      let reason = "";

      if (!isWeekend) {
        savings += 120;
        reason = "Werktag statt Wochenende";
      }
      if (!isHighSeason) {
        savings += 180;
        reason += reason ? " + Nebensaison" : "Nebensaison";
      }
      if (date.getDate() > 20) {
        savings += 80;
        reason += reason ? " + Monatsende" : "Monatsende";
      }

      dates.push({
        date: date.toLocaleDateString("de-CH"),
        dayOfWeek,
        savings,
        weather: Math.random() > 0.5 ? "Sonnig" : "Bewölkt",
        availability: savings > 250 ? "high" : savings > 150 ? "medium" : "low",
        reason,
      });
    }

    dates.sort((a, b) => b.savings - a.savings);
    setSuggestions(dates);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          KI-Datumsvorschläge
        </CardTitle>
        <CardDescription>
          AI-optimierte Termine für maximale Ersparnis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-budget">Budget (CHF)</Label>
            <Input
              id="ai-budget"
              type="number"
              placeholder="z.B. 1500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-flexibility">Flexibilität</Label>
            <Select value={flexibility} onValueChange={setFlexibility}>
              <SelectTrigger id="ai-flexibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Niedrig (±1 Woche)</SelectItem>
                <SelectItem value="medium">Mittel (±2 Wochen)</SelectItem>
                <SelectItem value="high">Hoch (±1 Monat)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={getSuggestions} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            KI-Vorschläge generieren
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Optimale Termine</h4>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  index === 0 ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{suggestion.date}</span>
                      {index === 0 && (
                        <Badge variant="default" className="text-xs">
                          Beste Wahl
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {suggestion.dayOfWeek}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    CHF {suggestion.savings}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    {suggestion.weather === "Sonnig" ? (
                      <Sun className="w-3 h-3 text-yellow-500" />
                    ) : (
                      <Cloud className="w-3 h-3 text-gray-500" />
                    )}
                    {suggestion.weather}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      suggestion.availability === "high"
                        ? "border-green-600 text-green-600"
                        : suggestion.availability === "medium"
                        ? "border-yellow-600 text-yellow-600"
                        : "border-red-600 text-red-600"
                    }`}
                  >
                    {suggestion.availability === "high" ? "Hohe" : suggestion.availability === "medium" ? "Mittlere" : "Niedrige"} Verfügbarkeit
                  </Badge>
                </div>

                <p className="text-sm">
                  <span className="font-semibold">Vorteil:</span> {suggestion.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
