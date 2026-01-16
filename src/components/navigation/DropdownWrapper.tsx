/**
 * Enhanced Dropdown Wrapper
 * Warm, welcoming & premium mega-menu container
 */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Star, Heart, CheckCircle2 } from "lucide-react";

interface DropdownWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

// Trust micro-signals for dropdown header
const TRUST_SIGNALS = [
  { icon: Shield, label: "Geprüfte Firmen", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Star, label: "4.8★ Bewertung", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Heart, label: "100% Gratis", color: "text-rose-500", bg: "bg-rose-500/10" },
];

export const DropdownWrapper = ({ isOpen, onClose, children, className }: DropdownWrapperProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with warm blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[3px] z-[9998] hidden lg:block"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Dropdown Content */}
          <motion.div 
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "hidden lg:block absolute left-0 right-0 top-full",
              "bg-background",
              "border-b border-primary/10",
              "shadow-[0_25px_80px_-15px_rgba(0,0,0,0.2),0_0_50px_-25px_hsl(var(--primary)/0.25)]",
              "z-[9999] overflow-hidden",
              className
            )}
          >
            {/* Brand accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
            
            {/* Trust micro-bar with icons */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="border-b border-border/40 bg-gradient-to-r from-primary/[0.04] via-transparent to-secondary/[0.04]"
            >
              <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-center gap-8 py-3">
                  {TRUST_SIGNALS.map((signal, i) => (
                    <motion.div
                      key={signal.label}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.05 }}
                      className="flex items-center gap-2.5"
                    >
                      <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", signal.bg)}>
                        <signal.icon className={cn("w-3.5 h-3.5", signal.color)} />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{signal.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content with staggered animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {children}
            </motion.div>

            {/* Bottom gradient fade for depth */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-primary/[0.03] to-transparent pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
