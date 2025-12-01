import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, Home, Building2, Sparkles, Trash2, Wrench, Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  { icon: Home, title: "Privatumzug", href: "/privatumzug" },
  { icon: Building2, title: "Firmenumzug", href: "/firmenumzug" },
  { icon: Sparkles, title: "Umzug mit Reinigung", href: "/umzug-mit-reinigung" },
  { icon: Sparkles, title: "Reinigung", href: "/reinigung" },
  { icon: Trash2, title: "Entsorgung & Räumung", href: "/entsorgung-raeumung" },
  { icon: Wrench, title: "Möbellift", href: "/moebellift" },
  { icon: Box, title: "Einlagerung", href: "/einlagerung" }
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div 
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile Hauptnavigation"
        className="fixed top-16 sm:top-20 right-0 bottom-0 w-[min(320px,85vw)] bg-white border-l border-border z-50 overflow-y-auto shadow-strong animate-slide-in-right lg:hidden"
      >
        <div className="p-6 space-y-2">
          {/* Preisrechner - Direct Link */}
          <Link
            to="/umzugsrechner"
            onClick={onClose}
            className={cn(
              "flex items-center w-full px-4 py-3 rounded-lg transition-colors font-medium",
              isActive("/umzugsrechner")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            Preisrechner
          </Link>

          {/* Umzugsfirmen - Direct Link */}
          <Link
            to="/umzugsfirmen"
            onClick={onClose}
            className={cn(
              "flex items-center w-full px-4 py-3 rounded-lg transition-colors font-medium",
              isActive("/umzugsfirmen")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            Umzugsfirmen
          </Link>

          {/* Services Accordion */}
          <Collapsible
            open={isServicesOpen}
            onOpenChange={setIsServicesOpen}
          >
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors font-medium"
              aria-expanded={isServicesOpen}
              aria-controls="services-menu"
              aria-label="Services Menü öffnen"
            >
              <span>Services</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isServicesOpen && "rotate-180"
              )} 
              aria-hidden="true" />
            </CollapsibleTrigger>
            <CollapsibleContent id="services-menu" className="mt-2 space-y-1">
              {services.map((service) => (
                <Link
                  key={service.title}
                  to={service.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 ml-4 rounded-lg transition-colors",
                    isActive(service.href)
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  aria-label={service.title}
                >
                  <service.icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-sm">{service.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Regionen - Direct Link */}
          <Link
            to="/regionen"
            onClick={onClose}
            className={cn(
              "flex items-center w-full px-4 py-3 rounded-lg transition-colors font-medium",
              isActive("/regionen")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            Regionen
          </Link>

          {/* Ratgeber - Direct Link */}
          <Link
            to="/ratgeber"
            onClick={onClose}
            className={cn(
              "flex items-center w-full px-4 py-3 rounded-lg transition-colors font-medium",
              isActive("/ratgeber")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            Ratgeber
          </Link>

          {/* Für Firmen - Direct Link */}
          <Link
            to="/fuer-firmen"
            onClick={onClose}
            className={cn(
              "flex items-center w-full px-4 py-3 rounded-lg transition-colors font-medium",
              isActive("/fuer-firmen")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-secondary"
            )}
          >
            Für Firmen
          </Link>

          {/* Divider */}
          <div className="border-t border-border my-4" />

          {/* CTA */}
          <Link to="/" onClick={onClose}>
            <Button className="w-full bg-destructive hover:bg-destructive/90 shadow-medium">
              Offerten vergleichen
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
