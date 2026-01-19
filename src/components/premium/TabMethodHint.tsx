/**
 * TabMethodHint Component
 * 
 * Makes it clearer that users can click to choose a method.
 * 4 variants available via URL param ?tabHint=A|B|C|D
 * 
 * A: "ODER" divider line between tabs and form
 * B: Pulsing glow on inactive tabs + hint text
 * C: "Methode wählen" label + larger button-like tabs
 * D: Arrow pointing at alternatives with badge
 */

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

type HintVariant = "A" | "B" | "C" | "D" | null;

// Get variant from URL or localStorage
const getTabHintVariant = (): HintVariant => {
  if (typeof window === "undefined") return null;
  
  const params = new URLSearchParams(window.location.search);
  const urlVariant = params.get("tabHint")?.toUpperCase() as HintVariant;
  
  if (urlVariant && ["A", "B", "C", "D"].includes(urlVariant)) {
    return urlVariant;
  }
  
  return null;
};

interface TabMethodHintProps {
  className?: string;
  activeTab?: string;
  position?: "above" | "below";
}

/**
 * Variant A: "ODER" Divider Line
 * Shows a horizontal line with "ODER" text between tabs and form content
 */
export const TabHintDivider = memo(({ className }: { className?: string }) => {
  return (
    <div className={cn("relative flex items-center my-4", className)}>
      <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
      <span className="mx-4 text-xs font-bold text-muted-foreground bg-card px-3 py-1 rounded-full border border-muted-foreground/20">
        ODER
      </span>
      <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
    </div>
  );
});
TabHintDivider.displayName = "TabHintDivider";

/**
 * Variant B: Pulsing Hint
 * Shows a hint text below tabs with pointing gesture
 */
export const TabHintPulsing = memo(({ className }: { className?: string }) => {
  return (
    <motion.div 
      className={cn("flex items-center justify-center gap-2 py-2", className)}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.4 }}
    >
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
    </motion.div>
  );
});
TabHintPulsing.displayName = "TabHintPulsing";

/**
 * Variant C: Method Label Header
 * Shows "⬇️ Methode wählen:" above the tabs
 */
export const TabHintLabel = memo(({ className }: { className?: string }) => {
  return (
    <motion.div 
      className={cn("flex items-center justify-center gap-2 mb-3", className)}
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
  );
});
TabHintLabel.displayName = "TabHintLabel";

/**
 * Variant D: Alternatives Badge
 * Shows a floating badge with "3 Alternativen" near inactive tabs
 */
export const TabHintBadge = memo(({ className }: { className?: string }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className={cn("absolute -top-2 right-2 z-20", className)}
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

/**
 * Combined TabMethodHint Component
 * Renders the appropriate variant based on URL parameter
 */
export const TabMethodHint = memo(({ 
  className,
  position = "below" 
}: TabMethodHintProps) => {
  const [variant, setVariant] = useState<HintVariant>(null);

  useEffect(() => {
    setVariant(getTabHintVariant());
  }, []);

  if (!variant) return null;

  if (variant === "A" && position === "below") {
    return <TabHintDivider className={className} />;
  }

  if (variant === "B" && position === "below") {
    return <TabHintPulsing className={className} />;
  }

  if (variant === "C" && position === "above") {
    return <TabHintLabel className={className} />;
  }

  if (variant === "D" && position === "above") {
    return <TabHintBadge className={className} />;
  }

  return null;
});
TabMethodHint.displayName = "TabMethodHint";

/**
 * Hook to get current tab hint variant
 */
export const useTabHintVariant = () => {
  const [variant, setVariant] = useState<HintVariant>(null);

  useEffect(() => {
    setVariant(getTabHintVariant());
  }, []);

  return variant;
};

export default TabMethodHint;
