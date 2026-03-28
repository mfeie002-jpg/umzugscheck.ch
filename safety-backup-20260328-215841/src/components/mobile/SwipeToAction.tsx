import { useState, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Trash2, Check, Phone } from 'lucide-react';
import { useHaptic } from '@/hooks/use-haptic';

interface SwipeToActionProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: typeof Trash2;
    color: string;
    label: string;
  };
  rightAction?: {
    icon: typeof Check;
    color: string;
    label: string;
  };
}

export const SwipeToAction = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = { icon: Trash2, color: 'bg-red-500', label: 'Löschen' },
  rightAction = { icon: Check, color: 'bg-green-500', label: 'Erledigt' },
}: SwipeToActionProps) => {
  const { trigger } = useHaptic();
  const [isRevealed, setIsRevealed] = useState<'left' | 'right' | null>(null);
  const x = useMotionValue(0);
  
  const leftOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
  const rightOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x < -threshold && onSwipeLeft) {
      trigger('medium');
      onSwipeLeft();
    } else if (info.offset.x > threshold && onSwipeRight) {
      trigger('medium');
      onSwipeRight();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Left action (revealed on swipe right) */}
      {onSwipeRight && (
        <motion.div
          style={{ opacity: rightOpacity }}
          className={`absolute inset-y-0 left-0 flex items-center px-6 ${rightAction.color}`}
        >
          <div className="flex items-center gap-2 text-white">
            <rightAction.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{rightAction.label}</span>
          </div>
        </motion.div>
      )}

      {/* Right action (revealed on swipe left) */}
      {onSwipeLeft && (
        <motion.div
          style={{ opacity: leftOpacity }}
          className={`absolute inset-y-0 right-0 flex items-center px-6 ${leftAction.color}`}
        >
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-medium">{leftAction.label}</span>
            <leftAction.icon className="w-5 h-5" />
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="relative bg-background"
      >
        {children}
      </motion.div>
    </div>
  );
};
