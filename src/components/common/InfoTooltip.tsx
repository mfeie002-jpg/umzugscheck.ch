import { memo, useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  className?: string;
  iconSize?: number;
}

export const InfoTooltip = memo(function InfoTooltip({ 
  content, 
  className,
  iconSize = 16
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-full hover:bg-primary/10"
        aria-label="Mehr Informationen"
      >
        <Info size={iconSize} />
      </button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64"
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-foreground text-background text-xs leading-relaxed p-3 rounded-lg shadow-lg">
              {content}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
