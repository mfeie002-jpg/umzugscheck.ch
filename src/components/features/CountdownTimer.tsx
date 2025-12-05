import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CountdownTimerProps {
  endDate: Date;
  title?: string;
  description?: string;
  type?: 'offer' | 'booking' | 'warning';
}

export const CountdownTimer = ({ 
  endDate, 
  title = "Angebot endet in",
  description,
  type = 'offer'
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const getTypeStyles = () => {
    switch (type) {
      case 'offer':
        return 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20';
      case 'booking':
        return 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20';
      case 'warning':
        return 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20';
      default:
        return 'bg-muted';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'offer':
        return <Gift className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="w-14 h-14 md:w-16 md:h-16 bg-background rounded-lg shadow-sm flex items-center justify-center"
      >
        <span className="text-2xl md:text-3xl font-bold tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );

  return (
    <div className={`rounded-xl p-4 md:p-6 border ${getTypeStyles()}`}>
      <div className="flex items-center gap-2 mb-4">
        {getIcon()}
        <span className="font-semibold">{title}</span>
        {type === 'offer' && (
          <Badge className="ml-auto bg-green-500">Limitiert</Badge>
        )}
      </div>

      <div className="flex justify-center gap-3 md:gap-4">
        <TimeBox value={timeLeft.days} label="Tage" />
        <div className="text-2xl font-bold self-center text-muted-foreground">:</div>
        <TimeBox value={timeLeft.hours} label="Std" />
        <div className="text-2xl font-bold self-center text-muted-foreground">:</div>
        <TimeBox value={timeLeft.minutes} label="Min" />
        <div className="text-2xl font-bold self-center text-muted-foreground hidden md:block">:</div>
        <div className="hidden md:block">
          <TimeBox value={timeLeft.seconds} label="Sek" />
        </div>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          {description}
        </p>
      )}
    </div>
  );
};
