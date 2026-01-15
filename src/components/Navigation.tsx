import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
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
        "group/nav relative flex items-center gap-1 px-2 xl:px-3 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-accent",
        "text-sm xl:text-base whitespace-nowrap",
        "after:absolute after:bottom-1 after:left-2 after:right-2 after:h-0.5 after:bg-primary after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100",
        activeDropdown === dropdown && "text-primary bg-accent after:scale-x-100"
      )}
      aria-expanded={activeDropdown === dropdown}
      aria-haspopup="true"
    >
      <span className="truncate max-w-[120px] xl:max-w-none">{children}</span>
      <ChevronDown className={cn(
        "w-4 h-4 transition-transform flex-shrink-0",
        activeDropdown === dropdown ? "rotate-180" : ""
      )} 
      aria-hidden="true" />
    </button>
  );

  return (
    <header className="sticky top-0 z-50">
      <nav 
        className={cn(
          "bg-background/95 backdrop-blur-md border-b border-border relative transition-shadow duration-300",
          scrolled ? "shadow-lg" : "shadow-soft"
        )} 
        aria-label="Hauptnavigation"
      >
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 xs:h-16 sm:h-16 lg:h-20 gap-2 lg:gap-4">
            {/* Logo with Slogan - Vertical Stack */}
            <div className="flex items-center min-w-0 flex-shrink-0">
              <div className="group flex flex-col items-start transition-all duration-300 hover:scale-105">
                <div className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)] flex items-center">
                  <Logo size="xl" className="hidden xl:flex" />
                  <Logo size="lg" className="hidden lg:flex xl:hidden" />
                  <Logo size="sm" iconOnly className="flex lg:hidden" />
                </div>

                {/* Slogan below logo (Desktop only) with fade-in animation */}
                <span className="hidden lg:block text-[9px] xl:text-xs text-muted-foreground/80 font-medium mt-0.5 transition-colors duration-300 group-hover:text-primary leading-tight animate-[fadeInSlogan_0.6s_ease-out_0.2s_both]">
                  Der Schweizer Umzugsvergleich
                </span>
              </div>
            </div>

            {/* Desktop Navigation - Dynamic Labels from Variant */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 justify-center min-w-0">
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
            </div>

            {/* Mobile: Menu button + mini CTA */}
            <div className="flex lg:hidden items-center gap-2 xs:gap-3 flex-shrink-0">
              {/* Mini CTA for mobile header with pulse animation */}
              <Link 
                to="/umzugsofferten" 
                className="hidden xs:flex items-center gap-1.5 xs:gap-2 bg-secondary text-secondary-foreground text-xs xs:text-sm font-semibold px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg shadow-cta active:scale-95 transition-all min-h-[44px] touch-manipulation animate-[pulseGlow_2s_ease-in-out_infinite]"
              >
                <span className="hidden sm:inline">Offerten</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50 h-11 w-11 xs:h-12 xs:w-12 active:scale-95 transition-transform touch-manipulation"
                aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 xs:w-6 h-5 xs:h-6" aria-hidden="true" /> : <Menu className="w-5 xs:w-6 h-5 xs:h-6" aria-hidden="true" />}
              </Button>
            </div>

            {/* CTA Button - Desktop with pulse animation */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <Link to="/umzugsofferten" aria-label="Kostenlose Umzugsofferten vergleichen">
                <Button 
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.5)] transition-all animate-[pulseGlow_2s_ease-in-out_infinite] hover:animate-none text-sm xl:text-base px-4 xl:px-6 whitespace-nowrap"
                >
                  {navVariant.labels.cta}
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
