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
    href: "/ratgeber/kosten"
  },
  {
    icon: CheckSquare,
    title: "Umzugscheckliste",
    description: "Schritt-für-Schritt Guide",
    href: "/ratgeber/checklisten"
  },
  {
    icon: Lightbulb,
    title: "Umzugstipps",
    description: "Praktische Tipps für Ihren Umzug",
    href: "/ratgeber/umzugstipps"
  },
  {
    icon: Package,
    title: "Verpackungsratgeber",
    description: "Richtig packen & schützen",
    href: "/ratgeber/umzugstipps"
  },
  {
    icon: FileText,
    title: "Reinigung & Abnahme",
    description: "Wohnungsübergabe perfekt",
    href: "/ratgeber/umzugstipps"
  },
  {
    icon: Trash2,
    title: "Räumung & Entsorgung",
    description: "Entrümpelung & Entsorgung",
    href: "/ratgeber/kosten"
  }
];

export const RatgeberDropdown = ({ isOpen, onClose }: RatgeberDropdownProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/5 z-40 hidden lg:block"
        onClick={onClose}
      />
      
      {/* Dropdown Content */}
      <div className="hidden lg:block absolute left-0 right-0 top-full mt-0 bg-white border-t border-border shadow-strong z-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ratgeberItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="flex flex-col items-start gap-3 p-4 rounded-xl hover:bg-secondary/50 transition-all duration-200 group border border-transparent hover:border-primary/20"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};
