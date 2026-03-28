import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export const ShimmerButton = memo(function ShimmerButton({
  children,
  className,
  onClick,
  variant = "primary"
}: ShimmerButtonProps) {
  const baseStyles = variant === "primary"
    ? "bg-secondary text-secondary-foreground"
    : "bg-primary text-primary-foreground";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold overflow-hidden transition-shadow hover:shadow-lg",
        baseStyles,
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
});
