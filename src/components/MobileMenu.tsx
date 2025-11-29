import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, Home, Building2, Sparkles, Trash2, Package, Wrench, Box,
  Calculator, Video, Settings, Trophy, TrendingDown, MapPin,
  DollarSign, CheckSquare, Lightbulb, FileText, Briefcase, LogIn, Award, HelpCircle
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
  { icon: Video, title: "Video-Umzugsrechner", href: "/rechner/video" }
];

const companies = [
  { icon: Trophy, title: "Beste Umzugsfirmen 2025", href: "/beste-umzugsfirma" },
  { icon: TrendingDown, title: "Günstige Umzugsfirmen", href: "/guenstige-umzugsfirma" },
  { icon: Building2, title: "Umzugsfirmen Schweiz", href: "/umzugsfirmen-schweiz" }
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

const cantons = [
  { name: "Zürich", href: "/zuerich/umzugsfirmen" },
  { name: "Bern", href: "/bern/umzugsfirmen" },
  { name: "Basel-Stadt", href: "/basel/umzugsfirmen" },
  { name: "Luzern", href: "/luzern/umzugsfirmen" },
  { name: "Zug", href: "/zug/umzugsfirmen" },
  { name: "Aargau", href: "/aargau/umzugsfirmen" },
  { name: "St. Gallen", href: "/st-gallen/umzugsfirmen" },
  { name: "Genève", href: "/geneve/umzugsfirmen" }
];

const ratgeber = [
  { icon: DollarSign, title: "Kosten & Preise", href: "/ratgeber/kosten" },
  { icon: CheckSquare, title: "Umzugscheckliste", href: "/ratgeber/checklisten" },
  { icon: Lightbulb, title: "Umzugstipps", href: "/ratgeber/umzugstipps" },
  { icon: Package, title: "Verpackungsratgeber", href: "/ratgeber/umzugstipps" },
  { icon: FileText, title: "Reinigung & Abnahme", href: "/ratgeber/umzugstipps" }
];

const provider = [
  { icon: Briefcase, title: "Anbieter werden", href: "/anbieter" },
  { icon: LogIn, title: "Anbieter Login", href: "/anbieter/login" },
  { icon: DollarSign, title: "Preise & Konditionen", href: "/anbieter/preise" },
  { icon: HelpCircle, title: "Häufige Fragen", href: "/anbieter/faq" },
  { icon: Award, title: "Vorteile", href: "/anbieter#vorteile" }
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [isRatgeberOpen, setIsRatgeberOpen] = useState(false);
  const [isProviderOpen, setIsProviderOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;

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
          <Collapsible
            open={isCalculatorsOpen}
            onOpenChange={setIsCalculatorsOpen}
          >
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
            >
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
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                    isActive(calc.href)
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <calc.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{calc.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Umzugsfirmen Accordion */}
          <Collapsible
            open={isCompaniesOpen}
            onOpenChange={setIsCompaniesOpen}
          >
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
            >
              <span>Umzugsfirmen</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isCompaniesOpen && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {companies.map((company) => (
                <Link
                  key={company.title}
                  to={company.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                    isActive(company.href)
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <company.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{company.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Services Accordion */}
          <Collapsible
            open={isServicesOpen}
            onOpenChange={setIsServicesOpen}
          >
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
              aria-expanded={isServicesOpen}
              aria-controls="services-menu"
              aria-label="Services Menü öffnen"
            >
              <span>Services</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isServicesOpen && "rotate-180"
              )} 
              aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent id="services-menu" className="mt-2 space-y-1">
              {services.map((service) => (
                <Link
                  key={service.title}
                  to={service.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                    isActive(service.href)
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  aria-label={service.title}
                >
                  <service.icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-sm">{service.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Regionen Accordion */}
          <Collapsible
            open={isRegionsOpen}
            onOpenChange={setIsRegionsOpen}
          >
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
            >
              <span>Regionen</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isRegionsOpen && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {cantons.map((canton) => (
                <Link
                  key={canton.name}
                  to={canton.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                    isActive(canton.href)
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">{canton.name}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Ratgeber Accordion */}
          <Collapsible
            open={isRatgeberOpen}
            onOpenChange={setIsRatgeberOpen}
          >
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
            >
              <span>Ratgeber</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isRatgeberOpen && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {ratgeber.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Für Firmen Accordion */}
          <Collapsible
            open={isProviderOpen}
            onOpenChange={setIsProviderOpen}
          >
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
            >
              <span>Für Firmen</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isProviderOpen && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {provider.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

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
