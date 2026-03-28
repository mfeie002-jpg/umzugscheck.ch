/**
 * Optimized Mobile Navigation
 * - 48px touch targets (WCAG AAA)
 * - Smooth animations
 * - Proper z-indexing
 * - Safe area insets
 */
import { memo, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Phone, Calculator, Building2, BookOpen, Users, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface MobileNavOptimizedProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "Preisrechner",
    icon: Calculator,
    href: "/umzugsrechner",
    highlight: true,
    description: "Kostenlos berechnen"
  },
  {
    label: "Umzugsfirmen",
    icon: Building2,
    href: "/umzugsfirmen",
    description: "200+ geprüfte Firmen"
  },
  {
    label: "Ratgeber",
    icon: BookOpen,
    href: "/ratgeber",
    description: "Tipps & Checklisten"
  },
  {
    label: "Für Firmen",
    icon: Users,
    href: "/fuer-firmen",
    description: "Partner werden"
  },
];

export const MobileNavOptimized = memo(function MobileNavOptimized({
  isOpen,
  onClose
}: MobileNavOptimizedProps) {
  const location = useLocation();
  const flowPath = useFlowPath();
  const [mounted, setMounted] = useState(false);
  
  // Track mount for safe animations
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);
  
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);
  
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
          
          {/* Slide-in Panel */}
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[101] w-[85vw] max-w-[320px] bg-background shadow-2xl lg:hidden flex flex-col"
            style={{ 
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <span className="text-lg font-bold text-foreground">Menü</span>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-12 h-12 -mr-2 rounded-xl hover:bg-muted active:scale-95 transition-all touch-manipulation"
                aria-label="Menü schließen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 mx-2 my-1 rounded-xl transition-all active:scale-[0.98] touch-manipulation",
                    "min-h-[56px]", // 48px + padding
                    item.highlight 
                      ? "bg-primary/10 text-primary hover:bg-primary/15" 
                      : "hover:bg-muted",
                    location.pathname === item.href && "bg-muted"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    item.highlight ? "bg-primary/20" : "bg-muted"
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
            
            {/* Bottom CTAs */}
            <div className="p-4 space-y-3 border-t bg-muted/30">
              {/* Primary CTA */}
              <Link
                to={flowPath}
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full h-14 bg-secondary text-secondary-foreground rounded-xl font-bold text-base shadow-lg shadow-secondary/25 active:scale-[0.98] transition-transform touch-manipulation"
              >
                Kostenlose Offerten
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              {/* Call CTA */}
              <a
                href="tel:+41780980000"
                className="flex items-center justify-center gap-2 w-full h-12 bg-card border-2 border-primary/20 text-primary rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform touch-manipulation"
              >
                <Phone className="w-4 h-4" />
                +41 78 098 00 00
              </a>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
});

export default MobileNavOptimized;
