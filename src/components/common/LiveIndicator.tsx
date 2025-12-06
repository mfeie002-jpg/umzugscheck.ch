import { memo } from "react";
import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  text?: string;
  className?: string;
  variant?: "default" | "success" | "warning";
}

export const LiveIndicator = memo(function LiveIndicator({ 
  text = "Live",
  className,
  variant = "default"
}: LiveIndicatorProps) {
  const variants = {
    default: "bg-secondary/10 text-secondary",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600"
  };

  const dotColors = {
    default: "bg-secondary",
    success: "bg-emerald-500",
    warning: "bg-amber-500"
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold",
      variants[variant],
      className
    )}>
      <span className="relative flex h-2 w-2">
        <span className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          dotColors[variant]
        )} />
        <span className={cn(
          "relative inline-flex rounded-full h-2 w-2",
          dotColors[variant]
        )} />
      </span>
      {text}
    </div>
  );
});
