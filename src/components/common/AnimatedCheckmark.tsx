import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCheckmarkProps {
  className?: string;
  size?: number;
  delay?: number;
}

export const AnimatedCheckmark = memo(function AnimatedCheckmark({ 
  className,
  size = 24,
  delay = 0
}: AnimatedCheckmarkProps) {
  return (
    <motion.svg
      className={cn("text-secondary", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
    >
      <motion.path
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4, ease: "easeOut" }}
      />
    </motion.svg>
  );
});
