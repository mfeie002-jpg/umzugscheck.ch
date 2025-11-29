import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Calculator, Sparkles, Trash2, Package, Wrench, Box, Settings, Video, MapPin, Search, Home, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
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
    href: "/umzugsrechner"
  },
  {
    icon: Sparkles,
    title: "Reinigungsrechner",
    href: "/umzugsrechner"
  },
  {
    icon: Trash2,
    title: "Entsorgungsrechner",
    href: "/umzugsrechner"
  },
  {
    icon: Box,
    title: "Lagerrechner",
    href: "/umzugsrechner"
  },
  {
    icon: Package,
    title: "Packservice-Rechner",
    href: "/umzugsrechner"
  },
  {
    icon: Wrench,
    title: "Möbelmontage-Rechner",
    href: "/umzugsrechner"
  },
  {
    icon: Settings,
    title: "Gesamtpreis-Konfigurator",
    href: "/umzugsrechner"
  },
  {
    icon: Video,
    title: "Video-Umzugsrechner",
    href: "/umzugsrechner"
  }
];

const cantons = [
  { name: "Zürich", code: "ZH", href: "/zuerich/umzugsfirmen", cities: ["Zürich", "Winterthur"] },
  { name: "Bern", code: "BE", href: "/bern/umzugsfirmen", cities: ["Bern", "Biel"] },
  { name: "Luzern", code: "LU", href: "/luzern/umzugsfirmen", cities: ["Luzern"] },
  { name: "Uri", code: "UR", href: "/uri/umzugsfirmen", cities: [] },
  { name: "Schwyz", code: "SZ", href: "/schwyz/umzugsfirmen", cities: ["Schwyz"] },
  { name: "Obwalden", code: "OW", href: "/obwalden/umzugsfirmen", cities: [] },
  { name: "Nidwalden", code: "NW", href: "/nidwalden/umzugsfirmen", cities: [] },
  { name: "Glarus", code: "GL", href: "/glarus/umzugsfirmen", cities: [] },
  { name: "Zug", code: "ZG", href: "/zug/umzugsfirmen", cities: ["Zug"] },
  { name: "Fribourg", code: "FR", href: "/fribourg/umzugsfirmen", cities: ["Fribourg"] },
  { name: "Solothurn", code: "SO", href: "/solothurn/umzugsfirmen", cities: ["Solothurn"] },
  { name: "Basel-Stadt", code: "BS", href: "/basel-stadt/umzugsfirmen", cities: ["Basel"] },
  { name: "Basel-Landschaft", code: "BL", href: "/basel-landschaft/umzugsfirmen", cities: [] },
  { name: "Schaffhausen", code: "SH", href: "/schaffhausen/umzugsfirmen", cities: ["Schaffhausen"] },
  { name: "Appenzell Ausserrhoden", code: "AR", href: "/appenzell-ausserrhoden/umzugsfirmen", cities: [] },
  { name: "Appenzell Innerrhoden", code: "AI", href: "/appenzell-innerrhoden/umzugsfirmen", cities: [] },
  { name: "St. Gallen", code: "SG", href: "/st-gallen/umzugsfirmen", cities: ["St. Gallen"] },
  { name: "Graubünden", code: "GR", href: "/graubuenden/umzugsfirmen", cities: ["Chur"] },
  { name: "Aargau", code: "AG", href: "/aargau/umzugsfirmen", cities: ["Aarau", "Baden"] },
  { name: "Thurgau", code: "TG", href: "/thurgau/umzugsfirmen", cities: ["Frauenfeld"] },
  { name: "Ticino", code: "TI", href: "/ticino/umzugsfirmen", cities: ["Lugano"] },
  { name: "Vaud", code: "VD", href: "/vaud/umzugsfirmen", cities: ["Lausanne"] },
  { name: "Valais", code: "VS", href: "/valais/umzugsfirmen", cities: ["Sion"] },
  { name: "Neuchâtel", code: "NE", href: "/neuchatel/umzugsfirmen", cities: ["Neuchâtel"] },
  { name: "Genève", code: "GE", href: "/geneve/umzugsfirmen", cities: ["Genève"] },
  { name: "Jura", code: "JU", href: "/jura/umzugsfirmen", cities: [] }
];

const services = [
  { icon: Home, title: "Privatumzug", href: "/umzug-schweiz" },
  { icon: Building2, title: "Firmenumzug", href: "/firmenumzug-schweiz" },
  { icon: Sparkles, title: "Umzugsreinigung", href: "/umzugsreinigung-schweiz" },
  { icon: Trash2, title: "Räumung & Entsorgung", href: "/entsorgung-schweiz" },
  { icon: Box, title: "Lagerung", href: "/umzugsrechner" },
  { icon: Wrench, title: "Möbelmontage", href: "/umzugsrechner" }
];

const providerLinks = [
  { title: "Partner werden", href: "/anbieter" },
  { title: "Login", href: "/anbieter/login" },
  { title: "Preise & Modelle", href: "/anbieter" }
];

const mainNavItems = [
  { label: "Ratgeber", href: "/ratgeber" }
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProviderOpen, setIsProviderOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [companyCounts, setCompanyCounts] = useState<Record<string, number>>({});

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (isOpen && isRegionsOpen) {
      fetchCompanyCounts();
    }
  }, [isOpen, isRegionsOpen]);

  const fetchCompanyCounts = async () => {
    try {
      const { data: companies } = await supabase
        .from('companies')
        .select('service_areas');

      if (companies) {
        const counts: Record<string, number> = {};
        
        cantons.forEach(canton => {
          const count = companies.filter(company => 
            company.service_areas?.includes(canton.code)
          ).length;
          counts[canton.code] = count;
        });
        
        setCompanyCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching company counts:', error);
    }
  };

  const filteredCantons = regionSearch 
    ? cantons.filter(canton => 
        canton.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
        canton.code.toLowerCase().includes(regionSearch.toLowerCase()) ||
        canton.cities.some(city => city.toLowerCase().includes(regionSearch.toLowerCase()))
      )
    : cantons;

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
          {/* Calculators Accordion */}
          <Collapsible
            open={isCalculatorsOpen}
            onOpenChange={setIsCalculatorsOpen}
          >
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
              aria-expanded={isCalculatorsOpen}
              aria-controls="calculators-menu"
              aria-label="Preisrechner Menü öffnen"
            >
              <span>Preisrechner</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isCalculatorsOpen && "rotate-180"
              )} 
              aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent id="calculators-menu" className="mt-2 space-y-1">
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
                  aria-label={calc.title}
                >
                  <calc.icon className="w-4 h-4 text-primary" aria-hidden="true" />
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
              aria-expanded={isCompaniesOpen}
              aria-controls="companies-menu"
              aria-label="Umzugsfirmen Menü öffnen"
            >
              <span>Umzugsfirmen</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isCompaniesOpen && "rotate-180"
              )} 
              aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent id="companies-menu" className="mt-2 space-y-1">
              <Link
                to="/beste-umzugsfirma"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                  isActive("/beste-umzugsfirma")
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
                aria-label="Beste Umzugsfirmen 2025"
              >
                <Badge variant="secondary" className="text-xs">Top</Badge>
                <span className="text-sm">Beste Umzugsfirmen 2025</span>
              </Link>
              <Link
                to="/guenstige-umzugsfirma"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                  isActive("/guenstige-umzugsfirma")
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
                aria-label="Günstige Umzugsfirmen finden"
              >
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">€</Badge>
                <span className="text-sm">Günstige Umzugsfirmen</span>
              </Link>
              <Link
                to="/umzugsfirmen-schweiz"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                  isActive("/umzugsfirmen-schweiz")
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">Alle Umzugsfirmen</span>
              </Link>
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
            <CollapsibleContent className="mt-2 space-y-2">
              {/* Search */}
              <div className="px-4 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Suchen..."
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Cantons List */}
              <div className="max-h-96 overflow-y-auto space-y-1">
                {filteredCantons.map((canton) => (
                  <div key={canton.code}>
                    {canton.cities.length > 0 ? (
                      <Collapsible>
                        <div className="flex items-center gap-1">
                          <Link
                            to={canton.href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors flex-1",
                              isActive(canton.href)
                                ? "bg-primary/10 text-primary border-l-4 border-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            )}
                          >
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm truncate flex-1">{canton.name}</span>
                            {companyCounts[canton.code] > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {companyCounts[canton.code]}
                              </Badge>
                            )}
                          </Link>
                          <CollapsibleTrigger className="px-2 py-3 text-muted-foreground hover:text-foreground">
                            <ChevronDown className="w-4 h-4 transition-transform ui-expanded:rotate-180" />
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="ml-12 space-y-1 mt-1 pl-4 border-l-2 border-border/50">
                          {canton.cities.map((city) => (
                            <Link
                              key={city}
                              to={`/${city.toLowerCase().replace(/\s+/g, '-')}/umzugsfirmen`}
                              onClick={onClose}
                              className="block text-xs text-muted-foreground hover:text-foreground py-1.5 hover:bg-secondary/30 rounded px-2"
                            >
                              {city}
                            </Link>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <Link
                        to={canton.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                          isActive(canton.href)
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm truncate">{canton.name}</span>
                        </div>
                        {companyCounts[canton.code] > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {companyCounts[canton.code]}
                          </Badge>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {filteredCantons.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Keine Regionen gefunden
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Main Nav Items - Ratgeber */}
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className={cn(
                "block px-4 py-3 rounded-lg transition-colors font-medium",
                isActive(item.href)
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Für Firmen Accordion */}
          <Collapsible
            open={isProviderOpen}
            onOpenChange={setIsProviderOpen}
          >
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
              aria-expanded={isProviderOpen}
              aria-controls="provider-menu"
              aria-label="Für Firmen Menü öffnen"
            >
              <span>Für Firmen</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isProviderOpen && "rotate-180"
              )} 
              aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent id="provider-menu" className="mt-2 space-y-1">
              {providerLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  aria-label={link.title}
                >
                  <Briefcase className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-sm">{link.title}</span>
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
          <Link to="/umzugsofferten" onClick={onClose}>
            <Button className="w-full bg-destructive hover:bg-destructive/90 shadow-medium">
              Offerten erhalten
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
