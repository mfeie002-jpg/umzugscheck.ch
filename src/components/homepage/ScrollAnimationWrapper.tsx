import { memo, useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

export const ScrollAnimationWrapper = memo(function ScrollAnimationWrapper({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.6
}: ScrollAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 50, x: 0 };
      case "down": return { y: -50, x: 0 };
      case "left": return { y: 0, x: 50 };
      case "right": return { y: 0, x: -50 };
      default: return { y: 50, x: 0 };
    }
  };

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.3], [getInitialPosition().y, 0]);
  const x = useTransform(scrollYProgress, [0, 0.3], [getInitialPosition().x, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y, x }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
});

// Stagger children animation wrapper
interface StaggerWrapperProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerWrapper = memo(function StaggerWrapper({
  children,
  className = "",
  staggerDelay = 0.1
}: StaggerWrapperProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
});

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = memo(function StaggerItem({
  children,
  className = ""
}: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 30,
          scale: 0.95
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
});

// Parallax wrapper for background elements
interface ParallaxWrapperProps {
  children: ReactNode;
  className?: string;
  speed?: number; // 0.5 = slow, 1 = normal, 2 = fast
}

export const ParallaxWrapper = memo(function ParallaxWrapper({
  children,
  className = "",
  speed = 0.5
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
});

// Section divider with animation
export const AnimatedDivider = memo(function AnimatedDivider({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`h-px bg-gradient-to-r from-transparent via-border to-transparent ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    />
  );
});
