/**
 * Mobile Menu V15 - Clean Mobile-First UX/UI
 * 
 * Features:
 * - 44-52px touch targets
 * - Clean design without excessive gradients
 * - Semantic colors using design tokens
 * - Smooth animations
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  X, ChevronDown, ArrowRight, CheckCircle, Shield, Zap, Star, Search,
  ClipboardList, FileSearch, HelpCircle, Building2, Sparkles, 
  Package, BadgeCheck, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface NavItem {
  label: string;
  tagline: string;
  emoji?: string;
  items: {
    emoji: string;
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

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
} as const;

const TRUST_SIGNALS = [
  { icon: BadgeCheck, label: "Geprüft", color: "text-primary" },
  { icon: Star, label: "4.8★", color: "text-primary" },
  { icon: Zap, label: "Gratis", color: "text-primary" },
];

// Map section labels to gradient colors
const SECTION_GRADIENTS: Record<string, { from: string; to: string; icon: React.ElementType }> = {
  "Plane deinen Umzug": { from: "from-blue-500", to: "to-indigo-600", icon: ClipboardList },
  "Offerten vergleichen": { from: "from-primary", to: "to-emerald-600", icon: FileSearch },
  "So funktioniert's": { from: "from-amber-500", to: "to-orange-600", icon: Sparkles },
  "Hilfe & Kontakt": { from: "from-purple-500", to: "to-pink-600", icon: HelpCircle },
};

export const MobileMenuV15 = ({ isOpen, onClose, navStructure }: MobileMenuV15Props) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const flowPath = useFlowPath();

  const toggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 w-full max-w-[360px] bg-background z-50 lg:hidden flex flex-col shadow-2xl"
          >
            {/* Header - Clean & Simple */}
            <div className="border-b border-border bg-card">
              {/* Trust Bar - Subtle */}
              <div className="flex items-center justify-center gap-4 py-2 bg-muted/50">
                {TRUST_SIGNALS.map((signal, idx) => {
                  const Icon = signal.icon;
                  return (
                    <motion.div 
                      key={signal.label} 
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.03 }}
                    >
                      <Icon className={cn("w-3.5 h-3.5", signal.color)} />
                      <span className="text-xs font-medium text-muted-foreground">{signal.label}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Title & Close - No duplicate logo */}
              <div className="flex items-center justify-between px-4 py-3">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-base font-bold text-foreground">Menü</h2>
                  <p className="text-[11px] text-muted-foreground">Navigation & Services</p>
                </motion.div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose} 
                  className="rounded-lg h-10 w-10 hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Menü schliessen</span>
                </Button>
              </div>

              {/* Search Bar - Cleaner */}
              <div className="px-4 pb-3">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Stadt oder Kanton suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                  />
                </motion.div>
              </div>
            </div>

            {/* Navigation Accordion - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <nav className="p-4 space-y-3">
                {navStructure.map((section, idx) => {
                  const sectionConfig = SECTION_GRADIENTS[section.label] || { 
                    from: "from-primary", 
                    to: "to-primary/80",
                    icon: Package
                  };
                  const SectionIcon = sectionConfig.icon;

                  return (
                    <motion.div 
                      key={section.label} 
                      custom={idx}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn(
                        "rounded-xl overflow-hidden transition-all",
                        expandedSection === section.label 
                          ? "ring-1 ring-primary/20 bg-muted/30" 
                          : "border border-border hover:border-primary/20"
                      )}
                    >
                      {/* Section Header - Clean design */}
                      <button
                        onClick={() => toggleSection(section.label)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 min-h-[56px] text-left transition-all",
                          "active:bg-muted/50 touch-manipulation"
                        )}
                      >
                        {/* Simple Icon Container - using semantic colors */}
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          "bg-primary/10 text-primary"
                        )}>
                          <SectionIcon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-foreground block text-sm">
                            {section.label}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {section.tagline}
                          </p>
                        </div>

                        <ChevronDown className={cn(
                          "h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform",
                          expandedSection === section.label && "rotate-180"
                        )} />
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
                            <div className="px-3 pb-3 pt-1 space-y-1 bg-muted/20">
                              {section.items.map((item, itemIdx) => (
                                <motion.div
                                  key={item.href}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: itemIdx * 0.03 }}
                                >
                                  <Link
                                    to={item.href}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background active:bg-accent transition-colors group touch-manipulation"
                                  >
                                    {/* No emojis in navigation (clean Swiss look) */}
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border border-border/40">
                                      <ArrowRight className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-medium text-foreground block group-hover:text-primary transition-colors">
                                        {item.title}
                                      </span>
                                      <span className="text-xs text-muted-foreground line-clamp-1">
                                        {item.description}
                                      </span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                                  </Link>
                                </motion.div>
                              ))}

                              {/* Section-specific CTA for Offerten */}
                              {section.label === "Offerten vergleichen" && (
                                <div className="pt-2 mt-1 border-t border-border">
                                  <Button asChild className="w-full h-11 font-semibold gap-2 rounded-lg bg-secondary hover:bg-secondary/90">
                                    <Link to={flowPath} onClick={onClose}>
                                      <Zap className="w-4 h-4" />
                                      Gratis Offerten holen
                                      <ArrowRight className="w-4 h-4" />
                                    </Link>
                                  </Button>
                                  <p className="text-[10px] text-center text-muted-foreground mt-1.5">
                                    Kostenlos & unverbindlich
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Für Anbieter Link - Clean */}
                <motion.div
                  custom={navStructure.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to="/anbieter"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 min-h-[56px] border border-dashed border-border rounded-xl hover:bg-muted/50 transition-colors group touch-manipulation"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-foreground block text-sm">Für Anbieter</span>
                      <p className="text-xs text-muted-foreground">Partner werden & Leads erhalten</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </motion.div>
              </nav>
            </div>

            {/* Sticky CTA Footer - Clean */}
            <div className="border-t border-border bg-card safe-area-inset-bottom">
              {/* Trust Pills Row */}
              <div className="flex items-center justify-center gap-3 py-2 px-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>Gratis</span>
                </div>
                <span className="text-muted-foreground/30">•</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>In 2 Min</span>
                </div>
                <span className="text-muted-foreground/30">•</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  <span>Swiss Made</span>
                </div>
              </div>

              {/* Main CTA Button */}
              <div className="px-4 pb-4">
                <Button asChild className="w-full h-12 text-sm font-bold gap-2 rounded-lg bg-secondary hover:bg-secondary/90">
                  <Link to={flowPath} onClick={onClose}>
                    Kostenlos Offerten erhalten
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  Unverbindlich • 3–5 Offerten in 24h
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
