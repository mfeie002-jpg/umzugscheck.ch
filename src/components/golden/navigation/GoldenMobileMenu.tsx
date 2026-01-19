/**
 * GoldenMobileMenu - Premium mobile navigation
 * 
 * Best patterns combined:
 * - Full-height drawer (V16)
 * - Accordion sections (V12, V13)
 * - Touch-optimized targets (V-E, min 56px)
 * - Sticky CTA footer (V11)
 * - Safe area support (V16)
 */

import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronRight, Zap, ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { GOLDEN_NAV_CONFIG, GOLDEN_NAV_SECTIONS } from "../config/navigation";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface GoldenMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoldenMobileMenu = memo(({ isOpen, onClose }: GoldenMobileMenuProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const flowPath = useFlowPath();

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-[320px] bg-background shadow-2xl z-[10000] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <span className="text-lg font-bold text-foreground">Menü</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 rounded-full hover:bg-destructive/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-safe">
              {/* Main Sections */}
              <div className="p-2">
                {GOLDEN_NAV_SECTIONS.map((section) => (
                  <div key={section.id} className="mb-1">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl",
                        "min-h-[56px] touch-manipulation",
                        "hover:bg-muted/50 active:bg-muted transition-colors",
                        expandedSection === section.id && "bg-primary/5"
                      )}
                    >
                      <span className="text-base font-semibold text-foreground">
                        {section.label}
                      </span>
                      <ChevronRight className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform duration-200",
                        expandedSection === section.id && "rotate-90"
                      )} />
                    </button>

                    {/* Expanded Items */}
                    <AnimatePresence>
                      {expandedSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pr-2 pb-2 space-y-1">
                            {section.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  onClick={onClose}
                                  className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg",
                                    "min-h-[52px] touch-manipulation",
                                    "hover:bg-primary/5 active:bg-primary/10 transition-colors"
                                  )}
                                >
                                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-foreground">
                                        {item.title}
                                      </span>
                                      {item.badge && (
                                        <span className={cn(
                                          "px-1.5 py-0.5 text-[9px] font-bold text-white rounded-full",
                                          item.badgeColor 
                                            ? `bg-gradient-to-r ${item.badgeColor}` 
                                            : "bg-primary"
                                        )}>
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs text-muted-foreground line-clamp-1">
                                      {item.description}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="px-4 py-3 border-t border-border/50 mt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Schnellzugriff
                </p>
                <div className="flex gap-2">
                  <Link
                    to="tel:+41445001234"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Anrufen</span>
                  </Link>
                  <Link
                    to="mailto:info@umzugscheck.ch"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">E-Mail</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sticky CTA Footer */}
            <div className="p-4 border-t border-border/50 bg-gradient-to-t from-background to-transparent pb-safe">
              <Button 
                asChild 
                className="w-full h-14 font-bold gap-2 rounded-xl bg-gradient-to-r from-secondary via-secondary to-secondary/90 shadow-lg shadow-secondary/20 text-base"
              >
                <Link to={flowPath} onClick={onClose}>
                  <Zap className="w-5 h-5" />
                  {GOLDEN_NAV_CONFIG.labels.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <p className="text-center text-[10px] text-muted-foreground mt-2">
                {GOLDEN_NAV_CONFIG.ctaCard.badges.join(" · ")}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

GoldenMobileMenu.displayName = "GoldenMobileMenu";
