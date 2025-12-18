import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropdownSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const DropdownSection = ({ title, children, className }: DropdownSectionProps) => {
  return (
    <div className={className}>
      {title && (
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          {title}
        </h3>
      )}
      <div className={cn("space-y-1")}>
        {children}
      </div>
    </div>
  );
};
