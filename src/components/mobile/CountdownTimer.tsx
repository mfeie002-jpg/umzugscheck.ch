import { motion } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown';

interface CountdownTimerProps {
  initialTime: number;
  onComplete?: () => void;
  autoStart?: boolean;
  variant?: 'default' | 'compact' | 'large';
  showControls?: boolean;
  className?: string;
}

export const CountdownTimer = ({
  initialTime,
  onComplete,
  autoStart = true,
  variant = 'default',
  showControls = false,
  className = '',
}: CountdownTimerProps) => {
  const {
    hours,
    minutes,
    seconds,
    isRunning,
    isComplete,
    formatted,
    start,
    pause,
    reset,
  } = useCountdown({
    initialTime,
    onComplete,
    autoStart,
  });

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          ${variant === 'large' ? 'text-4xl sm:text-6xl' : variant === 'compact' ? 'text-lg' : 'text-2xl sm:text-3xl'}
          font-bold tabular-nums
        `}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      {variant !== 'compact' && (
        <span className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
          {label}
        </span>
      )}
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="font-mono font-bold text-lg">{formatted.short}</span>
        {showControls && (
          <button
            onClick={isRunning ? pause : start}
            className="ml-2 text-xs text-primary hover:underline"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {initialTime >= 3600 && (
          <>
            <TimeBlock value={hours} label="Std" />
            <span className={`${variant === 'large' ? 'text-4xl' : 'text-2xl'} font-bold text-muted-foreground`}>:</span>
          </>
        )}
        <TimeBlock value={minutes} label="Min" />
        <span className={`${variant === 'large' ? 'text-4xl' : 'text-2xl'} font-bold text-muted-foreground`}>:</span>
        <TimeBlock value={seconds} label="Sek" />
      </div>

      {showControls && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={isRunning ? pause : start}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {isRunning ? 'Pause' : isComplete ? 'Neu starten' : 'Start'}
          </button>
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
