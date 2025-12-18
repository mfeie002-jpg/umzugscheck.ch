import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MobileMenu } from "@/components/MobileMenu";
import { CompaniesDropdown } from "@/components/CompaniesDropdown";
import { ServicesDropdown } from "@/components/ServicesDropdown";
import { RegionsDropdown } from "@/components/RegionsDropdown";
import { RatgeberDropdown } from "@/components/RatgeberDropdown";
import { ProviderDropdown } from "@/components/ProviderDropdown";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

// Removed 'calculator' - CTA button serves this purpose (#1)
type DropdownType = 'companies' | 'services' | 'regions' | 'ratgeber' | 'provider' | null;

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track scroll for enhanced shadow (#3)
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

  // Increased delay from 150ms to 200ms (#5)
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
        "flex items-center gap-1 px-3 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-accent",
        activeDropdown === dropdown && "text-primary bg-accent"
      )}
      aria-expanded={activeDropdown === dropdown}
      aria-haspopup="true"
    >
      {children}
      <ChevronDown className={cn(
        "w-4 h-4 transition-transform",
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
          scrolled ? "shadow-lg" : "shadow-soft" // Enhanced shadow on scroll (#3)
        )} 
        aria-label="Hauptnavigation"
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
            {/* Logo */}
            <div className="flex items-center -ml-1 sm:ml-0">
              <div className="flex items-center gap-3">
                <Logo size="xl" className="hidden xs:flex" />
                <Logo size="lg" iconOnly className="flex xs:hidden" />

                {/* Slogan (Desktop) */}
                <span className="hidden lg:flex items-center text-xs text-muted-foreground/70 font-medium border-l border-border/60 pl-3">
                  <span className="hidden xl:inline">Der Schweizer Umzugsvergleich</span>
                  <span className="xl:hidden">Schweizer Umzugsvergleich</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation - Removed Preisrechner (#1) */}
            <div className="hidden lg:flex items-center gap-1">
              <NavButton dropdown="companies">
                Umzugsfirmen
              </NavButton>

              <NavButton dropdown="services">
                Services
              </NavButton>

              <NavButton dropdown="regions">
                Regionen
              </NavButton>

              <NavButton dropdown="ratgeber">
                Ratgeber
              </NavButton>

              <NavButton dropdown="provider">
                Für Firmen
              </NavButton>
            </div>

            {/* Mobile: Just menu button (#4 - simplified) */}
            <div className="flex lg:hidden items-center gap-2 -mr-1 sm:mr-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50 h-10 w-10 active:scale-95 transition-transform"
                aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
              </Button>
            </div>

            {/* CTA Button - Desktop with enhanced visual hierarchy (#2) */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/umzugsofferten" aria-label="Kostenlose Umzugsofferten vergleichen">
                <Button 
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.5)] transition-all"
                >
                  Kostenlos Offerten erhalten
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
          <CompaniesDropdown 
            isOpen={activeDropdown === 'companies'} 
            onClose={closeAllDropdowns} 
          />
          <ServicesDropdown 
            isOpen={activeDropdown === 'services'} 
            onClose={closeAllDropdowns} 
          />
          <RegionsDropdown 
            isOpen={activeDropdown === 'regions'} 
            onClose={closeAllDropdowns} 
          />
          <RatgeberDropdown
            isOpen={activeDropdown === 'ratgeber'} 
            onClose={closeAllDropdowns} 
          />
          <ProviderDropdown 
            isOpen={activeDropdown === 'provider'} 
            onClose={closeAllDropdowns} 
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};
