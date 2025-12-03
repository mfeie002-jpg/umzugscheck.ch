import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export const AnimatedNumber = ({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
  decimals = 0
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      const startTime = Date.now();
      const endValue = value;

      const animate = () => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = easeOut * endValue;
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  const formattedValue = displayValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, "'");

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className={className}
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  );
};
