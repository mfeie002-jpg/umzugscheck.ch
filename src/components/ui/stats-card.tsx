import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

interface StatsCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  color?: "primary" | "secondary" | "success" | "warning";
  className?: string;
  index?: number;
}

export const StatsCard = memo(function StatsCard({
  icon: Icon,
  value,
  label,
  suffix = "",
  prefix = "",
  color = "primary",
  className,
  index = 0
}: StatsCardProps) {
  const colors = {
    primary: { icon: "text-primary", bg: "bg-primary/10" },
    secondary: { icon: "text-secondary", bg: "bg-secondary/10" },
    success: { icon: "text-green-600", bg: "bg-green-500/10" },
    warning: { icon: "text-amber-600", bg: "bg-amber-500/10" }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative bg-card rounded-2xl border border-border p-5 text-center",
        "hover:shadow-soft transition-shadow",
        className
      )}
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3", colors[color].bg)}>
        <Icon className={cn("w-5 h-5", colors[color].icon)} />
      </div>
      <div className="text-2xl md:text-3xl font-bold mb-1">
        <AnimatedCounter end={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </motion.div>
  );
});
