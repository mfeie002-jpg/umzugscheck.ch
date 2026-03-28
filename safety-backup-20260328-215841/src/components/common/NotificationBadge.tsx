import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
  max?: number;
  showZero?: boolean;
}

export const NotificationBadge = memo(function NotificationBadge({ 
  count, 
  className,
  max = 99,
  showZero = false
}: NotificationBadgeProps) {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <motion.span
      className={cn(
        "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1",
        "flex items-center justify-center",
        "bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full",
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {displayCount}
    </motion.span>
  );
});
