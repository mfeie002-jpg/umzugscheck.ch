import { memo } from "react";
import { cn } from "@/lib/utils";
import { usePerformance } from "@/contexts/PerformanceContext";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
}

export const BorderBeam = memo(function BorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0
}: BorderBeamProps) {
  const { shouldShowComplexAnimations } = usePerformance();

  // Don't render on low performance or mobile
  if (!shouldShowComplexAnimations) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        "[mask-image:linear-gradient(white,white)]",
        "before:absolute before:inset-0 before:rounded-[inherit]",
        "before:bg-[linear-gradient(var(--angle),transparent_70%,hsl(var(--primary))_80%,transparent_90%)]",
        "before:animate-border-beam",
        className
      )}
      style={{
        "--size": `${size}px`,
        "--duration": `${duration}s`,
        "--delay": `${delay}s`
      } as React.CSSProperties}
    />
  );
});
