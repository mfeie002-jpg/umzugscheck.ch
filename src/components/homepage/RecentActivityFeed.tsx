import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, MapPin, Clock } from "lucide-react";

const activities = [
  { name: "Thomas M.", location: "Zürich", action: "hat 3 Offerten erhalten", time: "vor 2 Min." },
  { name: "Sandra K.", location: "Basel", action: "hat eine Firma gebucht", time: "vor 5 Min." },
  { name: "Peter W.", location: "Bern", action: "vergleicht gerade Preise", time: "vor 8 Min." },
  { name: "Maria L.", location: "Luzern", action: "hat 4 Offerten erhalten", time: "vor 12 Min." },
  { name: "Andreas B.", location: "St. Gallen", action: "hat eine Bewertung geschrieben", time: "vor 15 Min." }
];

export const RecentActivityFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-xl border border-border p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-foreground">Live-Aktivität</span>
      </div>
      
      <div className="h-16 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {activities[currentIndex].name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {activities[currentIndex].action}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {activities[currentIndex].location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activities[currentIndex].time}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
