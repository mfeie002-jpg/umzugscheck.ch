/**
 * Navigation Variant #11: Simpel & Clean
 * 
 * 6 Hauptpunkte: Umzug, Umzugsreinigung, Weitere Services, Ratgeber, So funktioniert's + CTA
 * Mit Trust Signals und Highlights
 */

import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ArrowRight, Phone, Star, Shield, Clock, Users, CheckCircle2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { MobileMenuV11 } from "./MobileMenuV11";
import { 
  DropdownWrapper 
} from "@/components/navigation/DropdownWrapper";

type DropdownType = 'umzug' | 'reinigung' | 'services' | 'ratgeber' | 'wie-es-funktioniert' | null;

// Trust Stats for display
const TRUST_STATS = {
  reviews: "4.8",
  reviewCount: "2'847",
  companies: "380+",
  savings: "40%",
};

export const NavigationV11 = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeAllDropdowns = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(null);
  };

  const handleMouseEnter = (dropdown: DropdownType) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  // Simple nav button (no dropdown)
  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-accent",
        "text-sm xl:text-base whitespace-nowrap"
      )}
    >
      {children}
    </Link>
  );

  // Nav button with dropdown
  const NavButton = ({ dropdown, children }: { dropdown: DropdownType; children: React.ReactNode }) => (
    <button
      onMouseEnter={() => handleMouseEnter(dropdown)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group flex items-center gap-1 px-3 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-accent",
        "text-sm xl:text-base whitespace-nowrap",
        activeDropdown === dropdown && "text-primary bg-accent"
      )}
    >
      {children}
      <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === dropdown && "rotate-180")} />
    </button>
  );

  return (
    <header className="sticky top-0 z-50">
      <nav className={cn(
        "bg-background/95 backdrop-blur-md border-b border-border transition-shadow duration-300",
        scrolled ? "shadow-lg" : "shadow-soft"
      )}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center h-14 sm:h-16 lg:h-20 gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <div className="group flex flex-col items-start hover:scale-105 transition-transform">
                <Logo size="xl" className="hidden xl:flex" />
                <Logo size="lg" className="hidden lg:flex xl:hidden" />
                <Logo size="sm" iconOnly className="flex lg:hidden" />
                <span className="hidden lg:block text-[9px] xl:text-xs text-muted-foreground/80 font-medium mt-0.5">
                  Der Schweizer Umzugsvergleich
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - #11 Structure */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Umzug - Direct link (most important) */}
              <NavLink to="/dienstleistungen/privatumzug">Umzug</NavLink>
              
              {/* Umzugsreinigung - Direct link */}
              <NavLink to="/dienstleistungen/reinigung">Umzugsreinigung</NavLink>
              
              {/* Weitere Services - Dropdown */}
              <NavButton dropdown="services">Weitere Services</NavButton>
              
              {/* Ratgeber - Dropdown */}
              <NavButton dropdown="ratgeber">Ratgeber</NavButton>
              
              {/* So funktioniert's - Direct link */}
              <NavLink to="/so-funktionierts">So funktioniert's</NavLink>
            </nav>

            {/* Spacer */}
            <div className="hidden lg:flex flex-1" />

            {/* Trust Badge (Desktop) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 border border-border">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">{TRUST_STATS.reviews}</span>
              <span className="text-xs text-muted-foreground">({TRUST_STATS.reviewCount} Bewertungen)</span>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2">
              <a 
                href="tel:+41445001234" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">Anrufen</span>
              </a>
              <Button asChild size="default" className="font-semibold">
                <Link to="/umzugsofferten">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Mobile: Menu + CTA */}
            <div className="flex lg:hidden items-center gap-2 ml-auto">
              <Button asChild size="sm" className="font-semibold">
                <Link to="/umzugsofferten">Offerten</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className="h-10 w-10"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dropdowns */}
        {activeDropdown === 'services' && (
          <ServicesDropdownV11 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          />
        )}
        {activeDropdown === 'ratgeber' && (
          <RatgeberDropdownV11 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('ratgeber')}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </nav>

      {/* Mobile Menu */}
      <MobileMenuV11 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

// Simplified Services Dropdown for V11
const ServicesDropdownV11 = ({ 
  isOpen, 
  onClose, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  if (!isOpen) return null;
  
  const services = [
    { title: "Entsorgung & Räumung", description: "Umweltgerechte Entsorgung Ihres Hausrats", href: "/dienstleistungen/entsorgung" },
    { title: "Lagerung", description: "Temporäre Einlagerung von Möbeln", href: "/dienstleistungen/einlagerung" },
    { title: "Möbelmontage", description: "Ab- und Aufbau-Service für Möbel", href: "/moebelmontage" },
    { title: "Firmenumzug", description: "Professionelle Büro- & Geschäftsumzüge", href: "/dienstleistungen/firmenumzug" },
    { title: "Möbellift", description: "Aussenaufzug für schwere Möbel", href: "/dienstleistungen/moebellift" },
    { title: "Packservice", description: "Professionelles Ein- und Auspacken", href: "/services/packservice" },
  ];

  return (
    <div 
      className="absolute left-0 right-0 bg-background border-b border-border shadow-xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Services List */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">
              Weitere Services
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {services.map((service) => (
                <Link
                  key={service.href}
                  to={service.href}
                  onClick={onClose}
                  className="group p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {service.description}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              to="/dienstleistungen"
              onClick={onClose}
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Alle Services anzeigen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* CTA Card with Trust Signals */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold">Komplettpaket möglich</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Umzug + Übergabe + Reinigung aus einer Hand.
            </p>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-700">
                <CheckCircle2 className="w-3 h-3" /> Geprüfte Partner
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-700">
                <Clock className="w-3 h-3" /> 24h Antwort
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link to="/umzugsofferten" onClick={onClose}>
                  Gratis Offerten
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <a 
                href="tel:+41445001234"
                className="w-full text-center py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Anrufen
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Ratgeber Dropdown for V11
const RatgeberDropdownV11 = ({ 
  isOpen, 
  onClose,
  onMouseEnter,
  onMouseLeave
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  if (!isOpen) return null;
  
  const guides = [
    { title: "Umzugs-Checkliste (PDF)", description: "Alle To-dos zum Download", href: "/ratgeber/umzugscheckliste-download", featured: true },
    { title: "Tipps & Tricks", description: "Spartipps, Packhilfen & mehr", href: "/ratgeber/tipps" },
    { title: "Kosten & Preise", description: "Was kostet ein Umzug wirklich?", href: "/ratgeber/kosten" },
    { title: "Wohnungsübergabe", description: "Protokoll & Abnahme-Tipps", href: "/ratgeber/wohnungsabgabe" },
  ];

  return (
    <div 
      className="absolute left-0 right-0 bg-background border-b border-border shadow-xl"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Guides List */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">
              Ratgeber & Tipps
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {guides.map((guide) => (
                <Link
                  key={guide.href}
                  to={guide.href}
                  onClick={onClose}
                  className={cn(
                    "group p-3 rounded-lg hover:bg-accent transition-colors",
                    guide.featured && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {guide.title}
                    </p>
                    {guide.featured && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-semibold">
                        TOP
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              to="/ratgeber"
              onClick={onClose}
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Alle Ratgeber
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-accent to-accent/50 rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">Schnellstart in 5 Minuten</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Keine Lust auf lange Recherche? Starte direkt mit Offerten.
            </p>
            
            {/* Quick stat */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-background/80">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{TRUST_STATS.savings}</p>
                <p className="text-xs text-muted-foreground">Ersparnis</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{TRUST_STATS.companies}</p>
                <p className="text-xs text-muted-foreground">Firmen</p>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link to="/ratgeber/umzugscheckliste-download" onClick={onClose}>
                Checkliste herunterladen
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationV11;
