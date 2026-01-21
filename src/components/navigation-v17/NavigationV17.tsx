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
import { Menu, X, ChevronDown, ArrowRight, Zap } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MobileMenuNew } from "@/components/MobileMenuNew";
import { useFlowPath } from "@/hooks/useUnifiedAB";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { HeaderCallButton, MobileHeaderCallButton } from "@/components/CallButton";
import { type NavConfig } from "@/lib/navigation-variants";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";

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
    microcopy: variant.microcopy.preisrechner,
  },
  {
    id: 'offerten-vergleichen' as const,
    label: variant.labels.firmen,
    microcopy: variant.microcopy.firmen,
  },
  {
    id: 'services' as const,
    label: variant.labels.services,
    microcopy: variant.microcopy.services,
  },
  {
    id: 'ratgeber' as const,
    label: variant.labels.ratgeber,
    microcopy: variant.microcopy.ratgeber,
  },
  {
    id: 'fuer-firmen' as const,
    label: variant.labels.fuerFirmen,
    microcopy: variant.microcopy.fuerFirmen,
  },
] as const;

type DropdownType =
  | 'kosten-planung'
  | 'offerten-vergleichen'
  | 'services'
  | 'ratgeber'
  | 'fuer-firmen'
  | null;

export const NavigationV17 = () => {
  const navVariant = useNavigationVariant();
  const flowPath = useFlowPath();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [hoveredItem, setHoveredItem] = useState<DropdownType>(null);
  const [scrolled, setScrolled] = useState(false);

  const navItems = useMemo(() => buildNavItems(navVariant), [navVariant]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className="relative group/nav flex-shrink-0">
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
          "relative flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 2xl:px-4 py-2 font-semibold rounded-xl transition-all duration-200",
          "text-xs xl:text-sm 2xl:text-base whitespace-nowrap",
          "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary",
          "active:scale-[0.98]",
          activeDropdown === item.id 
            ? "text-primary bg-gradient-to-r from-primary/15 to-primary/5 shadow-sm" 
            : "text-foreground"
        )}
        aria-expanded={activeDropdown === item.id}
        aria-haspopup="true"
      >
        <span>{item.label}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform flex-shrink-0 text-muted-foreground group-hover/nav:text-primary",
            activeDropdown === item.id ? "rotate-180 text-primary" : ""
          )}
          aria-hidden="true"
        />
      </button>
      
      {/* Microcopy Tooltip on Hover - only show when dropdown is NOT open */}
      {hoveredItem === item.id && activeDropdown !== item.id && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-3 py-1.5 bg-foreground/90 text-background text-xs font-medium rounded-lg whitespace-nowrap z-[200] pointer-events-none shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          {item.microcopy}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground/90 rotate-45" />
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden">
      {/* Brand accent line at very top */}
      <div className="h-1 bg-gradient-to-r from-primary to-secondary" />

      <nav
        className={cn(
          "bg-gradient-to-b from-background to-background/98 backdrop-blur-md border-b border-primary/10 relative transition-shadow duration-300 w-full overflow-hidden",
          scrolled ? "shadow-lg shadow-primary/5" : "shadow-soft"
        )}
        aria-label="Hauptnavigation"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 min-w-0">
            {/* Logo - Always visible */}
            <Link to="/" className="flex-shrink-0 z-10">
              <Logo size="lg" className="hidden xl:flex" />
              <Logo size="md" className="flex xl:hidden" />
            </Link>

            {/* Desktop Navigation - show from xl to avoid overlap */}
            <nav className="hidden xl:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-2 flex-1 mx-2 xl:mx-4 min-w-0 overflow-hidden" role="navigation">
              {navItems.map((item) => (
                <NavButton key={item.id} item={item} />
              ))}
            </nav>

            {/* Mobile/Tablet */}
            <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <Link
                to={flowPath}
                className="flex items-center justify-center gap-1 bg-primary text-primary-foreground text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-md shadow-primary/20 active:scale-95 transition-all min-h-[40px] sm:min-h-[44px] touch-manipulation"
                aria-label="Offerten erhalten"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Offerten</span>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "relative z-50 flex items-center justify-center",
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-lg",
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
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden xl:flex items-center flex-shrink-0 gap-2 xl:gap-3 min-w-0">
              <HeaderCallButton className="hidden 2xl:flex flex-shrink-0" />

              <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="font-medium">Gratis & unverbindlich</span>
              </div>

              <Link to="/video-offerte" aria-label="Video-Offerte starten - Kostenlos" className="flex-shrink-0">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-bold shadow-[0_4px_20px_hsl(var(--primary)/0.35)] hover:shadow-[0_8px_30px_hsl(var(--primary)/0.45)] transition-all text-sm px-3 xl:px-4 2xl:px-6 whitespace-nowrap"
                >
                  <span className="hidden 2xl:inline">🎥 Video-Offerte</span>
                  <span className="2xl:hidden">Video</span>
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
