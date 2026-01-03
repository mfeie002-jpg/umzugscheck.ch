import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calculator, FileText, Phone, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useHaptic } from '@/hooks/use-haptic';
import { useIsMobile } from '@/hooks/use-mobile';

const actions = [
  { icon: Calculator, label: 'Rechner', href: '/umzugsrechner', color: 'bg-blue-500' },
  { icon: FileText, label: 'Offerte', href: '/umzugsofferten', color: 'bg-green-500' },
  { icon: Phone, label: 'Kontakt', href: '/kontakt', color: 'bg-orange-500' },
];

// Pages where FAB should be hidden to avoid covering form elements
const HIDDEN_ON_PATHS = [
  '/umzugsofferten-v',
  '/umzugsrechner',
  '/offerte',
  '/kontakt',
];

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { trigger } = useHaptic();
  const isMobile = useIsMobile();
  const location = useLocation();

  // Hide FAB on flow pages to prevent overlapping with form elements
  const shouldHide = HIDDEN_ON_PATHS.some(path => location.pathname.includes(path));
  
  if (!isMobile || shouldHide) return null;

  const toggleOpen = () => {
    trigger(isOpen ? 'light' : 'medium');
    setIsOpen(!isOpen);
  };

  return (
    // Position above bottom nav (64px nav + 16px gap = 80px min)
    <div className="fixed right-4 bottom-24 z-40 lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={action.href}
                  onClick={() => {
                    trigger('light');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <span className="px-3 py-1.5 bg-background rounded-full shadow-lg text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-primary-foreground" />
          ) : (
            <Plus className="w-6 h-6 text-primary-foreground" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};