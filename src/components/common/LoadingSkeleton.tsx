import { memo } from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: "text" | "card" | "image" | "avatar";
  lines?: number;
  className?: string;
}

export const LoadingSkeleton = memo(({
  variant = "text",
  lines = 1,
  className
}: LoadingSkeletonProps) => {
  if (variant === "card") {
    return (
      <div className={cn("bg-card rounded-xl border border-border/50 overflow-hidden", className)}>
        <div className="h-32 bg-muted animate-pulse" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === "image") {
    return (
      <div className={cn("bg-muted rounded-lg animate-pulse aspect-video", className)} />
    );
  }

  if (variant === "avatar") {
    return (
      <div className={cn("w-10 h-10 bg-muted rounded-full animate-pulse", className)} />
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';
