import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { ServicesDropdown } from "@/components/ServicesDropdown";
import { CompaniesDropdown } from "@/components/CompaniesDropdown";
import { RegionsDropdown } from "@/components/RegionsDropdown";
import { RatgeberDropdown } from "@/components/RatgeberDropdown";
import { ProviderDropdown } from "@/components/ProviderDropdown";
import { MegaDropdown } from "@/components/MegaDropdown";
import { MobileMenu } from "@/components/MobileMenu";
import logo from "@/assets/umzugscheck-logo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Preisrechner", href: "/umzugsrechner", hasDropdown: true, dropdownType: "calculators" },
  { label: "Umzugsfirmen", href: "/umzugsfirmen", hasDropdown: true, dropdownType: "companies" },
  { label: "Services", href: "/services", hasDropdown: true, dropdownType: "services" },
  { label: "Regionen", href: "/regionen", hasDropdown: true, dropdownType: "regions" },
  { label: "Ratgeber", href: "/ratgeber", hasDropdown: true, dropdownType: "ratgeber" },
  { label: "Für Firmen", href: "/fuer-firmen", hasDropdown: true, dropdownType: "provider" }
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={() => setActiveDropdown(item.dropdownType)}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveDropdown(activeDropdown === item.dropdownType ? null : item.dropdownType);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === item.dropdownType ? null : item.dropdownType);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50"
                    )}
                    aria-expanded={activeDropdown === item.dropdownType}
                    aria-haspopup="true"
                    aria-label={`${item.label} Menü öffnen`}
                  >
                    {item.label}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      activeDropdown === item.dropdownType ? "rotate-180" : ""
                    )} 
                    aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50 inline-block"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button & CTA - Visible on Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <Link to="/kontakt" aria-label="Live Chat starten">
              <Button 
                size="sm"
                className="bg-happy-teal hover:bg-happy-teal/90 text-white shadow-sm font-bold text-xs sm:text-sm px-3 sm:px-4"
              >
                <MessageCircle className="w-4 h-4 sm:mr-1" aria-hidden="true" />
                <span className="hidden sm:inline">Live Chat</span>
              </Button>
            </Link>
            <Link to="/umzug-offerte" aria-label="Kostenlose Umzugsofferten erhalten">
              <Button 
                size="sm"
                className="bg-destructive hover:bg-destructive/90 text-white shadow-sm font-bold text-xs sm:text-sm px-3 sm:px-4"
              >
                Offerten
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

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <DarkModeToggle />
            <Link to="/" aria-label="Kostenlose Umzugsofferten vergleichen">
              <Button className="bg-destructive hover:bg-destructive/90 text-white shadow-medium font-bold">
                Offerten vergleichen
              </Button>
            </Link>
          </div>
        </div>

        {/* All Dropdowns */}
        <div
          onMouseEnter={() => {}}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <MegaDropdown 
            isOpen={activeDropdown === "calculators"} 
            onClose={() => setActiveDropdown(null)} 
          />
          <CompaniesDropdown 
            isOpen={activeDropdown === "companies"} 
            onClose={() => setActiveDropdown(null)} 
          />
          <ServicesDropdown 
            isOpen={activeDropdown === "services"} 
            onClose={() => setActiveDropdown(null)} 
          />
          <RegionsDropdown 
            isOpen={activeDropdown === "regions"} 
            onClose={() => setActiveDropdown(null)} 
          />
          <RatgeberDropdown 
            isOpen={activeDropdown === "ratgeber"} 
            onClose={() => setActiveDropdown(null)} 
          />
          <ProviderDropdown 
            isOpen={activeDropdown === "provider"} 
            onClose={() => setActiveDropdown(null)} 
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
