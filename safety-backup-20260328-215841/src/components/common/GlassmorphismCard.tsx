import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
}

const blurMap = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

export const GlassmorphismCard = memo(function GlassmorphismCard({
  children,
  className,
  blur = "md",
  opacity = 0.7
}: GlassmorphismCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-2xl border border-white/20 shadow-xl overflow-hidden",
        blurMap[blur],
        className
      )}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${opacity}) 0%, rgba(255,255,255,${opacity * 0.5}) 100%)`,
      }}
    >
      {/* Inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
});
