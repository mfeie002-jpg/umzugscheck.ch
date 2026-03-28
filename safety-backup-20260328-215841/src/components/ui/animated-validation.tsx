/**
 * Animated Form Validation Components
 * Friendly inline hints with smooth animations
 */
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationMessageProps {
  message: string;
  type?: "error" | "success" | "warning" | "info";
  show: boolean;
  className?: string;
}

const iconMap = {
  error: XCircle,
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  error: "text-destructive",
  success: "text-emerald-600",
  warning: "text-amber-600",
  info: "text-primary",
};

const bgMap = {
  error: "bg-destructive/5",
  success: "bg-emerald-50",
  warning: "bg-amber-50",
  info: "bg-primary/5",
};

export const AnimatedValidation = memo(function AnimatedValidation({
  message,
  type = "error",
  show,
  className,
}: ValidationMessageProps) {
  const Icon = iconMap[type];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ 
            duration: 0.2, 
            ease: [0.4, 0, 0.2, 1],
            height: { duration: 0.15 }
          }}
          className={cn(
            "flex items-center gap-1.5 text-xs py-1.5 px-2 rounded-md mt-1.5",
            colorMap[type],
            bgMap[type],
            className
          )}
        >
          <Icon className="w-3 h-3 flex-shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Shake animation for invalid input
export const ShakeInput = memo(function ShakeInput({
  children,
  shake,
  className,
}: {
  children: React.ReactNode;
  shake: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={shake ? {
        x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
});

// Success checkmark animation
export const SuccessCheckmark = memo(function SuccessCheckmark({
  show,
  size = "md",
}: {
  show: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15 
          }}
          className={cn(
            "flex items-center justify-center rounded-full bg-emerald-100",
            sizeClasses[size]
          )}
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          >
            <CheckCircle className={cn(
              "text-emerald-500",
              size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-12 h-12"
            )} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Form success state with celebration
export const FormSuccessState = memo(function FormSuccessState({
  show,
  title = "Erfolgreich gesendet!",
  description = "Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
  className,
}: {
  show: boolean;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={cn(
            "flex flex-col items-center justify-center text-center p-6",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
          >
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold text-foreground mb-2"
          >
            {title}
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {description}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
