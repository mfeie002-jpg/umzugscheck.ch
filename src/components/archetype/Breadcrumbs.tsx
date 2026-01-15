/**
 * BREADCRUMBS
 * 
 * SEO-friendly breadcrumb navigation with Schema.org markup
 */

import { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Helmet } from "react-helmet";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export const Breadcrumbs = memo(({ items, currentPage }: BreadcrumbsProps) => {
  // Schema.org BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://umzugscheck.ch",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `https://umzugscheck.ch${item.href}`,
      })),
      {
        "@type": "ListItem",
        "position": items.length + 2,
        "name": currentPage,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <nav 
        aria-label="Breadcrumb" 
        className="bg-muted/50 border-b border-border"
      >
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-1 py-3 text-sm overflow-x-auto">
            {/* Home */}
            <li>
              <Link 
                to="/" 
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            
            {/* Path items */}
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                <Link 
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            
            {/* Current page */}
            <li className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="font-medium whitespace-nowrap">{currentPage}</span>
            </li>
          </ol>
        </div>
      </nav>
    </>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';
