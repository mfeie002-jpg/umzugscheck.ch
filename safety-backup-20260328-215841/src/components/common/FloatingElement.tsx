import { memo, ReactNode } from "react";
import { motion } from "framer-motion";

interface FloatingElementProps {
  children: ReactNode;
  duration?: number;
  distance?: number;
  delay?: number;
  className?: string;
}

/**
 * Animated floating element wrapper
 */
export const FloatingElement = memo(({ 
  children, 
  duration = 3,
  distance = 8,
  delay = 0,
  className = ""
}: FloatingElementProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
});

FloatingElement.displayName = 'FloatingElement';
