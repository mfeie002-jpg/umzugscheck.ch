/**
 * Mobile Menu V15 - ChatGPT Feedback v15
 * 
 * Mobile-first accordion menu with:
 * - 4 main sections (Du-Form)
 * - Emotional microcopy
 * - 5-item submenu for Offerten
 * - Sticky CTA footer
 * - Smooth animations
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronDown, ArrowRight, CheckCircle, Shield, Zap, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  tagline: string;
  emoji?: string;
  items: {
    icon: React.ElementType;
    title: string;
    description: string;
    href: string;
  }[];
}

interface MobileMenuV15Props {
  isOpen: boolean;
  onClose: () => void;
  navStructure: NavItem[];
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
} as const;

const menuVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 200 }
  },
  exit: { 
    x: "100%",
    transition: { duration: 0.2 }
  }
} as const;

const TRUST_SIGNALS = [
  { icon: Shield, label: "Geprüft", color: "text-emerald-600" },
  { icon: Star, label: "4.8★", color: "text-amber-500" },
  { icon: Zap, label: "Gratis", color: "text-primary" },
];

export const MobileMenuV15 = ({ isOpen, onClose, navStructure }: MobileMenuV15Props) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-background z-50 lg:hidden flex flex-col shadow-2xl"
          >
            {/* Header with Trust Micro-Bar */}
            <div className="border-b border-border">
              {/* Trust Bar */}
              <div className="flex items-center justify-center gap-4 py-2 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
                {TRUST_SIGNALS.map((signal) => {
                  const Icon = signal.icon;
                  return (
                    <div key={signal.label} className="flex items-center gap-1">
                      <Icon className={cn("w-3.5 h-3.5", signal.color)} />
                      <span className="text-xs font-medium text-muted-foreground">{signal.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Logo & Close */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold">
                    <span className="text-foreground">Umzugs</span>
                    <span className="text-primary">check</span>
                    <span className="text-muted-foreground text-sm">.ch</span>
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Menü schliessen</span>
                </Button>
              </div>

              {/* Search Bar */}
              <div className="px-4 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Stadt oder Kanton suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Accordion */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-2">
                {navStructure.map((section) => (
                  <div key={section.label} className="border border-border rounded-xl overflow-hidden bg-card">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.label)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 text-left transition-colors",
                        "hover:bg-accent active:bg-accent",
                        expandedSection === section.label && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{section.emoji}</span>
                        <div>
                          <span className="font-semibold text-foreground block">{section.label}</span>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[200px]">
                            {section.tagline}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
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
                          <div className="px-4 pb-4 space-y-1 bg-muted/20">
                            {section.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  onClick={onClose}
                                  className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors group"
                                >
                                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="h-4 w-4 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-foreground block">{item.title}</span>
                                    <span className="text-xs text-muted-foreground line-clamp-2">{item.description}</span>
                                  </div>
                                </Link>
                              );
                            })}

                            {/* Section-specific CTA */}
                            {section.label === "Offerten vergleichen" && (
                              <div className="pt-3 mt-2 border-t border-border">
                                <Button asChild className="w-full h-11 font-semibold gap-2">
                                  <Link to="/umzugsofferten" onClick={onClose}>
                                    Gratis Offerten holen
                                    <ArrowRight className="w-4 h-4" />
                                  </Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Für Anbieter Link */}
                <Link
                  to="/anbieter"
                  onClick={onClose}
                  className="flex items-center justify-between p-4 border border-border rounded-xl bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💼</span>
                    <div>
                      <span className="font-semibold text-foreground block">Für Anbieter</span>
                      <p className="text-xs text-muted-foreground">Partner werden & Leads erhalten</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              </nav>
            </div>

            {/* Sticky CTA Footer */}
            <div className="p-4 border-t border-border bg-background safe-area-inset-bottom">
              {/* Trust Pills */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gratis</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span>In 2 Min</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Swiss Made</span>
                </div>
              </div>

              {/* Main CTA */}
              <Button asChild className="w-full h-14 text-base font-bold gap-2 shadow-lg">
                <Link to="/umzugsofferten" onClick={onClose}>
                  Kostenlos Offerten erhalten
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-2">
                Unverbindlich • 3–5 Offerten in 24h
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
