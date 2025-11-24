import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Sun, Cloud, Wind, Thermometer, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface WeatherRecommendation {
  date: string;
  weather: string;
  temperature: number;
  precipitation: number;
  recommendation: "ideal" | "good" | "acceptable" | "avoid";
  reason: string;
}

export const WeatherBasedRecommendations = () => {
  const [canton, setCanton] = useState("ZH");
  const [recommendations, setRecommendations] = useState<WeatherRecommendation[]>([]);

  const cantons = [
    { code: "ZH", name: "Zürich" },
    { code: "BE", name: "Bern" },
    { code: "LU", name: "Luzern" },
  ];

  const getWeatherRecommendations = () => {
    const dates: WeatherRecommendation[] = [];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i + 1);

      const temp = 15 + Math.random() * 15;
      const precip = Math.random() * 100;
      
      let weather = "Sonnig";
      let recommendation: "ideal" | "good" | "acceptable" | "avoid" = "ideal";
      let reason = "";

      if (precip > 70) {
        weather = "Regen";
        recommendation = "avoid";
        reason = "Starker Regen erschwert den Umzug und kann Möbel beschädigen";
      } else if (precip > 40) {
        weather = "Bewölkt";
        recommendation = "acceptable";
        reason = "Leichter Regen möglich, Schutzmaßnahmen empfohlen";
      } else if (temp > 28) {
        weather = "Sehr warm";
        recommendation = "good";
        reason = "Hitze kann anstrengend sein, früher Startzeit empfohlen";
      } else if (temp < 5) {
        weather = "Kalt";
        recommendation = "acceptable";
        reason = "Kälte beachten, rutschige Bedingungen möglich";
      } else {
        weather = "Ideal";
        recommendation = "ideal";
        reason = "Optimale Bedingungen für einen reibungslosen Umzug";
      }

      dates.push({
        date: date.toLocaleDateString("de-CH", { weekday: "short", day: "2-digit", month: "short" }),
        weather,
        temperature: Math.round(temp),
        precipitation: Math.round(precip),
        recommendation,
        reason,
      });
    }

    setRecommendations(dates);
  };

  const getWeatherIcon = (weather: string) => {
    if (weather.includes("Regen")) return <CloudRain className="w-4 h-4 text-blue-500" />;
    if (weather.includes("Bewölkt")) return <Cloud className="w-4 h-4 text-gray-500" />;
    if (weather.includes("warm")) return <Sun className="w-4 h-4 text-orange-500" />;
    return <Sun className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Wetter-Empfehlungen
        </CardTitle>
        <CardDescription>
          Optimale Umzugstermine basierend auf Wettervorhersagen
        </CardDescription>

        <div className="flex gap-3 pt-4">
          <Select value={canton} onValueChange={setCanton}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cantons.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={getWeatherRecommendations}>
            Vorhersage laden
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 && (
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  rec.recommendation === "ideal" ? "bg-green-50 border-green-200 dark:bg-green-900/20" :
                  rec.recommendation === "good" ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20" :
                  rec.recommendation === "acceptable" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20" :
                  "bg-red-50 border-red-200 dark:bg-red-900/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{rec.date}</span>
                    {getWeatherIcon(rec.weather)}
                    <span className="text-sm">{rec.weather}</span>
                  </div>
                  <Badge
                    variant={
                      rec.recommendation === "ideal" ? "default" :
                      rec.recommendation === "good" ? "secondary" :
                      rec.recommendation === "acceptable" ? "outline" :
                      "destructive"
                    }
                  >
                    {rec.recommendation === "ideal" ? "Ideal" :
                     rec.recommendation === "good" ? "Gut" :
                     rec.recommendation === "acceptable" ? "Akzeptabel" :
                     "Meiden"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    {rec.temperature}°C
                  </span>
                  <span className="flex items-center gap-1">
                    <CloudRain className="w-3 h-3" />
                    {rec.precipitation}% Regen
                  </span>
                </div>

                <p className="text-sm">{rec.reason}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
