import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterHeadlineProps {
  words: string[];
  prefix?: string;
  suffix?: string;
  className?: string;
  highlightClassName?: string;
  speed?: number;
}

export const TypewriterHeadline = memo(function TypewriterHeadline({
  words,
  prefix = "",
  suffix = "",
  className,
  highlightClassName = "text-secondary",
  speed = 3000
}: TypewriterHeadlineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, speed);
    return () => clearInterval(interval);
  }, [words.length, speed]);

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      {prefix && <span>{prefix}</span>}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: 90 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={cn("inline-block", highlightClassName)}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
      {suffix && <span>{suffix}</span>}
    </span>
  );
});
