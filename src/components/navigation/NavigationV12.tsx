/**
 * Navigation Variant #12: Best-of-Breed (optimiert nach ChatGPT UX Audit)
 * 
 * Basiert auf V10 mit folgenden Verbesserungen:
 * 1. "Preise & Kosten berechnen" als Hero mit Badge "Gratis"
 * 2. Benefit-orientierte Sublines (z.B. "Bis 40% sparen")
 * 3. "Reinigung & Services" statt nur "Services"
 * 4. Visuelle Trennung für "Für Anbieter"
 * 5. Gefüllte Icons für wichtigste Punkte
 */

import { Button } from "@/components/ui/button";
import { 
  Menu, 
  ChevronDown, 
  ArrowRight, 
  Phone, 
  Star, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Calculator,
  Search,
  Sparkles,
  BookOpen,
  Building2,
  Users,
  Briefcase,
  FileText,
  Award,
  TrendingDown,
  Package,
  Trash2,
  Box,
  Wrench,
  Truck
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { MobileMenuV12 } from "./MobileMenuV12";

type DropdownType = 'kosten' | 'firmen' | 'reinigung' | 'ratgeber' | null;

// Trust Stats
const TRUST_STATS = {
  reviews: "4.8",
  reviewCount: "2'847",
  companies: "380+",
  savings: "40%",
};

export const NavigationV12 = () => {
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

  // Nav button with dropdown and optional badge
  const NavButton = ({ 
    dropdown, 
    children, 
    badge,
    isFilled 
  }: { 
    dropdown: DropdownType; 
    children: React.ReactNode;
    badge?: string;
    isFilled?: boolean;
  }) => (
    <button
      onMouseEnter={() => handleMouseEnter(dropdown)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group flex items-center gap-1.5 px-3 py-2 transition-colors font-medium rounded-lg hover:bg-accent",
        "text-sm xl:text-base whitespace-nowrap",
        activeDropdown === dropdown ? "text-primary bg-accent" : "text-foreground hover:text-primary",
        isFilled && "font-semibold"
      )}
    >
      {children}
      {badge && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500 text-white font-bold uppercase">
          {badge}
        </span>
      )}
      <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === dropdown && "rotate-180")} />
    </button>
  );

  return (
    <header className="sticky top-0 z-[9998]">
      <nav className={cn(
        "bg-background/95 backdrop-blur-md border-b border-border transition-shadow duration-300",
        scrolled ? "shadow-lg" : "shadow-soft"
      )}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center h-14 sm:h-16 lg:h-20 gap-4">
            
            {/* Logo (no nested links) */}
            <div className="flex-shrink-0 group hover:scale-105 transition-transform">
              <Logo size="xl" className="hidden xl:flex" />
              <Logo size="lg" className="hidden lg:flex xl:hidden" />
              <Logo size="sm" iconOnly className="flex lg:hidden" />
            </div>

            {/* Desktop Navigation - V12 Optimized Structure */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {/* 1. Hero: Preise & Kosten berechnen (mit Gratis Badge) */}
              <NavButton dropdown="kosten" badge="Gratis" isFilled>
                <Calculator className="w-4 h-4 text-primary fill-primary/20" />
                📋 Preise berechnen
              </NavButton>
              
              {/* 2. Umzugsfirma finden */}
              <NavButton dropdown="firmen">
                <Search className="w-4 h-4" />
                🔍 Firmen finden
              </NavButton>
              
              {/* 3. Reinigung & Services */}
              <NavButton dropdown="reinigung">
                <Sparkles className="w-4 h-4" />
                🛠️ Reinigung & Services
              </NavButton>
              
              {/* 4. Ratgeber */}
              <NavButton dropdown="ratgeber">
                <BookOpen className="w-4 h-4" />
                📚 Ratgeber
              </NavButton>
            </nav>

            {/* Spacer */}
            <div className="hidden lg:flex flex-1" />

            {/* Trust Badge (Desktop) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 border border-border">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">{TRUST_STATS.reviews}</span>
              <span className="text-xs text-muted-foreground">({TRUST_STATS.reviewCount})</span>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Für Anbieter - Secondary, separated */}
              <Link 
                to="/anbieter" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2"
              >
                Für Anbieter
              </Link>
              <div className="h-5 w-px bg-border" />
              <a 
                href="tel:+41445001234" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">Anrufen</span>
              </a>
              <Button asChild size="default" className="font-semibold">
                <Link to="/umzugsofferten">
                  Offerten vergleichen
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
        {activeDropdown === 'kosten' && (
          <KostenDropdown 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('kosten')}
            onMouseLeave={handleMouseLeave}
          />
        )}
        {activeDropdown === 'firmen' && (
          <FirmenDropdown 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('firmen')}
            onMouseLeave={handleMouseLeave}
          />
        )}
        {activeDropdown === 'reinigung' && (
          <ReinigungDropdown 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('reinigung')}
            onMouseLeave={handleMouseLeave}
          />
        )}
        {activeDropdown === 'ratgeber' && (
          <RatgeberDropdown 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('ratgeber')}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </nav>

      {/* Mobile Menu */}
      <MobileMenuV12 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

// ============================================================================
// DROPDOWN COMPONENTS
// ============================================================================

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// 1. Preise & Kosten Dropdown (Hero)
const KostenDropdown = ({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) => {
  if (!isOpen) return null;
  
  const items = [
    { 
      title: "Umzugsrechner", 
      description: "In 2 Minuten zum Richtpreis", 
      href: "/umzugsrechner",
      icon: Calculator,
      featured: true,
      badge: "Beliebt"
    },
    { 
      title: "Reinigungskosten", 
      description: "Endreinigung berechnen", 
      href: "/preisrechner/reinigung",
      icon: Sparkles
    },
    { 
      title: "Entsorgungskosten", 
      description: "Räumung & Mulde kalkulieren", 
      href: "/entsorgungsrechner",
      icon: Trash2
    },
  ];

  return (
    <div 
      className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-xl z-[9999]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Items */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              Kostenrechner
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 text-[10px] font-bold">
                100% GRATIS
              </span>
            </h3>
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-start gap-4 p-4 rounded-xl transition-colors",
                    item.featured 
                      ? "bg-primary/5 border-2 border-primary/20 hover:bg-primary/10" 
                      : "hover:bg-accent"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    item.featured ? "bg-primary text-primary-foreground" : "bg-accent"
                  )}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-semibold block">Gratis Offerten</span>
                <span className="text-xs text-muted-foreground">Unverbindlich vergleichen</span>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Bis zu <strong>{TRUST_STATS.savings}</strong> Kosten sparen</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span><strong>{TRUST_STATS.companies}</strong> geprüfte Firmen</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Antwort innert <strong>24h</strong></span>
              </div>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link to="/umzugsofferten" onClick={onClose}>
                Jetzt Offerten erhalten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Firmen finden Dropdown
const FirmenDropdown = ({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) => {
  if (!isOpen) return null;
  
  const mainItems = [
    { 
      title: "Beste Umzugsfirmen", 
      description: "Top-bewertete Partner", 
      href: "/beste-umzugsfirma",
      icon: Award,
      badge: "TOP"
    },
    { 
      title: "Günstigste Umzugsfirmen", 
      description: "Preisbewusste Angebote", 
      href: "/guenstige-umzugsfirma",
      icon: TrendingDown
    },
    { 
      title: "Alle Umzugsfirmen", 
      description: "Komplette Übersicht", 
      href: "/umzugsfirmen",
      icon: Building2
    },
  ];

  const regions = [
    { label: "Zürich", href: "/umzugsfirmen/zuerich" },
    { label: "Bern", href: "/umzugsfirmen/bern" },
    { label: "Basel", href: "/umzugsfirmen/basel" },
    { label: "Luzern", href: "/umzugsfirmen/luzern" },
    { label: "Aargau", href: "/umzugsfirmen/aargau" },
    { label: "St. Gallen", href: "/umzugsfirmen/st-gallen" },
  ];

  return (
    <div 
      className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-xl z-[9999]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_1fr_280px] gap-8">
          {/* Main Items */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">
              Firmen vergleichen
            </h3>
            <div className="space-y-2">
              {mainItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="group flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">
              Nach Region
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {regions.map((region) => (
                <Link
                  key={region.href}
                  to={region.href}
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent hover:text-primary transition-colors"
                >
                  {region.label}
                </Link>
              ))}
            </div>
            <Link
              to="/regionen"
              onClick={onClose}
              className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-primary hover:underline"
            >
              Alle Regionen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats Card */}
          <div className="bg-accent/50 rounded-xl p-5 border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">
              Warum bei uns?
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{TRUST_STATS.savings}</span>
                </div>
                <div>
                  <p className="font-semibold">Ersparnis</p>
                  <p className="text-xs text-muted-foreground">Durch Vergleichen</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                  <p className="font-semibold">{TRUST_STATS.reviews}/5 Sterne</p>
                  <p className="text-xs text-muted-foreground">{TRUST_STATS.reviewCount} Bewertungen</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Geprüfte Partner</p>
                  <p className="text-xs text-muted-foreground">Qualitätskontrolle</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Reinigung & Services Dropdown
const ReinigungDropdown = ({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) => {
  if (!isOpen) return null;
  
  const services = [
    { 
      title: "Umzugsreinigung", 
      description: "Mit Abnahmegarantie", 
      href: "/dienstleistungen/reinigung",
      icon: Sparkles,
      featured: true,
      badge: "Garantie"
    },
    { 
      title: "Entsorgung & Räumung", 
      description: "Umweltgerecht entsorgen", 
      href: "/dienstleistungen/entsorgung",
      icon: Trash2
    },
    { 
      title: "Lagerung", 
      description: "Möbel temporär einlagern", 
      href: "/dienstleistungen/einlagerung",
      icon: Box
    },
    { 
      title: "Möbelmontage", 
      description: "Auf- & Abbau Service", 
      href: "/moebelmontage",
      icon: Wrench
    },
    { 
      title: "Möbellift", 
      description: "Aussenaufzug für grosse Möbel", 
      href: "/dienstleistungen/moebellift",
      icon: Truck
    },
    { 
      title: "Packservice", 
      description: "Professionell ein- & auspacken", 
      href: "/services/packservice",
      icon: Package
    },
  ];

  return (
    <div 
      className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-xl z-[9999]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Services Grid */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">
              Alle Services
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {services.map((service) => (
                <Link
                  key={service.href}
                  to={service.href}
                  onClick={onClose}
                  className={cn(
                    "group p-3 rounded-lg transition-colors",
                    service.featured 
                      ? "bg-primary/5 border border-primary/20 hover:bg-primary/10" 
                      : "hover:bg-accent"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      service.featured ? "bg-primary text-primary-foreground" : "bg-accent"
                    )}>
                      <service.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                          {service.title}
                        </p>
                        {service.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500 text-white font-bold">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {service.description}
                      </p>
                    </div>
                  </div>
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

          {/* Komplettpaket CTA */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold">Komplettpaket</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Umzug + Reinigung + Übergabe aus einer Hand. Stressfrei und garantiert.
            </p>
            
            {/* Trust Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-700 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Abnahmegarantie
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-700 font-medium">
                <Clock className="w-3 h-3" /> 24h Antwort
              </span>
            </div>

            <Button asChild className="w-full">
              <Link to="/umzugsofferten" onClick={onClose}>
                Gratis Offerten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Ratgeber Dropdown
const RatgeberDropdown = ({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) => {
  if (!isOpen) return null;
  
  const guides = [
    { 
      title: "Umzugs-Checkliste", 
      description: "Zeitplan & PDF Download", 
      href: "/ratgeber/umzugscheckliste-download",
      icon: FileText,
      featured: true,
      badge: "Beliebt"
    },
    { 
      title: "Kosten & Preise", 
      description: "Was kostet ein Umzug wirklich?", 
      href: "/ratgeber/kosten",
      icon: Calculator
    },
    { 
      title: "Tipps & Tricks", 
      description: "Spartipps, Packhilfen & mehr", 
      href: "/ratgeber/tipps",
      icon: BookOpen
    },
    { 
      title: "Wohnungsübergabe", 
      description: "Protokoll & Abnahme-Tipps", 
      href: "/ratgeber/wohnungsabgabe",
      icon: FileText
    },
  ];

  return (
    <div 
      className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-xl z-[9999]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Guides */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">
              Checklisten & Ratgeber
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {guides.map((guide) => (
                <Link
                  key={guide.href}
                  to={guide.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-start gap-3 p-4 rounded-xl transition-colors",
                    guide.featured 
                      ? "bg-primary/5 border border-primary/20 hover:bg-primary/10" 
                      : "hover:bg-accent"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    guide.featured ? "bg-primary text-primary-foreground" : "bg-accent"
                  )}>
                    <guide.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {guide.title}
                      </p>
                      {guide.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                          {guide.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {guide.description}
                    </p>
                  </div>
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

          {/* Schnellstart Card */}
          <div className="bg-accent/50 rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">Schnellstart</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Keine Zeit für Recherche? Starte direkt mit Offerten von geprüften Firmen.
            </p>
            
            {/* Quick stat */}
            <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-background">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{TRUST_STATS.savings}</p>
                <p className="text-xs text-muted-foreground">sparen</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">2 Min</p>
                <p className="text-xs text-muted-foreground">Aufwand</p>
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

export default NavigationV12;
