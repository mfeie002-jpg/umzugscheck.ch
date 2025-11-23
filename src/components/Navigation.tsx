import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import logo from "@/assets/umzugscheck-logo-transparent.png";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-48 md:h-56">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img 
              src={logo} 
              alt="Umzugscheck.ch Logo" 
              className="h-40 md:h-48 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-base font-medium">
              Home
            </Link>
            <Link to="/rechner" className="text-foreground hover:text-primary transition-base font-medium">
              Preisrechner
            </Link>
            <Link to="/firmen" className="text-foreground hover:text-primary transition-base font-medium">
              Umzugsfirmen
            </Link>
            <Link to="/vergleichen" className="text-foreground hover:text-primary transition-base font-medium">
              Vergleichen
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-base font-medium">
              Ratgeber
            </Link>
            <Link to="/kontakt" className="text-foreground hover:text-primary transition-base font-medium">
              Kontakt
            </Link>
          </div>

          {/* CTA Button */}
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
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-base"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/rechner" 
                className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-base"
                onClick={() => setIsOpen(false)}
              >
                Preisrechner
              </Link>
              <Link 
                to="/firmen" 
                className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-base"
                onClick={() => setIsOpen(false)}
              >
                Umzugsfirmen
              </Link>
              <Link 
                to="/vergleichen" 
                className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-base"
                onClick={() => setIsOpen(false)}
              >
                Vergleichen
              </Link>
              <Link 
                to="/blog" 
                className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-base"
                onClick={() => setIsOpen(false)}
              >
                Ratgeber
              </Link>
              <Link 
                to="/kontakt" 
                className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-base"
                onClick={() => setIsOpen(false)}
              >
                Kontakt
              </Link>
              <Link 
                to="/auth" 
                className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-base"
                onClick={() => setIsOpen(false)}
              >
                Admin Login
              </Link>
              <Link to="/rechner" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-accent hover:bg-accent/90">
                  Offerten erhalten
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
