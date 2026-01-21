/**
 * Collapsible Section Wrapper for Vision Page
 * Makes sections expandable/collapsible to reduce page length
 */

import { memo, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisionCollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
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
  badge,
  children,
  className,
  headerClassName,
  language = 'de'
}: VisionCollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const collapseLabel = language === 'de' ? 'Einklappen' : 'Свий';
  const expandLabel = language === 'de' ? 'Ausklappen' : 'Разгъни';
  
  return (
    <div className={cn("border-b border-border", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full py-4 px-4 md:px-6 flex items-center justify-between",
          "hover:bg-muted/50 transition-colors",
          headerClassName
        )}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-primary">{icon}</span>}
          <span className="font-bold text-lg text-left">{title}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
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
