import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MobileMenuNew } from "@/components/MobileMenuNew";
import { UmzugPlanenDropdown } from "@/components/dropdowns/UmzugPlanenDropdown";
import { UmzugsfirmaFindenDropdown } from "@/components/dropdowns/UmzugsfirmaFindenDropdown";
import { ServicesDropdown } from "@/components/dropdowns/ServicesDropdown";
import { RatgeberDropdown } from "@/components/dropdowns/RatgeberDropdown";
import { FuerFirmenDropdown } from "@/components/dropdowns/FuerFirmenDropdown";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";
import { HeaderCallButton, MobileHeaderCallButton, COMPANY_PHONE } from "@/components/CallButton";

// 5 Hauptkategorien gemäß Navigationskonzept 2026
type DropdownType = 'umzug-planen' | 'umzugsfirma-finden' | 'services' | 'ratgeber' | 'fuer-firmen' | null;

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get active navigation variant
  const navVariant = useNavigationVariant();

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
  };

  const handleMouseEnter = (dropdown: DropdownType) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleDropdownToggle = (dropdown: DropdownType) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const NavButton = ({ 
    dropdown, 
    children 
  }: { 
    dropdown: DropdownType; 
    children: React.ReactNode;
  }) => (
    <button
      onMouseEnter={() => handleMouseEnter(dropdown)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.preventDefault();
        handleDropdownToggle(dropdown);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDropdownToggle(dropdown);
        }
        if (e.key === 'Escape') {
          closeAllDropdowns();
        }
      }}
      className={cn(
        "group/nav relative flex items-center gap-1.5 px-3 xl:px-4 py-2.5 font-semibold rounded-xl transition-all duration-200",
        "text-sm xl:text-base whitespace-nowrap",
        "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary",
        "active:scale-[0.98]",
        activeDropdown === dropdown 
          ? "text-primary bg-gradient-to-r from-primary/15 to-primary/5 shadow-sm" 
          : "text-foreground"
      )}
      aria-expanded={activeDropdown === dropdown}
      aria-haspopup="true"
    >
      <span className="truncate max-w-[120px] xl:max-w-none">{children}</span>
      <ChevronDown className={cn(
        "w-4 h-4 transition-transform flex-shrink-0 text-muted-foreground group-hover/nav:text-primary",
        activeDropdown === dropdown ? "rotate-180 text-primary" : ""
      )} 
      aria-hidden="true" />
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden">
      {/* Warm accent line at very top */}
      <div className="h-1 bg-gradient-to-r from-primary via-emerald-500 to-secondary" />
      
      <nav 
        className={cn(
          "bg-gradient-to-b from-background to-background/98 backdrop-blur-md border-b border-primary/10 relative transition-shadow duration-300 w-full",
          scrolled ? "shadow-lg shadow-primary/5" : "shadow-soft"
        )} 
        aria-label="Hauptnavigation"
      >
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 lg:gap-4">
            {/* Logo - Always visible (no nested links) */}
            <div className="flex-shrink-0">
              <Logo size="xl" className="hidden xl:flex" />
              <Logo size="lg" className="hidden lg:flex xl:hidden" />
              {/* Mobile */}
              <Logo size="md" className="flex lg:hidden" />
            </div>

            {/* Desktop Navigation - Dynamic Labels from Variant */}
            <nav className="hidden lg:flex items-center flex-1 justify-center gap-0.5 xl:gap-1 min-w-0" role="navigation">
              <NavButton dropdown="umzug-planen">
                {navVariant.labels.preisrechner}
              </NavButton>

              <NavButton dropdown="umzugsfirma-finden">
                {navVariant.labels.firmen}
              </NavButton>

              <NavButton dropdown="services">
                {navVariant.labels.services}
              </NavButton>

              <NavButton dropdown="ratgeber">
                {navVariant.labels.ratgeber}
              </NavButton>

              <NavButton dropdown="fuer-firmen">
                {navVariant.labels.fuerFirmen}
              </NavButton>
            </nav>

            {/* Mobile: Menu button + Call + mini CTA - properly spaced */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Call Button for mobile - compact */}
              <MobileHeaderCallButton />
              
              {/* Mini CTA for mobile header - compact to avoid overlap */}
              <Link 
                to="/umzugsofferten" 
                className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-bold px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg shadow-md shadow-secondary/20 active:scale-95 transition-all min-h-[40px] touch-manipulation"
              >
                <span>Offerten</span>
              </Link>
              
              {/* Burger menu - compact */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "relative z-50 flex items-center justify-center",
                  "w-10 h-10 rounded-lg",
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
                  <X className="w-5 h-5 text-primary" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5 text-primary" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* CTA Button - Desktop with enhanced styling */}
            <div className="hidden lg:flex items-center flex-shrink-0 gap-2 xl:gap-3 min-w-0">
              {/* Call Button for Desktop */}
              <HeaderCallButton className="flex-shrink-0" />
              
              {/* Micro trust hint */}
              <div className="hidden xl:flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="font-medium">Gratis & unverbindlich</span>
              </div>
              
              <Link to="/umzugsofferten" aria-label="Kostenlose Umzugsofferten vergleichen" className="flex-shrink-0">
                <Button 
                  size="lg"
                  className="group bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:from-secondary/90 hover:via-secondary hover:to-secondary text-secondary-foreground font-bold shadow-[0_4px_20px_rgba(220,38,38,0.35)] hover:shadow-[0_8px_30px_rgba(220,38,38,0.45)] transition-all text-sm xl:text-base px-4 xl:px-6 whitespace-nowrap"
                >
                  {navVariant.labels.cta}
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dropdowns Container - positioned relative to nav */}
        <div
          className="relative"
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <UmzugPlanenDropdown 
            isOpen={activeDropdown === 'umzug-planen'} 
            onClose={closeAllDropdowns} 
          />
          <UmzugsfirmaFindenDropdown 
            isOpen={activeDropdown === 'umzugsfirma-finden'} 
            onClose={closeAllDropdowns} 
          />
          <ServicesDropdown 
            isOpen={activeDropdown === 'services'} 
            onClose={closeAllDropdowns} 
          />
          <RatgeberDropdown
            isOpen={activeDropdown === 'ratgeber'} 
            onClose={closeAllDropdowns} 
          />
          <FuerFirmenDropdown 
            isOpen={activeDropdown === 'fuer-firmen'} 
            onClose={closeAllDropdowns} 
          />
        </div>
      </nav>

      {/* Mobile Menu - Neues Accordion-basiertes Menü */}
      <MobileMenuNew 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};
