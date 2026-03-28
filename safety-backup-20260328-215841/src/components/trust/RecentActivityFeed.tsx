import { useEffect, useState } from "react";
import { MapPin, Calculator, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  { icon: Calculator, text: "Jemand aus Zürich hat gerade eine Offerte erhalten", location: "Zürich" },
  { icon: CheckCircle2, text: "Umzug in Bern erfolgreich gebucht", location: "Bern" },
  { icon: Calculator, text: "3 neue Offerten in Basel verglichen", location: "Basel" },
  { icon: MapPin, text: "Umzugsfirma in Luzern ausgewählt", location: "Luzern" },
  { icon: Calculator, text: "Preisvergleich in St. Gallen durchgeführt", location: "St. Gallen" },
  { icon: CheckCircle2, text: "Kunde aus Winterthur sehr zufrieden", location: "Winterthur" },
  { icon: Calculator, text: "Neue Anfrage aus Genf eingegangen", location: "Genf" },
  { icon: MapPin, text: "Umzug in Lausanne geplant", location: "Lausanne" },
];

export const RecentActivityFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden lg:block">
      <div 
        className={cn(
          "bg-card border border-border rounded-xl shadow-strong p-4 max-w-sm transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
            <activity.icon className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-success uppercase tracking-wide">Live</span>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{activity.text}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{activity.location}</span>
              <span className="mx-1">•</span>
              <span>vor {Math.floor(Math.random() * 15 + 1)} Min.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
