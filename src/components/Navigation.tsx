import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MobileMenu } from "@/components/MobileMenu";
import { MegaDropdown } from "@/components/MegaDropdown";
import { CompaniesDropdown } from "@/components/CompaniesDropdown";
import { ServicesDropdown } from "@/components/ServicesDropdown";
import { RegionsDropdown } from "@/components/RegionsDropdown";
import { RatgeberDropdown } from "@/components/RatgeberDropdown";
import { ProviderDropdown } from "@/components/ProviderDropdown";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

type DropdownType = 'calculator' | 'companies' | 'services' | 'regions' | 'ratgeber' | 'provider' | null;

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    }, 150); // Small delay to allow moving to dropdown
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
        "flex items-center gap-1 px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-accent",
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
      <nav className="bg-background/95 backdrop-blur-md border-b border-border shadow-soft relative" aria-label="Hauptnavigation">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
            {/* Logo - Icon only on very small screens, full logo on larger */}
            <div className="flex items-center -ml-1 sm:ml-0">
              <Logo size="xl" className="hidden xs:flex" />
              <Logo size="lg" iconOnly className="flex xs:hidden" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Preisrechner - Dropdown */}
              <NavButton dropdown="calculator">
                Preisrechner
              </NavButton>

              {/* Umzugsfirmen - Dropdown */}
              <NavButton dropdown="companies">
                Umzugsfirmen
              </NavButton>

              {/* Services - Dropdown */}
              <NavButton dropdown="services">
                Services
              </NavButton>

              {/* Regionen - Dropdown */}
              <NavButton dropdown="regions">
                Regionen
              </NavButton>

              {/* Ratgeber - Dropdown */}
              <NavButton dropdown="ratgeber">
                Ratgeber
              </NavButton>

              {/* Für Firmen - Dropdown */}
              <NavButton dropdown="provider">
                Für Firmen
              </NavButton>
            </div>

            {/* Mobile Menu Button & CTA - Visible on Mobile */}
            <div className="flex lg:hidden items-center gap-2 -mr-1 sm:mr-0">
              <Link to="/umzugsofferten" aria-label="Kostenlose Umzugsofferten vergleichen">
                <Button 
                  size="sm"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta font-bold text-[11px] sm:text-xs px-2.5 sm:px-3 h-8 sm:h-9 active:scale-95 transition-transform"
                >
                  <span className="hidden xs:inline">Offerten</span>
                  <span className="xs:hidden">Offerten</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50 h-9 w-9 sm:h-10 sm:w-10 active:scale-95 transition-transform"
                aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />}
              </Button>
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/umzugsofferten" aria-label="Kostenlose Umzugsofferten vergleichen">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta font-bold animate-pulse-subtle">
                  Offerten erhalten
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dropdowns Container - positioned relative to nav */}
        <div
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <MegaDropdown 
            isOpen={activeDropdown === 'calculator'} 
            onClose={closeAllDropdowns} 
          />
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
