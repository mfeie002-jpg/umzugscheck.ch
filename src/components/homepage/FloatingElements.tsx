import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FloatingElements = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Search Button - Top Right (Desktop) */}
      <div className="fixed top-24 right-4 z-40 hidden md:block">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-10 h-10 bg-card shadow-soft border-border hover:shadow-medium"
          asChild
        >
          <Link to="/umzugsfirmen">
            <Search className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Mobile Quick Action Button */}
      <div className="fixed bottom-24 right-4 z-40 md:hidden">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-primary text-primary-foreground shadow-medium"
          asChild
        >
          <Link to="/umzugsofferten">
            <Plus className="w-6 h-6" />
          </Link>
        </Button>
      </div>

      {/* Chat Button - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-16 right-0 w-80 bg-card rounded-2xl shadow-premium border border-border overflow-hidden"
            >
              <div className="p-4 bg-secondary text-secondary-foreground">
                <h3 className="font-semibold">Haben Sie Fragen?</h3>
                <p className="text-sm text-secondary-foreground/80">
                  Wir helfen Ihnen gerne weiter.
                </p>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Kontaktieren Sie uns per E-Mail oder Telefon.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/kontakt">Zum Kontaktformular</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-secondary text-secondary-foreground shadow-cta relative"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {/* Ping Animation */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary/60 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
          
          {isChatOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </div>
    </>
  );
};
