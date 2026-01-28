import { ReactNode, useRef, useState, useCallback, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  snapPoints?: number[];
}

export default function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  title,
  snapPoints = [0.5, 0.9]
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const startHeight = useRef<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startHeight.current = sheetRef.current?.offsetHeight || 0;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!startY.current || !sheetRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 100) {
      // Dragged down significantly - close or snap to lower point
      if (currentSnap === 0) {
        onClose();
      } else {
        setCurrentSnap(Math.max(0, currentSnap - 1));
      }
      startY.current = null;
    } else if (diff < -100) {
      // Dragged up - snap to higher point
      setCurrentSnap(Math.min(snapPoints.length - 1, currentSnap + 1));
      startY.current = null;
    }
  }, [currentSnap, snapPoints.length, onClose]);

  const handleTouchEnd = useCallback(() => {
    startY.current = null;
  }, []);

  const currentHeight = `${snapPoints[currentSnap] * 100}vh`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0, height: currentHeight }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 shadow-2xl overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 pb-3 border-b">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <Button variant="ghost" size="icon" className="h-10 w-10 touch-manipulation" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-auto flex-1 pb-safe overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}