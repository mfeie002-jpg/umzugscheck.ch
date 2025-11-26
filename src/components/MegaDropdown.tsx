import { Calculator, Sparkles, Trash2, Package, Wrench, Box, Settings, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CalculatorItem {
  icon: any;
  title: string;
  description: string;
  href: string;
}

const calculators: CalculatorItem[] = [
  {
    icon: Calculator,
    title: "Umzugsrechner",
    description: "Berechnen Sie Ihre Umzugskosten",
    href: "/rechner"
  },
  {
    icon: Sparkles,
    title: "Reinigungsrechner",
    description: "Endreinigung kalkulieren",
    href: "/rechner/reinigung"
  },
  {
    icon: Trash2,
    title: "Entsorgungsrechner",
    description: "Kosten für Entsorgung ermitteln",
    href: "/rechner/entsorgung"
  },
  {
    icon: Box,
    title: "Lagerrechner",
    description: "Lagerkosten berechnen",
    href: "/rechner/lager"
  },
  {
    icon: Package,
    title: "Packservice-Rechner",
    description: "Packservice-Kosten kalkulieren",
    href: "/rechner/packservice"
  },
  {
    icon: Wrench,
    title: "Möbelmontage-Rechner",
    description: "Montagekosten berechnen",
    href: "/rechner/moebelmontage"
  },
  {
    icon: Settings,
    title: "Gesamtpreis-Konfigurator",
    description: "Alle Services kombinierbar",
    href: "/rechner/konfigurator"
  },
  {
    icon: Video,
    title: "Video-Umzugsrechner",
    description: "KI-Analyse per Video",
    href: "/rechner/video"
  }
];

interface MegaDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaDropdown = ({ isOpen, onClose }: MegaDropdownProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/5 z-40 hidden lg:block"
        onClick={onClose}
      />
      
      {/* Dropdown Content - Hidden on mobile */}
      <div className="hidden lg:block absolute left-0 right-0 top-full mt-0 bg-white border-t border-border shadow-strong z-50 animate-fade-in">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Preisrechner</h3>
              <p className="text-sm text-muted-foreground">Wählen Sie den passenden Rechner für Ihre Bedürfnisse</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calculators.map((calc, index) => (
                <Link
                  key={index}
                  to={calc.href}
                  onClick={onClose}
                  className={cn(
                    "group p-4 rounded-xl border border-border bg-background",
                    "hover:border-primary/40 hover:shadow-soft transition-all duration-200",
                    "flex items-start gap-4"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <calc.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {calc.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {calc.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
