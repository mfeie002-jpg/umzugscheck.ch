/**
 * Enhanced Breadcrumbs Component
 * 
 * Features:
 * - Schema.org JSON-LD structured data
 * - Responsive design (mobile truncation)
 * - Multiple style variants
 * - Automatic home icon
 */

import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Helmet } from "react-helmet";
import { cn } from "@/lib/utils";
import { memo } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface EnhancedBreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'pill' | 'card';
}

export const EnhancedBreadcrumbs = memo(function EnhancedBreadcrumbs({ 
  items, 
  showHome = true, 
  className,
  variant = 'default' 
}: EnhancedBreadcrumbsProps) {
  const allItems = showHome 
    ? [{ label: "Home", href: "/" }, ...items]
    : items;

  // Schema.org BreadcrumbList for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://umzugscheck.ch${item.href}` : undefined
    }))
  };

  const variantStyles = {
    default: 'py-3',
    minimal: 'py-2',
    pill: 'py-2 px-4 bg-muted/50 rounded-full inline-flex',
    card: 'py-3 px-4 bg-card border border-border rounded-lg shadow-sm'
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn(variantStyles[variant], className)}
    >
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = showHome && index === 0;

          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              {index > 0 && (
                <ChevronRight 
                  className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" 
                  aria-hidden="true"
                />
              )}
              
              {isLast ? (
                <span 
                  className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none" 
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className={cn(
                    "text-muted-foreground hover:text-primary transition-colors",
                    "flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
                    "truncate max-w-[120px] sm:max-w-none"
                  )}
                >
                  {isHome && <Home className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
                  <span className={isHome ? "sr-only sm:not-sr-only" : ""}>{item.label}</span>
                </Link>
              ) : (
                <span className="text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

export default EnhancedBreadcrumbs;
