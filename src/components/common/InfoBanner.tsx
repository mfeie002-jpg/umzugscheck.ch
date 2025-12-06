import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InfoBannerProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "info" | "success" | "warning";
  className?: string;
}

const variantStyles = {
  info: "bg-primary/5 border-primary/20 text-primary",
  success: "bg-green-500/5 border-green-500/20 text-green-600",
  warning: "bg-amber-500/5 border-amber-500/20 text-amber-600"
};

export const InfoBanner = memo(({
  icon: Icon,
  children,
  variant = "info",
  className
}: InfoBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border",
        variantStyles[variant],
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />}
      <span className="text-sm font-medium">{children}</span>
    </motion.div>
  );
});

InfoBanner.displayName = 'InfoBanner';
