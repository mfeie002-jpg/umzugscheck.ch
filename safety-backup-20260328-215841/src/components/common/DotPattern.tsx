import { memo } from "react";
import { cn } from "@/lib/utils";

interface DotPatternProps {
  className?: string;
  size?: number;
  gap?: number;
}

export const DotPattern = memo(function DotPattern({
  className,
  size = 2,
  gap = 20
}: DotPatternProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none opacity-30",
        "[mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]",
        className
      )}
      style={{
        backgroundImage: `radial-gradient(hsl(var(--foreground) / 0.3) ${size}px, transparent ${size}px)`,
        backgroundSize: `${gap}px ${gap}px`
      }}
    />
  );
});
