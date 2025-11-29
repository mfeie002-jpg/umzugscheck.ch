import { Link } from "react-router-dom";
import { Trophy, TrendingDown, MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompaniesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompaniesDropdown = ({ isOpen, onClose }: CompaniesDropdownProps) => {
  const rankingLinks = [
    {
      title: "Beste Umzugsfirmen 2025",
      description: "Top-bewertete Firmen basierend auf Kundenfeedback",
      icon: Trophy,
      href: "/beste-umzugsfirma",
    },
    {
      title: "Günstige Umzugsfirmen",
      description: "Preiswerte Anbieter mit bestem Preis-Leistungs-Verhältnis",
      icon: TrendingDown,
      href: "/guenstige-umzugsfirma",
    },
    {
      title: "Umzugsfirmen Schweiz",
      description: "Alle geprüften Umzugsfirmen im Überblick",
      icon: Building2,
      href: "/umzugsfirmen-schweiz",
    },
  ];

  const regionalLinks = [
    { label: "Zürich", href: "/zuerich/umzugsfirmen" },
    { label: "Bern", href: "/bern/umzugsfirmen" },
    { label: "Basel", href: "/basel/umzugsfirmen" },
    { label: "Luzern", href: "/luzern/umzugsfirmen" },
  ];

  if (!isOpen) return null;

  return (
    <div className="hidden lg:block absolute left-0 right-0 top-full bg-white border-t border-border shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Main Rankings */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Rankings & Vergleiche
            </h3>
            <div className="space-y-2">
              {rankingLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="mt-0.5 p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-0.5 group-hover:text-primary transition-colors">
                      {item.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Regional Links */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Nach Region
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {regionalLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="text-sm px-3 py-2 rounded-md hover:bg-muted/50 hover:text-primary transition-colors text-center font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
