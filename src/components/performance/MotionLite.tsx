/**
 * Motion-Lite: Lightweight animation wrapper for above-the-fold content
 * Uses CSS transitions instead of full Framer Motion for performance
 */
import { memo, ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MotionLiteProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight";
  delay?: number;
  duration?: number;
  once?: boolean;
}

const animationClasses = {
  fadeUp: {
    initial: "opacity-0 translate-y-4",
    animate: "opacity-100 translate-y-0",
  },
  fadeIn: {
    initial: "opacity-0",
    animate: "opacity-100",
  },
  scaleIn: {
    initial: "opacity-0 scale-95",
    animate: "opacity-100 scale-100",
  },
  slideLeft: {
    initial: "opacity-0 translate-x-4",
    animate: "opacity-100 translate-x-0",
  },
  slideRight: {
    initial: "opacity-0 -translate-x-4",
    animate: "opacity-100 translate-x-0",
  },
};

export const MotionLite = memo(function MotionLite({
  children,
  className,
  animation = "fadeUp",
  delay = 0,
  duration = 500,
  once = true,
}: MotionLiteProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay before animation
          setTimeout(() => setIsVisible(true), delay);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, once]);

  const { initial, animate } = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all will-change-transform",
        isVisible ? animate : initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
});

// For sections that need zero animation above fold
export const NoMotion = memo(function NoMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
});
