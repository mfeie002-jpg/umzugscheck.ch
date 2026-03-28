import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  className?: string;
  onClick?: () => void;
}

export const ScrollIndicator = memo(function ScrollIndicator({ 
  className,
  onClick 
}: ScrollIndicatorProps) {
  return (
    <motion.button
      className={cn(
        "flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
      onClick={onClick}
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      aria-label="Nach unten scrollen"
    >
      <span className="text-sm font-medium">Mehr entdecken</span>
      <ChevronDown className="h-5 w-5" />
    </motion.button>
  );
});
