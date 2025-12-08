import { memo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  clickScale?: number;
  onClick?: () => void;
}

export const InteractiveCard = memo(function InteractiveCard({
  children,
  className,
  hoverScale = 1.02,
  clickScale = 0.98,
  onClick
}: InteractiveCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      className={cn(
        "bg-card rounded-2xl border border-border shadow-soft cursor-pointer overflow-hidden",
        className
      )}
      whileHover={{ 
        scale: hoverScale,
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: clickScale }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        animate={{
          filter: isPressed ? "brightness(0.95)" : "brightness(1)"
        }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});
