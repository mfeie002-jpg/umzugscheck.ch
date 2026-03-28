/**
 * GoldenDropdown - Premium mega-dropdown component
 * 
 * Best patterns combined:
 * - Trust micro-bar (V16)
 * - Animated item reveals (V16, V17)
 * - Badge system for highlights (V16)
 * - Premium CTA card (V-J, V-P)
 * - Backdrop blur (V16)
 */

import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GOLDEN_NAV_CONFIG, type NavSection } from "../config/navigation";

const TRUST_SIGNALS = [
  { icon: Shield, label: "Geprüfte Firmen", color: "text-primary" },
  { icon: Star, label: "4.8★ Bewertung", color: "text-secondary" },
  { icon: Heart, label: "100% Gratis", color: "text-secondary" },
];

interface GoldenDropdownProps {
  section: NavSection;
  onClose: () => void;
  flowPath: string;
}

export const GoldenDropdown = memo(({ section, onClose, flowPath }: GoldenDropdownProps) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[9998] top-[65px]"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 5, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[9999]"
      >
        <div className="w-[420px] bg-background rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Gradient accent - Brand colors only */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0050A8] via-[#E32026] to-[#0050A8]" />
          
          {/* Trust micro-bar */}
          <div className="border-b border-border/50 bg-muted/30">
            <div className="flex items-center justify-center gap-4 py-2.5 px-4">
              {TRUST_SIGNALS.map((signal, i) => (
                <motion.div
                  key={signal.label}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.03 }}
                  className="flex items-center gap-1.5"
                >
                  <signal.icon className={cn("w-3.5 h-3.5", signal.color)} />
                  <span className="text-[10px] font-semibold text-muted-foreground">{signal.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dropdown Header */}
          <div className="px-5 py-4 bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-transparent border-b border-border/30">
            <p className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="text-lg">🏠</span>
              {section.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{section.tagline}</p>
          </div>

          {/* Dropdown Items */}
          <div className="p-3 space-y-1">
            {section.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                >
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex items-start gap-3 px-3 py-3.5 rounded-xl hover:bg-muted/50 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0 group-hover:bg-muted transition-all group-hover:scale-110">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold text-white rounded-full uppercase shadow-sm",
                            item.badgeColor 
                              ? `bg-gradient-to-r ${item.badgeColor}` 
                              : "bg-gradient-to-r from-primary to-primary/80"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 opacity-0 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Premium CTA Card */}
          <div className="p-4 pt-2 bg-gradient-to-t from-muted/30 to-transparent">
            <Button asChild className="w-full h-12 font-bold gap-2 rounded-xl bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transition-all hover:scale-[1.02]">
              <Link to={flowPath} onClick={onClose}>
                <Zap className="w-5 h-5" />
                {GOLDEN_NAV_CONFIG.ctaCard.buttonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              {GOLDEN_NAV_CONFIG.ctaCard.badges.map((b, i) => (
                <span key={b}>
                  ✓ {b}{i < GOLDEN_NAV_CONFIG.ctaCard.badges.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
});

GoldenDropdown.displayName = "GoldenDropdown";
