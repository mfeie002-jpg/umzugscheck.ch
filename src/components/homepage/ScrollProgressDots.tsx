/**
 * ScrollProgressDots - Discrete section navigation dots
 * Shows user progress through homepage sections (desktop only)
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

interface ScrollProgressDotsProps {
  sections?: Section[];
  className?: string;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: "hero", label: "Start" },
  { id: "trust", label: "Vertrauen" },
  { id: "how-it-works", label: "So funktioniert's" },
  { id: "compare", label: "Vergleich" },
  { id: "testimonials", label: "Bewertungen" },
  { id: "contact", label: "Kontakt" },
];

export const ScrollProgressDots = memo(function ScrollProgressDots({
  sections = DEFAULT_SECTIONS,
  className,
}: ScrollProgressDotsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show dots after scrolling past hero
      setIsVisible(scrollY > windowHeight * 0.3);
      
      // Calculate active section based on scroll position
      const progress = scrollY / (documentHeight - windowHeight);
      const sectionIndex = Math.min(
        Math.floor(progress * sections.length),
        sections.length - 1
      );
      setActiveIndex(sectionIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections.length]);

  const scrollToSection = (index: number) => {
    const sectionId = sections[index].id;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback: scroll to percentage of page
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const targetScroll = (index / sections.length) * (documentHeight - windowHeight);
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed right-4 top-1/2 -translate-y-1/2 z-40",
            "hidden lg:flex flex-col gap-3",
            className
          )}
        >
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(index)}
              className="group relative flex items-center justify-end"
              aria-label={`Scroll to ${section.label}`}
            >
              {/* Label - appears on hover */}
              <span className="absolute right-6 px-2 py-1 rounded-md bg-card border border-border text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                {section.label}
              </span>
              
              {/* Dot */}
              <motion.div
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
            </button>
          ))}
          
          {/* Progress line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border -z-10" />
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-primary -z-10"
            style={{
              height: `${(activeIndex / (sections.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default ScrollProgressDots;
