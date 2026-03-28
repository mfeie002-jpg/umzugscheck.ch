import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIdleDetection } from '@/hooks/useIdleDetection';

interface IdleWarningProps {
  warningTimeout?: number; // Show warning after X ms
  logoutTimeout?: number; // Auto action after X ms
  onTimeout?: () => void;
  message?: string;
}

export const IdleWarning = ({
  warningTimeout = 5 * 60 * 1000, // 5 minutes
  logoutTimeout = 30 * 1000, // 30 seconds after warning
  onTimeout,
  message = 'Sie waren eine Weile inaktiv',
}: IdleWarningProps) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(Math.floor(logoutTimeout / 1000));

  const { isIdle } = useIdleDetection({
    timeout: warningTimeout,
    onIdle: () => setShowWarning(true),
    onActive: () => {
      setShowWarning(false);
      setCountdown(Math.floor(logoutTimeout / 1000));
    },
  });

  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onTimeout?.();
          setShowWarning(false);
          return Math.floor(logoutTimeout / 1000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning, logoutTimeout, onTimeout]);

  const handleStayActive = () => {
    setShowWarning(false);
    setCountdown(Math.floor(logoutTimeout / 1000));
  };

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <button
                onClick={handleStayActive}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-2">{message}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Ihre Sitzung wird in{' '}
              <span className="font-bold text-foreground">{countdown}</span>{' '}
              Sekunden beendet.
            </p>

            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <motion.div
                className="bg-amber-500 h-2 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${(countdown / (logoutTimeout / 1000)) * 100}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>

            <Button
              onClick={handleStayActive}
              className="w-full"
            >
              Aktiv bleiben
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
