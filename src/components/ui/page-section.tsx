import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted' | 'primary' | 'dark';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  container?: boolean;
  as?: 'section' | 'div' | 'article' | 'aside';
}

/**
 * Page section component for consistent section styling
 * with background variants and spacing options
 */
export const PageSection = forwardRef<HTMLElement, PageSectionProps>(({
  children,
  className,
  variant = 'default',
  spacing = 'lg',
  container = true,
  as: Component = 'section',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-background',
    muted: 'bg-muted/50',
    primary: 'bg-primary text-primary-foreground',
    dark: 'bg-foreground text-background'
  };

  const spacings = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-20 lg:py-24',
    xl: 'py-20 md:py-28 lg:py-32'
  };

  return (
    <Component
      ref={ref as any}
      className={cn(
        variants[variant],
        spacings[spacing],
        className
      )}
      {...props}
    >
      {container ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
});

PageSection.displayName = 'PageSection';
