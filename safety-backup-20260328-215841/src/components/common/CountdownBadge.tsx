import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownBadgeProps {
  targetDate: Date;
  label?: string;
  className?: string;
  onComplete?: () => void;
}

export const CountdownBadge = memo(function CountdownBadge({
  targetDate,
  label = "Angebot endet in:",
  className,
  onComplete
}: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setIsComplete(true);
        onComplete?.();
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (isComplete) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "inline-flex items-center gap-3 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full px-4 py-2 border border-secondary/20",
        className
      )}
    >
      <Clock className="w-4 h-4 text-secondary animate-pulse" />
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1 font-mono font-bold text-foreground">
        <TimeBlock value={timeLeft.hours} label="h" />
        <span className="text-muted-foreground">:</span>
        <TimeBlock value={timeLeft.minutes} label="m" />
        <span className="text-muted-foreground">:</span>
        <TimeBlock value={timeLeft.seconds} label="s" />
      </div>
    </motion.div>
  );
});

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className="inline-flex items-baseline"
  >
    <span className="text-base">{String(value).padStart(2, "0")}</span>
    <span className="text-xs text-muted-foreground ml-0.5">{label}</span>
  </motion.span>
);
