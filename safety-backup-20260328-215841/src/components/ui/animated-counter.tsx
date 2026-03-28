import { memo, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  /** Target value to count to */
  value?: number;
  /** Alternative prop name for value (backwards compatibility) */
  end?: number;
  /** Alternative prop name for value (backwards compatibility) */
  to?: number;
  /** Starting value (default: 0) */
  from?: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Prefix before the number */
  prefix?: string;
  /** Suffix after the number */
  suffix?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Custom formatter function */
  formatter?: (value: number) => string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to start animation on viewport entry (default: true) */
  startOnView?: boolean;
  /** Intersection observer threshold */
  threshold?: number;
}

/**
 * Canonical animated counter component.
 * Consolidates: AnimatedNumber, CountUp, CountUpNumber, NumberTicker
 * 
 * @example
 * <AnimatedCounter value={1234} suffix="+" />
 * <AnimatedCounter end={1234} suffix="+" /> // backwards compatible
 * <AnimatedCounter value={99.9} decimals={1} prefix="CHF " />
 */
export const AnimatedCounter = memo(function AnimatedCounter({
  value,
  end,
  to,
  from = 0,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatter,
  className,
  startOnView = true,
  threshold = 0.5,
}: AnimatedCounterProps) {
  // Support multiple prop names for target value (backwards compatibility)
  const targetValue = value ?? end ?? to ?? 0;
  
  const [count, setCount] = useState(from);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(targetValue);
      return;
    }

    if (!startOnView) {
      animateCounter();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounter();
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [targetValue, startOnView, hasAnimated, threshold]);

  const animateCounter = () => {
    const startTime = performance.now();
    const diff = targetValue - from;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + diff * eased;
      
      // Handle decimal precision
      const precisionMultiplier = Math.pow(10, decimals);
      setCount(Math.round(current * precisionMultiplier) / precisionMultiplier);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    requestAnimationFrame(animate);
  };

  // Format display value
  const displayValue = formatter 
    ? formatter(count)
    : decimals > 0
      ? count.toFixed(decimals)
      : count.toLocaleString('de-CH');

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}{displayValue}{suffix}
    </span>
  );
});

// Re-export for backwards compatibility
export { AnimatedCounter as CountUp };
export { AnimatedCounter as AnimatedNumber };
export { AnimatedCounter as NumberTicker };
export { AnimatedCounter as CountUpNumber };
