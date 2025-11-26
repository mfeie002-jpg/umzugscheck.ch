import { Link } from "react-router-dom";
import { FileText, DollarSign, CheckSquare, Package, Trash2, Lightbulb } from "lucide-react";

interface RatgeberDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ratgeberItems = [
  {
    icon: DollarSign,
    title: "Kosten & Preise",
    description: "Was kostet ein Umzug?",
    href: "/umzugskosten-guide"
  },
  {
    icon: CheckSquare,
    title: "Umzugscheckliste",
    description: "Schritt-für-Schritt Guide",
    href: "/blog/umzugscheckliste"
  },
  {
    icon: Package,
    title: "Verpackungsratgeber",
    description: "Richtig packen & schützen",
    href: "/blog/verpackungstipps"
  },
  {
    icon: FileText,
    title: "Reinigung & Abnahme",
    description: "Wohnungsübergabe perfekt",
    href: "/blog/endreinigung-tipps"
  },
  {
    icon: Trash2,
    title: "Räumung & Entsorgung",
    description: "Entrümpelung & Entsorgung",
    href: "/blog/entsorgungs-ratgeber"
  },
  {
    icon: Lightbulb,
    title: "Tipps & Tricks",
    description: "Alle Ratgeber-Artikel",
    href: "/blog"
  }
];

export const RatgeberDropdown = ({ isOpen, onClose }: RatgeberDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div className="hidden lg:block absolute left-0 right-0 bg-white border-t border-border shadow-2xl z-40 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Ratgeber & Wissen</h3>
            <p className="text-sm text-muted-foreground">
              Hilfreiche Tipps und Guides für Ihren stressfreien Umzug
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {ratgeberItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
