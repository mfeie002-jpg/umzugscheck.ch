import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronRight, Home, Building2, Sparkles, Trash2, Wrench, Box,
  Calculator, Video, Package, Settings, Trophy, TrendingDown, MapPin,
  FileText, DollarSign, CheckSquare, Lightbulb, Briefcase, LogIn, Award, HelpCircle, BookOpen, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    id: "calculator",
    title: "Preisrechner",
    icon: Calculator,
    items: [
      { icon: Calculator, title: "Umzugsrechner", href: "/umzugsofferten" },
      { icon: Sparkles, title: "Reinigungsrechner", href: "/umzugsofferten?service=reinigung" },
      { icon: Trash2, title: "Entsorgungsrechner", href: "/umzugsofferten?service=entsorgung" },
      { icon: Box, title: "Lagerrechner", href: "/umzugsofferten?service=lagerung" },
      { icon: Video, title: "Video-Umzugsrechner", href: "/umzugsofferten?mode=video" },
    ],
  },
  {
    id: "companies",
    title: "Umzugsfirmen",
    icon: Building2,
    items: [
      { icon: Trophy, title: "Beste Umzugsfirmen 2025", href: "/beste-umzugsfirma" },
      { icon: TrendingDown, title: "Günstige Umzugsfirmen", href: "/guenstige-umzugsfirma" },
      { icon: Building2, title: "Alle Umzugsfirmen", href: "/umzugsfirmen-schweiz" },
    ],
  },
  {
    id: "services",
    title: "Services",
    icon: Package,
    items: [
      { icon: Home, title: "Privatumzug", href: "/privatumzug" },
      { icon: Building2, title: "Firmenumzug", href: "/firmenumzug" },
      { icon: Sparkles, title: "Umzug mit Reinigung", href: "/umzug-mit-reinigung" },
      { icon: Sparkles, title: "Reinigung", href: "/reinigung" },
      { icon: Trash2, title: "Entsorgung", href: "/entsorgung-raeumung" },
      { icon: Box, title: "Einlagerung", href: "/einlagerung" },
    ],
  },
  {
    id: "regions",
    title: "Regionen",
    icon: MapPin,
    items: [
      { icon: MapPin, title: "Zürich", href: "/zuerich" },
      { icon: MapPin, title: "Bern", href: "/bern" },
      { icon: MapPin, title: "Basel", href: "/basel" },
      { icon: MapPin, title: "Luzern", href: "/luzern" },
      { icon: MapPin, title: "Aargau", href: "/aargau" },
      { icon: MapPin, title: "Alle Regionen", href: "/regionen" },
    ],
  },
  {
    id: "ratgeber",
    title: "Ratgeber",
    icon: BookOpen,
    items: [
      { icon: DollarSign, title: "Kosten & Preise", href: "/ratgeber/kosten" },
      { icon: CheckSquare, title: "Umzugscheckliste", href: "/ratgeber/checklisten" },
      { icon: Lightbulb, title: "Umzugstipps", href: "/ratgeber/umzugstipps" },
      { icon: BookOpen, title: "Alle Ratgeber", href: "/ratgeber" },
    ],
  },
  {
    id: "provider",
    title: "Für Firmen",
    icon: Briefcase,
    items: [
      { icon: Briefcase, title: "Anbieter werden", href: "/anbieter" },
      { icon: LogIn, title: "Anbieter Login", href: "/anbieter/login" },
      { icon: DollarSign, title: "Preise", href: "/anbieter/preise" },
      { icon: HelpCircle, title: "FAQ", href: "/anbieter/faq" },
    ],
  },
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Reset active section when menu opens
  useEffect(() => {
    if (isOpen) {
      setActiveSection(null);
    }
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;

  const currentSection = menuSections.find(s => s.id === activeSection);

  return (
    <>
      {/* Overlay with fade animation */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
        style={{ 
          animation: 'fadeIn 0.25s ease-out forwards' 
        }}
      />
      
      {/* Menu Panel - Full screen slide from right with smooth animation */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-sm",
          "bg-background z-50 lg:hidden",
          "flex flex-col",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ 
          animation: isOpen ? 'slideInFromRight 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards' : undefined 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-background/95 backdrop-blur-md">
          <h2 className="font-bold text-lg">
            {activeSection ? currentSection?.title : "Menü"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={activeSection ? () => setActiveSection(null) : onClose}
            className="h-10 w-10"
          >
            {activeSection ? (
              <ChevronRight className="w-5 h-5 rotate-180" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {!activeSection ? (
              // Main Menu - Optimized touch targets
              <div className="space-y-3">
                {menuSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-5 rounded-xl",
                      "bg-accent/50 hover:bg-accent/80 active:bg-accent",
                      "transition-all duration-200 ease-out",
                      "active:scale-[0.98] touch-manipulation",
                      "min-h-[56px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                        <section.icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground text-base">{section.title}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            ) : (
              // Sub Menu - Optimized touch targets
              <div className="space-y-2">
                {currentSection?.items.map((item, index) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl",
                      "transition-all duration-200 ease-out",
                      "active:scale-[0.98] touch-manipulation",
                      "min-h-[52px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-accent/80 active:bg-accent"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      isActive(item.href) ? "bg-primary-foreground/20" : "bg-primary/10"
                    )}>
                      <item.icon className={cn(
                        "w-5 h-5",
                        isActive(item.href) ? "text-primary-foreground" : "text-primary"
                      )} />
                    </div>
                    <span className={cn(
                      "font-medium text-base",
                      isActive(item.href) ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer CTA */}
        <div className="p-4 border-t border-border bg-background/95 backdrop-blur-md">
          <Link to="/umzugsofferten" onClick={onClose}>
            <Button 
              className="w-full h-14 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
              size="lg"
            >
              Kostenlos Offerten erhalten
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
