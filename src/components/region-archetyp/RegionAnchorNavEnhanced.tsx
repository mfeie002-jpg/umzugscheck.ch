/**
 * GOLD STANDARD - Enhanced Anchor Navigation
 * Sticky mini navigation with more sections
 * ChatGPT recommendation: Add "So funktioniert's", "Services", "Warum wir"
 */

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, Lightbulb, HelpCircle, FileText, 
  Building2, Sparkles, Shield, MapPin, Cog
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnchorItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const ANCHOR_ITEMS: AnchorItem[] = [
  { id: "firmen", label: "Top Firmen", shortLabel: "Firmen", icon: <Building2 className="h-4 w-4" /> },
  { id: "so-funktionierts", label: "So geht's", shortLabel: "3 Schritte", icon: <Cog className="h-4 w-4" /> },
  { id: "services", label: "Services", shortLabel: "Services", icon: <Sparkles className="h-4 w-4" /> },
  { id: "preise", label: "Preise", shortLabel: "Preise", icon: <Calculator className="h-4 w-4" /> },
  { id: "gemeinden", label: "Gemeinden", shortLabel: "Orte", icon: <MapPin className="h-4 w-4" /> },
  { id: "warum-wir", label: "Warum wir", shortLabel: "Vorteile", icon: <Shield className="h-4 w-4" /> },
  { id: "tipps", label: "Tipps", shortLabel: "Tipps", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "faq", label: "FAQ", shortLabel: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
  { id: "offerten", label: "Offerten", shortLabel: "Offerten", icon: <FileText className="h-4 w-4" /> },
];

interface RegionAnchorNavEnhancedProps {
  className?: string;
}

export const RegionAnchorNavEnhanced = memo(({ className }: RegionAnchorNavEnhancedProps) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 500);

      // Find active section
      const sections = ANCHOR_ITEMS.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(s => s.element);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!isSticky) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-md border-b border-border/50 z-50 shadow-md",
        className
      )}
    >
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto py-2 scrollbar-hide">
          {ANCHOR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all shrink-0",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
});

RegionAnchorNavEnhanced.displayName = "RegionAnchorNavEnhanced";
