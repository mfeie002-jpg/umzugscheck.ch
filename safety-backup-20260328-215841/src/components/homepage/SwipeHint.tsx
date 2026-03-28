/**
 * SwipeHint - Visual indicator for horizontal swipe gestures
 * Shows once per session to educate users about swipeable content
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeHintProps {
  direction?: "horizontal" | "vertical";
  showOnce?: boolean;
  sessionKey?: string;
  delay?: number;
  className?: string;
}

export const SwipeHint = memo(function SwipeHint({
  direction = "horizontal",
  showOnce = true,
  sessionKey = "swipe_hint_shown",
  delay = 1000,
  className,
}: SwipeHintProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    if (showOnce) {
      const wasShown = sessionStorage.getItem(sessionKey);
      if (wasShown) return;
    }

    // Show after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Hide after animation
      setTimeout(() => {
        setIsVisible(false);
        if (showOnce) {
          sessionStorage.setItem(sessionKey, "true");
        }
      }, 2500);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, sessionKey, showOnce]);

  if (direction === "vertical") {
    return null; // Not implemented yet
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-0 pointer-events-none z-10 flex items-center justify-center",
            className
          )}
        >
          {/* Swipe animation */}
          <motion.div
            initial={{ x: 0, opacity: 0.8 }}
            animate={{ x: [-20, 20, -20], opacity: [0.8, 1, 0.8] }}
            transition={{ 
              duration: 1.5, 
              repeat: 1,
              ease: "easeInOut"
            }}
            className="flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 border border-border shadow-lg"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Wischen zum Entdecken</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default SwipeHint;
