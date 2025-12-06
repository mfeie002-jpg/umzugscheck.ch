import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Wrench, BookOpen } from "lucide-react";

interface InternalLinksBlockProps {
  variant?: "grid" | "inline";
  showAll?: boolean;
}

const linkCategories = [
  {
    title: "Umzug planen",
    icon: Wrench,
    links: [
      { label: "Startseite", href: "/" },
      { label: "Umzugsrechner", href: "/rechner" },
      { label: "KI Video-Analyse", href: "/rechner/video" },
      { label: "Umzugsofferten", href: "/umzugsofferten" },
    ]
  },
  {
    title: "Firmen finden",
    icon: MapPin,
    links: [
      { label: "Alle Umzugsfirmen", href: "/umzugsfirmen" },
      { label: "Beste Umzugsfirmen", href: "/beste-umzugsfirma" },
      { label: "Günstige Umzugsfirmen", href: "/guenstige-umzugsfirma" },
    ]
  },
  {
    title: "Services",
    icon: Wrench,
    links: [
      { label: "Privatumzug", href: "/privatumzug" },
      { label: "Firmenumzug", href: "/firmenumzug" },
      { label: "Umzugsreinigung", href: "/reinigung" },
      { label: "Entsorgung", href: "/entsorgung" },
      { label: "Möbellagerung", href: "/lagerung" },
    ]
  },
  {
    title: "Regionen",
    icon: MapPin,
    links: [
      { label: "Umzug Zürich", href: "/zuerich" },
      { label: "Umzug Bern", href: "/bern" },
      { label: "Umzug Basel", href: "/basel" },
      { label: "Umzug Luzern", href: "/luzern" },
      { label: "Alle Regionen", href: "/regionen" },
    ]
  },
  {
    title: "Ratgeber",
    icon: BookOpen,
    links: [
      { label: "Umzugsratgeber", href: "/ratgeber" },
      { label: "Umzugskosten Schweiz", href: "/preise" },
      { label: "FAQ", href: "/faq" },
      { label: "So funktioniert's", href: "/so-funktionierts" },
    ]
  }
];

export const InternalLinksBlock = ({ 
  variant = "grid", 
  showAll = false 
}: InternalLinksBlockProps) => {
  const displayCategories = showAll ? linkCategories : linkCategories.slice(0, 4);
  
  if (variant === "inline") {
    const allLinks = linkCategories.flatMap(cat => cat.links).slice(0, 8);
    return (
      <div className="flex flex-wrap gap-3 text-sm">
        {allLinks.map((link, idx) => (
          <Link 
            key={idx}
            to={link.href}
            className="text-primary hover:underline hover:text-primary/80 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <section className="py-10 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Weitere hilfreiche Seiten
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayCategories.map((category, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-medium text-foreground text-sm flex items-center gap-1.5">
                <category.icon className="h-4 w-4 text-primary" />
                {category.title}
              </h3>
              {category.links.map((link, linkIdx) => (
                <Link
                  key={linkIdx}
                  to={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Quick links for footer or sidebar
export const QuickLinks = () => (
  <div className="space-y-2">
    <Link to="/umzugsofferten" className="flex items-center gap-2 text-sm text-primary hover:underline">
      <ArrowRight className="h-3 w-3" />
      Kostenlos Offerten erhalten
    </Link>
    <Link to="/rechner" className="flex items-center gap-2 text-sm text-primary hover:underline">
      <ArrowRight className="h-3 w-3" />
      Umzugskosten berechnen
    </Link>
    <Link to="/umzugsfirmen" className="flex items-center gap-2 text-sm text-primary hover:underline">
      <ArrowRight className="h-3 w-3" />
      Umzugsfirmen vergleichen
    </Link>
  </div>
);
