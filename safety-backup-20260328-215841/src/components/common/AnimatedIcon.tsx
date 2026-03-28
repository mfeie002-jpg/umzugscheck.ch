import { memo } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  animation?: "bounce" | "pulse" | "spin" | "shake" | "float";
  color?: string;
}

const animations: Record<string, { animate: object; transition: object }> = {
  bounce: {
    animate: { y: [0, -5, 0] },
    transition: { duration: 1, repeat: Infinity }
  },
  pulse: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 1.5, repeat: Infinity }
  },
  spin: {
    animate: { rotate: 360 },
    transition: { duration: 2, repeat: Infinity }
  },
  shake: {
    animate: { x: [-2, 2, -2, 2, 0] },
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
  },
  float: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 3, repeat: Infinity }
  }
};

export const AnimatedIcon = memo(function AnimatedIcon({
  icon: Icon,
  className,
  size = 24,
  animation = "bounce",
  color
}: AnimatedIconProps) {
  const config = animations[animation];

  return (
    <motion.div
      animate={config.animate as any}
      transition={config.transition as any}
      className={cn("inline-flex", className)}
    >
      <Icon size={size} color={color} />
    </motion.div>
  );
});
