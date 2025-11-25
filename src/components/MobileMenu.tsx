import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Calculator, Sparkles, Trash2, Package, Wrench, Box, Settings, Video } from "lucide-react";
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

const calculators = [
  {
    icon: Calculator,
    title: "Umzugsrechner",
    href: "/rechner"
  },
  {
    icon: Sparkles,
    title: "Reinigungsrechner",
    href: "/rechner/reinigung"
  },
  {
    icon: Trash2,
    title: "Entsorgungsrechner",
    href: "/rechner/entsorgung"
  },
  {
    icon: Box,
    title: "Lagerrechner",
    href: "/rechner/lager"
  },
  {
    icon: Package,
    title: "Packservice-Rechner",
    href: "/rechner/packservice"
  },
  {
    icon: Wrench,
    title: "Möbelmontage-Rechner",
    href: "/rechner/moebelmontage"
  },
  {
    icon: Settings,
    title: "Gesamtpreis-Konfigurator",
    href: "/rechner/konfigurator"
  },
  {
    icon: Video,
    title: "Video-Umzugsrechner",
    href: "/rechner/video"
  }
];

const mainNavItems = [
  { label: "Startseite", href: "/" },
  { label: "Preise", href: "/preise" },
  { label: "Vergleich", href: "/vergleich" },
  { label: "Offerte", href: "/offerte" },
  { label: "Umzugsfirmen", href: "/firmen" },
  { label: "Dienstleistungen", href: "/dienstleistungen" },
  { label: "Ratgeber", href: "/blog" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" }
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-20 md:top-24 right-0 bottom-0 w-80 max-w-[85vw] bg-background border-l border-border z-50 overflow-y-auto shadow-strong animate-slide-in-right lg:hidden">
        <div className="p-4 pb-20 space-y-1">
          {/* Main Nav Items */}
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className="block px-4 py-3.5 text-foreground hover:bg-secondary/80 rounded-lg transition-all font-medium text-[15px]"
            >
              {item.label}
            </Link>
          ))}

          {/* Calculators Accordion */}
          <Collapsible
            open={isCalculatorsOpen}
            onOpenChange={setIsCalculatorsOpen}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3.5 text-foreground hover:bg-secondary/80 rounded-lg transition-all font-medium text-[15px]">
              <span>Rechner</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isCalculatorsOpen && "rotate-180"
              )} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-0.5 pl-3">
              {calculators.map((calc) => (
                <Link
                  key={calc.title}
                  to={calc.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/70 rounded-lg transition-all"
                >
                  <calc.icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-[14px]">{calc.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Divider */}
          <div className="border-t border-border my-4" />

          {/* Auth & CTA */}
          <div className="space-y-2 px-1">
            <Link to="/auth" onClick={onClose} className="block">
              <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary h-11">
                Admin Login
              </Button>
            </Link>
            <Link to="/rechner" onClick={onClose} className="block">
              <Button className="w-full bg-accent hover:bg-accent/90 shadow-medium h-12 text-[15px] font-semibold">
                Offerten erhalten
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
