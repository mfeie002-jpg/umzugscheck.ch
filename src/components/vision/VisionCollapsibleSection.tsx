/**
 * Collapsible Section Wrapper for Vision Page
 * Makes sections expandable/collapsible to reduce page length
 * Supports external control via forceOpen prop for "expand all" functionality
 */

import { memo, useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisionCollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean; // External control - when true, section is forced open
  badge?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  language?: 'de' | 'bg';
}

export const VisionCollapsibleSection = memo(({
  title,
  icon,
  defaultOpen = false,
  forceOpen,
  badge,
  children,
  className,
  headerClassName,
  language = 'de'
}: VisionCollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Sync with external forceOpen control
  useEffect(() => {
    if (forceOpen !== undefined) {
      setIsOpen(forceOpen);
    }
  }, [forceOpen]);
  
  const collapseLabel = language === 'de' ? 'Einklappen' : 'Свий';
  const expandLabel = language === 'de' ? 'Ausklappen' : 'Разгъни';
  
  return (
    <div className={cn("border-b border-border", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full py-3 md:py-4 px-4 md:px-6 flex items-center justify-between",
          "hover:bg-muted/50 transition-colors min-h-[56px] touch-manipulation active:bg-muted/70",
          headerClassName
        )}
      >
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          {icon && <span className="text-primary flex-shrink-0">{icon}</span>}
          <span className="font-bold text-sm md:text-lg text-left truncate">{title}</span>
          {badge && (
            <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0 hidden sm:inline-block">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 ml-2">
          <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline">
            {isOpen ? collapseLabel : expandLabel}
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

VisionCollapsibleSection.displayName = 'VisionCollapsibleSection';
