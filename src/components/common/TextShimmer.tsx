import { memo } from "react";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
}

export const TextShimmer = memo(function TextShimmer({
  children,
  className,
  shimmerColor = "hsl(var(--secondary))"
}: TextShimmerProps) {
  return (
    <span
      className={cn(
        "relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground animate-shimmer-text",
        className
      )}
      style={{
        backgroundSize: "200% 100%",
        backgroundImage: `linear-gradient(
          90deg,
          hsl(var(--foreground)) 0%,
          hsl(var(--foreground)) 40%,
          ${shimmerColor} 50%,
          hsl(var(--foreground)) 60%,
          hsl(var(--foreground)) 100%
        )`
      }}
    >
      {children}
    </span>
  );
});
