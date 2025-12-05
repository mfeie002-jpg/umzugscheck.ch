import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, X, Calculator, FileText, Star, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { icon: Calculator, label: "Rechner", href: "/rechner", color: "bg-blue-500" },
  { icon: FileText, label: "Offerte", href: "/umzugsofferten", color: "bg-primary" },
  { icon: Star, label: "Firmen", href: "/umzugsfirmen", color: "bg-yellow-500" },
  { icon: HelpCircle, label: "Hilfe", href: "/ratgeber", color: "bg-green-500" }
];

export const MobileQuickAccess = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-50 md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3"
          >
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-medium text-foreground bg-card px-3 py-1 rounded-lg shadow-sm">
                    {link.label}
                  </span>
                  <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center shadow-lg`}>
                    <link.icon className="h-5 w-5 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen ? "bg-muted" : "bg-primary"
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Plus className="h-6 w-6 text-primary-foreground" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};
