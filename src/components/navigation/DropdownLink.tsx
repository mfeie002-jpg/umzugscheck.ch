import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DropdownLinkProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  onClick?: () => void;
  featured?: boolean;
}

export const DropdownLink = ({ to, icon: Icon, title, description, onClick, featured }: DropdownLinkProps) => {
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
        <h4 className={cn(
          "font-semibold text-sm transition-colors",
          featured ? "text-primary" : "text-foreground group-hover:text-primary"
        )}>
          {title}
        </h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
};
