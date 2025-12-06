import { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

export const Marquee = memo(function Marquee({
  children,
  className,
  speed = "normal",
  direction = "left",
  pauseOnHover = true
}: MarqueeProps) {
  const speeds = {
    slow: "40s",
    normal: "25s",
    fast: "15s"
  };

  return (
    <div
      className={cn(
        "flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        pauseOnHover && "hover:[&>*]:animation-play-state-paused",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 gap-4 animate-marquee",
          direction === "right" && "animate-marquee-reverse"
        )}
        style={{ animationDuration: speeds[speed] }}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex shrink-0 gap-4 animate-marquee",
          direction === "right" && "animate-marquee-reverse"
        )}
        style={{ animationDuration: speeds[speed] }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
});
