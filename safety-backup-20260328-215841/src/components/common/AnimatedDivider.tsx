import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedDividerProps {
  className?: string;
  variant?: "line" | "dots" | "gradient" | "wave";
}

export const AnimatedDivider = memo(function AnimatedDivider({
  className,
  variant = "gradient"
}: AnimatedDividerProps) {
  if (variant === "line") {
    return (
      <motion.div
        className={cn("h-px bg-border", className)}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex justify-center gap-2", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/40"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          />
        ))}
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <svg
        className={cn("w-full h-6", className)}
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,12 C150,24 350,0 600,12 C850,24 1050,0 1200,12"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  // gradient (default)
  return (
    <motion.div
      className={cn(
        "h-px bg-gradient-to-r from-transparent via-border to-transparent",
        className
      )}
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  );
});