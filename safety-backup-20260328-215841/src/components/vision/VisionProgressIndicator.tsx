/**
 * VisionProgressIndicator - Reading progress bar
 * Shows how far user has scrolled through the page
 */

import { memo, useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface VisionProgressIndicatorProps {
  showPercentage?: boolean;
}

export const VisionProgressIndicator = memo(({ showPercentage = false }: VisionProgressIndicatorProps) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [percentage, setPercentage] = useState(0);
  
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);
  
  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      {/* Percentage Badge (optional) */}
      {showPercentage && percentage > 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 z-[60] bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg"
        >
          {percentage}%
        </motion.div>
      )}
    </>
  );
});

VisionProgressIndicator.displayName = 'VisionProgressIndicator';
