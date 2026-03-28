import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Users, AlertCircle } from "lucide-react";

export const ZuerichUrgencyBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 45, seconds: 30 });
  const [activeUsers, setActiveUsers] = useState(18);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => Math.max(12, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground py-2 px-4"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Angebot endet in:</span>
          <span className="font-mono font-bold">
            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span>
            <strong>15%</strong> Rabatt bei Buchung heute
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="flex items-center gap-1">
            <motion.span
              key={activeUsers}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="font-bold"
            >
              {activeUsers}
            </motion.span>
            Personen schauen gerade
          </span>
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};
