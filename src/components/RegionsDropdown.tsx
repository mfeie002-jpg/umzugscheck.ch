import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Canton {
  name: string;
  code: string;
  href: string;
}

const cantons: Canton[] = [
  { name: "Zürich", code: "ZH", href: "/zuerich/umzugsfirmen" },
  { name: "Bern", code: "BE", href: "/bern/umzugsfirmen" },
  { name: "Luzern", code: "LU", href: "/luzern/umzugsfirmen" },
  { name: "Uri", code: "UR", href: "/uri/umzugsfirmen" },
  { name: "Schwyz", code: "SZ", href: "/schwyz/umzugsfirmen" },
  { name: "Obwalden", code: "OW", href: "/obwalden/umzugsfirmen" },
  { name: "Nidwalden", code: "NW", href: "/nidwalden/umzugsfirmen" },
  { name: "Glarus", code: "GL", href: "/glarus/umzugsfirmen" },
  { name: "Zug", code: "ZG", href: "/zug/umzugsfirmen" },
  { name: "Fribourg", code: "FR", href: "/fribourg/umzugsfirmen" },
  { name: "Solothurn", code: "SO", href: "/solothurn/umzugsfirmen" },
  { name: "Basel-Stadt", code: "BS", href: "/basel-stadt/umzugsfirmen" },
  { name: "Basel-Landschaft", code: "BL", href: "/basel-landschaft/umzugsfirmen" },
  { name: "Schaffhausen", code: "SH", href: "/schaffhausen/umzugsfirmen" },
  { name: "Appenzell Ausserrhoden", code: "AR", href: "/appenzell-ausserrhoden/umzugsfirmen" },
  { name: "Appenzell Innerrhoden", code: "AI", href: "/appenzell-innerrhoden/umzugsfirmen" },
  { name: "St. Gallen", code: "SG", href: "/st-gallen/umzugsfirmen" },
  { name: "Graubünden", code: "GR", href: "/graubuenden/umzugsfirmen" },
  { name: "Aargau", code: "AG", href: "/aargau/umzugsfirmen" },
  { name: "Thurgau", code: "TG", href: "/thurgau/umzugsfirmen" },
  { name: "Ticino", code: "TI", href: "/ticino/umzugsfirmen" },
  { name: "Vaud", code: "VD", href: "/vaud/umzugsfirmen" },
  { name: "Valais", code: "VS", href: "/valais/umzugsfirmen" },
  { name: "Neuchâtel", code: "NE", href: "/neuchatel/umzugsfirmen" },
  { name: "Genève", code: "GE", href: "/geneve/umzugsfirmen" },
  { name: "Jura", code: "JU", href: "/jura/umzugsfirmen" }
];

interface RegionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegionsDropdown = ({ isOpen, onClose }: RegionsDropdownProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/5 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown Content */}
      <div className="absolute left-0 right-0 top-full mt-0 bg-white border-t border-border shadow-strong z-50 animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Regionen & Kantone</h3>
              <p className="text-sm text-muted-foreground">
                Finden Sie Umzugsfirmen in Ihrer Region
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {cantons.map((canton) => (
                <Link
                  key={canton.code}
                  to={canton.href}
                  onClick={onClose}
                  className={cn(
                    "group p-3 rounded-lg border border-border bg-background",
                    "hover:border-primary/40 hover:shadow-soft transition-all duration-200",
                    "flex items-center gap-3"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                      {canton.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {canton.code}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Link
                to="/regionen"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Alle Regionen anzeigen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
