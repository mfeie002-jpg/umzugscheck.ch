/**
 * STICKY SECTION NAV
 * 
 * Desktop/Tablet sticky navigation for long pages
 * Shows current section and allows quick navigation
 */

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
}

interface StickySectionNavProps {
  items: NavItem[];
  variant?: 'canton' | 'city';
  className?: string;
}

const defaultCantonItems: NavItem[] = [
  { id: 'offerten', label: 'Offerten' },
  { id: 'preise', label: 'Preise' },
  { id: 'firmen', label: 'Top Firmen' },
  { id: 'services', label: 'Services' },
  { id: 'so-funktionierts', label: "So geht's" },
  { id: 'gemeinden', label: 'Gemeinden' },
  { id: 'faq', label: 'FAQ' },
];

const defaultCityItems: NavItem[] = [
  { id: 'offerten', label: 'Offerten' },
  { id: 'preise', label: 'Preise' },
  { id: 'quartiere', label: 'Quartiere' },
  { id: 'services', label: 'Services' },
  { id: 'so-funktionierts', label: "So geht's" },
  { id: 'faq', label: 'FAQ' },
];

export const StickySectionNav = memo(({
  items,
  variant = 'canton',
  className,
}: StickySectionNavProps) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isSticky, setIsSticky] = useState(false);

  const navItems = items.length > 0 ? items : (variant === 'canton' ? defaultCantonItems : defaultCityItems);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero
      setIsSticky(window.scrollY > 500);

      // Find active section
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            return;
          }
        }
      }
      
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isSticky) return null;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 hidden md:block",
        "bg-background/95 backdrop-blur-md border-b border-border",
        "shadow-sm",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-2 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
});

StickySectionNav.displayName = 'StickySectionNav';
