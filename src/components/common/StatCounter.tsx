import { useEffect, useRef, useState, memo } from "react";
import { useInView } from "framer-motion";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Animated counter component for stats display
 * Optimized with memo and efficient animation loop
 */
export const StatCounter = memo(({ 
  value, 
  suffix = "", 
  prefix = "",
  decimals = 0,
  duration = 2,
  className = ""
}: StatCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = easeOut * value;
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  const formattedValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString("de-CH");

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
});

StatCounter.displayName = 'StatCounter';
