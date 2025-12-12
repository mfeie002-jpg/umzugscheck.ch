import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "secondary" | "success";
}

export const GlowCard = memo(function GlowCard({
  children,
  className,
  glowColor = "primary"
}: GlowCardProps) {
  const glowColors = {
    primary: "group-hover:shadow-[0_0_30px_rgba(0,80,168,0.15)]",
    secondary: "group-hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]",
    success: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "group relative bg-card rounded-2xl border border-border p-6 transition-all duration-300",
        glowColors[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
});
