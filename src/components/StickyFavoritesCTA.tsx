import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowRight, X } from "lucide-react";
import { useFavorites } from "@/components/FavoriteCompanies";
import { motion, AnimatePresence } from "framer-motion";

export const StickyFavoritesCTA = () => {
  const { favorites } = useFavorites();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show when user has 2+ favorites
    if (favorites.length >= 2 && !dismissed) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [favorites.length, dismissed]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none"
      >
        <div className="container mx-auto max-w-3xl pointer-events-auto">
          <div className="bg-primary text-primary-foreground rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-semibold">
                  {favorites.length} Firmen ausgewählt
                </div>
                <div className="text-sm text-primary-foreground/80">
                  Jetzt gemeinsame Offerten anfragen
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to="/umzugsofferten">
                <Button 
                  variant="secondary" 
                  className="font-semibold shadow-lg"
                >
                  Offerten erhalten
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
                onClick={() => setDismissed(true)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
