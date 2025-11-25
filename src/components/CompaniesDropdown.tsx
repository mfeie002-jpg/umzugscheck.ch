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
      href: "/firmen",
    },
  ];

  const regionalLinks = [
    { label: "Zürich", href: "/beste-umzugsfirma/zuerich" },
    { label: "Bern", href: "/beste-umzugsfirma/bern" },
    { label: "Basel", href: "/beste-umzugsfirma/basel" },
    { label: "Luzern", href: "/beste-umzugsfirma/luzern" },
    { label: "St. Gallen", href: "/beste-umzugsfirma/st-gallen" },
    { label: "Winterthur", href: "/beste-umzugsfirma/winterthur" },
  ];

  return (
    <div
      className={cn(
        "absolute left-0 right-0 top-full mt-2 bg-background border border-border rounded-lg shadow-xl transition-all duration-200 z-50",
        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
      )}
      style={{ width: "600px", marginLeft: "0" }}
    >
      <div className="p-6">
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
