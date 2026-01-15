/**
 * Enhanced Dropdown Wrapper
 * Warm, welcoming & trustworthy mega-menu container
 */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Star, Heart } from "lucide-react";

interface DropdownWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

// Trust micro-signals for dropdown header
const TRUST_SIGNALS = [
  { icon: Shield, label: "Geprüfte Firmen", color: "text-emerald-600" },
  { icon: Star, label: "4.8★ Bewertung", color: "text-amber-500" },
  { icon: Heart, label: "100% Gratis", color: "text-rose-500" },
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
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 hidden lg:block"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Dropdown Content - Enhanced with warmth */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "hidden lg:block absolute left-0 right-0 top-full",
              "bg-gradient-to-b from-background via-background to-primary/[0.02]",
              "border-b border-primary/10",
              "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15),0_0_40px_-20px_hsl(var(--primary)/0.2)]",
              "z-50 overflow-hidden",
              className
            )}
          >
            {/* Warm gradient accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-emerald-500/60 to-secondary/60" />
            
            {/* Trust micro-bar */}
            <div className="border-b border-border/50 bg-gradient-to-r from-primary/[0.03] via-transparent to-emerald-500/[0.03]">
              <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-center gap-6 py-2.5">
                  {TRUST_SIGNALS.map((signal, i) => (
                    <motion.div
                      key={signal.label}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex items-center gap-2"
                    >
                      <signal.icon className={cn("w-4 h-4", signal.color)} />
                      <span className="text-xs font-semibold text-muted-foreground">{signal.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {children}
            </motion.div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primary/[0.02] to-transparent pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
