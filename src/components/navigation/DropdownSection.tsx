/**
 * Enhanced Dropdown Section
 * Warm, structured section headers with better visual hierarchy
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
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {(title || subtitle) && (
        <div className="mb-4 px-1">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            {title && (
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                {title}
              </h3>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1.5 font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={cn("space-y-1")}>
        {children}
      </div>
    </motion.div>
  );
};
