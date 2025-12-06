import { memo, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  delay?: number;
  typingSpeed?: number;
}

export const TypewriterText = memo(({
  texts,
  className,
  delay = 3000,
  typingSpeed = 50
}: TypewriterTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const typeText = useCallback(() => {
    const text = texts[currentIndex];
    let charIndex = 0;

    setIsTyping(true);
    setDisplayText("");

    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }, delay);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [currentIndex, texts, delay, typingSpeed]);

  useEffect(() => {
    const cleanup = typeText();
    return cleanup;
  }, [typeText]);

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      <motion.span
        animate={{ opacity: isTyping ? [0, 1] : 1 }}
        transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
        className="inline-block w-0.5 h-[1em] bg-current ml-0.5 align-middle"
      />
    </span>
  );
});

TypewriterText.displayName = 'TypewriterText';
