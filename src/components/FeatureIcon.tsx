import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureIconProps {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "gradient" | "outline" | "solid" | "glass";
}

const sizeClasses = {
  sm: "w-10 h-10 rounded-lg",
  md: "w-14 h-14 rounded-xl",
  lg: "w-16 h-16 rounded-2xl",
  xl: "w-20 h-20 rounded-2xl",
};

const iconSizes = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

const variantClasses = {
  gradient: "bg-gradient-hero text-primary-foreground shadow-medium",
  outline: "border-2 border-alpine text-alpine bg-alpine/5",
  solid: "bg-alpine text-alpine-foreground",
  glass: "bg-background/80 backdrop-blur-md border border-border text-alpine shadow-soft",
};

const FeatureIcon = ({
  icon: Icon,
  className = "",
  size = "md",
  variant = "gradient",
}: FeatureIconProps) => {
  return (
    <motion.div
      className={cn(
        "flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Icon className={iconSizes[size]} />
    </motion.div>
  );
};

export default FeatureIcon;
