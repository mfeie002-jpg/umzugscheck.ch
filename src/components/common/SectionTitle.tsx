import { memo } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionTitle = memo(({ 
  badge,
  title,
  subtitle,
  align = 'center',
  className = ""
}: SectionTitleProps) => {
  return (
    <div className={cn(
      "max-w-3xl",
      align === 'center' ? "mx-auto text-center" : "text-left",
      className
    )}>
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-wider">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
});

SectionTitle.displayName = 'SectionTitle';
