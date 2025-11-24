import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { MegaDropdown } from "@/components/MegaDropdown";
import { MobileMenu } from "@/components/MobileMenu";
import logo from "@/assets/umzugscheck-logo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Startseite", href: "/" },
  { label: "Preisrechner", href: "/rechner", hasDropdown: true },
  { label: "Umzugsfirmen", href: "/firmen" },
  { label: "Regionen", href: "/regionen" },
  { label: "Ratgeber", href: "/blog" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" }
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaDropdownOpen, setIsMegaDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img 
              src={logo} 
              alt="Umzugscheck.ch Logo" 
              className="h-14 md:h-20 w-auto" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={() => setIsMegaDropdownOpen(true)}
                    onMouseLeave={() => setIsMegaDropdownOpen(false)}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-foreground hover:text-primary transition-colors font-medium rounded-lg hover:bg-secondary/50"
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      isMegaDropdownOpen && "rotate-180"
                    )} />
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

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <DarkModeToggle />
            <Link to="/auth">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Admin Login
              </Button>
            </Link>
            <Link to="/rechner">
              <Button className="bg-accent hover:bg-accent/90 shadow-medium">
                Offerten erhalten
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors" 
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </nav>
  );
};
