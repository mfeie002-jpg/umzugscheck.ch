/**
 * NavigationV17 - "Conversion-Killer" Architektur
 * 
 * Die finale Navigationsstruktur mit psychologischer Optimierung:
 * 1. Kosten & Planung - Budget berechnen, Checklisten & Zeitplan
 * 2. Offerten vergleichen - Top-Firmen in deiner Region, bis 40% sparen
 * 3. Services - Reinigung, Lagerung & Umzugskartons
 * 4. Ratgeber - Tipps, Vorlagen & Behördengänge
 * 5. Für Firmen - Partner werden & B2B Umzüge
 */

import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MobileMenuNew } from "@/components/MobileMenuNew";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { HeaderCallButton, MobileHeaderCallButton } from "@/components/CallButton";
import { getActiveVariant, type NavConfig } from "@/lib/navigation-variants";

// V17 Dropdowns
import { KostenPlanungDropdown } from "./dropdowns/KostenPlanungDropdown";
import { OffertenVergleichenDropdown } from "./dropdowns/OffertenVergleichenDropdown";
import { ServicesV17Dropdown } from "./dropdowns/ServicesV17Dropdown";
import { RatgeberV17Dropdown } from "./dropdowns/RatgeberV17Dropdown";
import { FuerFirmenV17Dropdown } from "./dropdowns/FuerFirmenV17Dropdown";

// Build navigation items from active variant
const buildNavItems = (variant: NavConfig) => [
  {
    id: 'kosten-planung' as const,
    label: variant.labels.preisrechner,
    microcopy: variant.microcopy.preisrechner
  },
  {
    id: 'offerten-vergleichen' as const,
    label: variant.labels.firmen,
    microcopy: variant.microcopy.firmen
  },
  {
    id: 'services' as const,
    label: variant.labels.services,
    microcopy: variant.microcopy.services
  },
  {
    id: 'ratgeber' as const,
    label: variant.labels.ratgeber,
    microcopy: variant.microcopy.ratgeber
  },
  {
    id: 'fuer-firmen' as const,
    label: variant.labels.fuerFirmen,
    microcopy: variant.microcopy.fuerFirmen
  }
] as const;

type DropdownType = 'kosten-planung' | 'offerten-vergleichen' | 'services' | 'ratgeber' | 'fuer-firmen' | null;

export const NavigationV17 = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [hoveredItem, setHoveredItem] = useState<DropdownType>(null);
  const [scrolled, setScrolled] = useState(false);
  const [navItems, setNavItems] = useState(() => buildNavItems(getActiveVariant()));
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update nav items when variant changes (via URL or localStorage)
  useEffect(() => {
    setNavItems(buildNavItems(getActiveVariant()));
  }, [location.search]);

  // Track scroll for enhanced shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeAllDropdowns = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(null);
    setHoveredItem(null);
  };

  const handleMouseEnter = (dropdown: DropdownType) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(dropdown);
    setHoveredItem(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredItem(null);
    }, 200);
  };

  const handleDropdownToggle = (dropdown: DropdownType) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const NavButton = ({ 
    item 
  }: { 
    item: ReturnType<typeof buildNavItems>[number];
  }) => (
    <div className="relative group/nav">
      <button
        onMouseEnter={() => handleMouseEnter(item.id)}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          e.preventDefault();
          handleDropdownToggle(item.id);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDropdownToggle(item.id);
          }
          if (e.key === 'Escape') {
            closeAllDropdowns();
          }
        }}
        className={cn(
          "relative flex items-center gap-1 px-3 xl:px-4 py-2.5 font-semibold rounded-xl transition-all duration-200",
          "text-sm xl:text-base whitespace-nowrap",
          "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary",
          "active:scale-[0.98]",
          activeDropdown === item.id 
            ? "text-primary bg-gradient-to-r from-primary/15 to-primary/5 shadow-sm" 
            : "text-foreground"
        )}
        aria-expanded={activeDropdown === item.id}
        aria-haspopup="true"
      >
        <span className="truncate max-w-[140px] xl:max-w-none">{item.label}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform flex-shrink-0 text-muted-foreground group-hover/nav:text-primary",
          activeDropdown === item.id ? "rotate-180 text-primary" : ""
        )} 
        aria-hidden="true" />
      </button>
      
      {/* Microcopy Tooltip on Hover */}
      {hoveredItem === item.id && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-3 py-1.5 bg-foreground/90 text-background text-xs font-medium rounded-lg whitespace-nowrap z-[200] pointer-events-none shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          {item.microcopy}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground/90 rotate-45" />
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Brand accent line at very top */}
      <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
      
        <nav 
          className={cn(
            "bg-gradient-to-b from-background to-background/98 backdrop-blur-md border-b border-primary/10 relative transition-shadow duration-300 w-full overflow-x-hidden",
            scrolled ? "shadow-lg shadow-primary/5" : "shadow-soft"
          )} 
          aria-label="Hauptnavigation"
        >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-4 lg:gap-6">
            {/* Logo - Always visible */}
            <div className="flex-shrink-0">
              <Logo size="xl" className="hidden xl:flex" />
              <Logo size="lg" className="hidden lg:flex xl:hidden" />
              <Logo size="md" className="flex lg:hidden" />
            </div>

            {/* Desktop Navigation - "Conversion-Killer" Labels */}
            <nav className="hidden 2xl:flex items-center justify-center gap-0.5 xl:gap-1" role="navigation">
              {navItems.map((item) => (
                <NavButton key={item.id} item={item} />
              ))}
            </nav>

            {/* Mobile/Tablet: Menu button + Call + mini CTA - 48px touch targets */}
            <div className="flex 2xl:hidden items-center gap-2 flex-shrink-0">
              <MobileHeaderCallButton />
              
              <Link 
                to="/umzugsofferten" 
                className="flex items-center justify-center gap-1 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-2.5 rounded-lg shadow-md shadow-secondary/20 active:scale-95 transition-all min-h-[48px] min-w-[48px] touch-manipulation"
                aria-label="Offerten erhalten"
              >
                <span>Offerten</span>
              </Link>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "relative z-50 flex items-center justify-center",
                  "w-12 h-12 rounded-lg", /* 48px touch target */
                  "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20",
                  "hover:from-primary/15 hover:to-primary/10 hover:border-primary/30",
                  "active:scale-95 transition-all touch-manipulation",
                  isMobileMenuOpen && "bg-primary/15 border-primary/30"
                )}
                aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-primary" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6 text-primary" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden 2xl:flex items-center flex-shrink-0 gap-2 xl:gap-3">
              <HeaderCallButton />
              
              {/* Micro trust hint */}
              <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Gratis & unverbindlich</span>
              </div>
              
              <Link to="/umzugsofferten" aria-label="Kostenlose Umzugsofferten vergleichen">
                <Button 
                  size="lg"
                  className="group bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:from-secondary/90 hover:via-secondary hover:to-secondary text-secondary-foreground font-bold shadow-[0_4px_20px_rgba(220,38,38,0.35)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.45)] transition-all text-sm 2xl:text-base px-4 2xl:px-6 whitespace-nowrap"
                >
                  Offerten erhalten
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dropdowns Container */}
        <div
          className="relative"
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <KostenPlanungDropdown 
            isOpen={activeDropdown === 'kosten-planung'} 
            onClose={closeAllDropdowns} 
          />
          <OffertenVergleichenDropdown 
            isOpen={activeDropdown === 'offerten-vergleichen'} 
            onClose={closeAllDropdowns} 
          />
          <ServicesV17Dropdown 
            isOpen={activeDropdown === 'services'} 
            onClose={closeAllDropdowns} 
          />
          <RatgeberV17Dropdown
            isOpen={activeDropdown === 'ratgeber'} 
            onClose={closeAllDropdowns} 
          />
          <FuerFirmenV17Dropdown 
            isOpen={activeDropdown === 'fuer-firmen'} 
            onClose={closeAllDropdowns} 
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenuNew 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};
