import { Link } from "react-router-dom";
import { Trophy, TrendingDown, MapPin, Building2, ArrowRight } from "lucide-react";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownLink } from "./navigation/DropdownLink";
import { DropdownSection } from "./navigation/DropdownSection";

interface CompaniesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const rankingLinks = [
  {
    title: "Beste Umzugsfirmen 2025",
    description: "Top-bewertete Firmen basierend auf Kundenfeedback",
    icon: Trophy,
    href: "/beste-umzugsfirma",
    featured: true,
  },
  {
    title: "Günstige Umzugsfirmen",
    description: "Preiswerte Anbieter mit bestem Preis-Leistungs-Verhältnis",
    icon: TrendingDown,
    href: "/guenstige-umzugsfirma",
  },
  {
    title: "Alle Umzugsfirmen Schweiz",
    description: "Alle geprüften Umzugsfirmen im Überblick",
    icon: Building2,
    href: "/umzugsfirmen-schweiz",
  },
];

const topRegions = [
  { label: "Zürich", href: "/zuerich/umzugsfirmen" },
  { label: "Bern", href: "/bern/umzugsfirmen" },
  { label: "Basel", href: "/basel/umzugsfirmen" },
  { label: "Luzern", href: "/luzern/umzugsfirmen" },
  { label: "Aargau", href: "/aargau/umzugsfirmen" },
  { label: "St. Gallen", href: "/st-gallen/umzugsfirmen" },
];

export const CompaniesDropdown = ({ isOpen, onClose }: CompaniesDropdownProps) => {
  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Rankings */}
          <DropdownSection title="Rankings & Vergleiche">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {rankingLinks.map((item) => (
                <DropdownLink
                  key={item.href}
                  to={item.href}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  onClick={onClose}
                  featured={item.featured}
                />
              ))}
            </div>
          </DropdownSection>

          {/* Popular Regions */}
          <div className="lg:border-l lg:border-border lg:pl-8">
            <DropdownSection title="Beliebte Regionen">
              <div className="grid grid-cols-2 gap-1">
                {topRegions.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                  >
                    <MapPin className="w-4 h-4 text-primary" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link
                to="/regionen"
                onClick={onClose}
                className="flex items-center gap-2 mt-3 px-3 py-2 text-sm font-semibold text-primary hover:underline"
              >
                Alle Regionen anzeigen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};
