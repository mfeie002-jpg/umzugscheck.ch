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
import logo from "@/assets/logo.png";
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
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm" aria-label="Hauptnavigation">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center hover:opacity-90 transition-opacity flex-shrink-0"
            aria-label="Zur Startseite von Umzugscheck.ch"
          >
            <img 
              src={logo} 
              alt="Umzugscheck.ch Logo" 
              className="h-10 sm:h-12 md:h-14 w-auto" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Preisrechner - Dropdown */}
            <div className="relative">
              <NavButton dropdown="calculator">
                Preisrechner
              </NavButton>
            </div>

            {/* Umzugsfirmen - Dropdown */}
            <div className="relative">
              <NavButton dropdown="companies">
                Umzugsfirmen
              </NavButton>
            </div>

            {/* Services - Dropdown */}
            <div className="relative">
              <NavButton dropdown="services">
                Services
              </NavButton>
            </div>

            {/* Regionen - Dropdown */}
            <div className="relative">
              <NavButton dropdown="regions">
                Regionen
              </NavButton>
            </div>

            {/* Ratgeber - Dropdown */}
            <div className="relative">
              <NavButton dropdown="ratgeber">
                Ratgeber
              </NavButton>
            </div>

            {/* Für Firmen - Dropdown */}
            <div className="relative">
              <NavButton dropdown="provider">
                Für Firmen
              </NavButton>
            </div>
          </div>

          {/* Mobile Menu Button & CTA - Visible on Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <Link to="/" aria-label="Kostenlose Umzugsofferten vergleichen">
              <Button 
                size="sm"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta font-bold text-xs sm:text-sm px-3 sm:px-4"
              >
                Offerten vergleichen
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50"
              aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
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

        {/* Dropdowns Container */}
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
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </nav>
  );
};
