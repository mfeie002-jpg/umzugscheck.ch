import { memo, useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

interface NumberTickerProps {
  value: number;
  className?: string;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export const NumberTicker = memo(function NumberTicker({
  value,
  className,
  duration = 2,
  suffix = "",
  prefix = "",
}: NumberTickerProps) {
  const screenshotMode = isScreenshotRenderMode();

  // In screenshot mode we render the final number immediately (no viewport dependency).
  if (screenshotMode) {
    return (
      <span className={cn("tabular-nums", className)}>
        {prefix}
        {value.toLocaleString("de-CH")}
        {suffix}
      </span>
    );
  }

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
      className={cn("tabular-nums", className)}
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: true, margin: "-100px" }}
    >
      {prefix}
      {displayValue.toLocaleString("de-CH")}
      {suffix}
    </motion.span>
  );
});

