import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedCheckListProps {
  items: string[];
  className?: string;
  checkColor?: string;
  staggerDelay?: number;
}

export const AnimatedCheckList = memo(function AnimatedCheckList({
  items,
  className,
  checkColor = "text-green-500",
  staggerDelay = 0.1
}: AnimatedCheckListProps) {
  return (
    <motion.ul
      className={cn("space-y-3", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: staggerDelay }}
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          className="flex items-start gap-3"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * staggerDelay + 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className={cn("w-5 h-5 flex-shrink-0 mt-0.5", checkColor)} />
          </motion.div>
          <span className="text-muted-foreground">{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
});
