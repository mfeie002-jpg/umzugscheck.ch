import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarDays, TrendingDown, TrendingUp, Sun, Cloud, 
  Snowflake, Leaf, AlertCircle, CheckCircle, Sparkles 
} from "lucide-react";
import { format, addDays, addWeeks, isWeekend, getDay } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateSuggestion {
  date: Date;
  score: number;
  reason: string;
  savings: number;
  weather: 'sunny' | 'cloudy' | 'rainy';
  demand: 'low' | 'medium' | 'high';
}

export const MovingDateOptimizer = () => {
  const [preferredDate, setPreferredDate] = useState<Date>();
  const [flexibility, setFlexibility] = useState<'low' | 'medium' | 'high'>('medium');
  const [suggestions, setSuggestions] = useState<DateSuggestion[]>([]);

  useEffect(() => {
    if (preferredDate) {
      generateSuggestions(preferredDate);
    }
  }, [preferredDate, flexibility]);

  const generateSuggestions = (baseDate: Date) => {
    const flexDays = flexibility === 'low' ? 3 : flexibility === 'medium' ? 7 : 14;
    const newSuggestions: DateSuggestion[] = [];

    for (let i = -flexDays; i <= flexDays; i++) {
      const date = addDays(baseDate, i);
      if (date < new Date()) continue;

      const dayOfWeek = getDay(date);
      const isEndOfMonth = date.getDate() >= 25;
      const isMidweek = dayOfWeek >= 2 && dayOfWeek <= 4;

      let score = 70;
      let savings = 0;
      let reason = "";
      let demand: 'low' | 'medium' | 'high' = 'medium';

      if (isMidweek) {
        score += 15;
        savings += 10;
        reason = "Wochentags sind günstiger";
        demand = 'low';
      }

      if (isEndOfMonth) {
        score -= 20;
        savings -= 15;
        reason = "Monatsende ist teurer";
        demand = 'high';
      }

      if (isWeekend(date)) {
        score -= 10;
        savings -= 5;
        reason = "Wochenende hat höhere Nachfrage";
        demand = 'high';
      }

      const weathers: Array<'sunny' | 'cloudy' | 'rainy'> = ['sunny', 'cloudy', 'rainy'];
      const weather = weathers[Math.floor(Math.random() * 3)];

      newSuggestions.push({
        date,
        score: Math.max(0, Math.min(100, score)),
        reason,
        savings,
        weather,
        demand
      });
    }

    setSuggestions(newSuggestions.sort((a, b) => b.score - a.score).slice(0, 5));
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-4 w-4 text-gray-500" />;
      default: return <Cloud className="h-4 w-4 text-blue-500" />;
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Umzugsdatum optimieren
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Wunschdatum wählen</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !preferredDate && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {preferredDate ? format(preferredDate, "PPP", { locale: de }) : "Datum wählen"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={preferredDate}
                onSelect={setPreferredDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Flexibilität</Label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <Button
                key={level}
                variant={flexibility === level ? "default" : "outline"}
                size="sm"
                onClick={() => setFlexibility(level)}
                className="flex-1"
              >
                {level === 'low' ? '±3 Tage' : level === 'medium' ? '±1 Woche' : '±2 Wochen'}
              </Button>
            ))}
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Beste Termine</span>
            </div>
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  idx === 0 ? "border-primary bg-primary/5" : "border-border/50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {format(suggestion.date, "EEE, d. MMM", { locale: de })}
                  </span>
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(suggestion.weather)}
                    <Badge className={getDemandColor(suggestion.demand)}>
                      {suggestion.demand === 'low' ? 'Wenig Nachfrage' : 
                       suggestion.demand === 'high' ? 'Hohe Nachfrage' : 'Normal'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{suggestion.reason}</span>
                  {suggestion.savings !== 0 && (
                    <span className={suggestion.savings > 0 ? "text-green-600" : "text-red-600"}>
                      {suggestion.savings > 0 ? (
                        <span className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          ~{suggestion.savings}% günstiger
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          ~{Math.abs(suggestion.savings)}% teurer
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MovingDateOptimizer;
