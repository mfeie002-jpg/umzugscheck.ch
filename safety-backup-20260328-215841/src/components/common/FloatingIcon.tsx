import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingIconProps {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
}

export const FloatingIcon = memo(function FloatingIcon({
  icon: Icon,
  className,
  size = "md",
  delay = 0
}: FloatingIconProps) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20"
  };

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10"
  };

  return (
    <motion.div
      className={cn(
        "flex items-center justify-center rounded-2xl",
        "bg-primary/10 text-primary",
        "border border-primary/20",
        sizes[size],
        className
      )}
      animate={{
        y: [0, -10, 0],
        rotate: [-2, 2, -2]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      <Icon className={iconSizes[size]} />
    </motion.div>
  );
});
