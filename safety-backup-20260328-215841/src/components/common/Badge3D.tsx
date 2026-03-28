import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Badge3DProps {
  icon: LucideIcon;
  label: string;
  className?: string;
  variant?: "primary" | "secondary" | "success";
}

export const Badge3D = memo(function Badge3D({ 
  icon: Icon, 
  label, 
  className,
  variant = "primary"
}: Badge3DProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border",
        "shadow-[0_4px_12px_-2px] shadow-current/20",
        "hover:shadow-[0_6px_16px_-2px] hover:shadow-current/30",
        "transition-shadow duration-300",
        variants[variant],
        className
      )}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-semibold">{label}</span>
    </motion.div>
  );
});
