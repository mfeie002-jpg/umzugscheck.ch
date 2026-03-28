/**
 * Urgency Indicators
 * 
 * Psychological triggers to increase conversion:
 * - Limited availability
 * - Time-sensitive offers
 * - Social proof counters
 * - Scarcity signals
 */

import { memo, useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, AlertCircle, Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Live activity counter
 */
export const LiveActivityCounter = memo(function LiveActivityCounter({
  className,
}: {
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simulate realistic activity (12-28 active users)
    const base = 12 + Math.floor(Math.random() * 8);
    setCount(base);

    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(8, Math.min(35, newCount));
      });
    }, 5000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-green-500/10 text-green-700 text-sm font-medium",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <Users className="w-4 h-4" />
      <span>{count} Personen suchen gerade</span>
    </motion.div>
  );
});

/**
 * Limited slots indicator
 */
export const LimitedSlotsIndicator = memo(function LimitedSlotsIndicator({
  totalSlots = 5,
  takenSlots = 3,
  className,
}: {
  totalSlots?: number;
  takenSlots?: number;
  className?: string;
}) {
  const remaining = totalSlots - takenSlots;
  const isLow = remaining <= 2;

  return (
    <motion.div 
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
        isLow ? "bg-orange-500/10 text-orange-700" : "bg-primary/10 text-primary",
        "text-sm font-medium",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {isLow && <Flame className="w-4 h-4" />}
      <span>
        Nur noch <strong>{remaining}</strong> von {totalSlots} Plätzen frei
      </span>
    </motion.div>
  );
});

/**
 * Time-sensitive offer banner
 */
export const TimeSensitiveBanner = memo(function TimeSensitiveBanner({
  endTime,
  message,
  className,
}: {
  endTime: Date;
  message?: string;
  className?: string;
}) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Abgelaufen');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <motion.div 
      className={cn(
        "flex items-center justify-center gap-3 px-4 py-2",
        "bg-gradient-to-r from-secondary/90 to-secondary text-secondary-foreground",
        "text-sm font-medium",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Clock className="w-4 h-4" />
      <span>{message || 'Angebot endet in'}</span>
      <span className="font-bold tabular-nums">{timeLeft}</span>
    </motion.div>
  );
});

/**
 * Recent activity notification
 */
export const RecentActivityNotification = memo(function RecentActivityNotification({
  city,
  timeAgo,
  className,
}: {
  city: string;
  timeAgo: string;
  className?: string;
}) {
  return (
    <motion.div 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg",
        "bg-card border border-border shadow-lg",
        "text-sm",
        className
      )}
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
    >
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
        <TrendingUp className="w-4 h-4 text-green-600" />
      </div>
      <div>
        <p className="font-medium">Neue Anfrage aus {city}</p>
        <p className="text-muted-foreground text-xs">{timeAgo}</p>
      </div>
    </motion.div>
  );
});

/**
 * Demand indicator for specific dates
 */
export const DemandIndicator = memo(function DemandIndicator({
  level,
  date,
  className,
}: {
  level: 'low' | 'medium' | 'high';
  date?: string;
  className?: string;
}) {
  const config = {
    low: {
      color: 'text-green-600 bg-green-500/10',
      label: 'Geringe Nachfrage',
      icon: Calendar,
      message: 'Gute Verfügbarkeit',
    },
    medium: {
      color: 'text-yellow-600 bg-yellow-500/10',
      label: 'Mittlere Nachfrage',
      icon: TrendingUp,
      message: 'Bald buchen',
    },
    high: {
      color: 'text-red-600 bg-red-500/10',
      label: 'Hohe Nachfrage',
      icon: Flame,
      message: 'Schnell buchen!',
    },
  };

  const { color, label, icon: Icon, message } = config[level];

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md", color)}>
        <Icon className="w-4 h-4" />
        <span className="font-medium">{label}</span>
      </div>
      {date && (
        <span className="text-muted-foreground">
          für {date} – {message}
        </span>
      )}
    </div>
  );
});

/**
 * Trust badge with micro-animation
 */
export const AnimatedTrustBadge = memo(function AnimatedTrustBadge({
  icon: Icon,
  text,
  className,
}: {
  icon: React.ElementType;
  text: string;
  className?: string;
}) {
  return (
    <motion.div 
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "bg-primary/5 text-primary text-sm font-medium",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </motion.div>
  );
});
