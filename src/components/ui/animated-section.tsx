import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale";
  delay?: number;
  threshold?: number;
}

export function AnimatedSection({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
}: AnimatedSectionProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold });
  const prefersReducedMotion = useReducedMotion();
  const screenshotMode = isScreenshotRenderMode();

  const animations = {
    "fade-up": {
      initial: "opacity-0 translate-y-8",
      animate: "opacity-100 translate-y-0",
    },
    "fade-in": {
      initial: "opacity-0",
      animate: "opacity-100",
    },
    "slide-left": {
      initial: "opacity-0 -translate-x-8",
      animate: "opacity-100 translate-x-0",
    },
    "slide-right": {
      initial: "opacity-0 translate-x-8",
      animate: "opacity-100 translate-x-0",
    },
    scale: {
      initial: "opacity-0 scale-95",
      animate: "opacity-100 scale-100",
    },
  } as const;

  const { initial, animate } = animations[animation];

  // When capturing screenshots, we must render EVERYTHING immediately.
  // IntersectionObserver + content-visibility can cause large "white" blocks.
  if (prefersReducedMotion || screenshotMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out contain-layout",
        isVisible ? animate : initial,
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        contentVisibility: "auto",
        containIntrinsicSize: "auto 400px",
      }}
    >
      {children}
    </div>
  );
}

export function StaggeredList({
  children,
  className,
  staggerDelay = 100,
}: {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const screenshotMode = isScreenshotRenderMode();

  if (prefersReducedMotion || screenshotMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
