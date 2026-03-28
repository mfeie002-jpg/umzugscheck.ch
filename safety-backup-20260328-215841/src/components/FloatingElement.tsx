import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amplitude?: number;
}

const FloatingElement = ({
  children,
  className = "",
  delay = 0,
  duration = 3,
  amplitude = 10,
}: FloatingElementProps) => {
  return (
    <motion.div
      className={cn(className)}
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;
