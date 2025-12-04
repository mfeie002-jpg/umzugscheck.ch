import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ZuerichBreadcrumbProps {
  items?: BreadcrumbItem[];
}

export const ZuerichBreadcrumb = ({ items = [] }: ZuerichBreadcrumbProps) => {
  const defaultItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Regionen", href: "/regionen" },
    { label: "Zürich" },
  ];

  const breadcrumbItems = items.length > 0 ? items : defaultItems;

  return (
    <nav aria-label="Breadcrumb" className="py-3 bg-muted/30">
      <div className="container mx-auto px-4">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          {breadcrumbItems.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              {i === 0 && <Home className="h-4 w-4 text-muted-foreground" />}
              {item.href ? (
                <Link to={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{item.label}</span>
              )}
              {i < breadcrumbItems.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};
