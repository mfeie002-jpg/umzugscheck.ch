/**
 * GOLD STANDARD - Sticky Mini Navigation (Mobile-First)
 * ChatGPT recommendation: After hero, show quick nav to key sections
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Building2, Wrench, HelpCircle, MapPin } from "lucide-react";

interface RegionMiniNavProps {
  showAfterScroll?: number;
  sections?: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
  }>;
}

const DEFAULT_SECTIONS = [
  { id: 'preise', label: 'Preise', icon: Calculator },
  { id: 'firmen', label: 'Top Firmen', icon: Building2 },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'so-funktionierts', label: "So geht's", icon: HelpCircle },
  { id: 'staedte', label: 'Gemeinden', icon: MapPin },
];

export const RegionMiniNav = memo(({ 
  showAfterScroll = 600,
  sections = DEFAULT_SECTIONS 
}: RegionMiniNavProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero
      setIsVisible(window.scrollY > showAfterScroll);
      
      // Determine active section
      const scrollPosition = window.scrollY + 100;
      let currentSection = '';
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop } = element;
          if (scrollPosition >= offsetTop) {
            currentSection = section.id;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll, sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm md:hidden"
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
});

RegionMiniNav.displayName = 'RegionMiniNav';
