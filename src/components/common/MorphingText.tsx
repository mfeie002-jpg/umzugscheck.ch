import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MorphingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export const MorphingText = memo(function MorphingText({
  texts,
  className,
  interval = 3000
}: MorphingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={cn("relative inline-block overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ 
            opacity: 0, 
            y: 20,
            filter: "blur(10px)"
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            filter: "blur(0px)"
          }}
          exit={{ 
            opacity: 0, 
            y: -20,
            filter: "blur(10px)"
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
});
