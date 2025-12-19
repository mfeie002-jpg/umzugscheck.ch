import { useState, useEffect, useCallback, memo } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

export const ScrollToTop = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  
  // Smooth spring for progress ring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      setProgress(latest);
      setIsVisible(latest > 0.1);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Calculate stroke dashoffset for progress ring
  const circumference = 2 * Math.PI * 22; // radius = 22
  const strokeDashoffset = circumference - (circumference * progress);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40"
        >
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 rounded-full bg-card border border-border shadow-medium hover:shadow-lift transition-shadow touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Nach oben scrollen"
          >
            {/* Progress Ring SVG */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 56 56"
            >
              {/* Background circle */}
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <motion.circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-150 ease-out"
              />
            </svg>
            
            {/* Arrow Icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ y: [0, -2, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
            >
              <ArrowUp className="w-5 h-5 text-primary" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ScrollToTop.displayName = 'ScrollToTop';
