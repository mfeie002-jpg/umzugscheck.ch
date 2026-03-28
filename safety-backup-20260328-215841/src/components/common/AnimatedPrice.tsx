import { memo, useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedPriceProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

export const AnimatedPrice = memo(function AnimatedPrice({
  value,
  prefix = "CHF ",
  suffix = "",
  className,
  duration = 2
}: AnimatedPriceProps) {
  const [isInView, setIsInView] = useState(false);
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  useEffect(() => {
    return display.on("change", (v) => setDisplayValue(v));
  }, [display]);

  return (
    <motion.span
      className={cn("tabular-nums font-bold", className)}
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: true, margin: "-100px" }}
    >
      {prefix}
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {displayValue.toLocaleString("de-CH")}
      </motion.span>
      {suffix}
    </motion.span>
  );
});
