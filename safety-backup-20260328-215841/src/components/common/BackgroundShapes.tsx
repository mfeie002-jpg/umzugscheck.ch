import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundShapesProps {
  variant?: "hero" | "section" | "minimal";
  className?: string;
}

export const BackgroundShapes = memo(({
  variant = "section",
  className
}: BackgroundShapesProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (variant === "minimal") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
        <div className="absolute top-20 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
        {/* Large primary circle */}
        <motion.div
          className="absolute top-[5%] left-[0%] w-48 h-48 md:w-72 md:h-72 rounded-full bg-primary/15 blur-3xl"
          animate={prefersReducedMotion ? {} : {
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Secondary circle */}
        <motion.div
          className="absolute top-[15%] right-[5%] w-40 h-40 md:w-64 md:h-64 rounded-full bg-secondary/20 blur-3xl"
          animate={prefersReducedMotion ? {} : {
            y: [0, 25, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Bottom accent */}
        <motion.div
          className="absolute bottom-[15%] left-[10%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-destructive/15 blur-2xl"
          animate={prefersReducedMotion ? {} : {
            y: [0, -35, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Floating particles */}
        {!prefersReducedMotion && [...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
            style={{
              left: `${10 + (i * 10) % 80}%`,
              top: `${15 + (i * 12) % 70}%`,
            }}
            animate={{
              y: [0, -30 - (i * 5), 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  // Default section variant
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      {/* Subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} 
        aria-hidden="true" 
      />
    </div>
  );
});

BackgroundShapes.displayName = 'BackgroundShapes';
