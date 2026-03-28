import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface RegionLiveCounterProps {
  region: string;
  baseCount: number;
}

export const RegionLiveCounter = memo(({ region, baseCount }: RegionLiveCounterProps) => {
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    // Store initial count in sessionStorage to keep it consistent during session
    const storageKey = `live_count_${region}`;
    const storedCount = sessionStorage.getItem(storageKey);
    
    if (storedCount) {
      setCount(parseInt(storedCount, 10));
    } else {
      // Add small random variation (-2 to +3)
      const variation = Math.floor(Math.random() * 6) - 2;
      const newCount = Math.max(5, baseCount + variation);
      setCount(newCount);
      sessionStorage.setItem(storageKey, newCount.toString());
    }

    // Simulate occasional updates (every 30-60 seconds)
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 3) - 1;
      setCount(prev => {
        const newCount = Math.max(5, prev + variation);
        sessionStorage.setItem(storageKey, newCount.toString());
        return newCount;
      });
    }, 30000 + Math.random() * 30000);

    return () => clearInterval(interval);
  }, [region, baseCount]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-full px-4 py-2 mb-4"
    >
      {/* Pulsing Dot */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
      </span>
      
      <Users className="w-4 h-4 text-green-600" />
      
      <span className="text-sm font-medium text-green-700 dark:text-green-400">
        <span className="font-bold">{count}</span> Personen vergleichen gerade in {region}
      </span>
    </motion.div>
  );
});

RegionLiveCounter.displayName = 'RegionLiveCounter';
