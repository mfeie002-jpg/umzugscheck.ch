import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeNavigation } from '@/hooks/use-swipe-navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SwipeNavigationWrapperProps {
  children: ReactNode;
}

const pageNames: Record<string, string> = {
  '/': 'Home',
  '/umzugsrechner': 'Rechner',
  '/umzugsofferten': 'Offerten',
  '/umzugsfirmen': 'Firmen',
  '/dienstleistungen': 'Services',
  '/regionen': 'Regionen',
  '/ratgeber': 'Ratgeber',
};

export const SwipeNavigationWrapper = ({ children }: SwipeNavigationWrapperProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { 
    swipeHandlers, 
    canSwipeLeft, 
    canSwipeRight, 
    currentIndex, 
    totalPages,
    nextPage,
    prevPage 
  } = useSwipeNavigation();

  // Wenn nicht mobile oder auf deaktivierten Routen: Children normal rendern ohne Wrapper
  const disabledRoutes = ['/flow-tester', '/capture', '/admin'];
  const isDisabled = !isMobile || disabledRoutes.some(route => location.pathname.startsWith(route));
  
  if (isDisabled) {
    return <>{children}</>;
  }

  const isInNavigation = currentIndex !== -1;

  return (
    <div {...swipeHandlers} className="min-h-full">
      {/* Swipe Indicators */}
      {isInNavigation && (
        <>
          {/* Left indicator */}
          <AnimatePresence>
            {canSwipeRight && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="fixed left-0 top-1/2 z-30 -translate-y-1/2 md:hidden"
              >
                <div className="flex items-center gap-1 rounded-r-full bg-background/80 py-3 pl-1 pr-3 shadow-lg backdrop-blur-sm">
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {prevPage && pageNames[prevPage]}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right indicator */}
          <AnimatePresence>
            {canSwipeLeft && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="fixed right-0 top-1/2 z-30 -translate-y-1/2 md:hidden"
              >
                <div className="flex items-center gap-1 rounded-l-full bg-background/80 py-3 pl-3 pr-1 shadow-lg backdrop-blur-sm">
                  <span className="text-xs text-muted-foreground">
                    {nextPage && pageNames[nextPage]}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page indicator dots */}
          <div className="fixed bottom-32 left-1/2 z-30 -translate-x-1/2 md:hidden">
            <div className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-2 shadow-lg backdrop-blur-sm">
              {Array.from({ length: totalPages }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === currentIndex 
                      ? "w-4 bg-primary" 
                      : "w-1.5 bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Content with page transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
