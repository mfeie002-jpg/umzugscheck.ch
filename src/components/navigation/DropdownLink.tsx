import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
          "group flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-200",
          "hover:bg-accent/80 active:scale-[0.98]"
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
            {title}
          </h4>
          {description && (
            <p className="text-[11px] text-muted-foreground truncate">
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
        "group flex items-start gap-3 p-3 rounded-xl transition-all duration-200",
        "hover:bg-accent/80 active:scale-[0.98]",
        featured && "bg-primary/5 hover:bg-primary/10 ring-1 ring-primary/20"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
        featured 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2">
          <h4 className={cn(
            "font-semibold text-sm transition-colors",
            featured ? "text-primary" : "text-foreground group-hover:text-primary"
          )}>
            {title}
          </h4>
          {badge && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
};
