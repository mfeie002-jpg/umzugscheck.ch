import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  showDays?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ 
  targetDate, 
  onComplete, 
  showDays = true,
  className = '' 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsComplete(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-xl font-bold text-green-500">Abgelaufen!</p>
      </div>
    );
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-14 h-14 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center"
      >
        <span className="text-xl sm:text-2xl font-bold">
          {value.toString().padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}>
      {showDays && <TimeUnit value={timeLeft.days} label="Tage" />}
      <span className="text-xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.hours} label="Std" />
      <span className="text-xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <span className="text-xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.seconds} label="Sek" />
    </div>
  );
}
