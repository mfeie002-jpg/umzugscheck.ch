/**
 * Neue Mobile Navigation mit Accordion-Struktur
 * 
 * Basiert auf dem Navigationskonzept 2026 mit 5 Hauptkategorien:
 * 1. Umzug planen
 * 2. Umzugsfirma finden  
 * 3. Services
 * 4. Ratgeber
 * 5. Für Firmen
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  X,
  Calculator,
  CheckSquare,
  Clock,
  Lightbulb,
  FileDown,
  Search,
  MapPin,
  Building2,
  Home,
  Globe,
  Sparkles,
  Wrench,
  Package,
  Trash2,
  Box,
  Truck,
  ParkingCircle,
  FileText,
  DollarSign,
  Calendar,
  Baby,
  Briefcase,
  LogIn,
  Star,
  HelpCircle,
  ArrowRight,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CANTONS_MAP, CITIES_MAP } from "@/data/locations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileMenuNewProps {
  isOpen: boolean;
  onClose: () => void;
}

// Beliebte Städte
const POPULAR_CITIES = ['zuerich', 'bern', 'basel', 'genf', 'lausanne', 'luzern'];
const popularCitiesData = POPULAR_CITIES.map(slug => CITIES_MAP[slug]).filter(Boolean);

// Beliebte Kantone
const POPULAR_CANTONS = ['zuerich', 'bern', 'aargau', 'st-gallen', 'luzern', 'basel-stadt'];

export const MobileMenuNew = ({ isOpen, onClose }: MobileMenuNewProps) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);

  // Reset when menu opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setOpenAccordion(undefined);
    }
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Search functionality for cities/cantons
  const searchResults = searchTerm.trim() ? {
    cantons: Object.values(CANTONS_MAP).filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 4),
    cities: Object.values(CITIES_MAP).filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 4),
  } : { cantons: [], cities: [] };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-sm",
          "bg-background z-50 lg:hidden",
          "flex flex-col",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-background">
          <h2 className="font-bold text-lg">Menü</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <Accordion 
              type="single" 
              collapsible 
              value={openAccordion}
              onValueChange={setOpenAccordion}
              className="space-y-2"
            >
              {/* 1. Umzug planen */}
              <AccordionItem value="umzug-planen" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-base">Umzug planen</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="space-y-1">
                    <MobileMenuItem
                      to="/umzugsrechner"
                      icon={Calculator}
                      title="Umzugskosten berechnen"
                      badge="Beliebt"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/ratgeber/checkliste"
                      icon={CheckSquare}
                      title="Umzugscheckliste"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/ratgeber/zeitplan"
                      icon={Clock}
                      title="Zeitplan & Ablauf"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/ratgeber/tipps"
                      icon={Lightbulb}
                      title="Umzugstipps"
                      onClick={onClose}
                    />
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Downloads</p>
                    <div className="flex flex-wrap gap-2">
                      <Link 
                        to="/ratgeber/checkliste#download" 
                        onClick={onClose}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                      >
                        <FileDown className="w-3 h-3 inline mr-1" />
                        Checkliste PDF
                      </Link>
                      <Link 
                        to="/ratgeber/kuendigung#vorlage" 
                        onClick={onClose}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                      >
                        <FileDown className="w-3 h-3 inline mr-1" />
                        Kündigungsvorlage
                      </Link>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 2. Umzugsfirma finden */}
              <AccordionItem value="umzugsfirma-finden" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-base">Umzugsfirma finden</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  {/* Suchfeld */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Stadt oder Kanton suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>

                  {/* Suchergebnisse */}
                  {searchTerm.trim() && (searchResults.cantons.length > 0 || searchResults.cities.length > 0) && (
                    <div className="space-y-2 mb-3 p-3 bg-accent rounded-lg">
                      {searchResults.cantons.map(canton => (
                        <Link
                          key={canton.slug}
                          to={`/umzugsfirmen/kanton-${canton.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 py-2 text-sm hover:text-primary transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-primary" />
                          Kanton {canton.name}
                        </Link>
                      ))}
                      {searchResults.cities.map(city => (
                        <Link
                          key={city.slug}
                          to={`/umzugsfirmen/${city.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 py-2 text-sm hover:text-primary transition-colors"
                        >
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {city.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Beliebte Städte */}
                  {!searchTerm.trim() && (
                    <>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Beliebte Städte</p>
                      <div className="space-y-1 mb-3">
                        {popularCitiesData.map(city => (
                          <MobileMenuItem
                            key={city.slug}
                            to={`/umzugsfirmen/${city.slug}`}
                            icon={Building2}
                            title={`Umzugsfirma ${city.name}`}
                            onClick={onClose}
                          />
                        ))}
                      </div>

                      {/* Beliebte Kantone */}
                      <p className="text-xs font-medium text-muted-foreground mb-2">Beliebte Kantone</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {POPULAR_CANTONS.map(slug => {
                          const canton = CANTONS_MAP[slug];
                          if (!canton) return null;
                          return (
                            <Link
                              key={slug}
                              to={`/umzugsfirmen/kanton-${slug}`}
                              onClick={onClose}
                              className="text-xs px-3 py-1.5 rounded-full bg-accent text-foreground font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              {canton.short}
                            </Link>
                          );
                        })}
                      </div>

                      <Link
                        to="/regionen"
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Alle Kantone & Städte
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* 3. Services */}
              <AccordionItem value="services" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-base">Services</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Umzugsarten</p>
                  <div className="space-y-1 mb-3">
                    <MobileMenuItem to="/dienstleistungen/privatumzug" icon={Home} title="Privatumzug" onClick={onClose} />
                    <MobileMenuItem to="/dienstleistungen/firmenumzug" icon={Building2} title="Geschäftsumzug" onClick={onClose} />
                    <MobileMenuItem to="/dienstleistungen/international" icon={Globe} title="Internationaler Umzug" onClick={onClose} />
                  </div>

                  <p className="text-xs font-medium text-muted-foreground mb-2">Zusatzservices</p>
                  <div className="grid grid-cols-2 gap-1">
                    <MobileMenuItemCompact to="/dienstleistungen/endreinigung" icon={Sparkles} title="Endreinigung" onClick={onClose} />
                    <MobileMenuItemCompact to="/dienstleistungen/moebelmontage" icon={Wrench} title="Möbelmontage" onClick={onClose} />
                    <MobileMenuItemCompact to="/dienstleistungen/einlagerung" icon={Package} title="Lagerung" onClick={onClose} />
                    <MobileMenuItemCompact to="/dienstleistungen/entsorgung" icon={Trash2} title="Entsorgung" onClick={onClose} />
                    <MobileMenuItemCompact to="/dienstleistungen/umzugskartons" icon={Box} title="Umzugskartons" onClick={onClose} />
                    <MobileMenuItemCompact to="/dienstleistungen/halteverbot" icon={ParkingCircle} title="Halteverbot" onClick={onClose} />
                    <MobileMenuItemCompact to="/dienstleistungen/moebellift" icon={Truck} title="Möbellift" onClick={onClose} />
                  </div>

                  <Link
                    to="/dienstleistungen"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
                  >
                    Alle Services
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </AccordionContent>
              </AccordionItem>

              {/* 4. Ratgeber */}
              <AccordionItem value="ratgeber" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-base">Ratgeber</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Top Ratgeber</p>
                  <div className="space-y-1 mb-3">
                    <MobileMenuItem
                      to="/ratgeber/checkliste"
                      icon={CheckSquare}
                      title="Umzug Checkliste (PDF)"
                      badge="Top"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/ratgeber/wohnungsabgabe"
                      icon={Home}
                      title="Wohnungsübergabe"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/ratgeber/kuendigung"
                      icon={FileText}
                      title="Kündigung & Ummeldung"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/ratgeber/kosten-sparen"
                      icon={DollarSign}
                      title="Spartipps"
                      onClick={onClose}
                    />
                  </div>

                  <p className="text-xs font-medium text-muted-foreground mb-2">Weitere Themen</p>
                  <div className="grid grid-cols-2 gap-1">
                    <MobileMenuItemCompact to="/ratgeber/zeitplan" icon={Calendar} title="Zeitplan" onClick={onClose} />
                    <MobileMenuItemCompact to="/ratgeber/halteverbot" icon={MapPin} title="Halteverbot" onClick={onClose} />
                    <MobileMenuItemCompact to="/ratgeber/umzug-mit-kindern" icon={Baby} title="Mit Kindern" onClick={onClose} />
                    <MobileMenuItemCompact to="/ratgeber/packtipps" icon={Box} title="Packtipps" onClick={onClose} />
                  </div>

                  <Link
                    to="/ratgeber"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
                  >
                    Alle Ratgeber
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </AccordionContent>
              </AccordionItem>

              {/* 5. Für Firmen */}
              <AccordionItem value="fuer-firmen" className="border rounded-xl overflow-hidden bg-accent/30">
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50 [&[data-state=open]]:bg-accent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-base">Für Firmen</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="space-y-1">
                    <MobileMenuItem
                      to="/anbieter"
                      icon={Briefcase}
                      title="Partner werden"
                      badge="Neu"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/anbieter/preise"
                      icon={DollarSign}
                      title="Preise & Konditionen"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/anbieter/login"
                      icon={LogIn}
                      title="Anbieter Login"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/anbieter/bewertungen"
                      icon={Star}
                      title="Bewertungssystem"
                      onClick={onClose}
                    />
                    <MobileMenuItem
                      to="/anbieter/faq"
                      icon={HelpCircle}
                      title="Häufige Fragen"
                      onClick={onClose}
                    />
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="w-4 h-4 text-primary" />
                      <span>500+ Partner schweizweit</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>

        {/* Footer CTA */}
        <div className="p-4 border-t border-border bg-background">
          <Link to="/umzugsofferten" onClick={onClose}>
            <Button 
              className="w-full h-14 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
              size="lg"
            >
              Kostenlos Offerten erhalten
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

// Helper Components
interface MobileMenuItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: string;
  onClick: () => void;
}

const MobileMenuItem = ({ to, icon: Icon, title, badge, onClick }: MobileMenuItemProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
  >
    <Icon className="w-4 h-4 text-primary" />
    <span className="text-sm font-medium group-hover:text-primary transition-colors">{title}</span>
    {badge && (
      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
        {badge}
      </span>
    )}
  </Link>
);

const MobileMenuItemCompact = ({ to, icon: Icon, title, onClick }: Omit<MobileMenuItemProps, 'badge'>) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent transition-colors group"
  >
    <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
    <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">{title}</span>
  </Link>
);
