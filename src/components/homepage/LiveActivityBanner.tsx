import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, CheckCircle } from "lucide-react";

const activities = [
  { location: "Zürich", action: "Offerte angefordert", time: "vor 2 Min." },
  { location: "Basel", action: "3 Offerten erhalten", time: "vor 5 Min." },
  { location: "Bern", action: "Umzug gebucht", time: "vor 8 Min." },
  { location: "Luzern", action: "Offerte angefordert", time: "vor 12 Min." },
  { location: "St. Gallen", action: "Preisvergleich gestartet", time: "vor 15 Min." },
  { location: "Winterthur", action: "2 Offerten erhalten", time: "vor 18 Min." },
];

export const LiveActivityBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentIndex];

  return (
    <div className="bg-green-50 dark:bg-green-950/30 border-y border-green-200 dark:border-green-800 py-2">
      <div className="container">
        <div className="flex items-center justify-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-sm"
            >
              <span className="flex items-center gap-1 text-green-700 dark:text-green-300 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {activity.location}
              </span>
              <span className="text-green-600 dark:text-green-400">
                – {activity.action}
              </span>
              <span className="flex items-center gap-1 text-green-500 text-xs">
                <Clock className="w-3 h-3" />
                {activity.time}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
