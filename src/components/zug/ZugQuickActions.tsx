/**
 * Zug Quick Actions Component
 * #59-68: Floating action buttons and quick access features
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, MessageCircle, Calculator, FileText, 
  ChevronUp, X, Sparkles, Calendar, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export const ZugQuickActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
  const [showBadge, setShowBadge] = useState(true);

  // Hide badge after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowBadge(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const actions = [
    {
      icon: Calculator,
      label: "Preisrechner",
      href: "/rechner",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: MessageCircle,
      label: "Live Chat",
      href: "/kontakt",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: Phone,
      label: "Rückruf",
      onClick: () => setShowCallback(true),
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      icon: FileText,
      label: "Checkliste",
      href: "/ratgeber/umzug-checkliste",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4 z-40 lg:bottom-8">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-16 right-0 space-y-3"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {action.href ? (
                    <Link to={action.href}>
                      <Button
                        className={`${action.color} text-white shadow-lg flex items-center gap-2 pr-4`}
                      >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={action.onClick}
                      className={`${action.color} text-white shadow-lg flex items-center gap-2 pr-4`}
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.div className="relative">
          {showBadge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 z-10"
            >
              <Badge className="bg-red-500 text-white text-xs animate-pulse">
                Neu
              </Badge>
            </motion.div>
          )}
          <Button
            size="lg"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-14 h-14 rounded-full shadow-xl transition-all ${
              isExpanded ? "bg-muted-foreground" : "bg-primary"
            }`}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? (
                <X className="w-6 h-6" />
              ) : (
                <Sparkles className="w-6 h-6" />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Callback Modal */}
      <AnimatePresence>
        {showCallback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCallback(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Rückruf anfordern</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCallback(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-muted-foreground mb-6">
                Wir rufen dich kostenlos zurück – innerhalb von 30 Minuten (Mo-Fr, 8-18 Uhr).
              </p>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Telefonnummer</label>
                  <input
                    type="tel"
                    placeholder="+41 79 123 45 67"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Wann passt es dir?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Jetzt", "Morgen früh", "Morgen mittag", "Später"].map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant="outline"
                        className="justify-start"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Rückruf anfordern
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Kostenlos & unverbindlich · Keine Warteschleife
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
