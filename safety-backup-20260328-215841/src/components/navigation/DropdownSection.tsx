/**
 * Enhanced Dropdown Section
 * Warm, lively section headers with gradient accents
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DropdownSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  icon?: React.ElementType;
}

export const DropdownSection = ({ title, subtitle, children, className, icon: Icon }: DropdownSectionProps) => {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {(title || subtitle) && (
        <div className="mb-5 px-1">
          <div className="flex items-center gap-3">
            {Icon && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/25 to-primary/15 flex items-center justify-center shadow-sm"
              >
                <Icon className="w-4 h-4 text-primary" />
              </motion.div>
            )}
            {title && (
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                  {title}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent min-w-[40px]" />
              </div>
            )}
          </div>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-muted-foreground mt-2 font-medium leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      <div className={cn("space-y-1")}>
        {children}
      </div>
    </motion.div>
  );
};
