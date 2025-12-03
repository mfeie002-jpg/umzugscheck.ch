import { cn } from "@/lib/utils";

interface PulsingDotProps {
  color?: "success" | "primary" | "secondary" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PulsingDot = ({ color = "success", size = "md", className }: PulsingDotProps) => {
  const colors = {
    success: "bg-success",
    primary: "bg-primary",
    secondary: "bg-secondary",
    warning: "bg-amber-500"
  };

  const sizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3"
  };

  return (
    <span className={cn("relative flex", sizes[size], className)}>
      <span className={cn(
        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
        colors[color]
      )} />
      <span className={cn(
        "relative inline-flex rounded-full",
        sizes[size],
        colors[color]
      )} />
    </span>
  );
};
