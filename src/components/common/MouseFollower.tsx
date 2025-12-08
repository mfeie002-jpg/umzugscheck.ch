import { memo, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MouseFollowerProps {
  className?: string;
  size?: number;
  color?: string;
  blur?: boolean;
}

export const MouseFollower = memo(function MouseFollower({
  className,
  size = 400,
  color = "hsl(var(--primary) / 0.15)",
  blur = true
}: MouseFollowerProps) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 100 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - size / 2);
      mouseY.set(e.clientY - size / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, size]);

  if (!mounted) return null;

  return (
    <motion.div
      className={cn(
        "fixed pointer-events-none z-0 rounded-full",
        blur && "blur-3xl",
        className
      )}
      style={{
        x: springX,
        y: springY,
        width: size,
        height: size,
        background: color
      }}
    />
  );
});