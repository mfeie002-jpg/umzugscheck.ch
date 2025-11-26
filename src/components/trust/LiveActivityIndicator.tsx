import { useEffect, useState } from "react";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  { text: "Neues Angebot in Zürich erhalten", time: "vor 2 Minuten" },
  { text: "Umzug in Bern erfolgreich gebucht", time: "vor 5 Minuten" },
  { text: "3 neue Offerten in Basel verglichen", time: "vor 8 Minuten" },
  { text: "Umzugsfirma in Luzern bewertet", time: "vor 12 Minuten" },
  { text: "Preisvergleich in St. Gallen durchgeführt", time: "vor 15 Minuten" },
  { text: "Reinigungsservice in Winterthur gebucht", time: "vor 18 Minuten" },
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

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <div 
        className={cn(
          "bg-card border-2 border-success/30 rounded-xl shadow-strong p-4 max-w-sm transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-success uppercase tracking-wide">Live</span>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{activity.text}</p>
            <p className="text-xs text-foreground/70">{activity.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};