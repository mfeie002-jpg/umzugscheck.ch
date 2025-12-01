import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MobileMenu } from "@/components/MobileMenu";
import { ServicesDropdown } from "@/components/ServicesDropdown";
import logo from "@/assets/umzugscheck-logo.png";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-soft" aria-label="Hauptnavigation">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center hover:opacity-90 transition-opacity flex-shrink-0"
            aria-label="Zur Startseite von Umzugscheck.ch"
          >
            <img 
              src={logo} 
              alt="Umzugscheck.ch Logo" 
              className="h-12 sm:h-16 md:h-24 w-auto" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Preisrechner - Direct Link */}
            <Link
              to="/umzugsrechner"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50"
            >
              Preisrechner
            </Link>

            {/* Umzugsfirmen - Direct Link */}
            <Link
              to="/umzugsfirmen"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50"
            >
              Umzugsfirmen
            </Link>

            {/* Services - Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsServicesOpen(true)}
                onClick={(e) => {
                  e.preventDefault();
                  setIsServicesOpen(!isServicesOpen);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsServicesOpen(!isServicesOpen);
                  }
                }}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50"
                )}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
                aria-label="Services Menü öffnen"
              >
                Services
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  isServicesOpen ? "rotate-180" : ""
                )} 
                aria-hidden="true" />
              </button>
            </div>

            {/* Regionen - Direct Link */}
            <Link
              to="/regionen"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50"
            >
              Regionen
            </Link>

            {/* Ratgeber - Direct Link */}
            <Link
              to="/ratgeber"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50"
            >
              Ratgeber
            </Link>

            {/* Für Firmen - Direct Link */}
            <Link
              to="/fuer-firmen"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50"
            >
              Für Firmen
            </Link>
          </div>

          {/* Mobile Menu Button & CTA - Visible on Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <Link to="/" aria-label="Kostenlose Umzugsofferten vergleichen">
              <Button 
                size="sm"
                className="bg-destructive hover:bg-destructive/90 text-white shadow-sm font-bold text-xs sm:text-sm px-3 sm:px-4"
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
            <Link to="/" aria-label="Kostenlose Umzugsofferten vergleichen">
              <Button className="bg-destructive hover:bg-destructive/90 text-white shadow-medium font-bold">
                Offerten vergleichen
              </Button>
            </Link>
          </div>
        </div>

        {/* Services Dropdown */}
        <div
          onMouseEnter={() => {}}
          onMouseLeave={() => setIsServicesOpen(false)}
        >
          <ServicesDropdown 
            isOpen={isServicesOpen} 
            onClose={() => setIsServicesOpen(false)} 
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
