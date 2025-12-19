import { memo } from "react";
import { motion } from "framer-motion";
import { Bot, Shield, Lock } from "lucide-react";

interface CheckyAvatarProps {
  size?: "sm" | "md" | "lg";
  showMessage?: boolean;
  message?: string;
  className?: string;
}

export const CheckyAvatar = memo(function CheckyAvatar({
  size = "md",
  showMessage = true,
  message = "Hallo! Ich bin Checky und helfe Ihnen, die beste Umzugsfirma zu finden.",
  className = ""
}: CheckyAvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20"
  };
  
  const iconSize = {
    sm: 20,
    md: 28,
    lg: 40
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Checky Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative flex-shrink-0"
      >
        {/* Main avatar circle */}
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-medium`}>
          <Bot className="text-primary-foreground" size={iconSize[size]} strokeWidth={1.5} />
        </div>
        
        {/* Status indicator */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
        />
        
        {/* Floating shield badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center shadow-sm">
          <Shield className="w-3 h-3 text-secondary-foreground" />
        </div>
      </motion.div>

      {/* Message bubble */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-card border border-border rounded-xl rounded-tl-sm px-4 py-3 shadow-soft max-w-xs"
        >
          {/* Speech bubble pointer */}
          <div className="absolute left-0 top-3 -translate-x-1.5 w-3 h-3 bg-card border-l border-b border-border rotate-45" />
          
          <p className="text-sm text-foreground leading-relaxed relative z-10">
            {message}
          </p>
          
          {/* Privacy note */}
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/50">
            <Lock className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-muted-foreground">
              Ihre Daten bleiben in der Schweiz geschützt
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
});
