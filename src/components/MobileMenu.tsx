import { useState, useEffect } from "react";
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
  { icon: Calculator, title: "Umzugsrechner", href: "/umzugsofferten" },
  { icon: Sparkles, title: "Reinigungsrechner", href: "/umzugsofferten?service=reinigung" },
  { icon: Trash2, title: "Entsorgungsrechner", href: "/umzugsofferten?service=entsorgung" },
  { icon: Box, title: "Lagerrechner", href: "/umzugsofferten?service=lagerung" },
  { icon: Package, title: "Packservice-Rechner", href: "/umzugsofferten?service=packservice" },
  { icon: Wrench, title: "Möbelmontage-Rechner", href: "/umzugsofferten?service=montage" },
  { icon: Settings, title: "Gesamtpreis-Konfigurator", href: "/umzugsofferten?service=komplett" },
  { icon: Video, title: "Video-Umzugsrechner", href: "/umzugsofferten?mode=video" },
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

const regions = [
  { icon: MapPin, title: "Zürich", href: "/zuerich/umzugsfirmen" },
  { icon: MapPin, title: "Bern", href: "/bern/umzugsfirmen" },
  { icon: MapPin, title: "Basel", href: "/basel/umzugsfirmen" },
  { icon: MapPin, title: "Luzern", href: "/luzern/umzugsfirmen" },
  { icon: MapPin, title: "Aargau", href: "/aargau/umzugsfirmen" },
  { icon: MapPin, title: "St. Gallen", href: "/st-gallen/umzugsfirmen" },
  { icon: MapPin, title: "Alle Regionen", href: "/regionen" },
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
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle animation state
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const isActive = (path: string) => location.pathname === path;

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionOpen = (section: string) => openSections.includes(section);

  if (!isOpen && !isAnimating) return null;

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
        className={cn(
          "flex items-center justify-between w-full px-4 py-4 min-h-[52px]",
          "text-foreground rounded-xl transition-all duration-200 font-medium",
          "hover:bg-secondary/80 active:bg-secondary active:scale-[0.98]",
          "focus:outline-none focus:ring-2 focus:ring-primary/20"
        )}
        aria-expanded={isSectionOpen(section)}
      >
        <span className="text-base xs:text-[15px]">{title}</span>
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-300 ease-out",
            isSectionOpen(section) && "rotate-180"
          )} 
          aria-hidden="true" 
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="mt-1 space-y-0.5 pb-2">
          {items.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 min-h-[48px] ml-2 mr-1 rounded-lg",
                "transition-all duration-200 active:scale-[0.98]",
                isActive(item.href)
                  ? "bg-primary/10 text-primary border-l-3 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 active:bg-secondary/70"
              )}
              style={{ 
                animationDelay: `${index * 30}ms`,
                animation: isSectionOpen(section) ? 'fade-in 0.2s ease-out forwards' : undefined
              }}
            >
              <item.icon className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm xs:text-[13px]">{item.title}</span>
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <>
      {/* Overlay with smooth fade */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden",
          "transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        onTransitionEnd={() => !isOpen && setIsAnimating(false)}
        aria-hidden="true"
      />
      
      {/* Menu Panel with smooth slide */}
      <div 
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile Hauptnavigation"
        className={cn(
          "fixed top-14 xs:top-16 sm:top-20 right-0 bottom-0",
          "w-[min(320px,88vw)] bg-background border-l border-border",
          "z-50 overflow-y-auto overflow-x-hidden",
          "shadow-xl lg:hidden",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 xs:p-5 sm:p-6 space-y-1 pb-24">
          {/* Preisrechner Accordion */}
          <CollapsibleSection title="Preisrechner" section="calculator" items={calculators} />

          {/* Umzugsfirmen Accordion */}
          <CollapsibleSection title="Umzugsfirmen" section="companies" items={companies} />

          {/* Services Accordion */}
          <CollapsibleSection title="Services" section="services" items={services} />

          {/* Regionen Accordion */}
          <CollapsibleSection title="Regionen" section="regions" items={regions} />

          {/* Ratgeber Accordion */}
          <CollapsibleSection title="Ratgeber" section="ratgeber" items={ratgeber} />

          {/* Für Firmen Accordion */}
          <CollapsibleSection title="Für Firmen" section="provider" items={provider} />

          {/* Divider */}
          <div className="border-t border-border my-4 mx-2" />

          {/* CTA */}
          <div className="px-2 pt-2">
            <Link to="/" onClick={onClose}>
              <Button 
                className={cn(
                  "w-full h-12 xs:h-14 text-base font-semibold",
                  "bg-destructive hover:bg-destructive/90",
                  "shadow-cta active:scale-[0.98] transition-all duration-200"
                )}
              >
                Offerten vergleichen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
