import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  Lightbulb, 
  HelpCircle, 
  FileText, 
  Building2,
  Package,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnchorItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const ANCHOR_ITEMS: AnchorItem[] = [
  { id: "preise", label: "Preise", icon: <Calculator className="h-4 w-4" /> },
  { id: "komplettpaket", label: "Komplettpaket", icon: <Package className="h-4 w-4" /> },
  { id: "tipps", label: "Tipps", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "vertrauen", label: "Vertrauen", icon: <Shield className="h-4 w-4" /> },
  { id: "firmen", label: "Firmen", icon: <Building2 className="h-4 w-4" /> },
  { id: "faq", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
  { id: "offerten", label: "Offerten", icon: <FileText className="h-4 w-4" /> },
];

interface RegionAnchorNavProps {
  className?: string;
}

export const RegionAnchorNav = memo(({ className }: RegionAnchorNavProps) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we should show sticky nav
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 400);

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

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ 
        opacity: isSticky ? 1 : 0.95, 
        y: 0,
        position: isSticky ? "fixed" : "relative"
      }}
      className={cn(
        "w-full bg-background/95 backdrop-blur-md border-b border-border/50 z-40 transition-shadow",
        isSticky && "top-0 left-0 right-0 shadow-md",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          {ANCHOR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
});

RegionAnchorNav.displayName = "RegionAnchorNav";
