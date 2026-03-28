import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const directionVariants = {
  up: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
};

export const StaggeredList = memo(function StaggeredList({
  children,
  className,
  itemClassName,
  staggerDelay = 0.1,
  direction = "up"
}: StaggeredListProps) {
  const variants = directionVariants[direction];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ staggerChildren: staggerDelay }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={variants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
});
