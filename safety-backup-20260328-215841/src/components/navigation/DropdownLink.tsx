/**
 * Enhanced Dropdown Link
 * Warm, lively & trustworthy link items with micro-animations
 */

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export interface DropdownLinkProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  onClick?: () => void;
  featured?: boolean;
  badge?: string;
  compact?: boolean;
}

export const DropdownLink = ({ 
  to, 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  featured,
  badge,
  compact 
}: DropdownLinkProps) => {
  if (compact) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
          "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
          "hover:shadow-sm hover:shadow-primary/5",
          "active:scale-[0.98]",
          "border border-transparent hover:border-primary/10"
        )}
      >
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 3 }}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 group-hover:shadow-md group-hover:shadow-primary/10 transition-all"
        >
          <Icon className="w-4.5 h-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
            {title}
          </h4>
          {description && (
            <p className="text-[11px] text-muted-foreground truncate group-hover:text-muted-foreground/80">
              {description}
            </p>
          )}
        </div>
        {/* Hover arrow */}
        <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
      </Link>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-250",
        "hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent",
        "hover:shadow-lg hover:shadow-primary/5",
        "active:scale-[0.98]",
        "border border-transparent",
        featured && "bg-gradient-to-r from-primary/[0.08] via-primary/[0.04] to-transparent border-primary/15 hover:border-primary/25 shadow-sm"
      )}
    >
      {/* Icon container with gradient and animation */}
      <motion.div 
        whileHover={{ scale: 1.08, rotate: featured ? 0 : 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(
          "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
          featured 
            ? "bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25" 
            : "bg-gradient-to-br from-muted to-muted/60 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:shadow-lg group-hover:shadow-primary/10"
        )}
      >
        <Icon className={cn(
          "w-5.5 h-5.5 transition-all group-hover:scale-110",
          featured ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
        )} />
      </motion.div>
      
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className={cn(
            "font-bold text-sm transition-colors",
            featured ? "text-primary" : "text-foreground group-hover:text-primary"
          )}>
            {title}
          </h4>
          {featured && !badge && (
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse" />
          )}
          {badge && (
            <Badge 
              variant="secondary" 
              className="text-[10px] px-2 py-0.5 h-5 bg-gradient-to-r from-secondary/90 to-secondary text-secondary-foreground border-0 font-bold shadow-sm"
            >
              <Sparkles className="w-2.5 h-2.5 mr-1" />
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1 group-hover:text-muted-foreground/80">
            {description}
          </p>
        )}
      </div>

      {/* Hover arrow indicator with smooth animation */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0 -translate-x-3">
        <motion.div 
          whileHover={{ x: 2 }}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/15 to-primary/10 flex items-center justify-center shadow-inner"
        >
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        </motion.div>
      </div>
    </Link>
  );
};
