import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "KI-Analyse & Export",
    description: "ChatGPT-Prompts generieren",
    href: "/admin/ai-export",
    icon: Brain,
    color: "bg-primary text-primary-foreground",
  },
  {
    label: "Kunden-Onboarding",
    description: "Partner-Anleitung",
    href: "/kunden-onboarding",
    icon: BookOpen,
    color: "bg-green-500 text-white",
  },
];

export function AdminFloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 pr-5 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                >
                  <div className={cn("p-2.5 rounded-lg", item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {item.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.div
        initial={false}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all",
            "bg-gradient-to-br from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90",
            isOpen && "bg-muted hover:bg-muted/90 from-muted to-muted"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Sparkles className="h-6 w-6" />
          )}
        </Button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
