/**
 * Mobile Menu V14 - 2026 Design
 * 
 * Accordion-style mobile menu with:
 * - 5 expandable sections
 * - Context-aware CTA at bottom
 * - Smooth animations
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  tagline: string;
  items: {
    icon: React.ElementType;
    title: string;
    href: string;
  }[];
}

interface MobileMenuV14Props {
  isOpen: boolean;
  onClose: () => void;
  navStructure: NavItem[];
  ctaConfig: { label: string; href: string };
}

export const MobileMenuV14 = ({ isOpen, onClose, navStructure, ctaConfig }: MobileMenuV14Props) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[10000] lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-background z-[10005] lg:hidden flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-lg font-bold text-primary">Umzugscheck</span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
                <span className="sr-only">Menü schliessen</span>
              </Button>
            </div>

            {/* Navigation Accordion */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-2">
                {navStructure.map((section) => (
                  <div key={section.label} className="border border-border rounded-lg overflow-hidden">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.label)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 text-left transition-colors",
                        "hover:bg-accent",
                        expandedSection === section.label && "bg-accent"
                      )}
                    >
                      <div>
                        <span className="font-semibold text-foreground">{section.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {section.tagline}
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-2",
                          expandedSection === section.label && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedSection === section.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-1 bg-muted/30">
                            {section.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  onClick={onClose}
                                  className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-accent transition-colors group"
                                >
                                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                  <span className="text-sm">{item.title}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>

            {/* Sticky CTA */}
            <div className="p-4 border-t border-border bg-background">
              <Button asChild className="w-full font-semibold h-12 text-base">
                <Link to={ctaConfig.href} onClick={onClose}>
                  {ctaConfig.label}
                </Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Kostenlos & unverbindlich
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
