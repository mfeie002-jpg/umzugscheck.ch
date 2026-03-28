import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipePageIndicatorProps {
  currentIndex: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const SwipePageIndicator = ({
  currentIndex,
  totalPages,
  canGoNext,
  canGoPrevious,
}: SwipePageIndicatorProps) => {
  if (currentIndex === -1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border lg:hidden"
    >
      {canGoPrevious && (
        <ChevronLeft className="w-4 h-4 text-muted-foreground animate-pulse" />
      )}
      
      <div className="flex gap-1.5">
        {Array.from({ length: totalPages }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex 
                ? 'w-4 bg-primary' 
                : 'w-1.5 bg-muted-foreground/30'
            }`}
            layoutId={`page-dot-${i}`}
          />
        ))}
      </div>

      {canGoNext && (
        <ChevronRight className="w-4 h-4 text-muted-foreground animate-pulse" />
      )}
    </motion.div>
  );
};
