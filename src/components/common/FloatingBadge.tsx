import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FloatingBadgeProps {
  icon: LucideIcon;
  text: string;
  subtext?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success';
}

export const FloatingBadge = memo(({ 
  icon: Icon,
  text,
  subtext,
  className = "",
  variant = 'primary'
}: FloatingBadgeProps) => {
  const variants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-emerald-500 text-white"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: [0, -6, 0] 
      }}
      transition={{ 
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      className={cn(
        "inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-medium border border-border/50",
        "bg-card",
        className
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg",
        variants[variant]
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-left">
        {subtext && (
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {subtext}
          </p>
        )}
        <p className="text-sm font-bold text-foreground">{text}</p>
      </div>
    </motion.div>
  );
});

FloatingBadge.displayName = 'FloatingBadge';
