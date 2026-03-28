import { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  gradient?: string;
}

export const GradientBorder = memo(function GradientBorder({
  children,
  className,
  borderWidth = 2,
  gradient = "from-primary via-secondary to-primary"
}: GradientBorderProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-[2px]",
        `bg-gradient-to-r ${gradient}`,
        className
      )}
      style={{ padding: borderWidth }}
    >
      <div className="relative rounded-2xl bg-background h-full">
        {children}
      </div>
    </div>
  );
});
