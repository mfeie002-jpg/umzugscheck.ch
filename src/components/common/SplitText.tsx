import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
}

export const SplitText = memo(function SplitText({
  text,
  className,
  charClassName,
  delay = 0
}: SplitTextProps) {
  const chars = text.split("");

  return (
    <span className={cn("inline-flex", className)} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className={cn("inline-block", charClassName)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.3,
            delay: delay + i * 0.02,
            ease: "easeOut"
          }}
          aria-hidden
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
});
