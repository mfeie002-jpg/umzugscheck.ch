/**
 * Sticky Navigation for Vision Page
 * Anchor links to all sections with smooth scrolling
 */

import { memo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Rocket, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Globe,
  UserCircle,
  ChevronDown
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

interface NavItem {
  id: string;
  labelDe: string;
  labelBg: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "vision-hero", labelDe: "Vision", labelBg: "Визия", icon: <Rocket className="w-3.5 h-3.5" /> },
  { id: "vision-progress", labelDe: "Traction", labelBg: "Traction", icon: <Target className="w-3.5 h-3.5" /> },
  { id: "vision-customer-usps", labelDe: "USPs", labelBg: "USPs", icon: <Users className="w-3.5 h-3.5" /> },
  { id: "vision-investor-pillars", labelDe: "Pillars", labelBg: "Pillars", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "vision-unit-economics", labelDe: "Economics", labelBg: "Икономика", icon: <DollarSign className="w-3.5 h-3.5" /> },
  { id: "vision-market-potential", labelDe: "Markt", labelBg: "Пазар", icon: <Globe className="w-3.5 h-3.5" /> },
  { id: "vision-team", labelDe: "Team", labelBg: "Екип", icon: <UserCircle className="w-3.5 h-3.5" /> },
  { id: "vision-exit", labelDe: "Exit", labelBg: "Изход", icon: <Rocket className="w-3.5 h-3.5" /> },
];

interface VisionStickyNavProps {
  language: VisionLanguage;
}

export const VisionStickyNav = memo(({ language }: VisionStickyNavProps) => {
  const [activeSection, setActiveSection] = useState("vision-hero");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsExpanded(false);
  };

  return (
    <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        {/* Mobile: Dropdown */}
        <div className="md:hidden py-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              {navItems.find(n => n.id === activeSection)?.icon}
              {language === 'de' 
                ? navItems.find(n => n.id === activeSection)?.labelDe 
                : navItems.find(n => n.id === activeSection)?.labelBg
              }
            </span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
          </button>
          
          {isExpanded && (
            <div className="absolute left-4 right-4 mt-1 bg-background border rounded-lg shadow-lg p-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {item.icon}
                  {language === 'de' ? item.labelDe : item.labelBg}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: Horizontal nav */}
        <nav className="hidden md:flex items-center justify-center gap-1 py-2 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              {language === 'de' ? item.labelDe : item.labelBg}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
});

VisionStickyNav.displayName = 'VisionStickyNav';
