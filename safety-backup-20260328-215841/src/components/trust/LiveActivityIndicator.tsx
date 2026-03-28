import { useEffect, useState } from "react";
import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  { text: "Kunde aus Zürich hat vor 3 Minuten erfolgreich verglichen", icon: MapPin },
  { text: "Familie aus Bern hat soeben 4 Offerten erhalten", icon: MapPin },
  { text: "27 Offerten wurden heute bereits vermittelt", icon: Clock },
  { text: "Kunde aus Basel hat vor 8 Minuten gespart", icon: MapPin },
  { text: "4 Firmen haben in den letzten 30 Min. Angebote abgegeben", icon: Clock },
  { text: "Neuer Vergleich aus St. Gallen gestartet", icon: MapPin },
];

export const LiveActivityIndicator = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentActivity];
  const ActivityIcon = activity.icon;

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <div 
        className={cn(
          "bg-white/95 backdrop-blur-sm border border-success/30 rounded-lg shadow-lg p-3 max-w-xs transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-success uppercase tracking-wide">LIVE</span>
          </div>
          <ActivityIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-xs font-medium text-foreground/80 flex-1">{activity.text}</p>
        </div>
      </div>
    </div>
  );
};