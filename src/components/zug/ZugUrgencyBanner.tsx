/**
 * Zug Urgency Banner Component
 * #86-92: Time-sensitive offers and scarcity indicators
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, AlertTriangle, Flame, TrendingUp, 
  X, Calendar, Users, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export const ZugUrgencyBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });
  const [slotsLeft, setSlotsLeft] = useState(3);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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

    return () => clearInterval(timer);
  }, []);

  // Simulate slots decreasing
  useEffect(() => {
    const slotTimer = setTimeout(() => {
      if (slotsLeft > 1 && Math.random() > 0.7) {
        setSlotsLeft(prev => prev - 1);
      }
    }, 30000);

    return () => clearTimeout(slotTimer);
  }, [slotsLeft]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Urgency message */}
            <div className="flex items-center gap-3 flex-wrap">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Flame className="w-5 h-5" />
              </motion.div>
              
              <span className="font-bold text-sm sm:text-base">
                🔥 Hohe Nachfrage in Zug!
              </span>
              
              <Badge variant="secondary" className="bg-white/20 text-white border-none">
                <Users className="w-3 h-3 mr-1" />
                {slotsLeft} freie Termine diese Woche
              </Badge>
            </div>

            {/* Center: Countdown */}
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Angebot endet in:</span>
              <div className="flex items-center gap-1 font-mono font-bold">
                <span className="bg-white/20 px-2 py-1 rounded">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Right: CTA + Close */}
            <div className="flex items-center gap-2">
              <Link to="/umzugsofferten">
                <Button size="sm" variant="secondary" className="bg-white text-red-600 hover:bg-white/90 font-bold">
                  <Zap className="w-4 h-4 mr-1" />
                  Jetzt sichern
                </Button>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setIsVisible(false)}
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

// Floating urgency indicator for company cards
export const UrgencyIndicator = ({ availability }: { availability: string }) => {
  const isUrgent = availability.includes("Sofort") || availability.includes("ab");
  
  if (!isUrgent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-2 left-2"
    >
      <Badge 
        className={`text-xs ${
          availability.includes("Sofort") 
            ? "bg-green-500 text-white animate-pulse" 
            : "bg-orange-500 text-white"
        }`}
      >
        {availability.includes("Sofort") ? (
          <>
            <Zap className="w-3 h-3 mr-1" />
            Sofort verfügbar
          </>
        ) : (
          <>
            <Calendar className="w-3 h-3 mr-1" />
            {availability}
          </>
        )}
      </Badge>
    </motion.div>
  );
};

// Sticky bottom urgency bar for mobile
export const MobileUrgencyBar = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-20 left-4 right-4 lg:hidden z-30"
    >
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <AlertTriangle className="w-5 h-5 text-yellow-300" />
            </motion.div>
            <div>
              <p className="text-sm font-bold text-white">Letzte Chance!</p>
              <p className="text-xs text-white/80">Nur noch 3 Termine frei</p>
            </div>
          </div>
          <Link to="/umzugsofferten">
            <Button size="sm" variant="secondary" className="font-bold">
              Jetzt
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
