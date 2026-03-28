import { memo } from "react";
import { cn } from "@/lib/utils";

interface HeroGradientProps {
  className?: string;
  variant?: "primary" | "secondary" | "mesh";
}

export const HeroGradient = memo(function HeroGradient({
  className,
  variant = "primary"
}: HeroGradientProps) {
  const variants = {
    primary: (
      <>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </>
    ),
    secondary: (
      <>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-primary via-secondary to-primary rounded-full blur-3xl opacity-20" />
      </>
    ),
    mesh: (
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 40% 20%, hsl(var(--primary)) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsl(var(--secondary)) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsl(var(--primary)) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsl(var(--secondary)) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsl(var(--primary)) 0px, transparent 50%),
            radial-gradient(at 80% 100%, hsl(var(--secondary)) 0px, transparent 50%)
          `
        }}
      />
    )
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {variants[variant]}
    </div>
  );
});
