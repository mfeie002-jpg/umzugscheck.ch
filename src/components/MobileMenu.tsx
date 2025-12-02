import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, Home, Building2, Sparkles, Trash2, Wrench, Box,
  Calculator, Video, Package, Settings, Trophy, TrendingDown, MapPin,
  FileText, DollarSign, CheckSquare, Lightbulb, Briefcase, LogIn, Award, HelpCircle
} from "lucide-react";
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
  { icon: Calculator, title: "Umzugsrechner", href: "/rechner" },
  { icon: Sparkles, title: "Reinigungsrechner", href: "/rechner/reinigung" },
  { icon: Trash2, title: "Entsorgungsrechner", href: "/rechner/entsorgung" },
  { icon: Box, title: "Lagerrechner", href: "/rechner/lager" },
  { icon: Package, title: "Packservice-Rechner", href: "/rechner/packservice" },
  { icon: Wrench, title: "Möbelmontage-Rechner", href: "/rechner/moebelmontage" },
  { icon: Settings, title: "Gesamtpreis-Konfigurator", href: "/rechner/konfigurator" },
  { icon: Video, title: "Video-Umzugsrechner", href: "/rechner/video" },
];

const companies = [
  { icon: Trophy, title: "Beste Umzugsfirmen 2025", href: "/beste-umzugsfirma" },
  { icon: TrendingDown, title: "Günstige Umzugsfirmen", href: "/guenstige-umzugsfirma" },
  { icon: Building2, title: "Umzugsfirmen Schweiz", href: "/umzugsfirmen-schweiz" },
  { icon: MapPin, title: "Zürich", href: "/zuerich/umzugsfirmen" },
  { icon: MapPin, title: "Bern", href: "/bern/umzugsfirmen" },
  { icon: MapPin, title: "Basel", href: "/basel/umzugsfirmen" },
];

const services = [
  { icon: Home, title: "Privatumzug", href: "/privatumzug" },
  { icon: Building2, title: "Firmenumzug", href: "/firmenumzug" },
  { icon: Sparkles, title: "Umzug mit Reinigung", href: "/umzug-mit-reinigung" },
  { icon: Sparkles, title: "Reinigung", href: "/reinigung" },
  { icon: Trash2, title: "Entsorgung & Räumung", href: "/entsorgung-raeumung" },
  { icon: Wrench, title: "Möbellift", href: "/moebellift" },
  { icon: Box, title: "Einlagerung", href: "/einlagerung" }
];

const ratgeber = [
  { icon: DollarSign, title: "Kosten & Preise", href: "/ratgeber/kosten" },
  { icon: CheckSquare, title: "Umzugscheckliste", href: "/ratgeber/checklisten" },
  { icon: Lightbulb, title: "Umzugstipps", href: "/ratgeber/umzugstipps" },
  { icon: FileText, title: "Alle Ratgeber", href: "/ratgeber" },
];

const provider = [
  { icon: Briefcase, title: "Anbieter werden", href: "/anbieter" },
  { icon: LogIn, title: "Anbieter Login", href: "/anbieter/login" },
  { icon: DollarSign, title: "Preise & Konditionen", href: "/anbieter/preise" },
  { icon: HelpCircle, title: "Häufige Fragen", href: "/anbieter/faq" },
  { icon: Award, title: "Vorteile", href: "/anbieter#vorteile" },
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const isActive = (path: string) => location.pathname === path;

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionOpen = (section: string) => openSections.includes(section);

  if (!isOpen) return null;

  const CollapsibleSection = ({ 
    title, 
    section, 
    items 
  }: { 
    title: string; 
    section: string; 
    items: { icon: any; title: string; href: string }[] 
  }) => (
    <Collapsible
      open={isSectionOpen(section)}
      onOpenChange={() => toggleSection(section)}
    >
      <CollapsibleTrigger 
        className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
        aria-expanded={isSectionOpen(section)}
      >
        <span>{title}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isSectionOpen(section) && "rotate-180"
        )} 
        aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
              isActive(item.href)
                ? "bg-primary/10 text-primary border-l-4 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <item.icon className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm">{item.title}</span>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div 
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile Hauptnavigation"
        className="fixed top-16 sm:top-20 right-0 bottom-0 w-[min(320px,85vw)] bg-white border-l border-border z-50 overflow-y-auto shadow-strong animate-slide-in-right lg:hidden"
      >
        <div className="p-6 space-y-2">
          {/* Preisrechner Accordion */}
          <CollapsibleSection title="Preisrechner" section="calculator" items={calculators} />

          {/* Umzugsfirmen Accordion */}
          <CollapsibleSection title="Umzugsfirmen" section="companies" items={companies} />

          {/* Services Accordion */}
          <CollapsibleSection title="Services" section="services" items={services} />

          {/* Regionen - Direct Link */}
          <Link
            to="/regionen"
            onClick={onClose}
            className={cn(
              "flex items-center w-full px-4 py-3 rounded-lg transition-colors font-medium",
              isActive("/regionen")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            Regionen
          </Link>

          {/* Ratgeber Accordion */}
          <CollapsibleSection title="Ratgeber" section="ratgeber" items={ratgeber} />

          {/* Für Firmen Accordion */}
          <CollapsibleSection title="Für Firmen" section="provider" items={provider} />

          {/* Divider */}
          <div className="border-t border-border my-4" />

          {/* CTA */}
          <Link to="/" onClick={onClose}>
            <Button className="w-full bg-destructive hover:bg-destructive/90 shadow-medium">
              Offerten vergleichen
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
