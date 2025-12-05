import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const PremiumUrgentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });

  useEffect(() => {
    // Show after 5 seconds
    const showTimer = setTimeout(() => setIsVisible(true), 5000);

    // Countdown
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 md:py-3 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Limitiert</span>
              </div>
              
              <p className="text-sm md:text-base font-medium">
                <span className="hidden md:inline">🔥 Nur heute: </span>
                <span className="font-bold">15% Extra-Rabatt</span> auf alle Buchungen!
              </p>

              <div className="hidden md:flex items-center gap-2 bg-black/20 rounded-lg px-3 py-1">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">
                  {String(timeLeft.hours).padStart(2, "0")}:
                  {String(timeLeft.minutes).padStart(2, "0")}:
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="bg-white text-red-600 hover:bg-white/90 hidden sm:flex"
              >
                <Link to="/umzugsofferten">
                  Jetzt sichern
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
