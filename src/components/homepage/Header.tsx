import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Preisrechner", href: "/rechner", hasDropdown: true },
  { label: "Umzugsfirmen", href: "/umzugsfirmen", hasDropdown: true },
  { label: "Services", href: "/dienstleistungen", hasDropdown: true },
  { label: "Regionen", href: "/regionen", hasDropdown: true },
  { label: "Ratgeber", href: "/ratgeber", hasDropdown: true },
  { label: "Für Firmen", href: "/fuer-firmen", hasDropdown: true },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">Umzugs</span>
              <span className="text-xl font-bold text-secondary">check</span>
              <span className="text-xl font-bold text-muted-foreground">.ch</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              className="bg-secondary/10 text-secondary hover:bg-secondary/20 font-semibold animate-pulse-subtle"
            >
              <Link to="/umzugsofferten">
                Offerten erhalten
              </Link>
            </Button>
          </div>

          {/* Mobile: CTA + Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="font-semibold"
            >
              <Link to="/umzugsofferten">
                Offerten vergleichen
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu öffnen"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-4 h-4 opacity-50" />}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
