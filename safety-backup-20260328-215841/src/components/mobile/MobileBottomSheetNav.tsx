import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Calculator, FileText, Building2, Truck, 
  MapPin, BookOpen, Users, Phone, ChevronRight 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHaptic } from '@/hooks/use-haptic';
import { useFlowPath } from '@/hooks/useUnifiedAB';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  description?: string;
}

const quickActions: NavItem[] = [
  { icon: Calculator, label: 'Preisrechner', href: '/umzugsrechner', description: 'Umzugskosten berechnen' },
  { icon: FileText, label: 'Offerten', href: '/umzugsofferten', description: 'Kostenlose Offerten erhalten' },
  { icon: Building2, label: 'Firmen', href: '/umzugsfirmen', description: 'Umzugsfirmen vergleichen' },
];

const moreLinks: NavItem[] = [
  { icon: Truck, label: 'Services', href: '/dienstleistungen' },
  { icon: MapPin, label: 'Regionen', href: '/regionen' },
  { icon: BookOpen, label: 'Ratgeber', href: '/ratgeber' },
  { icon: Users, label: 'Für Firmen', href: '/fuer-firmen' },
  { icon: Phone, label: 'Kontakt', href: '/kontakt' },
];

export const MobileBottomSheetNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const flowPath = useFlowPath();
  const { trigger } = useHaptic();

  if (!isMobile) return null;

  const handleOpen = () => {
    trigger('light');
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    trigger('light');
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const handleLinkClick = () => {
    handleClose();
  };

  return (
    <>
      {/* Floating Menu Button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-20 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        aria-label="Navigation öffnen"
      >
        <Menu className="h-5 w-5" />
      </motion.button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-3xl bg-background shadow-2xl md:hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center py-3">
                <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 pb-3">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <button
                  onClick={handleClose}
                  className="rounded-full p-2 hover:bg-muted"
                  aria-label="Schließen"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto px-4 py-4 pb-safe">
                {/* Quick Actions */}
                <div className="mb-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Schnellzugriff
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {quickActions.map((item) => {
                      const Icon = item.icon;
                      const href = item.href === '/umzugsofferten' ? flowPath : item.href;
                      const isActive = location.pathname === href;
                      return (
                        <Link
                          key={item.href}
                          to={href}
                          onClick={handleLinkClick}
                          className={cn(
                            "flex flex-col items-center rounded-xl p-4 text-center transition-colors",
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted/50 hover:bg-muted"
                          )}
                        >
                          <Icon className="mb-2 h-6 w-6" />
                          <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* More Links */}
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Weitere Seiten
                  </p>
                  <div className="space-y-1">
                    {moreLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={handleLinkClick}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-3 transition-colors",
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-muted"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-6">
                  <Link
                    to={flowPath}
                    onClick={handleLinkClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive py-4 font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
                  >
                    Offerten vergleichen
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
