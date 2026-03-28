import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Users, TrendingUp } from "lucide-react";

interface UrgencyBadgeProps {
  variant?: 'time' | 'demand' | 'savings' | 'users';
  className?: string;
}

/**
 * Urgency badges to encourage immediate action
 * Shows time-sensitive messaging and social proof
 */
export const UrgencyBadge = memo(function UrgencyBadge({
  variant = 'time',
  className = '',
}: UrgencyBadgeProps) {
  const [activeUsers, setActiveUsers] = useState(3);

  useEffect(() => {
    // Simulate live user count (2-6 users)
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 5) + 2);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const variants = {
    time: {
      icon: Clock,
      text: "In 2 Minuten erledigt",
      subtext: "Schnell & einfach",
      bgColor: "bg-green-500/10",
      textColor: "text-green-700 dark:text-green-400",
      borderColor: "border-green-500/20",
    },
    demand: {
      icon: TrendingUp,
      text: "Hohe Nachfrage",
      subtext: "Jetzt anfragen",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-700 dark:text-amber-400",
      borderColor: "border-amber-500/20",
    },
    savings: {
      icon: Zap,
      text: "Bis zu 40% sparen",
      subtext: "Garantiert bester Preis",
      bgColor: "bg-secondary/10",
      textColor: "text-secondary",
      borderColor: "border-secondary/20",
    },
    users: {
      icon: Users,
      text: `${activeUsers} Personen vergleichen gerade`,
      subtext: "Live-Aktivität",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      borderColor: "border-primary/20",
      isLive: true,
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 ${config.bgColor} ${config.textColor} rounded-full px-3 py-1.5 border ${config.borderColor} ${className}`}
    >
      {'isLive' in config && config.isLive && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {!('isLive' in config) && <Icon className="w-3.5 h-3.5" />}
      <span className="text-sm font-medium">{config.text}</span>
    </motion.div>
  );
});

/**
 * Countdown timer for limited-time offers
 */
interface CountdownTimerProps {
  endTime?: Date;
  message?: string;
  className?: string;
}

export const UrgencyCountdown = memo(function UrgencyCountdown({
  message = "Angebot endet in",
  className = '',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-3 bg-secondary/10 text-secondary rounded-lg px-4 py-2 border border-secondary/20 ${className}`}
    >
      <Clock className="w-4 h-4" />
      <span className="text-sm font-medium">{message}</span>
      <div className="flex items-center gap-1 font-mono font-bold">
        <span className="bg-secondary/20 px-1.5 py-0.5 rounded">{formatNumber(timeLeft.hours)}</span>
        <span>:</span>
        <span className="bg-secondary/20 px-1.5 py-0.5 rounded">{formatNumber(timeLeft.minutes)}</span>
        <span>:</span>
        <span className="bg-secondary/20 px-1.5 py-0.5 rounded">{formatNumber(timeLeft.seconds)}</span>
      </div>
    </motion.div>
  );
});
