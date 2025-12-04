import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useHaptic } from '@/hooks/use-haptic';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface MobileToastProps {
  isVisible: boolean;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors: Record<ToastType, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export const MobileToast = ({
  isVisible,
  message,
  type = 'info',
  onClose,
  duration = 3000,
}: MobileToastProps) => {
  const { trigger } = useHaptic();
  const Icon = icons[type];

  useEffect(() => {
    if (isVisible) {
      trigger(type === 'success' ? 'success' : type === 'error' ? 'error' : 'light');
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose, trigger, type]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="flex items-center gap-3 p-4 bg-background rounded-xl shadow-2xl border border-border">
            <div className={`p-2 rounded-full ${colors[type]}`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
