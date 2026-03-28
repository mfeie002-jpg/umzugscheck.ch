import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export const HoverScale = memo(function HoverScale({
  children,
  className,
  scale = 1.05,
  duration = 0.2
}: HoverScaleProps) {
  return (
    <motion.div
      className={cn(className)}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
});