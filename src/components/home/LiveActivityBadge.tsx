import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, Clock } from "lucide-react";

const activities = [
  { icon: Users, text: "3 Personen vergleichen gerade in Zürich" },
  { icon: TrendingUp, text: "12 Offerten heute angefordert" },
  { icon: Clock, text: "Letzte Anfrage vor 2 Minuten" },
  { icon: Users, text: "5 Personen schauen sich Firmen an" },
  { icon: TrendingUp, text: "8 Umzüge diese Woche gebucht" },
];

export const LiveActivityBadge = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = activities[currentIndex];
  const Icon = current.icon;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs sm:text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium"
        >
          <Icon className="h-3.5 w-3.5" />
          <span>{current.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
