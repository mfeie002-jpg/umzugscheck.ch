/**
 * Enhanced Dropdown Link
 * Warm, inviting & trustworthy link items
 */

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon, Sparkles } from "lucide-react";
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
          "group flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200",
          "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
          "active:scale-[0.98]"
        )}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 group-hover:shadow-sm transition-all">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
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
      </Link>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "group relative flex items-start gap-3.5 p-3.5 rounded-2xl transition-all duration-200",
        "hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent",
        "active:scale-[0.98]",
        featured && "bg-gradient-to-r from-primary/[0.08] via-primary/[0.04] to-transparent ring-1 ring-primary/15 hover:ring-primary/25"
      )}
    >
      {/* Icon container with gradient */}
      <div className={cn(
        "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm",
        featured 
          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-primary/20" 
          : "bg-gradient-to-br from-muted to-muted/60 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:shadow-md group-hover:shadow-primary/10"
      )}>
        <Icon className={cn(
          "w-5 h-5 transition-transform group-hover:scale-110",
          featured ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
        )} />
      </div>
      
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className={cn(
            "font-bold text-sm transition-colors",
            featured ? "text-primary" : "text-foreground group-hover:text-primary"
          )}>
            {title}
          </h4>
          {badge && (
            <Badge 
              variant="secondary" 
              className="text-[10px] px-2 py-0.5 h-5 bg-gradient-to-r from-primary/15 to-primary/10 text-primary border-0 font-bold"
            >
              <Sparkles className="w-2.5 h-2.5 mr-1" />
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 group-hover:text-muted-foreground/80">
            {description}
          </p>
        )}
      </div>

      {/* Hover arrow indicator */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 -translate-x-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};
