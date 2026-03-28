import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MovingCountdownProps {
  movingDate?: Date;
}

const MovingCountdown = ({ movingDate }: MovingCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!movingDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(movingDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [movingDate]);

  if (!movingDate) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4 text-center text-muted-foreground">
          <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Wählen Sie ein Umzugsdatum</p>
        </CardContent>
      </Card>
    );
  }

  const isUrgent = timeLeft.days < 7;
  const isToday = timeLeft.days === 0 && timeLeft.hours <= 24;

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      key={value}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className="text-center"
    >
      <div className={`text-2xl md:text-3xl font-bold tabular-nums ${isUrgent ? 'text-destructive' : 'text-primary'}`}>
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
    </motion.div>
  );

  return (
    <Card className={`overflow-hidden ${isUrgent ? 'border-destructive/50 bg-destructive/5' : 'border-primary/20 bg-primary/5'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isToday ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : isUrgent ? (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            ) : (
              <Clock className="w-5 h-5 text-primary" />
            )}
            <span className="font-semibold text-sm">
              {isToday ? 'Heute ist Umzugstag!' : 'Countdown zum Umzug'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {movingDate.toLocaleDateString('de-CH', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <TimeBlock value={timeLeft.days} label="Tage" />
          <TimeBlock value={timeLeft.hours} label="Std" />
          <TimeBlock value={timeLeft.minutes} label="Min" />
          <TimeBlock value={timeLeft.seconds} label="Sek" />
        </div>

        {isUrgent && !isToday && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-destructive mt-3 text-center"
          >
            ⚠️ Weniger als eine Woche! Letzte Vorbereitungen treffen.
          </motion.p>
        )}
      </CardContent>
    </Card>
  );
};

export default MovingCountdown;
