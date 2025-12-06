import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  description?: string;
  className?: string;
  iconColor?: string;
}

export const StatCard = memo(function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  description,
  className,
  iconColor = "text-primary"
}: StatCardProps) {
  return (
    <motion.div
      className={cn(
        "bg-card rounded-xl p-4 md:p-6 shadow-card border border-border/50",
        "hover:shadow-medium hover:-translate-y-1 transition-all duration-300",
        className
      )}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-2.5 rounded-lg bg-muted", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl md:text-3xl font-bold text-foreground">{value}</div>
          <div className="text-sm font-medium text-foreground/80">{label}</div>
          {description && (
            <div className="text-xs text-muted-foreground mt-1">{description}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
