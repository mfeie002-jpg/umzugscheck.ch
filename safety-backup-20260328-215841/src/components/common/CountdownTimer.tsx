import { memo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endDate: Date;
  className?: string;
  onComplete?: () => void;
}

export const CountdownTimer = memo(function CountdownTimer({ 
  endDate, 
  className,
  onComplete 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - Date.now();
      
      if (difference <= 0) {
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endDate, onComplete]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-2xl md:text-3xl font-bold tabular-nums bg-card rounded-lg px-3 py-2 shadow-soft">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );

  return (
    <div className={cn("flex items-center gap-2 md:gap-4", className)}>
      <TimeBlock value={timeLeft.days} label="Tage" />
      <span className="text-xl font-bold text-muted-foreground">:</span>
      <TimeBlock value={timeLeft.hours} label="Std" />
      <span className="text-xl font-bold text-muted-foreground">:</span>
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <span className="text-xl font-bold text-muted-foreground">:</span>
      <TimeBlock value={timeLeft.seconds} label="Sek" />
    </div>
  );
});
