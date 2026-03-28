/**
 * HeroLiveCounter - Compact live counter for hero form header
 * Shows "🟢 47 Personen vergleichen gerade"
 */

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';

interface HeroLiveCounterProps {
  baseValue?: number;
  label?: string;
  className?: string;
}

export const HeroLiveCounter = memo(function HeroLiveCounter({
  baseValue = 45,
  label = 'Personen vergleichen gerade',
  className = ''
}: HeroLiveCounterProps) {
  const [count, setCount] = useState(() => {
    // Check session storage for consistent count during session
    const stored = sessionStorage.getItem('uc_hero_live_count');
    if (stored) {
      return parseInt(stored, 10);
    }
    // Generate initial count with small variation
    const variation = Math.floor(Math.random() * 15) - 5; // -5 to +10
    return Math.max(12, baseValue + variation);
  });

  useEffect(() => {
    // Store initial count
    sessionStorage.setItem('uc_hero_live_count', count.toString());

    // Simulate occasional updates (every 20-45 seconds)
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newCount = Math.max(12, Math.min(99, prev + change));
        sessionStorage.setItem('uc_hero_live_count', newCount.toString());
        return newCount;
      });
    }, 20000 + Math.random() * 25000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Green pulse indicator */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Users className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="font-bold text-foreground tabular-nums"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        <span>{label}</span>
      </div>
    </div>
  );
});
