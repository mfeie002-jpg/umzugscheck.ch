import { memo } from "react";
import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  size?: number;
  fade?: boolean;
}

export const GridPattern = memo(function GridPattern({
  className,
  size = 40,
  fade = true
}: GridPatternProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none",
        fade && "[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`
      }}
    />
  );
});
