import { useRef, ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  animation?: "slide-left" | "slide-right" | "slide-up" | "slide-down" | "fade" | "fade-in" | "scale" | "scale-in";
  once?: boolean;
}

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  animation,
  once = true,
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Map animation prop to CSS classes
  const getAnimationClass = () => {
    const effectiveAnimation = animation || (direction !== "none" ? `slide-${direction}` : "fade");
    
    switch (effectiveAnimation) {
      case "slide-left":
        return "translate-x-10";
      case "slide-right":
        return "-translate-x-10";
      case "slide-up":
        return "translate-y-10";
      case "slide-down":
        return "-translate-y-10";
      case "scale":
      case "scale-in":
        return "scale-95";
      default:
        return "";
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Apply delay before showing
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);
          
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, once]);

  const animationClass = getAnimationClass();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-600 ease-out",
        !isVisible && "opacity-0",
        !isVisible && animationClass,
        isVisible && "opacity-100 translate-x-0 translate-y-0 scale-100",
        className
      )}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
