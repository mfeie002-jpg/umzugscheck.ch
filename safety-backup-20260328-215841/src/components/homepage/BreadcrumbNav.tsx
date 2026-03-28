import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
}

const routeLabels: Record<string, string> = {
  "/": "Startseite",
  "/rechner": "Preisrechner",
  "/umzugsfirmen": "Umzugsfirmen",
  "/umzugsofferten": "Offerten",
  "/dienstleistungen": "Services",
  "/regionen": "Regionen",
  "/ratgeber": "Ratgeber",
  "/fuer-firmen": "Für Firmen",
  "/kontakt": "Kontakt",
};

export const BreadcrumbNav = ({ items }: BreadcrumbNavProps) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from path if not provided
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const paths = location.pathname.split("/").filter(Boolean);
    return [
      { label: "Startseite", href: "/" },
      ...paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");
        return {
          label: routeLabels[href] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
          href: index === paths.length - 1 ? undefined : href,
        };
      }),
    ];
  })();

  // Don't render on homepage
  if (location.pathname === "/") return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="py-3 text-sm"
    >
      <ol 
        className="flex items-center gap-1 flex-wrap"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        {breadcrumbs.map((item, index) => (
          <li 
            key={index}
            className="flex items-center gap-1"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                itemProp="item"
              >
                {index === 0 && <Home className="w-3.5 h-3.5" />}
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-foreground font-medium" itemProp="name">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};
