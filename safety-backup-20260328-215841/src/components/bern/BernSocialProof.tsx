import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MapPin, Clock } from "lucide-react";

const notifications = [
  { name: "Familie K.", location: "Bern Altstadt", action: "hat gebucht", time: "vor 3 Min" },
  { name: "Stefan M.", location: "Thun", action: "vergleicht Offerten", time: "vor 6 Min" },
  { name: "Anna L.", location: "Köniz", action: "hat gebucht", time: "vor 10 Min" },
  { name: "Peter B.", location: "Biel", action: "erhielt 5 Offerten", time: "vor 14 Min" },
];

export const BernSocialProof = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => { setCurrentIndex((prev) => (prev + 1) % notifications.length); setIsVisible(true); }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = notifications[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div key={currentIndex} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} className="bg-card border border-border rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0"><CheckCircle className="h-5 w-5 text-success" /></div>
              <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{current.name}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{current.location}</p><p className="text-xs mt-1"><span className="text-primary font-medium">{current.action}</span></p></div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0"><Clock className="h-3 w-3" />{current.time}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
