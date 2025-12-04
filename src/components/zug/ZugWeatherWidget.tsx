/**
 * Zug Weather Widget Component
 * #43-48: Weather-based moving recommendations
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sun, Cloud, CloudRain, CloudSnow, Wind, Thermometer,
  Calendar, AlertTriangle, CheckCircle2, ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WeatherDay {
  date: string;
  day: string;
  temp: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  recommendation: "optimal" | "good" | "avoid";
  tip: string;
}

// Simulated weather forecast for Zug
const generateForecast = (): WeatherDay[] => {
  const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const conditions: Array<"sunny" | "cloudy" | "rainy" | "snowy"> = ["sunny", "cloudy", "rainy", "cloudy", "sunny", "sunny", "cloudy"];
  const temps = [8, 6, 4, 5, 9, 11, 7];
  
  const today = new Date();
  
  return conditions.map((condition, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    let recommendation: "optimal" | "good" | "avoid" = "good";
    let tip = "Gute Bedingungen für einen Umzug.";
    
    if (condition === "sunny" && temps[i] > 5) {
      recommendation = "optimal";
      tip = "Ideale Umzugsbedingungen – jetzt buchen!";
    } else if (condition === "rainy" || condition === "snowy") {
      recommendation = "avoid";
      tip = condition === "rainy" 
        ? "Regen erwartet – Möbel gut abdecken!" 
        : "Schnee – erhöhte Vorsicht beim Transport.";
    }
    
    return {
      date: date.toLocaleDateString("de-CH", { day: "numeric", month: "short" }),
      day: days[date.getDay()],
      temp: temps[i],
      condition,
      recommendation,
      tip,
    };
  });
};

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  switch (condition) {
    case "sunny": return <Sun className={className} />;
    case "cloudy": return <Cloud className={className} />;
    case "rainy": return <CloudRain className={className} />;
    case "snowy": return <CloudSnow className={className} />;
    default: return <Sun className={className} />;
  }
};

export const ZugWeatherWidget = () => {
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(0);

  useEffect(() => {
    setForecast(generateForecast());
  }, []);

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "optimal": return "bg-green-100 text-green-700 border-green-200";
      case "good": return "bg-blue-100 text-blue-700 border-blue-200";
      case "avoid": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getConditionBg = (condition: string) => {
    switch (condition) {
      case "sunny": return "from-yellow-400/20 to-orange-400/20";
      case "cloudy": return "from-gray-300/20 to-gray-400/20";
      case "rainy": return "from-blue-400/20 to-blue-500/20";
      case "snowy": return "from-blue-100/20 to-white/20";
      default: return "from-primary/10 to-primary/5";
    }
  };

  if (forecast.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header with current weather */}
        <div className={`bg-gradient-to-r ${getConditionBg(forecast[selectedDay]?.condition)} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Wetter in Zug</p>
              <div className="flex items-center gap-3">
                <WeatherIcon 
                  condition={forecast[selectedDay]?.condition} 
                  className="w-10 h-10 text-primary"
                />
                <div>
                  <p className="text-3xl font-bold">{forecast[selectedDay]?.temp}°C</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {forecast[selectedDay]?.condition === "sunny" && "Sonnig"}
                    {forecast[selectedDay]?.condition === "cloudy" && "Bewölkt"}
                    {forecast[selectedDay]?.condition === "rainy" && "Regnerisch"}
                    {forecast[selectedDay]?.condition === "snowy" && "Schnee"}
                  </p>
                </div>
              </div>
            </div>
            <Badge className={getRecommendationColor(forecast[selectedDay]?.recommendation)}>
              {forecast[selectedDay]?.recommendation === "optimal" && (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Optimal
                </>
              )}
              {forecast[selectedDay]?.recommendation === "good" && "Gut"}
              {forecast[selectedDay]?.recommendation === "avoid" && (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Beachten
                </>
              )}
            </Badge>
          </div>
          
          <p className="text-sm mt-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {forecast[selectedDay]?.tip}
          </p>
        </div>

        {/* 7-day forecast */}
        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">7-Tage Prognose</p>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {forecast.map((day, i) => (
              <motion.button
                key={day.date}
                onClick={() => setSelectedDay(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 min-w-[60px] p-2 rounded-lg text-center transition-colors ${
                  i === selectedDay 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                }`}
              >
                <p className="text-xs font-medium">{day.day}</p>
                <WeatherIcon 
                  condition={day.condition} 
                  className={`w-5 h-5 mx-auto my-1 ${
                    i === selectedDay ? "text-primary-foreground" : ""
                  }`}
                />
                <p className="text-sm font-bold">{day.temp}°</p>
                <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                  day.recommendation === "optimal" ? "bg-green-500" :
                  day.recommendation === "good" ? "bg-blue-500" : "bg-orange-500"
                }`} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 pb-4">
          <Button variant="outline" size="sm" className="w-full group">
            Besten Umzugstag finden
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
