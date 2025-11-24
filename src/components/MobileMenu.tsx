import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Calculator, Sparkles, Trash2, Package, Wrench, Box, Settings, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const calculators = [
  {
    icon: Calculator,
    title: "Umzugsrechner",
    href: "/rechner"
  },
  {
    icon: Sparkles,
    title: "Reinigungsrechner",
    href: "/rechner/reinigung"
  },
  {
    icon: Trash2,
    title: "Entsorgungsrechner",
    href: "/rechner/entsorgung"
  },
  {
    icon: Box,
    title: "Lagerrechner",
    href: "/rechner/lager"
  },
  {
    icon: Package,
    title: "Packservice-Rechner",
    href: "/rechner/packservice"
  },
  {
    icon: Wrench,
    title: "Möbelmontage-Rechner",
    href: "/rechner/moebelmontage"
  },
  {
    icon: Settings,
    title: "Gesamtpreis-Konfigurator",
    href: "/rechner/konfigurator"
  },
  {
    icon: Video,
    title: "Video-Umzugsrechner",
    href: "/rechner/video"
  }
];

const cantons = [
  { name: "Zürich", href: "/zuerich/umzugsfirmen" },
  { name: "Bern", href: "/bern/umzugsfirmen" },
  { name: "Luzern", href: "/luzern/umzugsfirmen" },
  { name: "Uri", href: "/uri/umzugsfirmen" },
  { name: "Schwyz", href: "/schwyz/umzugsfirmen" },
  { name: "Obwalden", href: "/obwalden/umzugsfirmen" },
  { name: "Nidwalden", href: "/nidwalden/umzugsfirmen" },
  { name: "Glarus", href: "/glarus/umzugsfirmen" },
  { name: "Zug", href: "/zug/umzugsfirmen" },
  { name: "Fribourg", href: "/fribourg/umzugsfirmen" },
  { name: "Solothurn", href: "/solothurn/umzugsfirmen" },
  { name: "Basel-Stadt", href: "/basel-stadt/umzugsfirmen" },
  { name: "Basel-Landschaft", href: "/basel-landschaft/umzugsfirmen" },
  { name: "Schaffhausen", href: "/schaffhausen/umzugsfirmen" },
  { name: "Appenzell Ausserrhoden", href: "/appenzell-ausserrhoden/umzugsfirmen" },
  { name: "Appenzell Innerrhoden", href: "/appenzell-innerrhoden/umzugsfirmen" },
  { name: "St. Gallen", href: "/st-gallen/umzugsfirmen" },
  { name: "Graubünden", href: "/graubuenden/umzugsfirmen" },
  { name: "Aargau", href: "/aargau/umzugsfirmen" },
  { name: "Thurgau", href: "/thurgau/umzugsfirmen" },
  { name: "Ticino", href: "/ticino/umzugsfirmen" },
  { name: "Vaud", href: "/vaud/umzugsfirmen" },
  { name: "Valais", href: "/valais/umzugsfirmen" },
  { name: "Neuchâtel", href: "/neuchatel/umzugsfirmen" },
  { name: "Genève", href: "/geneve/umzugsfirmen" },
  { name: "Jura", href: "/jura/umzugsfirmen" }
];

const mainNavItems = [
  { label: "Startseite", href: "/" },
  { label: "Umzugsfirmen", href: "/firmen" },
  { label: "Ratgeber", href: "/blog" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" }
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-20 md:top-24 right-0 bottom-0 w-80 max-w-[85vw] bg-white border-l border-border z-50 overflow-y-auto shadow-strong animate-slide-in-right lg:hidden">
        <div className="p-6 space-y-2">
          {/* Main Nav Items */}
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className="block px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}

          {/* Calculators Accordion */}
          <Collapsible
            open={isCalculatorsOpen}
            onOpenChange={setIsCalculatorsOpen}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium">
              <span>Preisrechner</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isCalculatorsOpen && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {calculators.map((calc) => (
                <Link
                  key={calc.title}
                  to={calc.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 ml-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  <calc.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{calc.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Regions Accordion */}
          <Collapsible
            open={isRegionsOpen}
            onOpenChange={setIsRegionsOpen}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium">
              <span>Regionen</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isRegionsOpen && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1 max-h-64 overflow-y-auto">
              {cantons.map((canton) => (
                <Link
                  key={canton.name}
                  to={canton.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 ml-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{canton.name}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Divider */}
          <div className="border-t border-border my-4" />

          {/* Auth & CTA */}
          <Link to="/auth" onClick={onClose}>
            <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
              Admin Login
            </Button>
          </Link>
          <Link to="/rechner" onClick={onClose}>
            <Button className="w-full bg-accent hover:bg-accent/90 shadow-medium">
              Offerten erhalten
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
