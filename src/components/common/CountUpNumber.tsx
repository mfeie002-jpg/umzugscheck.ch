import { memo, useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface CountUpNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export const CountUpNumber = memo(({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  decimals = 0,
  className = ""
}: CountUpNumberProps) => {
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
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(easeOut * value);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString("de-CH");

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
});

CountUpNumber.displayName = 'CountUpNumber';
