/**
 * HeroLiveActivityLine.tsx
 * 
 * Displays rotating live activity message: "🟢 Letzte Anfrage: Genf → Zug vor 8 Min"
 * 
 * Features:
 * - Auto-rotates every 5-6 seconds (fade transition)
 * - Green pulse dot + map icons
 * - Swiss cities + realistic time ranges
 * - Mobile-optimized (single line, no wrap)
 * 
 * Usage (place under CTA button):
 * ```tsx
 * <HeroLiveActivityLine />
 * ```
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

interface Activity {
  from: string;
  to: string;
  minutesAgo: number;
}

// Realistic Swiss moving routes
const ACTIVITIES: Activity[] = [
  { from: "Zürich", to: "Bern", minutesAgo: 3 },
  { from: "Basel", to: "Zürich", minutesAgo: 8 },
  { from: "Genf", to: "Lausanne", minutesAgo: 2 },
  { from: "Luzern", to: "Bern", minutesAgo: 6 },
  { from: "St. Gallen", to: "Zürich", minutesAgo: 1 },
  { from: "Winterthur", to: "Bern", minutesAgo: 5 },
  { from: "Lugano", to: "Zürich", minutesAgo: 7 },
  { from: "Chur", to: "Schaffhausen", minutesAgo: 4 },
  { from: "Neuenburg", to: "Freiburg", minutesAgo: 9 },
  { from: "Solothurn", to: "Liestal", minutesAgo: 2 },
];

const ROTATION_INTERVAL = 5000; // 5 seconds

export const HeroLiveActivityLine = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const loadTimer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    const rotationTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(rotationTimer);
  }, []);

  const currentActivity = ACTIVITIES[currentIndex];

  if (isLoading) {
    return (
      <div className="h-5 w-full max-w-xs bg-gray-200 rounded animate-pulse" />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        {/* Green pulse dot */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"
        />

        {/* Activity text */}
        <span>Letzte Anfrage:</span>
        
        {/* Route */}
        <div className="flex items-center gap-0.5 font-medium">
          <span>{currentActivity.from}</span>
          <span className="text-muted-foreground">→</span>
          <span>{currentActivity.to}</span>
        </div>

        <span className="text-muted-foreground">·</span>

        {/* Time ago */}
        <div className="flex items-center gap-0.5">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span>vor {currentActivity.minutesAgo} Min</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
