import { cn } from "@/lib/utils";
import { Breadcrumbs, BreadcrumbItem } from "@/components/Breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'centered' | 'hero';
  badge?: string;
}

/**
 * Unified page header component for consistent page layout
 * Includes breadcrumbs, title, description, and optional badge
 */
export const PageHeader = ({
  title,
  description,
  breadcrumbs,
  children,
  className,
  variant = 'default',
  badge
}: PageHeaderProps) => {
  const variants = {
    default: 'text-left',
    centered: 'text-center',
    hero: 'text-center py-8 md:py-12'
  };

  return (
    <header className={cn('space-y-4', variants[variant], className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}
      
      <div className="space-y-3">
        {badge && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {badge}
          </span>
        )}
        
        <h1 className="heading-premium text-3xl md:text-4xl lg:text-5xl">
          {title}
        </h1>
        
        {description && (
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {children && (
        <div className="pt-4">
          {children}
        </div>
      )}
    </header>
  );
};
