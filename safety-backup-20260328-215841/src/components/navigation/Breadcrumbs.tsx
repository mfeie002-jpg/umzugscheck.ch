/**
 * Breadcrumb Navigation (SEO Optimized)
 * 
 * Features:
 * - Schema.org structured data
 * - Responsive design
 * - Accessible
 * - Auto-generates from route
 */

import { memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

// Route to label mapping
const ROUTE_LABELS: Record<string, string> = {
  '': 'Startseite',
  'preisrechner': 'Preisrechner',
  'firmen': 'Umzugsfirmen',
  'services': 'Services',
  'regionen': 'Regionen',
  'ratgeber': 'Ratgeber',
  'kontakt': 'Kontakt',
  'umzugsofferten': 'Offerten',
  'beste-umzugsfirma': 'Beste Umzugsfirmen',
  'guenstige-umzugsfirma': 'Günstige Umzugsfirmen',
  'privatumzug': 'Privatumzug',
  'firmenumzug': 'Firmenumzug',
  'reinigung': 'Reinigung',
  'entsorgung': 'Entsorgung',
  'lagerung': 'Lagerung',
  'zuerich': 'Zürich',
  'bern': 'Bern',
  'basel': 'Basel',
  'aargau': 'Aargau',
  'luzern': 'Luzern',
  'st-gallen': 'St. Gallen',
};

export const Breadcrumbs = memo(function Breadcrumbs({
  items,
  className,
  showHome = true,
}: BreadcrumbsProps) {
  const location = useLocation();

  // Generate items from route if not provided
  const breadcrumbItems = useMemo(() => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const generated: BreadcrumbItem[] = [];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      generated.push({
        label,
        href: index < pathSegments.length - 1 ? currentPath : undefined,
      });
    });

    return generated;
  }, [items, location.pathname]);

  if (breadcrumbItems.length === 0 && !showHome) return null;

  // Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ...(showHome ? [{
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: window.location.origin,
      }] : []),
      ...breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: (showHome ? 2 : 1) + index,
        name: item.label,
        item: item.href ? `${window.location.origin}${item.href}` : undefined,
      })),
    ],
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Visible breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={cn('flex items-center text-sm', className)}
      >
        <ol className="flex items-center flex-wrap gap-1">
          {/* Home */}
          {showHome && (
            <li className="flex items-center">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                aria-label="Zur Startseite"
              >
                <Home className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only">Startseite</span>
              </Link>
            </li>
          )}

          {/* Items */}
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" aria-hidden="true" />
              {item.href ? (
                <Link
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
});

/**
 * Compact breadcrumbs for mobile
 */
export const BreadcrumbsCompact = memo(function BreadcrumbsCompact({
  items,
  className,
}: BreadcrumbsProps) {
  const location = useLocation();

  // Only show parent on mobile
  const parentItem = useMemo(() => {
    if (items && items.length > 0) {
      return items[items.length - 2];
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length < 2) return null;

    const parentSegment = pathSegments[pathSegments.length - 2];
    const parentPath = '/' + pathSegments.slice(0, -1).join('/');
    
    return {
      label: ROUTE_LABELS[parentSegment] || parentSegment,
      href: parentPath,
    };
  }, [items, location.pathname]);

  if (!parentItem) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <Link
        to={parentItem.href || '/'}
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span>{parentItem.label}</span>
      </Link>
    </nav>
  );
});
