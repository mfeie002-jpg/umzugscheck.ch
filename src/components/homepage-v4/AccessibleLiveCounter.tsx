/**
 * Accessible Live Counter V4 - With proper ARIA labels
 * Addresses gap: "ARIA-Labels zu interaktiven Elementen hinzufügen"
 */
import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessibleLiveCounterProps {
  baseValue: number;
  label: string;
  incrementPerMinute?: number;
}

export const AccessibleLiveCounter = memo(function AccessibleLiveCounter({
  baseValue,
  label,
  incrementPerMinute = 0.5,
}: AccessibleLiveCounterProps) {
  const [count, setCount] = useState(baseValue);

  useEffect(() => {
    // Calculate initial value based on time of day
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minutesSinceStart = (now.getTime() - startOfDay.getTime()) / (1000 * 60);
    const dailyIncrement = Math.floor(minutesSinceStart * incrementPerMinute);
    setCount(baseValue + dailyIncrement);

    // Simulate live increments
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCount((prev) => prev + 1);
      }
    }, 30000 + Math.random() * 60000);

    return () => clearInterval(interval);
  }, [baseValue, incrementPerMinute]);

  const formattedCount = count.toLocaleString('de-CH');

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${formattedCount} ${label}`}
      className="inline-flex items-center gap-2"
    >
      {/* Pulse Indicator */}
      <span 
        className="relative flex h-2 w-2"
        aria-hidden="true"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>

      {/* Counter */}
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-bold tabular-nums"
        >
          {formattedCount}
        </motion.span>
      </AnimatePresence>

      {/* Label */}
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
});
