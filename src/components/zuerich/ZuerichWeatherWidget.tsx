import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer, Calendar } from "lucide-react";

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny": return Sun;
    case "cloudy": return Cloud;
    case "rainy": return CloudRain;
    case "snowy": return Snowflake;
    default: return Cloud;
  }
};

const getMovingRecommendation = (condition: string) => {
  switch (condition) {
    case "sunny": return { text: "Ideale Umzugsbedingungen", color: "bg-success/10 text-success" };
    case "cloudy": return { text: "Gute Umzugsbedingungen", color: "bg-primary/10 text-primary" };
    case "rainy": return { text: "Regenschutz einplanen", color: "bg-yellow-500/10 text-yellow-600" };
    case "snowy": return { text: "Winterausrüstung nötig", color: "bg-blue-500/10 text-blue-600" };
    default: return { text: "Wetter prüfen", color: "bg-muted text-muted-foreground" };
  }
};

export const ZuerichWeatherWidget = () => {
  const [weather] = useState({
    temp: 12,
    condition: "cloudy" as const,
    humidity: 65,
    wind: 15,
  });

  const [forecast] = useState([
    { day: "Mo", temp: 14, condition: "sunny" },
    { day: "Di", temp: 13, condition: "cloudy" },
    { day: "Mi", temp: 11, condition: "rainy" },
    { day: "Do", temp: 12, condition: "cloudy" },
    { day: "Fr", temp: 15, condition: "sunny" },
  ]);

  const WeatherIcon = getWeatherIcon(weather.condition);
  const recommendation = getMovingRecommendation(weather.condition);

  return (
    <Card className="border-2 border-primary/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Wetter Zürich</h3>
            <p className="text-sm text-muted-foreground">Umzugswetter-Prognose</p>
          </div>
          <Badge className={recommendation.color}>{recommendation.text}</Badge>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <WeatherIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{weather.temp}</span>
              <span className="text-xl text-muted-foreground">°C</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Wind className="h-3 w-3" />
                {weather.wind} km/h
              </span>
              <span className="flex items-center gap-1">
                <Thermometer className="h-3 w-3" />
                {weather.humidity}%
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            5-Tage-Prognose
          </div>
          <div className="flex justify-between">
            {forecast.map((day) => {
              const Icon = getWeatherIcon(day.condition);
              return (
                <div key={day.day} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
                  <Icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{day.temp}°</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
