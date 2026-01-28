import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SwipeNavIndicatorProps {
  prevPage?: { path: string; label: string };
  nextPage?: { path: string; label: string };
  currentLabel: string;
}

export default function SwipeNavIndicator({ prevPage, nextPage, currentLabel }: SwipeNavIndicatorProps) {
  return (
    <div className="fixed bottom-20 left-0 right-0 z-30 md:hidden pointer-events-none">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Previous page indicator */}
          <AnimatePresence>
            {prevPage && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="pointer-events-auto"
              >
                <Link 
                  to={prevPage.path}
                  className="flex items-center gap-1 px-3 py-2 bg-background/80 backdrop-blur-sm rounded-full border shadow-md text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden xs:inline">{prevPage.label}</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current page indicator */}
          <div className="flex-1 flex justify-center">
            <div className="px-3 py-1.5 bg-primary/10 backdrop-blur-sm rounded-full text-xs font-medium text-primary">
              {currentLabel}
            </div>
          </div>

          {/* Next page indicator */}
          <AnimatePresence>
            {nextPage && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="pointer-events-auto"
              >
                <Link 
                  to={nextPage.path}
                  className="flex items-center gap-1 px-3 py-2 bg-background/80 backdrop-blur-sm rounded-full border shadow-md text-xs"
                >
                  <span className="hidden xs:inline">{nextPage.label}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Swipe hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-2"
        >
          <span className="text-[10px] text-muted-foreground bg-background/60 px-2 py-0.5 rounded-full">
            ← Wischen für Navigation →
          </span>
        </motion.div>
      </div>
    </div>
  );
}