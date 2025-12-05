import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

export const CountdownTimer = ({ targetDate, label = "Angebot endet in" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <motion.div
        key={value}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="bg-card border border-border rounded-lg p-2 min-w-[50px]"
      >
        <span className="text-xl font-bold text-foreground">{String(value).padStart(2, "0")}</span>
      </motion.div>
      <span className="text-xs text-muted-foreground mt-1 block">{label}</span>
    </div>
  );

  return (
    <div className="text-center">
      {label && <p className="text-sm text-muted-foreground mb-3">{label}</p>}
      <div className="flex items-center justify-center gap-2">
        <TimeBlock value={timeLeft.days} label="Tage" />
        <span className="text-xl font-bold text-muted-foreground">:</span>
        <TimeBlock value={timeLeft.hours} label="Std" />
        <span className="text-xl font-bold text-muted-foreground">:</span>
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <span className="text-xl font-bold text-muted-foreground">:</span>
        <TimeBlock value={timeLeft.seconds} label="Sek" />
      </div>
    </div>
  );
};
