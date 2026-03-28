import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

/**
 * Consistent section heading component
 */
export const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(({
  title,
  subtitle,
  badge,
  align = 'center',
  size = 'md',
  className,
  titleClassName,
  subtitleClassName
}, ref) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center'
  };

  const sizes = {
    sm: {
      title: 'text-xl md:text-2xl',
      subtitle: 'text-sm',
      spacing: 'space-y-2'
    },
    md: {
      title: 'text-2xl md:text-3xl lg:text-4xl',
      subtitle: 'text-base md:text-lg',
      spacing: 'space-y-3'
    },
    lg: {
      title: 'text-3xl md:text-4xl lg:text-5xl',
      subtitle: 'text-lg md:text-xl',
      spacing: 'space-y-4'
    }
  };

  return (
    <div 
      ref={ref}
      className={cn(
        alignClasses[align],
        sizes[size].spacing,
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
          {badge}
        </span>
      )}
      
      <h2 className={cn(
        "font-bold tracking-tight text-foreground",
        sizes[size].title,
        titleClassName
      )}>
        {title}
      </h2>
      
      {subtitle && (
        <p className={cn(
          "text-muted-foreground max-w-2xl",
          align === 'center' && 'mx-auto',
          sizes[size].subtitle,
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
});

SectionHeading.displayName = 'SectionHeading';
