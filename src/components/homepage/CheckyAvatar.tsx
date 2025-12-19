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
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className={`flex items-start gap-3 ${className}`}
    >
      {/* Checky Avatar - Enhanced with Swiss colors */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative flex-shrink-0"
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-primary/30 blur-lg animate-pulse`} />
        
        {/* Main avatar circle with Swiss gradient */}
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary via-primary to-swiss-red flex items-center justify-center shadow-medium relative z-10 ring-2 ring-background`}>
          <Bot className="text-primary-foreground drop-shadow-sm" size={iconSize[size]} strokeWidth={1.5} />
        </div>
        
        {/* Status indicator - pulsing green */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background shadow-sm"
        />
        
        {/* Floating Swiss shield badge */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-md ring-1 ring-background"
        >
          <Shield className="w-3.5 h-3.5 text-secondary-foreground" />
        </motion.div>
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
    </motion.div>
  );
});
