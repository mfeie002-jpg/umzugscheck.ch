import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-primary">Umzugscheck.ch</span>
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
            <Link to="/blog" className="text-foreground hover:text-primary transition-base font-medium">
              Ratgeber
            </Link>
            <Link to="/kontakt" className="text-foreground hover:text-primary transition-base font-medium">
              Kontakt
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
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
