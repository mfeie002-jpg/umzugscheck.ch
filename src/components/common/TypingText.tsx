import { memo, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
}

export const TypingText = memo(function TypingText({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true
}: TypingTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const startTyping = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startTyping);
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} className={cn(className)}>
      {displayedText}
      {cursor && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current ml-1"
          animate={{ opacity: isTyping ? 1 : [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: isTyping ? 0 : Infinity,
            repeatType: "reverse"
          }}
        />
      )}
    </span>
  );
});