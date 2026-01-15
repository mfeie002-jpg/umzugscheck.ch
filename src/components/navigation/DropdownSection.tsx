import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropdownSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const DropdownSection = ({ title, subtitle, children, className }: DropdownSectionProps) => {
  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3 px-1">
          {title && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[11px] text-muted-foreground/70 mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={cn("space-y-1")}>
        {children}
      </div>
    </div>
  );
};
