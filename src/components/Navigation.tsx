import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { MegaDropdown } from "@/components/MegaDropdown";
import { RegionsDropdown } from "@/components/RegionsDropdown";
import { ServicesDropdown } from "@/components/ServicesDropdown";
import { ProviderDropdown } from "@/components/ProviderDropdown";
import { CompaniesDropdown } from "@/components/CompaniesDropdown";
import { RatgeberDropdown } from "@/components/RatgeberDropdown";
import { MobileMenu } from "@/components/MobileMenu";
import logo from "@/assets/umzugscheck-logo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Preisrechner", href: "/rechner", hasDropdown: true, dropdownType: "calculators" },
  { label: "Umzugsfirmen", href: "/firmen", hasDropdown: true, dropdownType: "companies" },
  { label: "Services", href: "#", hasDropdown: true, dropdownType: "services" },
  { label: "Regionen", href: "/regionen", hasDropdown: true, dropdownType: "regions" },
  { label: "Ratgeber", href: "/blog", hasDropdown: true, dropdownType: "ratgeber" },
  { label: "Für Firmen", href: "/anbieter-werden", hasDropdown: true, dropdownType: "provider" }
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaDropdownOpen, setIsMegaDropdownOpen] = useState(false);
  const [isRegionsDropdownOpen, setIsRegionsDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [isCompaniesDropdownOpen, setIsCompaniesDropdownOpen] = useState(false);
  const [isRatgeberDropdownOpen, setIsRatgeberDropdownOpen] = useState(false);

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
              className="h-10 sm:h-14 md:h-20 w-auto" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={() => {
                      setIsMegaDropdownOpen(item.dropdownType === "calculators");
                      setIsRegionsDropdownOpen(item.dropdownType === "regions");
                      setIsServicesDropdownOpen(item.dropdownType === "services");
                      setIsProviderDropdownOpen(item.dropdownType === "provider");
                      setIsCompaniesDropdownOpen(item.dropdownType === "companies");
                      setIsRatgeberDropdownOpen(item.dropdownType === "ratgeber");
                    }}
                    onMouseLeave={() => {
                      if (item.dropdownType === "calculators") setIsMegaDropdownOpen(false);
                      if (item.dropdownType === "regions") setIsRegionsDropdownOpen(false);
                      if (item.dropdownType === "services") setIsServicesDropdownOpen(false);
                      if (item.dropdownType === "provider") setIsProviderDropdownOpen(false);
                      if (item.dropdownType === "companies") setIsCompaniesDropdownOpen(false);
                      if (item.dropdownType === "ratgeber") setIsRatgeberDropdownOpen(false);
                    }}
                    onClick={() => {
                      if (item.dropdownType === "calculators") setIsMegaDropdownOpen(!isMegaDropdownOpen);
                      if (item.dropdownType === "regions") setIsRegionsDropdownOpen(!isRegionsDropdownOpen);
                      if (item.dropdownType === "services") setIsServicesDropdownOpen(!isServicesDropdownOpen);
                      if (item.dropdownType === "provider") setIsProviderDropdownOpen(!isProviderDropdownOpen);
                      if (item.dropdownType === "companies") setIsCompaniesDropdownOpen(!isCompaniesDropdownOpen);
                      if (item.dropdownType === "ratgeber") setIsRatgeberDropdownOpen(!isRatgeberDropdownOpen);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (item.dropdownType === "calculators") setIsMegaDropdownOpen(!isMegaDropdownOpen);
                        if (item.dropdownType === "regions") setIsRegionsDropdownOpen(!isRegionsDropdownOpen);
                        if (item.dropdownType === "services") setIsServicesDropdownOpen(!isServicesDropdownOpen);
                        if (item.dropdownType === "provider") setIsProviderDropdownOpen(!isProviderDropdownOpen);
                        if (item.dropdownType === "companies") setIsCompaniesDropdownOpen(!isCompaniesDropdownOpen);
                        if (item.dropdownType === "ratgeber") setIsRatgeberDropdownOpen(!isRatgeberDropdownOpen);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50"
                    )}
                    aria-expanded={
                      (item.dropdownType === "calculators" && isMegaDropdownOpen) || 
                      (item.dropdownType === "regions" && isRegionsDropdownOpen) ||
                      (item.dropdownType === "services" && isServicesDropdownOpen) ||
                      (item.dropdownType === "provider" && isProviderDropdownOpen) ||
                      (item.dropdownType === "companies" && isCompaniesDropdownOpen) ||
                      (item.dropdownType === "ratgeber" && isRatgeberDropdownOpen)
                    }
                    aria-haspopup="true"
                    aria-label={`${item.label} Menü öffnen`}
                  >
                    {item.label}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      (item.dropdownType === "calculators" && isMegaDropdownOpen) || 
                      (item.dropdownType === "regions" && isRegionsDropdownOpen) ||
                      (item.dropdownType === "services" && isServicesDropdownOpen) ||
                      (item.dropdownType === "provider" && isProviderDropdownOpen) ||
                      (item.dropdownType === "companies" && isCompaniesDropdownOpen) ||
                      (item.dropdownType === "ratgeber" && isRatgeberDropdownOpen) ? "rotate-180" : ""
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
            <Link to="/umzugsofferten" aria-label="Kostenlose Umzugsofferten erhalten">
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
            <Link to="/umzugsofferten" aria-label="Kostenlose Umzugsofferten erhalten">
              <Button className="bg-destructive hover:bg-destructive/90 text-white shadow-medium font-bold">
                Offerten erhalten
              </Button>
            </Link>
          </div>
        </div>

        {/* Mega Dropdown */}
        <div
          onMouseEnter={() => setIsMegaDropdownOpen(true)}
          onMouseLeave={() => setIsMegaDropdownOpen(false)}
        >
          <MegaDropdown 
            isOpen={isMegaDropdownOpen} 
            onClose={() => setIsMegaDropdownOpen(false)} 
          />
        </div>

        {/* Regions Dropdown */}
        <div
          onMouseEnter={() => setIsRegionsDropdownOpen(true)}
          onMouseLeave={() => setIsRegionsDropdownOpen(false)}
        >
          <RegionsDropdown 
            isOpen={isRegionsDropdownOpen} 
            onClose={() => setIsRegionsDropdownOpen(false)} 
          />
        </div>

        {/* Services Dropdown */}
        <div
          onMouseEnter={() => setIsServicesDropdownOpen(true)}
          onMouseLeave={() => setIsServicesDropdownOpen(false)}
        >
          <ServicesDropdown 
            isOpen={isServicesDropdownOpen} 
            onClose={() => setIsServicesDropdownOpen(false)} 
          />
        </div>

        {/* Provider Dropdown */}
        <div
          onMouseEnter={() => setIsProviderDropdownOpen(true)}
          onMouseLeave={() => setIsProviderDropdownOpen(false)}
        >
          <ProviderDropdown 
            isOpen={isProviderDropdownOpen} 
            onClose={() => setIsProviderDropdownOpen(false)} 
          />
        </div>

        {/* Companies Dropdown */}
        <div
          onMouseEnter={() => setIsCompaniesDropdownOpen(true)}
          onMouseLeave={() => setIsCompaniesDropdownOpen(false)}
        >
          <CompaniesDropdown 
            isOpen={isCompaniesDropdownOpen} 
            onClose={() => setIsCompaniesDropdownOpen(false)} 
          />
        </div>

        {/* Ratgeber Dropdown */}
        <div
          onMouseEnter={() => setIsRatgeberDropdownOpen(true)}
          onMouseLeave={() => setIsRatgeberDropdownOpen(false)}
        >
          <RatgeberDropdown 
            isOpen={isRatgeberDropdownOpen} 
            onClose={() => setIsRatgeberDropdownOpen(false)} 
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
