import { Link } from "react-router-dom";
import { Truck, Sparkles, Trash2, Package, Wrench, Home, Building2, Globe, Piano, Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServicesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  { icon: Truck, label: "Umzug", href: "/rechner", description: "Kompletter Umzugsservice" },
  { icon: Sparkles, label: "Reinigung", href: "/rechner/reinigung", description: "Endreinigung mit Garantie" },
  { icon: Trash2, label: "Entsorgung", href: "/rechner/entsorgung", description: "Entrümpelung & Entsorgung" },
  { icon: Box, label: "Lagerung", href: "/rechner/lager", description: "Sichere Lagerlösungen" },
  { icon: Wrench, label: "Möbelmontage", href: "/rechner/moebelmontage", description: "Auf- und Abbau Service" },
  { icon: Home, label: "Wohnungsabgabe", href: "/rechner/konfigurator", description: "Komplettservice für Übergabe" },
  { icon: Building2, label: "Räumungen", href: "/rechner/entsorgung", description: "Wohnungs- & Kellerräumung" },
  { icon: Globe, label: "Firmenumzug", href: "/rechner", description: "Business Relocation" },
  { icon: Globe, label: "Internationale Umzüge", href: "/rechner", description: "Grenzüberschreitend" },
  { icon: Piano, label: "Klaviertransport", href: "/rechner", description: "Spezialtransporte" }
];

export const ServicesDropdown = ({ isOpen, onClose }: ServicesDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-t border-border shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.label}
                to={service.href}
                onClick={onClose}
                className={cn(
                  "flex flex-col items-start gap-3 p-4 rounded-xl hover:bg-secondary/50 transition-all duration-200 group border border-transparent hover:border-primary/20"
                )}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                    {service.label}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
