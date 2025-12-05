import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

interface WeatherForecast {
  date: Date;
  condition: "sunny" | "cloudy" | "rainy" | "windy" | "stormy";
  temperature: number;
  humidity: number;
  windSpeed: number;
  movingScore: number;
  recommendation: string;
}

interface WeatherRecommendationsProps {
  providerId: string;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  windy: Wind,
  stormy: AlertCircle
};

const weatherLabels = {
  sunny: "Sonnig",
  cloudy: "Bewölkt",
  rainy: "Regnerisch",
  windy: "Windig",
  stormy: "Stürmisch"
};

export function WeatherRecommendations({ providerId }: WeatherRecommendationsProps) {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("zürich");

  useEffect(() => {
    // Generate simulated weather forecast for next 7 days
    const generateForecast = () => {
      const conditions: Array<"sunny" | "cloudy" | "rainy" | "windy" | "stormy"> = 
        ["sunny", "sunny", "cloudy", "rainy", "sunny", "cloudy", "windy"];
      
      return conditions.map((condition, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        
        const baseTemp = 15 + Math.random() * 10;
        const humidity = 40 + Math.random() * 40;
        const windSpeed = condition === "windy" ? 30 + Math.random() * 20 : 5 + Math.random() * 15;
        
        let movingScore = 100;
        if (condition === "rainy") movingScore -= 40;
        if (condition === "windy") movingScore -= 30;
        if (condition === "stormy") movingScore -= 70;
        if (humidity > 70) movingScore -= 10;
        if (windSpeed > 25) movingScore -= 15;
        
        let recommendation = "";
        if (movingScore >= 80) recommendation = "Ideale Bedingungen für Umzüge";
        else if (movingScore >= 60) recommendation = "Gute Bedingungen, leichte Einschränkungen möglich";
        else if (movingScore >= 40) recommendation = "Mässige Bedingungen, Vorsicht geboten";
        else recommendation = "Nicht empfohlen für Umzüge";

        return {
          date,
          condition,
          temperature: Math.round(baseTemp),
          humidity: Math.round(humidity),
          windSpeed: Math.round(windSpeed),
          movingScore: Math.round(movingScore),
          recommendation
        };
      });
    };

    setForecasts(generateForecast());
  }, [selectedRegion]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-amber-600 bg-amber-50";
    if (score >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Heute";
    if (date.toDateString() === tomorrow.toDateString()) return "Morgen";
    return date.toLocaleDateString('de-CH', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const bestDays = forecasts
    .filter(f => f.movingScore >= 70)
    .sort((a, b) => b.movingScore - a.movingScore)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Region Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Wetterbasierte Umzugsempfehlungen
          </CardTitle>
          <CardDescription>
            Optimale Tage für Umzüge basierend auf der Wettervorhersage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {["zürich", "bern", "basel", "luzern", "st-gallen"].map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region)}
              >
                {region.charAt(0).toUpperCase() + region.slice(1).replace("-", ". ")}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Days Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Empfohlene Umzugstage
          </CardTitle>
          <CardDescription>
            Die besten Tage für Umzüge in der kommenden Woche
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bestDays.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <p>Keine idealen Umzugstage in dieser Woche</p>
              <p className="text-sm">Planen Sie Umzüge wenn möglich flexibel</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bestDays.map((day, index) => {
                const WeatherIcon = weatherIcons[day.condition];
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getScoreColor(day.movingScore)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{formatDate(day.date)}</span>
                      <WeatherIcon className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {day.movingScore}%
                    </div>
                    <p className="text-sm">Umzugstauglichkeit</p>
                    <div className="mt-2 text-xs">
                      {day.temperature}°C • {weatherLabels[day.condition]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            7-Tage-Übersicht
          </CardTitle>
          <CardDescription>
            Detaillierte Wettervorhersage für Ihre Umzugsplanung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecasts.map((forecast, index) => {
              const WeatherIcon = weatherIcons[forecast.condition];
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 font-medium">
                      {formatDate(forecast.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <WeatherIcon className="h-6 w-6" />
                      <span className="text-sm">{weatherLabels[forecast.condition]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <span>{forecast.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <span>{forecast.windSpeed} km/h</span>
                    </div>
                    <div className="w-20">
                      <Badge variant={getScoreBadge(forecast.movingScore)}>
                        {forecast.movingScore}%
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Wetter-Tipps für Umzüge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Bei gutem Wetter</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Früh morgens starten für kühlere Temperaturen</li>
                <li>• Sonnenschutz für empfindliche Möbel vorbereiten</li>
                <li>• Ausreichend Wasser für das Team bereitstellen</li>
              </ul>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Bei schlechtem Wetter</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Schutzfolien und Abdeckungen einsetzen</li>
                <li>• Rutschfeste Matten an Eingängen platzieren</li>
                <li>• Elektronik besonders schützen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
