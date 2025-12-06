import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedListProps {
  items: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const AnimatedList = memo(function AnimatedList({ 
  items, 
  className,
  staggerDelay = 0.1
}: AnimatedListProps) {
  return (
    <motion.ul
      className={cn("space-y-3", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: { staggerChildren: staggerDelay }
        }
      }}
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
});
