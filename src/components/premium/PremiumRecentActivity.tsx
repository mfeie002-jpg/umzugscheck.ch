import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, CheckCircle } from "lucide-react";

const activities = [
  { city: "Zürich", type: "Offerte angefragt", time: "vor 2 Min." },
  { city: "Bern", type: "Umzug gebucht", time: "vor 5 Min." },
  { city: "Basel", type: "Offerte angefragt", time: "vor 8 Min." },
  { city: "Luzern", type: "Bewertung abgegeben", time: "vor 12 Min." },
  { city: "Winterthur", type: "Offerte angefragt", time: "vor 15 Min." },
  { city: "St. Gallen", type: "Umzug gebucht", time: "vor 18 Min." },
  { city: "Genf", type: "Offerte angefragt", time: "vor 22 Min." },
];

export const PremiumRecentActivity = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification every 8 seconds
    const showInterval = setInterval(() => {
      setIsVisible(true);
      setCurrentIndex((prev) => (prev + 1) % activities.length);

      // Hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    }, 8000);

    // Initial show after 3 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }, 3000);

    return () => {
      clearInterval(showInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const activity = activities[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 0 }}
          className="fixed bottom-24 left-4 z-40 md:bottom-8"
        >
          <div className="bg-card rounded-xl shadow-2xl border p-4 max-w-[280px]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-sm">{activity.type}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{activity.city}</span>
                  <Clock className="w-3 h-3 ml-1" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
