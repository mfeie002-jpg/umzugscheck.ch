/**
 * HeroLiveCounter.tsx
 * 
 * Displays animated live counter: "🟢 47 Personen vergleichen gerade"
 * 
 * Behavior:
 * - Pseudo-live: realistic range (35-75) with gentle drift every 10-15 seconds
 * - Pulse animation on green dot
 * - Fallback: no backend required, works offline
 * 
 * Usage:
 * ```tsx
 * <HeroLiveCounter />
 * ```
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MIN_ACTIVE = 35;
const MAX_ACTIVE = 75;
const DRIFT_INTERVAL = 10000; // 10 seconds

export const HeroLiveCounter = () => {
  const [activeCount, setActiveCount] = useState<number | null>(null);

  useEffect(() => {
    // Initialize with random value in range
    setActiveCount(Math.floor(Math.random() * (MAX_ACTIVE - MIN_ACTIVE + 1) + MIN_ACTIVE));

    // Update with gentle drift every 10s
    const interval = setInterval(() => {
      setActiveCount((prev) => {
        if (prev === null) return MIN_ACTIVE;
        // Gentle drift: ±3 to ±8
        const drift = Math.floor(Math.random() * 12) - 6;
        const newValue = Math.max(MIN_ACTIVE, Math.min(MAX_ACTIVE, prev + drift));
        return newValue;
      });
    }, DRIFT_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (activeCount === null) {
    // Skeleton while loading
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground h-6">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      {/* Green pulse dot */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"
      />
      
      {/* Text */}
      <span className="font-medium">
        {activeCount} Personen vergleichen gerade
      </span>
    </motion.div>
  );
};
