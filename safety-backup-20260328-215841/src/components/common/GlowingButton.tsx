import { memo, forwardRef } from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GlowingButtonProps extends ButtonProps {
  glowColor?: string;
  glowIntensity?: "low" | "medium" | "high";
}

const intensityMap = {
  low: "0 0 20px",
  medium: "0 0 30px",
  high: "0 0 40px, 0 0 60px",
};

export const GlowingButton = memo(forwardRef<HTMLButtonElement, GlowingButtonProps>(
  ({ className, children, glowColor = "hsl(var(--secondary))", glowIntensity = "medium", ...props }, ref) => {
    return (
      <motion.div
        className="relative group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-300"
          style={{
            background: glowColor,
            boxShadow: `${intensityMap[glowIntensity]} ${glowColor}`,
          }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Button
          ref={ref}
          className={cn(
            "relative z-10 shadow-cta",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
));

GlowingButton.displayName = 'GlowingButton';
