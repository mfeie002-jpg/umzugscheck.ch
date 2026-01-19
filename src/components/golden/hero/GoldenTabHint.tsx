/**
 * GoldenTabHint - Consolidated tab hint component
 * 
 * Combines best patterns from TabHint A/B test:
 * - Variant A: "ODER" divider
 * - Variant B: Pulsing hint
 * - Variant C: Method label
 * - Variant D: Alternatives badge
 * 
 * The golden version uses the most effective patterns based on testing.
 */

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MousePointerClick, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type HintVariant = "divider" | "pulsing" | "label" | "badge" | "auto";
type HintPosition = "above" | "below";

interface GoldenTabHintProps {
  variant?: HintVariant;
  position?: HintPosition;
  activeTab?: string;
  className?: string;
}

export const GoldenTabHint = memo(({ 
  variant = "auto",
  position = "below",
  activeTab,
  className 
}: GoldenTabHintProps) => {
  // Auto mode: show label above, pulsing below
  if (variant === "auto") {
    if (position === "above") {
      return <TabHintLabel className={className} />;
    }
    return <TabHintPulsing className={className} />;
  }

  // Specific variants
  if (variant === "divider" && position === "below") {
    return <TabHintDivider className={className} />;
  }

  if (variant === "pulsing" && position === "below") {
    return <TabHintPulsing className={className} />;
  }

  if (variant === "label" && position === "above") {
    return <TabHintLabel className={className} />;
  }

  if (variant === "badge" && position === "above" && activeTab === "form") {
    return <TabHintBadge className={className} />;
  }

  return null;
});

GoldenTabHint.displayName = "GoldenTabHint";

/**
 * Variant A: "ODER" Divider Line
 */
const TabHintDivider = memo(({ className }: { className?: string }) => (
  <div className={cn("relative flex items-center my-4", className)}>
    <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
    <span className="mx-4 text-xs font-bold text-muted-foreground bg-card px-3 py-1 rounded-full border border-muted-foreground/20">
      ODER
    </span>
    <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
  </div>
));
TabHintDivider.displayName = "TabHintDivider";

/**
 * Variant B: Pulsing Hint
 */
const TabHintPulsing = memo(({ className }: { className?: string }) => (
  <motion.div
    className={cn("w-full py-2 flex justify-center pointer-events-none", className)}
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5, duration: 0.4 }}
  >
    <div className="inline-flex items-center justify-center gap-2 text-center">
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-base"
      >
        👆
      </motion.span>
      <span className="text-xs text-muted-foreground font-medium">
        Klicken für andere Methoden
      </span>
    </div>
  </motion.div>
));
TabHintPulsing.displayName = "TabHintPulsing";

/**
 * Variant C: Method Label Header
 */
const TabHintLabel = memo(({ className }: { className?: string }) => (
  <motion.div 
    className={cn("flex items-center justify-center gap-2 mb-3 pointer-events-none", className)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
  >
    <motion.div
      animate={{ y: [0, 3, 0] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    >
      <ChevronDown className="w-4 h-4 text-primary" />
    </motion.div>
    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
      Eine Methode wählen
    </span>
    <motion.div
      animate={{ y: [0, 3, 0] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    >
      <ChevronDown className="w-4 h-4 text-primary" />
    </motion.div>
  </motion.div>
));
TabHintLabel.displayName = "TabHintLabel";

/**
 * Variant D: Alternatives Badge
 */
const TabHintBadge = memo(({ className }: { className?: string }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className={cn("absolute -top-2 right-2 z-20 pointer-events-none", className)}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-full shadow-lg">
        <MousePointerClick className="w-3 h-3" />
        <span>3 Alternativen</span>
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        >
          →
        </motion.div>
      </div>
    </motion.div>
  );
});
TabHintBadge.displayName = "TabHintBadge";
