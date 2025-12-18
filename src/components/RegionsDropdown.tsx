import { MapPin, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DropdownWrapper } from "./navigation/DropdownWrapper";
import { DropdownSection } from "./navigation/DropdownSection";

interface Canton {
  name: string;
  code: string;
  href: string;
  popular?: boolean;
}

const cantons: Canton[] = [
  { name: "Zürich", code: "ZH", href: "/zuerich", popular: true },
  { name: "Bern", code: "BE", href: "/bern", popular: true },
  { name: "Basel", code: "BS", href: "/basel", popular: true },
  { name: "Luzern", code: "LU", href: "/luzern", popular: true },
  { name: "Aargau", code: "AG", href: "/aargau", popular: true },
  { name: "St. Gallen", code: "SG", href: "/st-gallen", popular: true },
  { name: "Genève", code: "GE", href: "/geneve" },
  { name: "Wallis", code: "VS", href: "/wallis" },
  { name: "Tessin", code: "TI", href: "/tessin" },
  { name: "Fribourg", code: "FR", href: "/fribourg" },
  { name: "Solothurn", code: "SO", href: "/solothurn" },
  { name: "Thurgau", code: "TG", href: "/thurgau" },
  { name: "Graubünden", code: "GR", href: "/graubuenden" },
  { name: "Neuchâtel", code: "NE", href: "/neuchatel" },
  { name: "Schwyz", code: "SZ", href: "/schwyz" },
  { name: "Zug", code: "ZG", href: "/zug" },
  { name: "Schaffhausen", code: "SH", href: "/schaffhausen" },
  { name: "Jura", code: "JU", href: "/jura" },
  { name: "Appenzell", code: "AR", href: "/appenzell" },
  { name: "Uri", code: "UR", href: "/uri" },
  { name: "Obwalden", code: "OW", href: "/obwalden" },
  { name: "Nidwalden", code: "NW", href: "/nidwalden" },
  { name: "Glarus", code: "GL", href: "/glarus" },
];

interface RegionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegionsDropdown = ({ isOpen, onClose }: RegionsDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const popularCantons = cantons.filter(c => c.popular);
  const filteredCantons = searchTerm 
    ? cantons.filter(canton => 
        canton.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        canton.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cantons;

  return (
    <DropdownWrapper isOpen={isOpen} onClose={onClose}>
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Search & Popular */}
          <div>
            <DropdownSection title="Region suchen">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Kanton oder Stadt suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Beliebte Regionen
              </h4>
              <div className="space-y-1">
                {popularCantons.map((canton) => (
                  <Link
                    key={canton.code}
                    to={canton.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {canton.name}
                    </span>
                  </Link>
                ))}
              </div>
            </DropdownSection>
          </div>

          {/* All Cantons Grid */}
          <div className="lg:border-l lg:border-border lg:pl-8">
            <DropdownSection title={searchTerm ? `Suchergebnisse (${filteredCantons.length})` : "Alle Kantone"}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                {filteredCantons.map((canton) => (
                  <Link
                    key={canton.code}
                    to={canton.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all",
                      "hover:bg-accent hover:text-primary",
                      canton.popular ? "font-medium text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{canton.name}</span>
                  </Link>
                ))}
              </div>
              
              {filteredCantons.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Keine Region gefunden</p>
                </div>
              )}

              <Link
                to="/regionen"
                onClick={onClose}
                className="flex items-center gap-2 mt-4 px-3 py-2 text-sm font-semibold text-primary hover:underline"
              >
                Alle Regionen auf einer Seite
                <ArrowRight className="w-4 h-4" />
              </Link>
            </DropdownSection>
          </div>
        </div>
      </div>
    </DropdownWrapper>
  );
};
