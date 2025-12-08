import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface AnimatedCheckProps {
  className?: string;
  size?: number;
  delay?: number;
  color?: string;
}

export const AnimatedCheck = memo(function AnimatedCheck({
  className,
  size = 24,
  delay = 0,
  color = "text-green-500"
}: AnimatedCheckProps) {
  return (
    <motion.div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-green-500/10",
        color,
        className
      )}
      style={{ width: size, height: size }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay
      }}
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
      >
        <Check className="w-[60%] h-[60%]" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
});