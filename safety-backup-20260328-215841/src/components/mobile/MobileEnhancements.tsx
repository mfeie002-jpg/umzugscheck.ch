/**
 * Mobile-Optimized Components
 * 
 * Features:
 * - Pull to refresh
 * - Bottom sheets
 * - Swipe actions
 * - Safe area handling
 * - Haptic feedback
 */

import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Hook for haptic feedback (if supported)
 */
export function useHapticFeedback() {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(20), [vibrate]);
  const heavyTap = useCallback(() => vibrate([30, 10, 30]), [vibrate]);
  const success = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const error = useCallback(() => vibrate([50, 30, 50, 30, 50]), [vibrate]);

  return { vibrate, lightTap, mediumTap, heavyTap, success, error };
}

/**
 * Safe area wrapper for notch devices
 */
export const SafeAreaWrapper = memo(function SafeAreaWrapper({
  children,
  className,
  top = false,
  bottom = true,
  left = true,
  right = true,
}: {
  children: React.ReactNode;
  className?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}) {
  return (
    <div
      className={cn(className)}
      style={{
        paddingTop: top ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: bottom ? 'env(safe-area-inset-bottom)' : undefined,
        paddingLeft: left ? 'env(safe-area-inset-left)' : undefined,
        paddingRight: right ? 'env(safe-area-inset-right)' : undefined,
      }}
    >
      {children}
    </div>
  );
});

/**
 * Bottom Sheet Component
 */
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  className?: string;
}

export const BottomSheet = memo(function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
  className,
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(0);
  const y = useMotionValue(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const haptic = useHapticFeedback();

  const handleDragEnd = useCallback((_: any, info: { velocity: { y: number }; offset: { y: number } }) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (velocity > 500 || offset > 100) {
      haptic.lightTap();
      onClose();
    } else if (velocity < -500 && currentSnap < snapPoints.length - 1) {
      haptic.lightTap();
      setCurrentSnap(prev => Math.min(prev + 1, snapPoints.length - 1));
    } else if (velocity > 200 && currentSnap > 0) {
      haptic.lightTap();
      setCurrentSnap(prev => Math.max(prev - 1, 0));
    }
  }, [currentSnap, snapPoints.length, onClose, haptic]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sheetHeight = `${snapPoints[currentSnap] * 100}vh`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0, height: sheetHeight }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            style={{ y }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "bg-background rounded-t-2xl",
              "shadow-2xl",
              className
            )}
          >
            <SafeAreaWrapper bottom>
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>
              
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-4 pb-3 border-b">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              {/* Content */}
              <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: `calc(${sheetHeight} - 60px)` }}>
                {children}
              </div>
            </SafeAreaWrapper>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

/**
 * Swipeable Card
 */
export const SwipeableCard = memo(function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className,
}: {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const haptic = useHapticFeedback();

  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);

  const handleDragEnd = useCallback((_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -500) {
      haptic.mediumTap();
      onSwipeLeft?.();
    } else if (offset > threshold || velocity > 500) {
      haptic.mediumTap();
      onSwipeRight?.();
    }
  }, [onSwipeLeft, onSwipeRight, haptic]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left action background */}
      {leftAction && (
        <motion.div
          style={{ opacity: leftOpacity }}
          className="absolute inset-y-0 left-0 flex items-center px-4 bg-destructive text-destructive-foreground"
        >
          {leftAction}
        </motion.div>
      )}
      
      {/* Right action background */}
      {rightAction && (
        <motion.div
          style={{ opacity: rightOpacity }}
          className="absolute inset-y-0 right-0 flex items-center px-4 bg-green-500 text-white"
        >
          {rightAction}
        </motion.div>
      )}
      
      {/* Card content */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        className="relative bg-background"
      >
        {children}
      </motion.div>
    </div>
  );
});

/**
 * Pull indicator for refresh
 */
export const PullIndicator = memo(function PullIndicator({
  progress,
  isRefreshing,
}: {
  progress: number;
  isRefreshing: boolean;
}) {
  const rotation = useTransform(() => progress * 180);

  return (
    <motion.div
      className="flex items-center justify-center py-4"
      style={{ opacity: Math.min(progress, 1) }}
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : { rotate: progress * 180 }}
        transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: 'linear' } : { duration: 0.1 }}
      >
        <ChevronDown className="w-6 h-6 text-primary" />
      </motion.div>
    </motion.div>
  );
});
