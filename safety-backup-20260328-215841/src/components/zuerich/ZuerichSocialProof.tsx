import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MapPin, Clock } from "lucide-react";

const notifications = [
  { name: "Familie M.", location: "Zürich Kreis 4", action: "hat gebucht", time: "vor 2 Min" },
  { name: "Thomas K.", location: "Winterthur", action: "vergleicht Offerten", time: "vor 5 Min" },
  { name: "Sandra L.", location: "Uster", action: "hat gebucht", time: "vor 8 Min" },
  { name: "Peter H.", location: "Dübendorf", action: "erhielt 5 Offerten", time: "vor 12 Min" },
  { name: "Anna B.", location: "Kloten", action: "hat gebucht", time: "vor 15 Min" },
];

export const ZuerichSocialProof = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const current = notifications[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-card border border-border rounded-lg shadow-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{current.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {current.location}
                </p>
                <p className="text-xs mt-1">
                  <span className="text-primary font-medium">{current.action}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="h-3 w-3" />
                {current.time}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
