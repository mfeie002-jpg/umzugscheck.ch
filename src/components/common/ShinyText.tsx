import { memo } from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
}

export const ShinyText = memo(function ShinyText({
  children,
  className
}: ShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-flex animate-shine bg-[length:200%_100%]",
        "bg-gradient-to-r from-foreground via-foreground/50 to-foreground",
        "bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
});
