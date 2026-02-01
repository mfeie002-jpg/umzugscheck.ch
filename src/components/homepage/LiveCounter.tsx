/**
 * LiveCounter - Animated counter with realistic increments
 * Creates perception of live activity on the platform
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiveCounterProps {
  baseValue: number;
  incrementPerHour?: number;
  label: string;
  className?: string;
  showPulse?: boolean;
  format?: "number" | "swiss"; // Swiss = 15'000 format
}

export const LiveCounter = memo(function LiveCounter({
  baseValue,
  incrementPerHour = 2,
  label,
  className,
  showPulse = true,
  format = "swiss",
}: LiveCounterProps) {
  const [currentValue, setCurrentValue] = useState(baseValue);
  const [isIncrementing, setIsIncrementing] = useState(false);

  // Calculate initial value based on time of day
  useEffect(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const hoursSinceStart = (now.getTime() - startOfDay.getTime()) / (1000 * 60 * 60);
    const dailyIncrement = Math.floor(hoursSinceStart * incrementPerHour);
    setCurrentValue(baseValue + dailyIncrement);
  }, [baseValue, incrementPerHour]);

  // Simulate realistic increments
  useEffect(() => {
    const interval = setInterval(() => {
      // Random increment every 30-90 seconds
      if (Math.random() > 0.5) {
        setIsIncrementing(true);
        setCurrentValue((prev) => prev + 1);
        setTimeout(() => setIsIncrementing(false), 500);
      }
    }, 30000 + Math.random() * 60000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (format === "swiss") {
      return num.toLocaleString("de-CH").replace(/,/g, "'");
    }
    return num.toLocaleString();
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {/* Pulse indicator */}
      {showPulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      
      {/* Counter */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentValue}
          initial={isIncrementing ? { y: -10, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          className="font-bold tabular-nums"
        >
          {formatNumber(currentValue)}
        </motion.span>
      </AnimatePresence>
      
      {/* Label */}
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
});

export default LiveCounter;
