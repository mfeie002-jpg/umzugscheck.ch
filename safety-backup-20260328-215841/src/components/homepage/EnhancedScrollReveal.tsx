/**
 * Enhanced ScrollReveal with CLS prevention and multiple animation variants
 * Optimized for Core Web Vitals - uses CSS containment for layout stability
 */
import { memo, ReactNode, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface EnhancedScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale" | "none";
  duration?: number;
  threshold?: number;
  once?: boolean;
  // CLS prevention
  minHeight?: string;
  reserveSpace?: boolean;
}

export const EnhancedScrollReveal = memo(function EnhancedScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 600,
  threshold = 0.1,
  once = true,
  minHeight,
  reserveSpace = false,
}: EnhancedScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip animation if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "50px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, threshold, once, hasAnimated]);

  const directionStyles = {
    up: "translate-y-6",
    down: "-translate-y-6",
    left: "translate-x-6",
    right: "-translate-x-6",
    fade: "",
    scale: "scale-95",
    none: "",
  };

  const containerStyle: React.CSSProperties = {
    ...(minHeight && { minHeight }),
    ...(reserveSpace && { 
      contentVisibility: 'auto',
      containIntrinsicSize: minHeight || 'auto',
    }),
  };

  // If direction is "none", skip all animation
  if (direction === "none") {
    return (
      <div ref={ref} className={className} style={containerStyle}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform",
        !isVisible && `opacity-0 ${directionStyles[direction]}`,
        isVisible && "opacity-100 translate-y-0 translate-x-0 scale-100",
        className
      )}
      style={{
        ...containerStyle,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
});

// Stagger container for animating children sequentially
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
}

export const StaggerContainer = memo(function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  baseDelay = 0,
}: StaggerContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), baseDelay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [baseDelay]);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-500 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms",
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
});

export default EnhancedScrollReveal;
