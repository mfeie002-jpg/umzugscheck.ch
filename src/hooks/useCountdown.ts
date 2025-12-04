import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCountdownOptions {
  initialTime: number; // seconds
  interval?: number; // milliseconds
  autoStart?: boolean;
  onComplete?: () => void;
}

export const useCountdown = ({
  initialTime,
  interval = 1000,
  autoStart = false,
  onComplete,
}: UseCountdownOptions) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setTimeLeft(newTime ?? initialTime);
    setIsRunning(false);
  }, [initialTime]);

  const restart = useCallback((newTime?: number) => {
    setTimeLeft(newTime ?? initialTime);
    setIsRunning(true);
  }, [initialTime]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, interval, onComplete]);

  // Format helpers
  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return {
    timeLeft,
    isRunning,
    isComplete: timeLeft === 0,
    days,
    hours,
    minutes,
    seconds,
    formatted: {
      full: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      short: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      minimal: `${minutes}:${String(seconds).padStart(2, '0')}`,
    },
    start,
    pause,
    reset,
    restart,
  };
};
