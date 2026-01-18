/**
 * Navigation Variant #13: Mobile-First Optimiert
 * 
 * Komplett überarbeitete Struktur nach detailliertem UX-Feedback:
 * - 4 Hauptpunkte: Plane deinen Umzug, Offerten vergleichen, So funktioniert's, Hilfe & Kontakt
 * - Du-Form für Vertrauensaufbau
 * - Benefit-orientierte Microcopy
 * - Offerten-Submenu mit 5 Optionen (Privat, Büro, Reinigung, International, Lagerung)
 */

import { Button } from "@/components/ui/button";
import { 
  Menu, 
  ChevronDown, 
  ArrowRight, 
  Phone, 
  Star, 
  CheckCircle2, 
  ClipboardList,
  Search,
  HelpCircle,
  Info,
  Home,
  Building2,
  Sparkles,
  Globe,
  Package,
  Users
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { MobileMenuV13 } from "./MobileMenuV13";

type DropdownType = 'planen' | 'offerten' | 'funktioniert' | 'hilfe' | null;

// Trust Stats
const TRUST_STATS = {
  reviews: "4.8",
  reviewCount: "2'847",
  companies: "380+",
  savings: "40%",
};

export const NavigationV13 = () => {
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

  // Nav button with dropdown
  const NavButton = ({ 
    dropdown, 
    children, 
    icon: Icon,
    hasDropdown = true
  }: { 
    dropdown: DropdownType; 
    children: React.ReactNode;
    icon: React.ElementType;
    hasDropdown?: boolean;
  }) => (
    <button
      onMouseEnter={() => handleMouseEnter(dropdown)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group flex items-center gap-1.5 px-3 py-2 transition-colors font-medium rounded-lg hover:bg-accent",
        "text-sm xl:text-base whitespace-nowrap",
        activeDropdown === dropdown ? "text-primary bg-accent" : "text-foreground hover:text-primary"
      )}
    >
      <Icon className="w-4 h-4" />
      {children}
      {hasDropdown && (
        <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === dropdown && "rotate-180")} />
      )}
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
            
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <div className="group flex flex-col items-start hover:scale-105 transition-transform">
                <Logo size="xl" className="hidden xl:flex" />
                <Logo size="lg" className="hidden lg:flex xl:hidden" />
                <Logo size="sm" iconOnly className="flex lg:hidden" />
                <span className="hidden lg:block text-[9px] xl:text-xs text-muted-foreground/80 font-medium mt-0.5">
                  Dein Schweizer Umzugsvergleich
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - V13 Simplified Structure */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {/* 1. Plane deinen Umzug */}
              <NavButton dropdown="planen" icon={ClipboardList}>
                Plane deinen Umzug
              </NavButton>
              
              {/* 2. Offerten vergleichen (Core Funnel) */}
              <NavButton dropdown="offerten" icon={Search}>
                Offerten vergleichen
              </NavButton>
              
              {/* 3. So funktioniert's */}
              <NavButton dropdown="funktioniert" icon={Info}>
                So funktioniert's
              </NavButton>
              
              {/* 4. Hilfe & Kontakt */}
              <NavButton dropdown="hilfe" icon={HelpCircle}>
                Hilfe & Kontakt
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
              <a 
                href="tel:+41445001234" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">Anrufen</span>
              </a>
              <Button asChild size="default" className="font-semibold">
                <Link to="/offerten">
                  Gratis Offerten
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Mobile: Menu + CTA */}
            <div className="flex lg:hidden items-center gap-2 ml-auto">
              <Button asChild size="sm" className="font-semibold">
                <Link to="/offerten">Offerten</Link>
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
        {activeDropdown === 'planen' && (
          <PlanenDropdown 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('planen')}
            onMouseLeave={handleMouseLeave}
          />
        )}
        {activeDropdown === 'offerten' && (
          <OffertenDropdown 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('offerten')}
            onMouseLeave={handleMouseLeave}
          />
        )}
        {activeDropdown === 'funktioniert' && (
          <FunktioniertDropdown 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('funktioniert')}
            onMouseLeave={handleMouseLeave}
          />
        )}
        {activeDropdown === 'hilfe' && (
          <HilfeDropdown 
            isOpen={true} 
            onClose={closeAllDropdowns}
            onMouseEnter={() => handleMouseEnter('hilfe')}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </nav>

      {/* Mobile Menu */}
      <MobileMenuV13 
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

// 1. Plane deinen Umzug Dropdown
const PlanenDropdown = ({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) => {
  if (!isOpen) return null;
  
  const items = [
    { 
      title: "Umzugs-Checkliste", 
      description: "Dein Zeitplan für alles Wichtige", 
      href: "/umzug-planen/checkliste",
      icon: ClipboardList,
      featured: true,
      badge: "PDF Download"
    },
    { 
      title: "Kostenrechner", 
      description: "In 2 Minuten zu deinem Richtpreis", 
      href: "/umzugsrechner",
      icon: Search
    },
    { 
      title: "Spartipps", 
      description: "So sparst du beim Umzug", 
      href: "/ratgeber/tipps",
      icon: CheckCircle2
    },
    { 
      title: "Wohnungsübergabe", 
      description: "Protokoll & Checkliste", 
      href: "/ratgeber/wohnungsabgabe",
      icon: Home
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
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">
              📋 Tools, Checklisten & Tipps
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Damit du stressfrei an alles denkst.
            </p>
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
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    item.featured ? "bg-primary text-primary-foreground" : "bg-accent"
                  )}>
                    <item.icon className="w-5 h-5" />
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
            <h4 className="font-semibold text-lg mb-2">Bereit für den nächsten Schritt?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Hol dir jetzt gratis Offerten von geprüften Umzugsfirmen.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>100% kostenlos & unverbindlich</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Offerten in 24–48 Stunden</span>
              </div>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link to="/offerten" onClick={onClose}>
                Gratis Offerten holen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Offerten vergleichen Dropdown (Core Funnel)
const OffertenDropdown = ({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) => {
  if (!isOpen) return null;
  
  const items = [
    { 
      title: "Privatumzug", 
      description: "Zügle ohne Stress – Angebote für deinen Wohnungs- oder Hausumzug einholen.", 
      href: "/privatumzug",
      icon: Home,
      featured: true
    },
    { 
      title: "Büro & Firmenumzug", 
      description: "Reibungsloser Geschäftsumzug – Offerten für Büro, Laden oder Firmenumzüge vergleichen.", 
      href: "/firmenumzug",
      icon: Building2
    },
    { 
      title: "Umzug + Reinigung", 
      description: "Komplett sorglos – Umziehen inkl. Endreinigung durch Profis in einem Angebot.", 
      href: "/umzug-mit-reinigung",
      icon: Sparkles
    },
    { 
      title: "Internationaler Umzug", 
      description: "Von der Schweiz in die Welt – erfahrene Umzugspartner für Auslandsumzüge finden.", 
      href: "/international",
      icon: Globe
    },
    { 
      title: "Lagerung & Entsorgung", 
      description: "Zwischenlagern oder Entsorgen leicht gemacht – sichere Lagerplätze und Entrümpelungsservices.", 
      href: "/lagerung-entsorgung",
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
          {/* Items */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
              🔍 Finde deine Umzugsfirma
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Hol dir gratis Offerten von geprüften Umzugsfirmen & finde das beste Angebot.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-start gap-3 p-4 rounded-xl transition-colors",
                    item.featured 
                      ? "bg-primary/5 border-2 border-primary/20 hover:bg-primary/10 md:col-span-2" 
                      : "hover:bg-accent border border-border"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    item.featured ? "bg-primary text-primary-foreground" : "bg-accent"
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✨</span>
              <span className="font-bold text-green-700">Gratis & unverbindlich</span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>3–5 Offerten in 24–48h</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Bis zu {TRUST_STATS.savings} sparen</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>{TRUST_STATS.companies} geprüfte Firmen</span>
              </div>
            </div>

            <Button asChild className="w-full bg-green-600 hover:bg-green-700" size="lg">
              <Link to="/offerten" onClick={onClose}>
                Jetzt Offerten holen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. So funktioniert's Dropdown
const FunktioniertDropdown = ({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) => {
  if (!isOpen) return null;

  const steps = [
    { 
      step: "1", 
      title: "Anfrage stellen", 
      description: "In 2 Minuten deine Umzugsdetails eingeben" 
    },
    { 
      step: "2", 
      title: "Offerten erhalten", 
      description: "3–5 passende Angebote in 24–48h" 
    },
    { 
      step: "3", 
      title: "Vergleichen & buchen", 
      description: "Das beste Angebot auswählen und stressfrei umziehen" 
    },
  ];

  return (
    <div 
      className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-xl z-[9999]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold mb-2">⭐ In 3 Schritten zu deinem stressfreien Umzug</h3>
            <p className="text-muted-foreground">Transparent, sicher und einfach erklärt.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {steps.map((item) => (
              <div 
                key={item.step}
                className="relative p-5 rounded-xl bg-accent/50 border border-border text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/so-funktioniert"
              onClick={onClose}
              className="text-sm font-medium text-primary hover:underline"
            >
              Mehr erfahren →
            </Link>
            <Button asChild size="lg">
              <Link to="/offerten" onClick={onClose}>
                Jetzt starten – Gratis Offerten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Hilfe & Kontakt Dropdown
const HilfeDropdown = ({ isOpen, onClose, onMouseEnter, onMouseLeave }: DropdownProps) => {
  if (!isOpen) return null;

  const items = [
    { 
      title: "Häufige Fragen (FAQ)", 
      description: "Antworten auf die wichtigsten Fragen", 
      href: "/hilfe/faq",
      icon: HelpCircle
    },
    { 
      title: "Kontakt", 
      description: "Wir sind für dich da", 
      href: "/kontakt",
      icon: Phone
    },
    { 
      title: "Für Anbieter", 
      description: "Partner werden & Leads erhalten", 
      href: "/anbieter",
      icon: Users
    },
  ];

  return (
    <div 
      className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-xl z-[9999]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-4 lg:px-6 py-6">
        <div className="max-w-2xl">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
            📞 Hilfe & Kontakt
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Wir sind für dich da – FAQ, Tipps und persönlicher Support bei allen Umzugsfragen.
          </p>
          
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="group flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          {/* Phone CTA */}
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
            <div>
              <p className="font-semibold">Lieber telefonieren?</p>
              <p className="text-sm text-muted-foreground">Mo–Fr 8–18 Uhr</p>
            </div>
            <Button asChild variant="outline">
              <a href="tel:+41445001234">
                <Phone className="w-4 h-4 mr-2" />
                Anrufen
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
