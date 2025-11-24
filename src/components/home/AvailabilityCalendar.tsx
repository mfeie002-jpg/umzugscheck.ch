import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DayData {
  date: number;
  availability: "high" | "medium" | "low" | "none";
  price: "low" | "medium" | "high";
}

export const AvailabilityCalendar = () => {
  const [selectedMonth] = useState("Juni 2025");
  
  // Mock data for demonstration
  const generateCalendarData = (): DayData[] => {
    const days: DayData[] = [];
    const availabilities: DayData["availability"][] = ["high", "medium", "low", "none"];
    const prices: DayData["price"][] = ["low", "medium", "high"];
    
    for (let i = 1; i <= 30; i++) {
      days.push({
        date: i,
        availability: availabilities[Math.floor(Math.random() * availabilities.length)],
        price: prices[Math.floor(Math.random() * prices.length)],
      });
    }
    return days;
  };

  const days = generateCalendarData();

  const getAvailabilityColor = (availability: DayData["availability"]) => {
    switch (availability) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-orange-500";
      case "none":
        return "bg-red-500";
    }
  };

  const getPriceIndicator = (price: DayData["price"]) => {
    switch (price) {
      case "low":
        return "💰";
      case "medium":
        return "💰💰";
      case "high":
        return "💰💰💰";
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Verfügbarkeitskalender
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Wählen Sie den perfekten Tag für Ihren Umzug basierend auf Verfügbarkeit und Preis
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="p-8">
              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-foreground">Hohe Verfügbarkeit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-foreground">Mittlere Verfügbarkeit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm text-foreground">Niedrige Verfügbarkeit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-foreground">Ausgebucht</span>
                </div>
              </div>

              {/* Month Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground">{selectedMonth}</h3>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {/* Day Headers */}
                {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                  <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                
                {/* Days */}
                {days.map((day, index) => (
                  <motion.button
                    key={day.date}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.01 }}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-square rounded-lg border-2 border-border hover:border-primary transition-all relative group ${
                      day.availability === "none" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <div className={`absolute inset-0 ${getAvailabilityColor(day.availability)} opacity-20 rounded-lg`}></div>
                    <div className="relative flex flex-col items-center justify-center h-full">
                      <span className="text-sm font-semibold text-foreground">{day.date}</span>
                      <span className="text-xs">{getPriceIndicator(day.price)}</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      <p className="text-xs font-semibold">
                        {day.availability === "high" && "Viele Firmen verfügbar"}
                        {day.availability === "medium" && "Begrenzte Verfügbarkeit"}
                        {day.availability === "low" && "Wenige Firmen verfügbar"}
                        {day.availability === "none" && "Ausgebucht"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Preisniveau: {day.price === "low" ? "Günstig" : day.price === "medium" ? "Normal" : "Hoch"}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Best Days */}
              <div className="grid md:grid-cols-2 gap-4 pt-6 border-t">
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      Beste Tage zum Sparen
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Dienstag bis Donnerstag: Bis zu 20% günstiger
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      Hochsaison vermeiden
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Wochenenden & Monatsende sind teurer & voller
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-8">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Datum auswählen & Preis berechnen
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
